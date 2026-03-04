// routes/mongodb/substitucionesPartido.routes.js
const express = require('express');
const router = express.Router();
const substitucionesPartidoController = require('../../controllers/mongodb/substitucionesPartido.controller');
const autenticar = require('../../middleware/authMiddleware');
const autorizar = require('../../middleware/roleMiddleware');

// GET /api/mongodb/substituciones/:idpartido
router.get(
  '/:idpartido',
  autenticar,
  substitucionesPartidoController.obtenerPorPartido
);

// GET /api/mongodb/substituciones/:idpartido/:numero_set/:equipo/disponibles
router.get(
  '/:idpartido/:numero_set/:equipo/disponibles',
  autenticar,
  substitucionesPartidoController.obtenerDisponibles
);

// POST /api/mongodb/substituciones/:idpartido
router.post(
  '/:idpartido',
  autenticar,
  autorizar(['arbitro', 'planillero']),
  substitucionesPartidoController.registrar
);

module.exports = router;
