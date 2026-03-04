// controllers/mongodb/planillaDigital.controller.js
const partidoDigitalService = require('../../services/mongodb/partidoDigital.service');
const formacionesSetsService = require('../../services/mongodb/formacionesSets.service');
const setsPartidoService = require('../../services/mongodb/setsPartido.service');
const estadisticasPartidoService = require('../../services/mongodb/estadisticasPartido.service');

class PlanillaDigitalController {
  
  /**
   * Crea un partido digital completo con toda la información inicial
   */
  async crearPartidoCompleto(req, res) {
    try {
      const { 
        idpartido, 
        planteles, 
        arbitros,
        configuracion 
      } = req.body;
      const userId = req.usuario.idusuario;

      // 1. Crear partido digital desde PostgreSQL
      const partido = await partidoDigitalService.crearDesdePostgreSQL(
        parseInt(idpartido)
      );

      // 2. Registrar planteles
      if (planteles?.local) {
        await partidoDigitalService.registrarPlantel(
          parseInt(idpartido),
          'local',
          planteles.local.jugadores,
          planteles.local.cuerpo_tecnico
        );
      }

      if (planteles?.visitante) {
        await partidoDigitalService.registrarPlantel(
          parseInt(idpartido),
          'visitante',
          planteles.visitante.jugadores,
          planteles.visitante.cuerpo_tecnico
        );
      }

      // 3. Registrar árbitros
      if (arbitros) {
        await partidoDigitalService.registrarArbitraje(
          parseInt(idpartido),
          arbitros
        );
      }

      res.status(201).json({
        success: true,
        data: partido,
        message: 'Partido digital creado completamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Inicia un set con formación
   */
  async iniciarSetConFormacion(req, res) {
    try {
      const { idpartido } = req.params;
      const { 
        numero_set, 
        formacion_local, 
        formacion_visitante, 
        equipo_recibidor 
      } = req.body;
      const userId = req.usuario.idusuario;

      // 1. Registrar formaciones
      await formacionesSetsService.registrarFormacion(
        parseInt(idpartido),
        numero_set,
        { formacion_local, formacion_visitante },
        equipo_recibidor,
        userId
      );

      // 2. Confirmar formaciones (simulado - en producción esperar confirmación real)
      await formacionesSetsService.confirmarFormacion(
        parseInt(idpartido),
        numero_set,
        'local',
        userId
      );

      await formacionesSetsService.confirmarFormacion(
        parseInt(idpartido),
        numero_set,
        'visitante',
        userId
      );

      // 3. Iniciar el set
      await setsPartidoService.iniciarSet(
        parseInt(idpartido),
        numero_set,
        equipo_recibidor
      );

      // 4. Actualizar estado del partido
      await partidoDigitalService.iniciarSet(
        parseInt(idpartido),
        numero_set,
        userId
      );

      // Emitir evento
      const io = req.app.get('io');
      io.of('/partido-en-vivo')
        .to(`partido:${idpartido}`)
        .emit('set:iniciado_con_formacion', { 
          numero_set,
          formacion_local,
          formacion_visitante 
        });

      res.json({
        success: true,
        message: `Set ${numero_set} iniciado con formaciones`
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Finaliza el partido y genera estadísticas
   */
  async finalizarPartido(req, res) {
    try {
      const { idpartido } = req.params;
      const userId = req.usuario.idusuario;

      // 1. Generar estadísticas finales
      await estadisticasPartidoService.generarEstadisticasFinales(
        parseInt(idpartido)
      );

      // 2. Sincronizar con PostgreSQL
      await partidoDigitalService.sincronizarConPostgreSQL(
        parseInt(idpartido)
      );

      // 3. Obtener resumen completo
      const resumen = await estadisticasPartidoService.obtenerResumenCompleto(
        parseInt(idpartido)
      );

      res.json({
        success: true,
        data: resumen,
        message: 'Partido finalizado y sincronizado'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Obtiene el estado completo del partido en tiempo real
   */
  async obtenerEstadoCompleto(req, res) {
    try {
      const { idpartido } = req.params;

      const [
        partido,
        sets,
        estadisticas,
        resumen
      ] = await Promise.all([
        partidoDigitalService.obtenerPorId(parseInt(idpartido)),
        setsPartidoService.obtenerPorPartido(parseInt(idpartido)),
        estadisticasPartidoService.obtenerResumenCompleto(parseInt(idpartido)),
        eventosPartidoService.obtenerResumenEventos(parseInt(idpartido))
      ]);

      res.json({
        success: true,
        data: {
          partido,
          sets,
          estadisticas,
          resumen_eventos: resumen
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new PlanillaDigitalController();
