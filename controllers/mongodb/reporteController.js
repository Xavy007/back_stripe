// controllers/mongodb/reporteController.js
const reporteService = require('../../services/mongodb/reporteService');

/**
 * GET /api/reportes/goleadores
 * Query params: idcampeonato, idcategoria, limite
 */
const obtenerTopGoleadores = async (req, res) => {
  try {
    const { idcampeonato, idcategoria, limite } = req.query;

    const reporte = await reporteService.obtenerTopGoleadores({
      idcampeonato,
      idcategoria,
      limite: limite || 20
    });

    res.json({
      success: true,
      data: reporte
    });

  } catch (error) {
    console.error('Error en reporte de goleadores:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar reporte de goleadores',
      error: error.message
    });
  }
};

/**
 * GET /api/reportes/estadisticas-equipos
 * Query params: idcampeonato, idcategoria
 */
const obtenerEstadisticasEquipos = async (req, res) => {
  try {
    const { idcampeonato, idcategoria } = req.query;

    const reporte = await reporteService.obtenerEstadisticasEquipos({
      idcampeonato,
      idcategoria
    });

    res.json({
      success: true,
      data: reporte
    });

  } catch (error) {
    console.error('Error en reporte de estadísticas de equipos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar reporte de estadísticas de equipos',
      error: error.message
    });
  }
};

/**
 * GET /api/reportes/jugador/:idjugador
 * Query params: idcampeonato, idcategoria
 */
const obtenerEstadisticasJugador = async (req, res) => {
  try {
    const { idjugador } = req.params;
    const { idcampeonato, idcategoria } = req.query;

    if (!idjugador) {
      return res.status(400).json({
        success: false,
        message: 'El ID del jugador es requerido'
      });
    }

    const reporte = await reporteService.obtenerEstadisticasJugador(idjugador, {
      idcampeonato,
      idcategoria
    });

    res.json({
      success: true,
      data: reporte
    });

  } catch (error) {
    console.error('Error en reporte de estadísticas del jugador:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar reporte de estadísticas del jugador',
      error: error.message
    });
  }
};

/**
 * GET /api/reportes/sanciones
 * Query params: idcampeonato, idcategoria, tipo_sancion
 */
const obtenerReporteSanciones = async (req, res) => {
  try {
    const { idcampeonato, idcategoria, tipo_sancion } = req.query;

    const reporte = await reporteService.obtenerReporteSanciones({
      idcampeonato,
      idcategoria,
      tipo_sancion
    });

    res.json({
      success: true,
      data: reporte
    });

  } catch (error) {
    console.error('Error en reporte de sanciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar reporte de sanciones',
      error: error.message
    });
  }
};

/**
 * GET /api/reportes/jornada/:idjornada
 */
const obtenerResumenJornada = async (req, res) => {
  try {
    const { idjornada } = req.params;

    if (!idjornada) {
      return res.status(400).json({
        success: false,
        message: 'El ID de la jornada es requerido'
      });
    }

    const reporte = await reporteService.obtenerResumenJornada(idjornada);

    res.json({
      success: true,
      data: reporte
    });

  } catch (error) {
    console.error('Error en reporte de jornada:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar reporte de jornada',
      error: error.message
    });
  }
};

/**
 * GET /api/reportes/comparativa/:idequipo1/:idequipo2
 * Query params: idcampeonato
 */
const obtenerComparativaEquipos = async (req, res) => {
  try {
    const { idequipo1, idequipo2 } = req.params;
    const { idcampeonato } = req.query;

    if (!idequipo1 || !idequipo2) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren los IDs de ambos equipos'
      });
    }

    const reporte = await reporteService.obtenerComparativaEquipos(idequipo1, idequipo2, {
      idcampeonato
    });

    res.json({
      success: true,
      data: reporte
    });

  } catch (error) {
    console.error('Error en reporte comparativo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar reporte comparativo',
      error: error.message
    });
  }
};

module.exports = {
  obtenerTopGoleadores,
  obtenerEstadisticasEquipos,
  obtenerEstadisticasJugador,
  obtenerReporteSanciones,
  obtenerResumenJornada,
  obtenerComparativaEquipos
};
