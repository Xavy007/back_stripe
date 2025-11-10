const express = require('express');
const router = express.Router();
const autenticar = require('../middleware/authMiddleware');
const autorizar = require('../middleware/roleMiddleware');
const CampeonatoController = require('../controllers/campeoantoController');

// CRUD Routes
router.post('/', CampeonatoController.crearCampeonato);                                    // POST /api/campeonato
router.get('/', CampeonatoController.obtenerCampeonatos);                                  // GET /api/campeonato (solo activos)
router.get('/todos', CampeonatoController.obtenerTodosLosCampeonatos);                     // GET /api/campeonato/todos (incluyendo inactivos)
router.post('/getbyId', CampeonatoController.getbyId);                                     // POST /api/campeonato/getbyId (por body)
router.get('/relaciones/:id', CampeonatoController.obtenerCampeonatoConRelaciones);        // GET /api/campeonato/relaciones/:id
router.get('/tipo/:tipo', CampeonatoController.obtenerCampeonatosPorTipo);                 // GET /api/campeonato/tipo/:tipo
router.get('/estado/:estado', CampeonatoController.obtenerCampeonatosPorEstado);           // GET /api/campeonato/estado/:estado
router.get('/gestion/:id_gestion', CampeonatoController.obtenerCampeonatosPorGestion);     // GET /api/campeonato/gestion/:id_gestion
router.get('/:id', CampeonatoController.obtenerCampeonatoPorId);                           // GET /api/campeonato/:id
router.put('/:id', CampeonatoController.actualizarCampeonato);                             // PUT /api/campeonato/:id
router.delete('/:id', CampeonatoController.eliminarCampeonato);                            // DELETE /api/campeonato/:id

module.exports = router;