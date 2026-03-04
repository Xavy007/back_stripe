// controllers/mongodb/eventosPartido.controller.js
const eventosPartidoService = require('../../services/mongodb/eventosPartido.service');
const estadisticasPartidoService = require('../../services/mongodb/estadisticasPartido.service');

class EventosPartidoController {
  
  async registrarPunto(req, res) {
    try {
      const { idpartido } = req.params;
      const { numero_set, punto } = req.body;
      const userId = req.usuario.idusuario;

      const evento = await eventosPartidoService.registrarPunto(
        parseInt(idpartido),
        numero_set,
        punto,
        userId
      );

      // Emitir evento en tiempo real
      const io = req.app.get('io');
      io.of('/partido-en-vivo')
        .to(`partido:${idpartido}`)
        .emit('punto:registrado', {
          evento,
          timestamp: new Date()
        });

      res.status(201).json({
        success: true,
        data: evento,
        message: 'Punto registrado'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async registrarEvento(req, res) {
    try {
      const { idpartido } = req.params;
      const { numero_set, tipo_evento, datos } = req.body;
      const userId = req.usuario.idusuario;

      const evento = await eventosPartidoService.registrarEvento(
        parseInt(idpartido),
        numero_set,
        tipo_evento,
        datos,
        userId
      );

      // Emitir evento en tiempo real
      const io = req.app.get('io');
      io.of('/partido-en-vivo')
        .to(`partido:${idpartido}`)
        .emit('evento:registrado', {
          tipo: tipo_evento,
          evento,
          timestamp: new Date()
        });

      res.status(201).json({
        success: true,
        data: evento,
        message: `Evento ${tipo_evento} registrado`
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async obtenerEventosPartido(req, res) {
    try {
      const { idpartido } = req.params;

      const eventos = await eventosPartidoService.obtenerEventosPartido(
        parseInt(idpartido)
      );

      res.json({
        success: true,
        data: eventos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async obtenerEventosSet(req, res) {
    try {
      const { idpartido, numero_set } = req.params;

      const eventos = await eventosPartidoService.obtenerEventosSet(
        parseInt(idpartido),
        parseInt(numero_set)
      );

      res.json({
        success: true,
        data: eventos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async obtenerResumen(req, res) {
    try {
      const { idpartido } = req.params;

      const resumen = await eventosPartidoService.obtenerResumenEventos(
        parseInt(idpartido)
      );

      res.json({
        success: true,
        data: resumen
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new EventosPartidoController();
