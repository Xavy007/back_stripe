// routes/departamentoRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/departamentoController');

router.get('/', controller.getDepartamentos);
router.get('/:id', controller.getDepartamento);
router.post('/', controller.postDepartamento);
router.put('/:id', controller.putDepartamento);
router.delete('/:id', controller.deleteDepartamento);

module.exports = router;
