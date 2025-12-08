// routes/juez.routes.js
const express = require('express');
const router = express.Router();
const juezController = require('../controllers/juezController');

// GET /api/jueces        → listar todos los jueces (estado = true)
router.get('/', juezController.getJueces);

// GET /api/jueces/:id    → obtener juez por id (incluye Persona)
router.get('/:id', juezController.getJuezById);

// POST /api/jueces       → crear Persona + Juez
// body: { persona: {...}, juez: {...} }
router.post('/', juezController.createJuez);

// PUT /api/jueces/:id    → actualizar Persona y/o Juez
// body: { persona?: {...}, juez?: {...} }
router.put('/:id', juezController.updateJuez);

// DELETE /api/jueces/:id → soft delete (estado = false en Juez)
router.delete('/:id', juezController.deleteJuez);

module.exports = router;
