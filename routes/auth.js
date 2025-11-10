
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const registroController = require('../controllers/registroController');

console.log('routes/auth loaded');



router.post('/login', authController.loginValidation, authController.handleValidationErrors, (req, res, next) => { console.log('entered route /login'); next(); },
    authController.login
);


router.post('/registro',  registroController.registrar);


router.post('/refresh', authController.refresh);

const autenticar = require('../middleware/authMiddleware');


router.post('/logout', autenticar, authController.logout);

module.exports = router;