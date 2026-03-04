const express = require('express');
const router = express.Router();
const ParticipacionController = require('../controllers/participacionController');

// ============================================
// CREATE - Crear una nueva participación
// ============================================
router.post('/', ParticipacionController.crearParticipacion);

// ============================================
// READ - Obtener todas las participaciones activas
// ============================================
router.get('/', ParticipacionController.obtenerParticipaciones);

// ============================================
// READ - Obtener TODAS las participaciones (todos los estados)
// ============================================
router.get('/todas', ParticipacionController.obtenerTodasLasParticipaciones);

// ============================================
// READ - Obtener una participación por ID
// ============================================
router.get('/:id', ParticipacionController.obtenerParticipacionPorId);

// ============================================
// READ - Obtener participaciones por Jugador
// ============================================
router.get('/jugador/:id_jugador', ParticipacionController.obtenerParticipacionesPorJugador);

// ============================================
// READ - Obtener participaciones por Equipo
// ============================================
router.get('/equipo/:id_equipo', ParticipacionController.obtenerParticipacionesPorEquipo);

// ============================================
// READ - Obtener participaciones por Campeonato
// ============================================
router.get('/campeonato/:id_campeonato', ParticipacionController.obtenerParticipacionesPorCampeonato);

// ============================================
// READ - Obtener participaciones por CampeonatoCategoria
// ============================================
router.get('/campeonato-categoria/:id_cc', ParticipacionController.obtenerParticipacionesPorCampeonatoCategoria);

// ============================================
// READ - Obtener participaciones por estado
// ============================================
router.get('/estado/:estado', ParticipacionController.obtenerParticipacionesPorEstado);

// ============================================
// UPDATE - Actualizar una participación
// ============================================
router.put('/:id', ParticipacionController.actualizarParticipacion);

// ============================================
// UPDATE - Cambiar estado de participación
// ============================================
router.patch('/:id/estado', ParticipacionController.cambiarEstadoParticipacion);

module.exports = router;
