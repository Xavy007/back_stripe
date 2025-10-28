const { Usuario, Session } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator'); 

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;
const ACCESS_TOKEN_EXPIRES = '2h';
const REFRESH_TOKEN_TTL_DAYS = 30;

// Validación de entradas
exports.loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Correo electrónico no válido')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 12 })
    .withMessage('La contraseña debe tener al menos 12 caracteres')
    .notEmpty()
    .withMessage('La contraseña no puede estar vacía')
];

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email+" "+password);
  try {
    const emailLc = (email || '').toLowerCase();
 
    const usuario = await Usuario.scope('withPassword').findOne({ where: { email: emailLc } });
    console.log('found usuario:', !!usuario, usuario ? { id: usuario.id_usuario, verificado: usuario.verificado, estado: usuario.estado, hasPassword: !!usuario.password } : null);
 
   if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });
    if (!usuario.verificado) return res.status(401).json({ error: 'Cuenta no verificada' });
    // solo rechazar si estado existe y es false
    if (usuario.estado === false) return res.status(401).json({ error: 'Cuenta inactiva' });


    if (usuario.locked_until && new Date() < new Date(usuario.locked_until)) {
      return res.status(429).json({ error: 'Cuenta temporalmente bloqueada. Intenta más tarde.' });
    }
    console.log(password);
    const match = await bcrypt.compare(password, usuario.password);
    console.log(match)
    if (!match) {
      await usuario.recordFailedAttempt(); // Lógica delegada a la instancia del modelo
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    await usuario.resetAttempts(); // Resetear intentos fallidos

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );

    let refreshToken;
    try {
      refreshToken = crypto.randomBytes(40).toString('hex');
      const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
      await Session.create({
        token: refreshToken,
        id_usuario: usuario.id_usuario,
        ip: req.ip,
        user_agent: req.get('User-Agent') || null,
        expires_at: expiresAt
      });
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000
      });
    } catch (e) {
      console.error('session create error', e);
      return res.status(500).json({ error: 'Error al generar el Refresh Token' });
    }

    res.json({
      token,
      usuario: { email: usuario.email, rol: usuario.rol },
      refreshToken: refreshToken ? undefined : undefined
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token || req.body.refresh_token;
    if (!refreshToken) return res.status(401).json({ error: 'Refresh token requerido' });

    const session = await Session.findOne({ where: { token: refreshToken } });
    if (!session) return res.status(401).json({ error: 'Refresh token inválido' });

    if (session.expires_at && new Date() > new Date(session.expires_at)) {
      await Session.destroy({ where: { token: refreshToken } });
      return res.status(401).json({ error: 'Refresh token expirado' });
    }

    const usuario = await Usuario.findByPk(session.id_usuario);
    if (!usuario) return res.status(401).json({ error: 'Usuario no encontrado' });

    // Emitir nuevo access token
    const accessPayload = { id_usuario: usuario.id_usuario, rol: usuario.rol };
    const newAccessToken = createAccessToken(accessPayload);

    // Rotación de refresh token (recomendado)
    const newRefreshToken = createRefreshTokenString();
    const newExpiry = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

    await session.update({ token: newRefreshToken, expires_at: newExpiry });

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000
    });

    return res.json({ token: newAccessToken });
  } catch (err) {
    console.error('refresh error:', err);
    return res.status(500).json({ error: 'Error al refrescar token' });
  }
};

exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token || req.body.refresh_token;
    if (refreshToken) {
      await Session.destroy({ where: { token: refreshToken } });
    }
    res.clearCookie('refresh_token');
    return res.json({ ok: true });
  } catch (err) {
    console.error('logout error:', err);
    return res.status(500).json({ error: 'Error al cerrar sesión' });
  }
};
