// routes/mongodb/formacionesSets.routes.js
const express = require('express');
const router = express.Router();
const formacionesSetsController = require('../../controllers/mongodb/formacionesSets.controller');
const autenticar = require('../../middleware/authMiddleware');
const autorizar = require('../../middleware/roleMiddleware');

// GET /api/mongodb/formaciones/:idpartido/:numero_set
router.get(
  '/:idpartido/:numero_set',
  autenticar,
  formacionesSetsController.obtener
);

// POST /api/mongodb/formaciones
router.post(
  '/',
  autenticar,
  autorizar(['arbitro', 'planillero']),
  formacionesSetsController.registrar
);

// POST /api/mongodb/formaciones/:idpartido/:numero_set/confirmar
router.post(
  '/:idpartido/:numero_set/confirmar',
  autenticar,
  autorizar(['arbitro', 'planillero', 'dt']),
  formacionesSetsController.confirmar
);

module.exports = router;
