/**
 * @file middleware/authMiddleware.js
 * @description Middleware de autenticación basado en JSON Web Tokens (JWT).
 *
 * Intercepta cada petición protegida y verifica que el token JWT incluido en
 * el encabezado Authorization sea válido y no haya expirado.
 *
 * Flujo de verificación:
 *   1. Si SKIP_AUTH=true en .env, inyecta un usuario administrador ficticio y
 *      omite la verificación (solo para entornos de desarrollo/pruebas).
 *   2. Extrae el token del encabezado: Authorization: Bearer <token>.
 *   3. Verifica la firma y la expiración del token con jwt.verify().
 *   4. Inyecta el payload decodificado en req.usuario para los handlers siguientes.
 *
 * Respuestas de error:
 *   401 - Token no proporcionado o malformado.
 *   401 - Token expirado (TokenExpiredError de jsonwebtoken).
 *   401 - Token inválido (firma incorrecta u otro error).
 *   500 - Error interno inesperado.
 *
 * Uso típico en rutas:
 *   router.get('/ruta-protegida', autenticar, controlador);
 *   router.post('/ruta-admin', autenticar, autorizar('admin'), controlador);
 *
 * Variable de entorno:
 *   JWT_SECRET : Clave secreta para firmar/verificar tokens.
 *                Valor por defecto: 'tu_secret_key' (solo para desarrollo).
 *
 * @module middleware/authMiddleware
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticación JWT.
 * Verifica el token Bearer del encabezado Authorization y popula req.usuario.
 *
 * @param {import('express').Request}  req  - Objeto de petición Express.
 * @param {import('express').Response} res  - Objeto de respuesta Express.
 * @param {import('express').NextFunction} next - Función para continuar la cadena.
 */
const autenticar = (req, res, next) => {
  try {
    /* ── Modo de desarrollo: omitir autenticación ──
     * Cuando SKIP_AUTH=true, se inyecta un usuario admin ficticio para
     * facilitar las pruebas de endpoints sin necesidad de generar tokens.
     * NUNCA debe habilitarse en producción.
     */
    if (process.env.SKIP_AUTH === 'true') {
      console.log('⚠️ SKIP_AUTH activo - Saltando autenticación');
      req.usuario = {
        id_usuario: 1,
        email: 'admin@example.com',
        rol: 'admin'
      };
      return next();
    }

    // ── Extraer token del encabezado Authorization ──
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token requerido. Use Authorization: Bearer <token>'
      });
    }

    // ── Validar formato: debe ser exactamente "Bearer <token>" ──
    const partes = authHeader.split(' ');
    if (partes.length !== 2 || partes[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: 'Token malformado. Formato: Bearer <token>'
      });
    }

    const token = partes[1];

    // ── Verificar firma y expiración del token ──
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secret_key');
      // Inyectar payload decodificado para uso en controladores y roleMiddleware
      req.usuario = decoded;
      next();
    } catch (error) {
      // Diferenciar token expirado de token inválido para mensajes precisos
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expirado'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

  } catch (error) {
    // Error inesperado en el proceso de autenticación
    return res.status(500).json({
      success: false,
      message: 'Error en autenticación'
    });
  }
};

module.exports = autenticar;
