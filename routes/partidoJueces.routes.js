const express = require('express');
const router = express.Router();
const PartidoJuezController = require('../controllers/partidoJuezController');

// ============================================
// CREATE - Crear una nueva asignación de jueces
// ============================================
router.post('/', PartidoJuezController.crearPartidoJuez);

// ============================================
// READ - Obtener todas las asignaciones activas
// ============================================
router.get('/', PartidoJuezController.obtenerPartidoJueces);

// ============================================
// READ - Obtener TODAS las asignaciones (incluyendo inactivas)
// ============================================
router.get('/todas', PartidoJuezController.obtenerTodosLosPartidoJueces);

// ============================================
// READ - Obtener una asignación por ID
// ============================================
router.get('/:id', PartidoJuezController.obtenerPartidoJuezPorId);

// ============================================
// READ - Obtener asignación por Partido
// ============================================
router.get('/partido/:id_partido', PartidoJuezController.obtenerPartidoJuezPorPartido);

// ============================================
// READ - Obtener partidos de un juez
// ============================================
router.get('/juez/:id_juez', PartidoJuezController.obtenerPartidosPorJuez);

// ============================================
// UPDATE - Actualizar una asignación
// ============================================
router.put('/:id', PartidoJuezController.actualizarPartidoJuez);

// ============================================
// UPDATE - Confirmar asignación de jueces
// ============================================
router.patch('/:id/confirmar', PartidoJuezController.confirmarPartidoJuez);

// ============================================
// DELETE - Eliminar (soft delete) una asignación
// ============================================
router.delete('/:id', PartidoJuezController.eliminarPartidoJuez);

module.exports = router;
