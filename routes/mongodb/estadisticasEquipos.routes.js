// routes/mongodb/estadisticasEquipos.routes.js
const express = require('express');
const router = express.Router();
const estadisticasEquiposController = require('../../controllers/mongodb/estadisticasEquipos.controller');
const autenticar = require('../../middleware/authMiddleware');

// GET /api/mongodb/estadisticas-equipos/:idpartido
router.get(
  '/:idpartido',
  estadisticasEquiposController.obtenerPorPartido
);

// GET /api/mongodb/estadisticas-equipos/:idpartido/:equipo
router.get(
  '/:idpartido/:equipo',
  estadisticasEquiposController.obtenerPorEquipo
);

// GET /api/mongodb/estadisticas-equipos/:idpartido/comparativa
router.get(
  '/:idpartido/comparativa',
  estadisticasEquiposController.obtenerComparativa
);

module.exports = router;
