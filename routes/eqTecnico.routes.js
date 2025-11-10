/**
 * routes/eqTecnicoRoutes.js
 * 
 * RUTAS SIMPLES Y CORRECTAS
 * Todas las funciones están verificadas en el controlador
 */

const express = require('express');
const router = express.Router();
const EqTecnicoController = require('../controllers/eqTecnicoController');

// ============================================
// CREATE
// ============================================

router.post('/', EqTecnicoController.crearEqTecnico);

// ============================================
// READ
// ============================================

// Rutas específicas (DEBEN ir antes de :id)
router.get('/todos', EqTecnicoController.obtenerTodosLosEqTecnicos);
router.get('/actuales', EqTecnicoController.obtenerEqTecnicosActuales);
router.get('/personas-disponibles', EqTecnicoController.obtenerPersonasDisponibles);

// Rutas con dos parámetros
router.get('/club/:id_club/categoria/:id_categoria', EqTecnicoController.obtenerEqTecnicosClubCategoria);

// Rutas con verificación
router.get('/verificar/:id_persona', EqTecnicoController.verificarEqTecnico);
router.get('/contar/club/:id_club', EqTecnicoController.contarPorClub);
router.get('/disponibilidad', EqTecnicoController.verificarDisponibilidad);

// Rutas con un parámetro
router.get('/persona/:id_persona', EqTecnicoController.obtenerPorPersona);
router.get('/categoria/:id_categoria', EqTecnicoController.obtenerPorCategoria);
router.get('/club/:id_club', EqTecnicoController.obtenerPorClub);

// Rutas genéricas (SIEMPRE AL FINAL)
router.get('/:id/completo', EqTecnicoController.obtenerCompleto);
router.get('/:id', EqTecnicoController.obtenerPorId);

// ============================================
// UPDATE
// ============================================

router.put('/:id', EqTecnicoController.actualizar);

// ============================================
// DELETE
// ============================================

router.delete('/:id', EqTecnicoController.eliminar);

// Obtener todos general
router.get('/', EqTecnicoController.obtenerEqTecnicos);

module.exports = router;