const express= require('express');
const router=express.Router();
const NacionalidaController= require('../controllers/nacionalidadController');
const auth= require('../middleware/authMiddleware');
const authorize=require('../middleware/roleMiddleware');

//router.get('/', auth, authorize(),NacionalidaController.getAll);
router.get('/', NacionalidaController.getAll);
router.post('/',NacionalidaController.registrar);
router.get('/getbyId', NacionalidaController.getbyId);
router.get('/getbyId/:id', NacionalidaController.getbyIdParam);
router.put('/:id_nacionalidad', NacionalidaController.updateNac);
router.delete('/:id_nacionalidad', NacionalidaController.deleteNacionalidad);
module.exports=router;