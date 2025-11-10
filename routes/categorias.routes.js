const express = require('express');
const router = express.Router();
const autenticar = require('../middleware/authMiddleware');
const autorizar = require('../middleware/roleMiddleware');
const CategoriaController = require('../controllers/categoriaController');

// CRUD Routes
router.post('/', CategoriaController.crearCategoria);                              // POST /api/categoria
router.get('/', CategoriaController.obtenerCategorias);                            // GET /api/categoria (solo activas)
router.get('/todas', CategoriaController.obtenerTodasLasCategorias);               // GET /api/categoria/todas (incluyendo inactivas)
router.post('/getbyId', CategoriaController.getbyId);                              // POST /api/categoria/getbyId (por body)
router.get('/genero/:genero', CategoriaController.obtenerCategoriasPorGenero);     // GET /api/categoria/genero/:genero
router.get('/edad/:edad', CategoriaController.obtenerCategoriasPorEdad);           // GET /api/categoria/edad/:edad
router.get('/:id', CategoriaController.obtenerCategoriaPorId);                     // GET /api/categoria/:id
router.put('/:id', CategoriaController.actualizarCategoria);                       // PUT /api/categoria/:id
router.delete('/:id', CategoriaController.eliminarCategoria);                      // DELETE /api/categoria/:id

module.exports = router;