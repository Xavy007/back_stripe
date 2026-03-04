// routes/mongodb/configuracionPuntos.routes.js
const express = require('express');
const router = express.Router();
const configuracionPuntosController = require('../../controllers/mongodb/configuracionPuntos.controller');
const autenticar = require('../../middleware/authMiddleware');
const autorizar = require('../../middleware/roleMiddleware');

// GET /api/mongodb/configuracion-puntos/:idcampeonato
router.get(
  '/:idcampeonato',
  autenticar,
  configuracionPuntosController.obtener
);

// POST /api/mongodb/configuracion-puntos
router.post(
  '/',
  autenticar,
  autorizar(['administrador']),
  configuracionPuntosController.crear
);

// PUT /api/mongodb/configuracion-puntos/:idcampeonato
router.put(
  '/:idcampeonato',
  autenticar,
  autorizar(['administrador']),
  configuracionPuntosController.actualizar
);

// POST /api/mongodb/configuracion-puntos/:idcampeonato/default
router.post(
  '/:idcampeonato/default',
  autenticar,
  autorizar(['administrador']),
  configuracionPuntosController.crearPorDefecto
);

module.exports = router;
