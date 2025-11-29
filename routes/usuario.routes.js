const express = require('express');
const router = express.Router();

const autenticar = require('../middleware/authMiddleware');
const autorizar = require('../middleware/roleMiddleware');

const usuarioController = require('../controllers/usuarioController');

router.post('/login', usuarioController.login);

router.post(
    '/',
    autenticar,
    autorizar('admin'),
    usuarioController.crearUsuario
);
router.post(
    '/persona_existente',
    autenticar,
    autorizar('admin'),
    usuarioController.crearUsuarioParaPersonaExistente
);

// OBTENER TODOS - Solo admin
router.get(
    '/',
    autenticar,
    autorizar('admin'),
    usuarioController.obtenerUsuarios
);

// OBTENER POR ID - Cualquier usuario autenticado
router.get(
    '/:id',
    autenticar,
    usuarioController.obtenerUsuarioPorId
);

// OBTENER POR EMAIL - Solo admin
router.get(
    '/email/:email',
    autenticar,
    autorizar('admin'),
    usuarioController.obtenerUsuarioPorEmail
);

// OBTENER POR ROL - Solo admin
router.get(
    '/rol/:rol',
    autenticar,
    autorizar('admin'),
    usuarioController.obtenerUsuariosPorRol
);

// OBTENER VERIFICADOS - Solo admin
router.get(
    '/estado/verificados',
    autenticar,
    autorizar('admin'),
    usuarioController.obtenerUsuariosVerificados
);

// OBTENER BLOQUEADOS - Solo admin
router.get(
    '/estado/bloqueados',
    autenticar,
    autorizar('admin'),
    usuarioController.obtenerUsuariosBloqueados
);

// ACTUALIZAR USUARIO - El usuario o admin
router.put(
    '/:id',
    autenticar,
    usuarioController.actualizarUsuario
);

// CAMBIAR CONTRASEÑA - El usuario
router.put(
    '/:id/cambiar-contrasena',
    autenticar,
    usuarioController.cambiarContrasena
);

// CAMBIAR VERIFICACIÓN - Solo admin
router.put(
    '/:id/verificacion',
    autenticar,
    autorizar('admin'),
    usuarioController.cambiarVerificacion
);

// DESBLOQUEAR USUARIO - Solo admin
router.put(
    '/:id/desbloquear',
    autenticar,
    autorizar('admin'),
    usuarioController.desbloquearUsuario
);

// ELIMINAR USUARIO - Solo admin
router.delete(
    '/:id',
    autenticar,
    autorizar('admin'),
    usuarioController.eliminarUsuario
);
router.put('/:id/estado', usuarioController.cambiarEstado);

module.exports = router;