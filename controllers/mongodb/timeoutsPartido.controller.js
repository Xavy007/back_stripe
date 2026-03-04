// controllers/mongodb/timeoutsPartido.controller.js
class TimeoutsPartidoController {
  async obtenerPorPartido(req, res) { res.json({ success: true, data: [] }); }
  async solicitar(req, res) { res.json({ success: true, message: 'En desarrollo' }); }
  async finalizar(req, res) { res.json({ success: true, message: 'En desarrollo' }); }
  async obtenerDisponibles(req, res) { res.json({ success: true, data: { utilizados: 0, disponibles: 2 } }); }
}
module.exports = new TimeoutsPartidoController();
