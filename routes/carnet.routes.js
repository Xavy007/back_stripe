'use strict';
const express = require('express');
const router = express.Router();
const CarnetController = require('../controllers/carnetController');

router.post('/solicitar', CarnetController.solicitarCarnet);

router.put('/activar/:id', CarnetController.activarCarnet);


router.post('/cancelar/:id', CarnetController.cancelarCarnet);


router.post('/marcar-vencidos', CarnetController.marcarCarnetsvencidos);

router.get('/:id', CarnetController.obtenerCarnetPorId);

router.get('/numero/:numero_carnet', CarnetController.obtenerCarnetPorNumero);

router.get('/jugador/:id_jugador', CarnetController.obtenerCarnetsPorJugador);

router.get('/jugador/:id_jugador/gestion/:id_gestion', CarnetController.obtenerCarnetActual);

router.get('/gestion/:id_gestion', CarnetController.obtenerCarnetsPorGestion);

router.get('/gestion/:id_gestion/estadisticas', CarnetController.obtenerEstadisticas);

router.post('/buscar', CarnetController.buscarCarnets);


router.get('/', CarnetController.obtenerConPaginacion);

module.exports = router;