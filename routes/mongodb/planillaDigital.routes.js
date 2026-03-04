// routes/mongodb/planillaDigital.routes.js
const express = require('express');
const router = express.Router();

// 🧪 TEMPORAL: Comentado para pruebas - Descomentar en producción
// const autenticar = require('../../middleware/authMiddleware');
const planillaController = require('../../controllers/mongodb/planillaDigitalController');

// 📋 RUTAS PÚBLICAS (sin autenticación) - Solo para pruebas
// TODO: Descomentar 'autenticar' y agregarlo a cada ruta en producción

// Listar todos los partidos finalizados (disponibles para ver planilla)
router.get(
  '/finalizados',
  planillaController.listarPartidosFinalizados
);

// Verificar si un partido está listo para imprimir
router.get(
  '/:idpartido/verificar',
  planillaController.verificarPartido
);

// Obtener resumen rápido de un partido
router.get(
  '/:idpartido/resumen',
  planillaController.obtenerResumen
);

// Obtener planilla completa en JSON (PÚBLICA)
router.get(
  '/:idpartido',
  planillaController.obtenerPlanilla
);

// Renderizar planilla en HTML (para imprimir)
router.get(
  '/:idpartido/html',
  planillaController.renderizarPlanillaHTML
);

module.exports = router;
