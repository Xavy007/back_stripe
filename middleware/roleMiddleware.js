// src/middleware/roleMiddleware.js
module.exports = function authorize(...allowedRoles) {
  return (req, res, next) => {
    try {
      if (!req.usuario || !req.usuario.rol) {
        return res.status(401).json({ error: 'No autenticado' });
      }
      if (allowedRoles.length === 0) return next();
      if (allowedRoles.includes(req.usuario.rol)) return next();
      return res.status(403).json({ error: 'Permisos insuficientes' });
    } catch (err) {
      console.error('authorize middleware error:', err);
      return res.status(500).json({ error: 'Error al verificar permisos' });
    }
  };
};