const express = require('express');
const router = express.Router();
const autenticar = require('../middleware/authMiddleware');
const autorizar = require('../middleware/roleMiddleware');
const CanchaController = require('../controllers/canchaController');

// CRUD Routes
router.post('/', CanchaController.crearCancha);                           // POST /api/canchas
router.get('/', CanchaController.obtenerCanchas);                         // GET /api/canchas (solo activas)
router.get('/todas', CanchaController.obtenerTodasLasCanchas);            // GET /api/canchas/todas (incluyendo inactivas)
router.get('/:id', CanchaController.obtenerCanchaPorId);                  // GET /api/canchas/:id
router.put('/:id', CanchaController.actualizarCancha);                    // PUT /api/canchas/:id
router.delete('/:id', CanchaController.eliminarCancha);                   // DELETE /api/canchas/:id

module.exports = router;