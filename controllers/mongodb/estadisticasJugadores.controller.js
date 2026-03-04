// controllers/mongodb/estadisticasJugadores.controller.js
class EstadisticasJugadoresController {
  async obtenerPorPartido(req, res) { res.json({ success: true, data: [] }); }
  async obtenerPorEquipo(req, res) { res.json({ success: true, data: [] }); }
  async obtenerPorJugador(req, res) { res.json({ success: true, data: {} }); }
  async obtenerTopScorers(req, res) { res.json({ success: true, data: [] }); }
  async obtenerMVP(req, res) { res.json({ success: true, data: null }); }
}
module.exports = new EstadisticasJugadoresController();
