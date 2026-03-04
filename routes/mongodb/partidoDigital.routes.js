// routes/mongodb/partidoDigital.routes.js
const express = require('express');
const router = express.Router();
const partidoDigitalController = require('../../controllers/mongodb/partidoDigital.controller');
const autenticar = require('../../middleware/authMiddleware');
const autorizar = require('../../middleware/roleMiddleware');

// GET /api/mongodb/partidos-digitales/:idpartido
router.get(
  '/:idpartido',
  autenticar,
  partidoDigitalController.obtener
);

// GET /api/mongodb/partidos-digitales/en-vivo
router.get(
  '/estado/en-vivo',
  partidoDigitalController.obtenerEnVivo
);

// GET /api/mongodb/partidos-digitales/campeonato/:idcampeonato
router.get(
  '/campeonato/:idcampeonato',
  autenticar,
  partidoDigitalController.obtenerPorCampeonato
);

// POST /api/mongodb/partidos-digitales
router.post(
  '/',
  autenticar,
  autorizar(['administrador', 'arbitro', 'planillero']),
  partidoDigitalController.crear
);

// POST /api/mongodb/partidos-digitales/:idpartido/iniciar
router.post(
  '/:idpartido/iniciar',
  autenticar,
  autorizar(['arbitro', 'planillero']),
  partidoDigitalController.iniciar
);

// POST /api/mongodb/partidos-digitales/:idpartido/iniciar-set
router.post(
  '/:idpartido/iniciar-set',
  autenticar,
  autorizar(['arbitro', 'planillero']),
  partidoDigitalController.iniciarSet
);

// PUT /api/mongodb/partidos-digitales/:idpartido/plantel
router.put(
  '/:idpartido/plantel',
  autenticar,
  autorizar(['arbitro', 'planillero']),
  partidoDigitalController.registrarPlantel
);

// PUT /api/mongodb/partidos-digitales/:idpartido/arbitraje
router.put(
  '/:idpartido/arbitraje',
  autenticar,
  autorizar(['administrador', 'planillero']),
  partidoDigitalController.registrarArbitraje
);

// POST /api/mongodb/partidos-digitales/:idpartido/cerrar
router.post(
  '/:idpartido/cerrar',
  autenticar,
  autorizar(['arbitro']),
  partidoDigitalController.cerrarPlanilla
);

// ✅ POST /api/mongodb/partidos-digitales/:idpartido/guardar-completo
// Guardar partido completo desde la app móvil (sin autenticación para pruebas)
router.post(
  '/:idpartido/guardar-completo',
  partidoDigitalController.guardarPartidoCompleto
);

module.exports = router;
