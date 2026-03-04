const express = require('express');
const router = express.Router();
const GrupoController = require('../controllers/grupoController');

// ============================================
// CREATE - Crear un nuevo grupo
// ============================================
router.post('/', GrupoController.crearGrupo);

// ============================================
// READ - Obtener todos los grupos activos
// ============================================
router.get('/', GrupoController.obtenerGrupos);

// ============================================
// READ - Obtener TODOS los grupos (incluyendo inactivos)
// ============================================
router.get('/todos', GrupoController.obtenerTodosLosGrupos);

// ============================================
// READ - Obtener un grupo por ID
// ============================================
router.get('/:id', GrupoController.obtenerGrupoPorId);

// ============================================
// READ - Obtener grupos por CampeonatoCategoria
// ============================================
router.get('/campeonato-categoria/:id_cc', GrupoController.obtenerGruposPorCampeonatoCategoria);

// ============================================
// READ - Obtener grupos por Fase
// ============================================
router.get('/fase/:id_fase', GrupoController.obtenerGruposPorFase);

// ============================================
// READ - Obtener grupo por clave única
// ============================================
router.get('/clave/:id_cc/:clave', GrupoController.obtenerGrupoPorClave);

// ============================================
// UPDATE - Actualizar un grupo
// ============================================
router.put('/:id', GrupoController.actualizarGrupo);

// ============================================
// DELETE - Eliminar (soft delete) un grupo
// ============================================
router.delete('/:id', GrupoController.eliminarGrupo);

module.exports = router;
