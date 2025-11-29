// routes/clubUsuarioRoutes.js
const express = require('express');
const router = express.Router();
const {
  crear,
  actualizar,
  desactivar
} = require('../controllers/clubUsuarioController');

router.post('/', crear);
router.put('/:id', actualizar);
router.delete('/:id', desactivar);

module.exports = router;