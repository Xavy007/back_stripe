// routes/partido.routes.js
const express = require('express');
const router = express.Router();
const partidoController = require('../controllers/partidoController');

// GET /partidos
router.get('/', (req, res, next) => partidoController.getPartidos(req, res, next));

// GET /partidos/:id
router.get('/:id', (req, res, next) => partidoController.getPartido(req, res, next));

// POST /partidos
router.post('/', (req, res, next) => partidoController.createPartido(req, res, next));

// PUT /partidos/:id
router.put('/:id', (req, res, next) => partidoController.updatePartido(req, res, next));

// DELETE /partidos/:id  -> ahora hace soft delete (estado = false)
router.delete('/:id', (req, res, next) => partidoController.deletePartido(req, res, next));

// PUT /partidos/:id/oficiales (árbitros + planillero)
router.put('/:id/oficiales', (req, res, next) =>
  partidoController.assignOficiales(req, res, next)
);

module.exports = router;
