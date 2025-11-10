// src/middleware/roleMiddleware.js
/**
 * Middleware de Autorización por Rol
 * Verifica que el usuario autenticado tiene los permisos necesarios
 * 
 * Uso:
 * router.post('/crear', autenticar, autorizar('admin', 'presidente'), controlador);
 * router.get('/datos', autenticar, autorizar(), controlador); // Sin restricción
 */

const autorizar = (...rolesPermitidos) => {
    return (req, res, next) => {
        try {
            // Verificar que el usuario está autenticado
            if (!req.usuario) {
                return res.status(401).json({
                    success: false,
                    error: 'No autenticado',
                    message: 'Debes estar logueado para acceder a este recurso'
                });
            }

            // Verificar que el usuario tiene un rol
            if (!req.usuario.rol) {
                return res.status(400).json({
                    success: false,
                    error: 'Rol no configurado',
                    message: 'Tu cuenta no tiene un rol asignado. Contacta al administrador'
                });
            }

            // Si no hay roles especificados, permitir a cualquier usuario autenticado
            if (rolesPermitidos.length === 0) {
                return next();
            }

            // Verificar que el usuario tiene uno de los roles permitidos
            if (rolesPermitidos.includes(req.usuario.rol)) {
                return next();
            }

            // Rol no permitido
            return res.status(403).json({
                success: false,
                error: 'Permisos insuficientes',
                message: `No tienes permisos. Roles requeridos: ${rolesPermitidos.join(', ')}. Tu rol: ${req.usuario.rol}`,
                detalles: {
                    rolesRequeridos: rolesPermitidos,
                    tuRol: req.usuario.rol
                }
            });

        } catch (error) {
            console.error('Error en middleware de autorización:', error);
            return res.status(500).json({
                success: false,
                error: 'Error interno',
                message: 'Error al verificar los permisos'
            });
        }
    };
};

module.exports = autorizar;