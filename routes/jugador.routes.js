const express = require('express');
const router = express.Router();
const jugadorController = require('../controllers/jugadorController');

router.post('/', jugadorController.crearJugadorCompleto);

router.post('/persona/:id_persona', jugadorController.crearJugadorParaPersona);

router.get('/personas-sin-jugador', jugadorController.obtenerPersonasSinJugador);


router.get('/todos', jugadorController.obtenerTodosLosJugadores);

router.get('/:id_jugador', jugadorController.obtenerJugadorPorId);

router.get('/club/:id_club', jugadorController.obtenerJugadoresPorClub);


router.get('/', jugadorController.obtenerJugadores);

router.get('/buscar/nombre', jugadorController.obtenerJugadoresPorNombre);

router.get('/buscar/estatura', jugadorController.obtenerJugadoresPorEstatura);


router.put('/:id_jugador', jugadorController.actualizarJugador);

router.delete('/:id_jugador', jugadorController.eliminarJugador);

module.exports = router;