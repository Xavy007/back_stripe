// routes/mongodb/setsPartido.routes.js
const express = require('express');
const router = express.Router();
const setsPartidoController = require('../../controllers/mongodb/setsPartido.controller');
const autenticar = require('../../middleware/authMiddleware');

// GET /api/mongodb/sets/:idpartido
router.get(
  '/:idpartido',
  autenticar,
  setsPartidoController.obtenerPorPartido
);

// GET /api/mongodb/sets/:idpartido/:numero_set
router.get(
  '/:idpartido/:numero_set',
  autenticar,
  setsPartidoController.obtenerSetActual
);

module.exports = router;
