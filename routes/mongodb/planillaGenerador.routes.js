// routes/mongodb/planillaGenerador.routes.js
const express = require('express');
const router = express.Router();
const planillaGeneradorController = require('../../controllers/mongodb/planillaGenerador.controller');
const autenticar = require('../../middleware/authMiddleware');

// GET /api/mongodb/planilla/:idpartido/html
router.get(
  '/:idpartido/html',
  planillaGeneradorController.generarHTML
);

// GET /api/mongodb/planilla/:idpartido/pdf
router.get(
  '/:idpartido/pdf',
  autenticar,
  planillaGeneradorController.generarPDF
);

// GET /api/mongodb/planilla/:idpartido/descargar
router.get(
  '/:idpartido/descargar',
  autenticar,
  planillaGeneradorController.descargarPDF
);

module.exports = router;
