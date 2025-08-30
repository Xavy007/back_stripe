const express= require('express');
const router= express.Router();
const PersonaController = require('../controllers/personaController');

router.get('/getUsuarios', PersonaController.getConUsuarios);
router.post('/registro', PersonaController.registrar )


module.exports=router;