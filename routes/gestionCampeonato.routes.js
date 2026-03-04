const express = require('express');
const router = express.Router();
const autenticar = require('../middleware/authMiddleware');
const autorizar = require('../middleware/roleMiddleware');
const GestionCampeonatoController = require('../controllers/gestionCampeonatoController');

// CRUD Routes
router.post('/', GestionCampeonatoController.crearGestion);                                      // POST /api/gestion-campeonato
router.get('/', GestionCampeonatoController.obtenerGestiones);                                  // GET /api/gestion-campeonato (solo activas)
router.get('/todas', GestionCampeonatoController.obtenerTodasLasGestiones);                     // GET /api/gestion-campeonato/todas (incluyendo inactivas)
router.post('/getbyId', GestionCampeonatoController.getbyId);                                   // POST /api/gestion-campeonato/getbyId (por body)
router.get('/ano/:ano', GestionCampeonatoController.obtenerGestionPorAno);                      // GET /api/gestion-campeonato/ano/:ano
router.get('/campeonatos/:id', GestionCampeonatoController.obtenerGestionConCampeonatos);       // GET /api/gestion-campeonato/campeonatos/:id
router.get('/:id', GestionCampeonatoController.obtenerGestionPorId);                            // GET /api/gestion-campeonato/:id
router.put('/:id', GestionCampeonatoController.actualizarGestion);                              // PUT /api/gestion-campeonato/:id
router.delete('/:id', GestionCampeonatoController.eliminarGestion);                             // DELETE /api/gestion-campeonato/:id

module.exports = router;