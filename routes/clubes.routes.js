const express = require('express');
const router = express.Router();
const autenticar = require('../middleware/authMiddleware');
const autorizar = require('../middleware/roleMiddleware');
const ClubController = require('../controllers/clubController');

// CRUD Routes
router.post('/', ClubController.crearClub);                        // POST /api/club
router.get('/', ClubController.obtenerClubs);                      // GET /api/club (solo activos)
router.get('/todos', ClubController.obtenerTodosLosClubs);         // GET /api/club/todos (incluyendo inactivos)
router.post('/getbyId', ClubController.getbyId);                   // POST /api/club/getbyId (por body)
router.get('/:id', ClubController.obtenerClubPorId);               // GET /api/club/:id
router.put('/:id', ClubController.actualizarClub);                 // PUT /api/club/:id
router.delete('/:id', ClubController.eliminarClub);                // DELETE /api/club/:id

module.exports = router;