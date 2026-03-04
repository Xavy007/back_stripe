// controllers/mongodb/sancionesPartido.controller.js
class SancionesPartidoController {
  async obtenerPorPartido(req, res) { res.json({ success: true, data: [] }); }
  async obtenerPorSet(req, res) { res.json({ success: true, data: [] }); }
  async registrar(req, res) { res.json({ success: true, message: 'En desarrollo' }); }
  async registrarAdvertencia(req, res) { res.json({ success: true, message: 'En desarrollo' }); }
  async registrarPenalty(req, res) { res.json({ success: true, message: 'En desarrollo' }); }
}
module.exports = new SancionesPartidoController();
