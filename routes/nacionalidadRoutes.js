const express= require('express');
const router=express.Router();
const autenticar = require('../middleware/authMiddleware');
const autorizar = require('../middleware/roleMiddleware');
const NacionalidaController= require('../controllers/nacionalidadController');


//router.get('/', auth, authorize(),NacionalidaController.getAll);
router.get('/', NacionalidaController.getAll);
router.get('/getbyId', NacionalidaController.getbyId);
router.get('/getbyId/:id', NacionalidaController.getbyIdParam);
router.post('/',autenticar,autorizar('admin'),NacionalidaController.registrar);
router.put('/:id_nacionalidad', NacionalidaController.updateNac);
router.delete('/:id_nacionalidad', NacionalidaController.deleteNacionalidad);
module.exports=router;