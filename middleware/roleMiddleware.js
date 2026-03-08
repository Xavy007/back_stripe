/**
 * @file middleware/roleMiddleware.js
 * @description Middleware de autorización basado en roles (RBAC — Role-Based Access Control).
 *
 * Complementa al authMiddleware: mientras `autenticar` verifica la identidad
 * del usuario mediante JWT, `autorizar` restringe el acceso a recursos según
 * el rol que tiene asignado en el sistema.
 *
 * Debe usarse siempre DESPUÉS de `autenticar` en la cadena de middleware,
 * ya que depende de que `req.usuario` haya sido inyectado previamente.
 *
 * Flujo de verificación:
 *   1. Confirma que `req.usuario` existe (autenticación ya realizada).
 *   2. Confirma que `req.usuario.rol` está definido (cuenta configurada).
 *   3. Si no se especificaron roles, permite el paso a cualquier usuario autenticado.
 *   4. Verifica que `req.usuario.rol` se encuentra entre los roles permitidos.
 *   5. Si el rol no coincide, responde con 403 Forbidden y detalla los roles requeridos.
 *
 * Roles del sistema (definidos en el JWT al momento del login):
 *   - admin       : acceso completo a todos los módulos administrativos.
 *   - presidente  : gestión de campeonatos y reportes.
 *   - secretario  : gestión de inscripciones, jugadores y documentación.
 *   - arbitro     : acceso a asignaciones de partidos y planillas.
 *   - (otros roles que se definan en la tabla Usuarios)
 *
 * Respuestas HTTP:
 *   401 - req.usuario no existe (autenticación no realizada o token inválido).
 *   400 - El usuario no tiene rol asignado en la base de datos.
 *   403 - El rol del usuario no está en la lista de roles permitidos.
 *   500 - Error inesperado durante la verificación.
 *
 * Uso en rutas:
 * @example
 * // Solo administradores pueden crear campeonatos
 * router.post('/campeonato', autenticar, autorizar('admin'), crearCampeonato);
 *
 * // Admins o presidentes pueden ver reportes
 * router.get('/reportes', autenticar, autorizar('admin', 'presidente'), obtenerReportes);
 *
 * // Cualquier usuario autenticado puede ver el listado público
 * router.get('/fixture', autenticar, autorizar(), verFixture);
 *
 * @module middleware/roleMiddleware
 */

/**
 * Fábrica de middleware de autorización por rol.
 *
 * Retorna un middleware de Express que verifica si el usuario autenticado
 * posee alguno de los roles especificados. Al no recibir argumentos,
 * el middleware generado permite el acceso a cualquier usuario autenticado.
 *
 * @param {...string} rolesPermitidos - Lista de roles con acceso al recurso.
 *   Si se omite, se genera un middleware sin restricción de rol
 *   (solo requiere autenticación válida).
 * @returns {import('express').RequestHandler} Middleware de Express listo para encadenar.
 */
const autorizar = (...rolesPermitidos) => {
    return (req, res, next) => {
        try {
            // ── Paso 1: Verificar que la autenticación fue realizada ──
            // `req.usuario` es inyectado por `autenticar` (authMiddleware).
            // Su ausencia indica que este middleware se usó sin el previo.
            if (!req.usuario) {
                return res.status(401).json({
                    success: false,
                    error: 'No autenticado',
                    message: 'Debes estar logueado para acceder a este recurso'
                });
            }

            // ── Paso 2: Verificar que el usuario tiene un rol asignado ──
            // Un usuario sin rol es un estado de configuración inválido;
            // no debe ocurrir en condiciones normales de operación.
            if (!req.usuario.rol) {
                return res.status(400).json({
                    success: false,
                    error: 'Rol no configurado',
                    message: 'Tu cuenta no tiene un rol asignado. Contacta al administrador'
                });
            }

            // ── Paso 3: Sin restricción de rol — permitir a cualquier autenticado ──
            // Cuando `autorizar()` se invoca sin argumentos, la ruta es
            // accesible para cualquier usuario con sesión válida.
            if (rolesPermitidos.length === 0) {
                return next();
            }

            // ── Paso 4: Verificar que el rol del usuario esté en la lista permitida ──
            if (rolesPermitidos.includes(req.usuario.rol)) {
                return next();
            }

            // ── Paso 5: Rol no permitido — denegar acceso con información detallada ──
            // Se incluye el rol actual y los requeridos para facilitar el diagnóstico
            // tanto al usuario como al equipo de soporte.
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
            // Error inesperado durante la verificación de permisos
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
