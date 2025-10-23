// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

console.log('routes/auth loaded');

router.post(
  '/login',
  authController.loginValidation,
  authController.handleValidationErrors,
  (req, res, next) => { console.log('entered route /login'); next(); },
  authController.login
);

router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);


module.exports = router;