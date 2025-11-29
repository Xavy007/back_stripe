// routes/provinciaRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/provinciaController');

router.get('/', controller.getProvincias);
router.get('/:id', controller.getProvincia);
router.post('/', controller.postProvincia);
router.put('/:id', controller.putProvincia);
router.delete('/:id', controller.deleteProvincia);

module.exports = router;
