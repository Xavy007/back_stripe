const express = require('express');
const router = express.Router();
const GrupoInscripcionController = require('../controllers/grupoInscripcionController');

// ============================================
// CREATE - Crear una nueva asignación de grupo
// ============================================
router.post('/', GrupoInscripcionController.crearGrupoInscripcion);

// ============================================
// READ - Obtener todas las asignaciones activas
// ============================================
router.get('/', GrupoInscripcionController.obtenerGrupoInscripciones);

// ============================================
// READ - Obtener TODAS las asignaciones (incluyendo inactivas)
// ============================================
router.get('/todas', GrupoInscripcionController.obtenerTodasLasGrupoInscripciones);

// ============================================
// READ - Obtener una asignación por ID
// ============================================
router.get('/:id', GrupoInscripcionController.obtenerGrupoInscripcionPorId);

// ============================================
// READ - Obtener asignaciones por Grupo
// ============================================
router.get('/grupo/:id_grupo', GrupoInscripcionController.obtenerGrupoInscripcionesPorGrupo);

// ============================================
// READ - Obtener asignaciones por Inscripción
// ============================================
router.get('/inscripcion/:id_inscripcion', GrupoInscripcionController.obtenerGrupoInscripcionesPorInscripcion);

// ============================================
// READ - Obtener asignaciones por Bombo
// ============================================
router.get('/bombo/:bombo', GrupoInscripcionController.obtenerGrupoInscripcionesPorBombo);

// ============================================
// UPDATE - Actualizar una asignación
// ============================================
router.put('/:id', GrupoInscripcionController.actualizarGrupoInscripcion);

// ============================================
// DELETE - Eliminar (soft delete) una asignación
// ============================================
router.delete('/:id', GrupoInscripcionController.eliminarGrupoInscripcion);

module.exports = router;
