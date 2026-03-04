// routes/configuracionPuntos.routes.js

const express = require('express');
const router = express.Router();
const configuracionPuntosController = require('../controllers/configuracionPuntosController');

// GET - Obtener configuración de un campeonato
router.get('/:idcampeonato', configuracionPuntosController.obtenerConfiguracion);

// GET - Obtener todas las configuraciones activas (debug/admin)
router.get('/activas/todas', configuracionPuntosController.obtenerConfiguracionesActivas);

// PUT - Actualizar configuración
router.put('/:idcampeonato', configuracionPuntosController.actualizarConfiguracion);

// POST - Resetear configuración a valores por defecto
router.post('/:idcampeonato/reset', configuracionPuntosController.resetearConfiguracion);

// DELETE - Limpiar configuración de memoria
router.delete('/:idcampeonato', configuracionPuntosController.limpiarConfiguracion);

module.exports = router;
