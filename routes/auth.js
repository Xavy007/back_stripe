
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const registroController = require('../controllers/registroController');

console.log('routes/auth loaded');


// LOGIN
router.post(
    '/login',
    authController.loginValidation,
    authController.handleValidationErrors,
    (req, res, next) => { console.log('entered route /login'); next(); },
    authController.login
);

// ✅ REGISTRO - NUEVO
// Registrar nuevo usuario con datos de persona
router.post(
    '/registro',
    registroController.registrar
);

// REFRESH TOKEN
router.post('/refresh', authController.refresh);

// ============================================
// RUTAS PROTEGIDAS
// ============================================

const autenticar = require('../middleware/authMiddleware');

// LOGOUT
router.post('/logout', autenticar, authController.logout);

module.exports = router;