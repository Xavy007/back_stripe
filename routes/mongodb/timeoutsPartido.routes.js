// routes/mongodb/timeoutsPartido.routes.js
const express = require('express');
const router = express.Router();
const timeoutsPartidoController = require('../../controllers/mongodb/timeoutsPartido.controller');
const autenticar = require('../../middleware/authMiddleware');
const autorizar = require('../../middleware/roleMiddleware');

// GET /api/mongodb/timeouts/:idpartido
router.get(
  '/:idpartido',
  autenticar,
  timeoutsPartidoController.obtenerPorPartido
);

// GET /api/mongodb/timeouts/:idpartido/:numero_set/:equipo/disponibles
router.get(
  '/:idpartido/:numero_set/:equipo/disponibles',
  autenticar,
  timeoutsPartidoController.obtenerDisponibles
);

// POST /api/mongodb/timeouts/:idpartido
router.post(
  '/:idpartido',
  autenticar,
  autorizar(['arbitro', 'planillero', 'dt']),
  timeoutsPartidoController.solicitar
);

// PUT /api/mongodb/timeouts/:idpartido/:numero_set/:numero_timeout/finalizar
router.put(
  '/:idpartido/:numero_set/:numero_timeout/finalizar',
  autenticar,
  autorizar(['arbitro', 'planillero']),
  timeoutsPartidoController.finalizar
);

module.exports = router;
