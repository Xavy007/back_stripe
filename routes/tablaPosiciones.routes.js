const express = require('express');
const router = express.Router();
const TablaPosicionController = require('../controllers/tablaPosicionController');

// ============================================
// CREATE - Crear una nueva posición en tabla
// ============================================
router.post('/', TablaPosicionController.crearTablaPosicion);

// ============================================
// READ - Obtener todas las posiciones activas
// ============================================
router.get('/', TablaPosicionController.obtenerTablaPosiciones);

// ============================================
// READ - Obtener TODAS las posiciones (incluyendo inactivas)
// ============================================
router.get('/todas', TablaPosicionController.obtenerTodasLasTablaPosiciones);

// ============================================
// READ - Obtener tabla por Campeonato (DEBE IR ANTES DE /:id)
// ============================================
router.get('/campeonato/:id_campeonato', TablaPosicionController.obtenerTablaPorCampeonato);

// ============================================
// READ - Obtener tabla por Campeonato y Categoría (DEBE IR ANTES DE /:id)
// ============================================
router.get('/campeonato/:id_campeonato/categoria/:id_categoria', TablaPosicionController.obtenerTablaPorCampeonatoCategoria);

// ============================================
// READ - Obtener posición de un equipo específico (DEBE IR ANTES DE /:id)
// ============================================
router.get('/campeonato/:id_campeonato/categoria/:id_categoria/equipo/:id_equipo', TablaPosicionController.obtenerPosicionEquipo);

// ============================================
// READ - Obtener top N equipos (DEBE IR ANTES DE /:id)
// ============================================
router.get('/campeonato/:id_campeonato/categoria/:id_categoria/top', TablaPosicionController.obtenerTopEquipos);

// ============================================
// POST - Inicializar tabla con equipos inscritos (DEBE IR ANTES DE /:id)
// ============================================
router.post('/campeonato/:id_campeonato/categoria/:id_categoria/inicializar', TablaPosicionController.inicializarTabla);

// ============================================
// READ - Obtener una posición por ID (DEBE IR AL FINAL de los GETs)
// ============================================
router.get('/:id', TablaPosicionController.obtenerTablaPosicionPorId);

// ============================================
// UPDATE - Actualizar una posición
// ============================================
router.put('/:id', TablaPosicionController.actualizarTablaPosicion);

// ============================================
// DELETE - Eliminar (soft delete) una posición
// ============================================
router.delete('/:id', TablaPosicionController.eliminarTablaPosicion);

module.exports = router;
