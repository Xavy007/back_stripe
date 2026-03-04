const express = require('express');
const router = express.Router();
const JornadaController = require('../controllers/jornadaController');

// ============================================
// CREATE - Crear una nueva jornada
// ============================================
router.post('/', JornadaController.crearJornada);

// ============================================
// READ - Obtener todas las jornadas activas
// ============================================
router.get('/', JornadaController.obtenerJornadas);

// ============================================
// READ - Obtener TODAS las jornadas (incluyendo inactivas)
// ============================================
router.get('/todas', JornadaController.obtenerTodasLasJornadas);

// ============================================
// READ - Obtener una jornada por ID
// ============================================
router.get('/:id', JornadaController.obtenerJornadaPorId);

// ============================================
// READ - Obtener jornadas por Fase
// ============================================
router.get('/fase/:id_fase', JornadaController.obtenerJornadasPorFase);

// ============================================
// READ - Obtener jornadas por Grupo
// ============================================
router.get('/grupo/:id_grupo', JornadaController.obtenerJornadasPorGrupo);

// ============================================
// READ - Obtener jornadas por CampeonatoCategoria
// ============================================
router.get('/campeonato-categoria/:id_cc', JornadaController.obtenerJornadasPorCampeonatoCategoria);

// ============================================
// READ - Obtener jornadas por estado
// ============================================
router.get('/estado/:estado', JornadaController.obtenerJornadasPorEstado);

// ============================================
// UPDATE - Actualizar una jornada
// ============================================
router.put('/:id', JornadaController.actualizarJornada);

// ============================================
// UPDATE - Cambiar estado de jornada
// ============================================
router.patch('/:id/estado', JornadaController.cambiarEstadoJornada);

// ============================================
// DELETE - Eliminar (soft delete) una jornada
// ============================================
router.delete('/:id', JornadaController.eliminarJornada);

module.exports = router;
