// routes/mongodb/estadisticasJugadores.routes.js
const express = require('express');
const router = express.Router();
const estadisticasJugadoresController = require('../../controllers/mongodb/estadisticasJugadores.controller');
const autenticar = require('../../middleware/authMiddleware');

// GET /api/mongodb/estadisticas-jugadores/:idpartido
router.get(
  '/:idpartido',
  estadisticasJugadoresController.obtenerPorPartido
);

// GET /api/mongodb/estadisticas-jugadores/:idpartido/equipo/:equipo
router.get(
  '/:idpartido/equipo/:equipo',
  estadisticasJugadoresController.obtenerPorEquipo
);

// GET /api/mongodb/estadisticas-jugadores/:idpartido/jugador/:idjugador
router.get(
  '/:idpartido/jugador/:idjugador',
  estadisticasJugadoresController.obtenerPorJugador
);

// GET /api/mongodb/estadisticas-jugadores/:idpartido/top-scorers
router.get(
  '/:idpartido/top-scorers',
  estadisticasJugadoresController.obtenerTopScorers
);

// GET /api/mongodb/estadisticas-jugadores/:idpartido/mvp
router.get(
  '/:idpartido/mvp',
  estadisticasJugadoresController.obtenerMVP
);

module.exports = router;
