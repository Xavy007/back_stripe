const express = require('express');
const router = express.Router();
const FaseController = require('../controllers/faseController');

// ============================================
// CREATE - Crear una nueva fase
// ============================================
router.post('/', FaseController.crearFase);

// ============================================
// READ - Obtener todas las fases activas
// ============================================
router.get('/', FaseController.obtenerFases);

// ============================================
// READ - Obtener TODAS las fases (incluyendo inactivas)
// ============================================
router.get('/todas', FaseController.obtenerTodasLasFases);

// ============================================
// READ - Obtener una fase por ID
// ============================================
router.get('/:id', FaseController.obtenerFasePorId);

// ============================================
// READ - Obtener fases por CampeonatoCategoria
// ============================================
router.get('/campeonato-categoria/:id_cc', FaseController.obtenerFasesPorCampeonatoCategoria);

// ============================================
// READ - Obtener fases por tipo
// ============================================
router.get('/tipo/:tipo', FaseController.obtenerFasesPorTipo);

// ============================================
// READ - Obtener fases por estado
// ============================================
router.get('/estado/:estado', FaseController.obtenerFasesPorEstado);

// ============================================
// UPDATE - Actualizar una fase
// ============================================
router.put('/:id', FaseController.actualizarFase);

// ============================================
// UPDATE - Cambiar estado de una fase
// ============================================
router.patch('/:id/estado', FaseController.cambiarEstadoFase);

// ============================================
// DELETE - Eliminar (soft delete) una fase
// ============================================
router.delete('/:id', FaseController.eliminarFase);

module.exports = router;
