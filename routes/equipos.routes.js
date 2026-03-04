const express = require('express');
const router = express.Router();
const autenticar = require('../middleware/authMiddleware');
const autorizar = require('../middleware/roleMiddleware');
const EquipoController = require('../controllers/equipoController');

// CRUD Routes
router.post('/', EquipoController.crearEquipo);                                                    // POST /api/equipo
router.get('/', EquipoController.obtenerEquipos);                                                  // GET /api/equipo (solo activos)
router.get('/todos', EquipoController.obtenerTodosLosEquipos);                                     // GET /api/equipo/todos (incluyendo inactivos)
router.post('/getbyId', EquipoController.getbyId);                                                 // POST /api/equipo/getbyId (por body)
router.get('/club/:id_club', EquipoController.obtenerEquiposPorClub);                              // GET /api/equipo/club/:id_club
router.get('/categoria/:id_categoria', EquipoController.obtenerEquiposPorCategoria);               // GET /api/equipo/categoria/:id_categoria
router.get('/club/:id_club/categoria/:id_categoria', EquipoController.obtenerEquiposPorClubYCategoria); // GET /api/equipo/club/:id_club/categoria/:id_categoria
router.get('/relaciones/:id', EquipoController.obtenerEquipoConRelaciones);                        // GET /api/equipo/relaciones/:id
router.get('/:id/jugadores', EquipoController.obtenerJugadoresDeEquipo);                           // GET /api/equipo/:id/jugadores
router.get('/:id/plantilla', EquipoController.obtenerPlantillaHabilitada);                         // GET /api/equipo/:id/plantilla
router.get('/:id', EquipoController.obtenerEquipoPorId);                                           // GET /api/equipo/:id
router.put('/:id', EquipoController.actualizarEquipo);                                             // PUT /api/equipo/:id
router.delete('/:id', EquipoController.eliminarEquipo);                                            // DELETE /api/equipo/:id

module.exports = router;