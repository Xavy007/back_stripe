const express = require('express');
const router = express.Router();
const HistorialCampeonatoController = require('../controllers/historialCampeonatoController');

// ============================================
// CREATE - Crear un nuevo registro de historial
// ============================================
router.post('/', HistorialCampeonatoController.crearHistorialCampeonato);

// ============================================
// READ - Obtener todos los registros activos
// ============================================
router.get('/', HistorialCampeonatoController.obtenerHistorialCampeonatos);

// ============================================
// READ - Obtener TODOS los registros (incluyendo inactivos)
// ============================================
router.get('/todos', HistorialCampeonatoController.obtenerTodosLosHistorialCampeonatos);

// ============================================
// READ - Obtener un registro por ID
// ============================================
router.get('/:id', HistorialCampeonatoController.obtenerHistorialCampeonatoPorId);

// ============================================
// READ - Obtener historial por Campeonato
// ============================================
router.get('/campeonato/:id_campeonato', HistorialCampeonatoController.obtenerHistorialPorCampeonato);

// ============================================
// READ - Obtener historial por CampeonatoCategoria
// ============================================
router.get('/campeonato-categoria/:id_cc', HistorialCampeonatoController.obtenerHistorialPorCampeonatoCategoria);

// ============================================
// READ - Obtener historial por Equipo
// ============================================
router.get('/equipo/:id_equipo', HistorialCampeonatoController.obtenerHistorialPorEquipo);

// ============================================
// READ - Obtener campeonatos ganados por Equipo
// ============================================
router.get('/equipo/:id_equipo/campeonatos-ganados', HistorialCampeonatoController.obtenerCampeonatosGanados);

// ============================================
// READ - Obtener top equipos
// ============================================
router.get('/campeonato/:id_campeonato/top-equipos', HistorialCampeonatoController.obtenerTopEquipos);

// ============================================
// UPDATE - Actualizar un registro
// ============================================
router.put('/:id', HistorialCampeonatoController.actualizarHistorialCampeonato);

// ============================================
// DELETE - Eliminar (soft delete) un registro
// ============================================
router.delete('/:id', HistorialCampeonatoController.eliminarHistorialCampeonato);

module.exports = router;
