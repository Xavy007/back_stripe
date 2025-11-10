const express = require('express');
const router = express.Router();
const autenticar = require('../middleware/authMiddleware');
const autorizar = require('../middleware/roleMiddleware');
const CampeonatoCategoriaController = require('../controllers/campeonatoCategoriaController');

// CRUD Routes
router.post('/', CampeonatoCategoriaController.crearCampeonatoCategoria);                                    // POST /api/campeonato-categoria
router.get('/', CampeonatoCategoriaController.obtenerCampeonatoCategorias);                                  // GET /api/campeonato-categoria (solo activas)
router.get('/todas', CampeonatoCategoriaController.obtenerTodasLasCampeonatoCategorias);                     // GET /api/campeonato-categoria/todas (incluyendo inactivas)
router.post('/getbyId', CampeonatoCategoriaController.getbyId);                                              // POST /api/campeonato-categoria/getbyId (por body)
router.get('/campeonato/:id_campeonato', CampeonatoCategoriaController.obtenerCampeonatoCategoriasPorCampeonato); // GET /api/campeonato-categoria/campeonato/:id_campeonato
router.get('/categoria/:id_categoria', CampeonatoCategoriaController.obtenerCampeonatoCategoriasPorCategoria); // GET /api/campeonato-categoria/categoria/:id_categoria
router.get('/formato/:formato', CampeonatoCategoriaController.obtenerCampeonatoCategoriasPorFormato);         // GET /api/campeonato-categoria/formato/:formato
router.get('/:id', CampeonatoCategoriaController.obtenerCampeonatoCategoriaPorId);                           // GET /api/campeonato-categoria/:id
router.put('/:id', CampeonatoCategoriaController.actualizarCampeonatoCategoria);                             // PUT /api/campeonato-categoria/:id
router.delete('/:id', CampeonatoCategoriaController.eliminarCampeonatoCategoria);                            // DELETE /api/campeonato-categoria/:id

module.exports = router;