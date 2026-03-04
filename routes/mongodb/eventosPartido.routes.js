// routes/mongodb/eventosPartido.routes.js
const express = require('express');
const router = express.Router();
const eventosPartidoController = require('../../controllers/mongodb/eventosPartido.controller');
const autenticar = require('../../middleware/authMiddleware');
const autorizar = require('../../middleware/roleMiddleware');

// GET /api/mongodb/eventos/:idpartido
router.get(
  '/:idpartido',
  autenticar,
  eventosPartidoController.obtenerEventosPartido
);

// GET /api/mongodb/eventos/:idpartido/:numero_set
router.get(
  '/:idpartido/:numero_set',
  autenticar,
  eventosPartidoController.obtenerEventosSet
);

// GET /api/mongodb/eventos/:idpartido/resumen
router.get(
  '/:idpartido/resumen',
  autenticar,
  eventosPartidoController.obtenerResumen
);

// POST /api/mongodb/eventos/:idpartido/punto
router.post(
  '/:idpartido/punto',
  //autenticar,
  //autorizar(['arbitro', 'planillero', 'admin', 'Administrador']),
  eventosPartidoController.registrarPunto
);

// POST /api/mongodb/eventos/:idpartido/evento
router.post(
  '/:idpartido/evento',
  autenticar,
  autorizar(['arbitro', 'planillero', 'admin', 'Administrador']),
  eventosPartidoController.registrarEvento
);

module.exports = router;
