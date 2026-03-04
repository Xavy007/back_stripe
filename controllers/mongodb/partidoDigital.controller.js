// controllers/mongodb/partidoDigital.controller.js
const partidoDigitalService = require('../../services/mongodb/partidoDigital.service');

class PartidoDigitalController {
  
  async obtener(req, res) {
    try {
      const { idpartido } = req.params;
      
      const partido = await partidoDigitalService.obtenerPorId(
        parseInt(idpartido)
      );

      res.json({
        success: true,
        data: partido
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async crear(req, res) {
    try {
      const { idpartido } = req.body;

      const partido = await partidoDigitalService.crearDesdePostgreSQL(
        parseInt(idpartido)
      );

      res.status(201).json({
        success: true,
        data: partido,
        message: 'Partido digital creado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async iniciar(req, res) {
    try {
      const { idpartido } = req.params;
      const userId = req.usuario.idusuario;

      const partido = await partidoDigitalService.iniciarPartido(
        parseInt(idpartido),
        userId
      );

      // Emitir evento Socket.IO
      const io = req.app.get('io');
      io.of('/partido-en-vivo')
        .to(`partido:${idpartido}`)
        .emit('partido:iniciado', partido);

      res.json({
        success: true,
        data: partido,
        message: 'Partido iniciado'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async iniciarSet(req, res) {
    try {
      const { idpartido } = req.params;
      const { numero_set } = req.body;
      const userId = req.usuario.idusuario;

      const partido = await partidoDigitalService.iniciarSet(
        parseInt(idpartido),
        numero_set,
        userId
      );

      // Emitir evento Socket.IO
      const io = req.app.get('io');
      io.of('/partido-en-vivo')
        .to(`partido:${idpartido}`)
        .emit('set:iniciado', { numero_set, partido });

      res.json({
        success: true,
        data: partido,
        message: `Set ${numero_set} iniciado`
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async registrarPlantel(req, res) {
    try {
      const { idpartido } = req.params;
      const { equipo, jugadores, cuerpo_tecnico } = req.body;

      const partido = await partidoDigitalService.registrarPlantel(
        parseInt(idpartido),
        equipo,
        jugadores,
        cuerpo_tecnico
      );

      res.json({
        success: true,
        data: partido,
        message: `Plantel ${equipo} registrado`
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async registrarArbitraje(req, res) {
    try {
      const { idpartido } = req.params;
      const arbitros = req.body;

      const partido = await partidoDigitalService.registrarArbitraje(
        parseInt(idpartido),
        arbitros
      );

      res.json({
        success: true,
        data: partido,
        message: 'Cuerpo arbitral registrado'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async obtenerEnVivo(req, res) {
    try {
      const partidos = await partidoDigitalService.obtenerPartidosEnVivo();

      res.json({
        success: true,
        data: partidos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async obtenerPorCampeonato(req, res) {
    try {
      const { idcampeonato } = req.params;

      const partidos = await partidoDigitalService.obtenerPorCampeonato(
        parseInt(idcampeonato)
      );

      res.json({
        success: true,
        data: partidos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async cerrarPlanilla(req, res) {
    try {
      const { idpartido } = req.params;
      const aprobaciones = req.body;
      const userId = req.usuario.idusuario;

      const partido = await partidoDigitalService.cerrarPlanilla(
        parseInt(idpartido),
        aprobaciones,
        userId
      );

      res.json({
        success: true,
        data: partido,
        message: 'Planilla cerrada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // ✅ NUEVO: Guardar partido completo desde la app móvil
  async guardarPartidoCompleto(req, res) {
    console.log('🎯 guardarPartidoCompleto - Inicio');
    console.log('📋 Params:', req.params);
    console.log('📦 Body:', JSON.stringify(req.body, null, 2));

    try {
      const { idpartido } = req.params;
      const datosPartido = req.body;

      console.log('🔄 Llamando a partidoDigitalService...');

      const partido = await partidoDigitalService.guardarPartidoCompletoDesdeApp(
        parseInt(idpartido),
        datosPartido
      );

      console.log('✅ Partido guardado exitosamente');

      res.status(201).json({
        success: true,
        data: partido,
        message: 'Partido guardado exitosamente en MongoDB'
      });
    } catch (error) {
      console.error('❌ Error en guardarPartidoCompleto:', error);
      console.error('Stack:', error.stack);
      res.status(400).json({
        success: false,
        message: error.message,
        error: error.toString()
      });
    }
  }
}

module.exports = new PartidoDigitalController();
