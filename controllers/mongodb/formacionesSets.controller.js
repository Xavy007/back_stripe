const formacionesSetsService = require('../../services/mongodb/formacionesSets.service');

class FormacionesSetsController {
  async obtener(req, res) {
    try {
      const { idpartido, numero_set } = req.params;
      const formacion = await formacionesSetsService.obtenerFormacion(parseInt(idpartido), parseInt(numero_set));
      res.json({ success: true, data: formacion });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async registrar(req, res) {
    try {
      const { idpartido, numero_set, formacion_local, formacion_visitante, equipo_recibidor } = req.body;
      const userId = req.usuario?.idusuario || 1;
      const formacion = await formacionesSetsService.registrarFormacion(parseInt(idpartido), numero_set, { formacion_local, formacion_visitante }, equipo_recibidor, userId);
      res.status(201).json({ success: true, data: formacion, message: 'Formación registrada' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async confirmar(req, res) {
    try {
      const { idpartido, numero_set } = req.params;
      const { equipo } = req.body;
      const userId = req.usuario?.idusuario || 1;
      const formacion = await formacionesSetsService.confirmarFormacion(parseInt(idpartido), parseInt(numero_set), equipo, userId);
      res.json({ success: true, data: formacion, message: 'Formación confirmada' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new FormacionesSetsController();
