// controllers/mongodb/estadisticasEquipos.controller.js
class EstadisticasEquiposController {
  async obtenerPorPartido(req, res) { res.json({ success: true, data: [] }); }
  async obtenerPorEquipo(req, res) { res.json({ success: true, data: {} }); }
  async obtenerComparativa(req, res) { res.json({ success: true, data: {} }); }
}
module.exports = new EstadisticasEquiposController();
