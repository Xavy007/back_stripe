const express= require('express');
const router=express.Router();
const NacionalidaController= require('../controllers/nacionalidadController');

router.post('/',NacionalidaController.registrar);
router.get('/getbyId', NacionalidaController.getbyId);
router.get('/getbyId/:id', NacionalidaController.getbyIdParam);

module.exports=router;