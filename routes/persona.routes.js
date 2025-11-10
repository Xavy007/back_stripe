const express = require('express');
const router = express.Router();
const autenticar = require('../middleware/authMiddleware');
const autorizar = require('../middleware/roleMiddleware');
const personaController = require('../controllers/personaController');

// CRUD Routes
router.post('/', personaController.crearPersona);                                              // POST /api/persona
router.post('/getbyId', personaController.getbyId);                                            // POST /api/persona/getbyId
//router.get('/', personaController.obtenerPersonas);                                            // GET /api/persona (solo activas)
router.get('/getConUsuarios', personaController.getConUsuarios);                                            // GET /api/persona (solo activas)
router.get('/todas', personaController.obtenerTodasLasPersonas);                               // GET /api/persona/todas (incluyendo inactivas)
router.get('/ci/:ci', personaController.obtenerPersonaPorCI);                                  // GET /api/persona/ci/:ci
router.get('/nacionalidad/:id_nacionalidad', personaController.obtenerPersonasPorNacionalidad); // GET /api/persona/nacionalidad/:id_nacionalidad
router.get('/genero/:genero', personaController.obtenerPersonasPorGenero);                      // GET /api/persona/genero/:genero
router.get('/edad/:edad_minima/:edad_maxima', personaController.obtenerPersonasPorEdad);       // GET /api/persona/edad/:edad_minima/:edad_maxima
router.get('/nombre/:nombre', personaController.obtenerPersonasPorNombre);                      // GET /api/persona/nombre/:nombre (búsqueda)
router.get('/:id', personaController.obtenerPersonaPorId);                                     // GET /api/persona/:id
router.put('/:id', personaController.actualizarPersona);                                       // PUT /api/persona/:id
router.delete('/:id', personaController.eliminarPersona);                                      // DELETE /api/persona/:id

module.exports = router;
/*const express= require('express');
const router= express.Router();
const PersonaController = require('../controllers/personaController');

router.get('/getUsuarios', PersonaController.getConUsuarios);
router.post('/registro', PersonaController.registrar )


module.exports=router;*/