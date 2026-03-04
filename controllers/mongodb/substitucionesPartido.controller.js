// controllers/mongodb/substitucionesPartido.controller.js
const substitucionesPartidoService = require('../../services/mongodb/substitucionesPartido.service');

class SubstitucionesPartidoController {
  
  async registrar(req, res) {
    try {
      const { idpartido } = req.params;
      const { numero_set, equipo, jugador_sale, jugador_entra, tipo_sustitucion } = req.body;
      const userId = req.usuario.idusuario;

      const sustitucion = await substitucionesPartidoService.registrarSustitucion(
        parseInt(idpartido),
        numero_set,
        { equipo, jugador_sale, jugador_entra, tipo_sustitucion },
        userId
      );

      // Emitir evento Socket.IO
      const io = req.app.get('io');
      io.of('/partido-en-vivo')
        .to(`partido:${idpartido}`)
        .emit('sustitucion:registrada', sustitucion);

      res.status(201).json({
        success: true,
        data: sustitucion,
        message: 'Sustitución registrada'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async obtenerPorPartido(req, res) {
    try {
      const { idpartido } = req.params;

      const substituciones = await substitucionesPartidoService.obtenerSubstitucionesPartido(
        parseInt(idpartido)
      );

      res.json({
        success: true,
        data: substituciones
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async obtenerDisponibles(req, res) {
    try {
      const { idpartido, numero_set, equipo } = req.params;

      const disponibles = await substitucionesPartidoService.obtenerSubstitucionesDisponibles(
        parseInt(idpartido),
        parseInt(numero_set),
        equipo
      );

      res.json({
        success: true,
        data: disponibles
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new SubstitucionesPartidoController();
