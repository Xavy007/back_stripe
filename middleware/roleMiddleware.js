// src/middleware/roleMiddleware.js
module.exports = function authorize(...allowedRoles) {
  return (req, res, next) => {
    try {
      // requiere que el middleware de autenticación haya establecido req.usuario
      if (!req.usuario || !req.usuario.rol) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      // si no se pasaron roles permitidos, permitir cualquier usuario autenticado
      if (allowedRoles.length === 0) return next();

      // comprobar inclusión
      if (allowedRoles.includes(req.usuario.rol)) return next();

      return res.status(403).json({ error: 'Permisos insuficientes' });
    } catch (err) {
      console.error('authorize middleware error:', err);
      return res.status(500).json({ error: 'Error al verificar permisos' });
    }
  };
};