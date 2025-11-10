const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
    try {
             // ✅ AGREGAR ESTO (Para saltar autenticación en desarrollo)
        if (process.env.SKIP_AUTH === 'true') {
            console.log('⚠️ SKIP_AUTH activo - Saltando autenticación');
            req.usuario = {
                id_usuario: 1,
                email: 'admin@example.com',
                rol: 'admin'
            };
            return next();
        }
        // ✅ FIN SKIP_AUTH - El resto sigue igua
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token requerido. Use Authorization: Bearer <token>'
            });
        }

        const partes = authHeader.split(' ');
        if (partes.length !== 2 || partes[0] !== 'Bearer') {
            return res.status(401).json({
                success: false,
                message: 'Token malformado. Formato: Bearer <token>'
            });
        }

        const token = partes[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secret_key');
            req.usuario = decoded;
            next();
        } catch (error) {
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
        return res.status(500).json({
            success: false,
            message: 'Error en autenticación'
        });
    }
};

module.exports = autenticar;