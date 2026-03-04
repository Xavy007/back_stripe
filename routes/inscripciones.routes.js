const express = require('express');
const router = express.Router();
const InscripcionController = require('../controllers/inscripcionController');

// ============================================
// CREATE - Crear una nueva inscripción
// ============================================
router.post('/', InscripcionController.crearInscripcion);

// ============================================
// READ - Obtener todas las inscripciones activas
// ============================================
router.get('/', InscripcionController.obtenerInscripciones);

// ============================================
// READ - Obtener TODAS las inscripciones (todos los estados)
// ============================================
router.get('/todas', InscripcionController.obtenerTodasLasInscripciones);

// ============================================
// READ - Obtener una inscripción por ID
// ============================================
router.get('/:id', InscripcionController.obtenerInscripcionPorId);

// ============================================
// READ - Obtener inscripciones por Campeonato
// ============================================
router.get('/campeonato/:id_campeonato', InscripcionController.obtenerInscripcionesPorCampeonato);

// ============================================
// READ - Obtener inscripciones por CampeonatoCategoria
// ============================================
router.get('/campeonato-categoria/:id_cc', InscripcionController.obtenerInscripcionesPorCampeonatoCategoria);

// ============================================
// READ - Obtener inscripciones por Equipo
// ============================================
router.get('/equipo/:id_equipo', InscripcionController.obtenerInscripcionesPorEquipo);

// ============================================
// READ - Obtener inscripciones por Grupo
// ============================================
router.get('/grupo/:id_grupo', InscripcionController.obtenerInscripcionesPorGrupo);

// ============================================
// READ - Obtener inscripciones por estado
// ============================================
router.get('/estado/:estado', InscripcionController.obtenerInscripcionesPorEstado);

// ============================================
// UPDATE - Actualizar una inscripción
// ============================================
router.put('/:id', InscripcionController.actualizarInscripcion);

// ============================================
// UPDATE - Cambiar estado de inscripción
// ============================================
router.patch('/:id/estado', InscripcionController.cambiarEstadoInscripcion);

module.exports = router;
