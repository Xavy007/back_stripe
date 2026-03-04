// routes/mongodb/sancionesPartido.routes.js
const express = require('express');
const router = express.Router();
const sancionesPartidoController = require('../../controllers/mongodb/sancionesPartido.controller');
const autenticar = require('../../middleware/authMiddleware');
const autorizar = require('../../middleware/roleMiddleware');

// GET /api/mongodb/sanciones/:idpartido
router.get(
  '/:idpartido',
  autenticar,
  sancionesPartidoController.obtenerPorPartido
);

// GET /api/mongodb/sanciones/:idpartido/:numero_set
router.get(
  '/:idpartido/:numero_set',
  autenticar,
  sancionesPartidoController.obtenerPorSet
);

// POST /api/mongodb/sanciones/:idpartido
router.post(
  '/:idpartido',
  autenticar,
  autorizar(['arbitro']), // Solo árbitros pueden sancionar
  sancionesPartidoController.registrar
);

// POST /api/mongodb/sanciones/:idpartido/advertencia
router.post(
  '/:idpartido/advertencia',
  autenticar,
  autorizar(['arbitro']),
  sancionesPartidoController.registrarAdvertencia
);

// POST /api/mongodb/sanciones/:idpartido/penalty
router.post(
  '/:idpartido/penalty',
  autenticar,
  autorizar(['arbitro']),
  sancionesPartidoController.registrarPenalty
);

module.exports = router;
