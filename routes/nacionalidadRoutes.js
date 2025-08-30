const express= require('express');
const router=express.Router();
const NacionalidaController= require('../controllers/nacionalidadController');

router.post('/',NacionalidaController.registrar);

module.exports=router;