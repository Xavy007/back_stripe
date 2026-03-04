// routes/mongodb/reportes.routes.js
const express = require('express');
const router = express.Router();

// 🧪 TEMPORAL: Comentado para pruebas - Descomentar en producción
// const autenticar = require('../../middleware/authMiddleware');
const reporteController = require('../../controllers/mongodb/reporteController');

/**
 * RUTAS DE REPORTES
 * Todas las rutas están públicas para pruebas
 * TODO: Descomentar 'autenticar' y agregarlo a cada ruta en producción
 */

// Reporte 1: Top Goleadores/Anotadores
// GET /api/reportes/goleadores?idcampeonato=1&idcategoria=1&limite=20
router.get(
  '/goleadores',
  reporteController.obtenerTopGoleadores
);

// Reporte 2: Estadísticas de Equipos
// GET /api/reportes/estadisticas-equipos?idcampeonato=1&idcategoria=1
router.get(
  '/estadisticas-equipos',
  reporteController.obtenerEstadisticasEquipos
);

// Reporte 3: Estadísticas de un Jugador
// GET /api/reportes/jugador/123?idcampeonato=1&idcategoria=1
router.get(
  '/jugador/:idjugador',
  reporteController.obtenerEstadisticasJugador
);

// Reporte 4: Reporte de Sanciones
// GET /api/reportes/sanciones?idcampeonato=1&idcategoria=1&tipo_sancion=penalty
router.get(
  '/sanciones',
  reporteController.obtenerReporteSanciones
);

// Reporte 5: Resumen de Jornada
// GET /api/reportes/jornada/5
router.get(
  '/jornada/:idjornada',
  reporteController.obtenerResumenJornada
);

// Reporte Extra: Comparativa entre Equipos (Historial de Enfrentamientos)
// GET /api/reportes/comparativa/1/2?idcampeonato=1
router.get(
  '/comparativa/:idequipo1/:idequipo2',
  reporteController.obtenerComparativaEquipos
);

module.exports = router;
