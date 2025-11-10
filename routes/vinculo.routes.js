
const express = require('express');
const router = express.Router();

const autenticar = require('../middleware/authMiddleware');
const autorizar = require('../middleware/roleMiddleware');
const vinculoController = require('../controllers/vinculoController');

router.get(
    '/personas-sin-usuario',
    autenticar,
    autorizar('admin'),
    vinculoController.obtenerPersonasSinUsuario
);

router.post(
    '/crear-usuario/:id_persona',
    autenticar,
    autorizar('admin'),
    vinculoController.crearUsuarioParaPersona
);

module.exports = router;