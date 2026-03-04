// routes/fixture.routes.js

const express = require('express');
const router = express.Router();
const fixtureController = require('../controllers/fixtureController');
const autenticar = require('../middleware/authMiddleware');

// Obtener todos los partidos (sin filtro de campeonato)
router.get('/partidos', (req, res) => fixtureController.obtenerTodosPartidos(req, res));

// Generar fixture (preview, no guarda en BD)
router.post('/generar', (req, res) => fixtureController.generarFixture(req, res));

// Guardar fixture completo en BD
router.post('/guardar', (req, res) => fixtureController.guardarFixture(req, res));

// Obtener fixture de un campeonato-categoria
router.get('/campeonato/:id_campeonato/categoria/:id_cc', (req, res) => fixtureController.obtenerFixture(req, res));

// Obtener partidos solo por id_cc (campeonato-categoria)
router.get('/cc/:id_cc', (req, res) => fixtureController.obtenerPartidosPorCC(req, res));

// Obtener TODOS los partidos del campeonato (todas las categorías)
router.get('/campeonato/:id_campeonato/todos', (req, res) => fixtureController.obtenerTodosLosPartidos(req, res));

// 🆕 Obtener MIS partidos (filtrados por rol de usuario autenticado)
router.get('/mis-partidos', autenticar, (req, res) => fixtureController.obtenerMisPartidos(req, res));

// Obtener un partido específico por ID
router.get('/partido/:id_partido', (req, res) => fixtureController.obtenerPartido(req, res));

// Actualizar un partido específico (cancha, árbitros, horario)
router.put('/partido/:id_partido', (req, res) => fixtureController.actualizarPartido(req, res));

// Obtener recursos disponibles (canchas, árbitros)
router.get('/recursos', (req, res) => fixtureController.obtenerRecursosDisponibles(req, res));

// Debug: Obtener información detallada de partidos
router.get('/debug/campeonato/:id_campeonato', (req, res) => fixtureController.debugPartidos(req, res));

// Eliminar partidos duplicados (soft delete)
router.delete('/partidos-duplicados/:id_campeonato', (req, res) => fixtureController.eliminarPartidosDuplicados(req, res));

module.exports = router;
