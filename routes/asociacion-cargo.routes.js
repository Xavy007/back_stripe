const express = require('express');
const router = express.Router();
const controller = require('../controllers/asociacionCargoController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const ROLES_ADMIN = ['admin', 'presidente'];

// GET /api/asociacion-cargo               → todos los cargos (autenticado)
router.get('/', authMiddleware, controller.listar);

// GET /api/asociacion-cargo/gestion/:id   → cargos de una gestión específica
router.get('/gestion/:id_gestion', authMiddleware, controller.listarPorGestion);

// GET /api/asociacion-cargo/:id           → un cargo por id
router.get('/:id', authMiddleware, controller.obtener);

// POST /api/asociacion-cargo              → registrar cargo (admin/presidente)
router.post('/', authMiddleware, roleMiddleware(...ROLES_ADMIN), controller.crear);

// PUT /api/asociacion-cargo/:id           → actualizar cargo
router.put('/:id', authMiddleware, roleMiddleware(...ROLES_ADMIN), controller.actualizar);

// DELETE /api/asociacion-cargo/:id        → eliminar cargo (solo admin)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), controller.eliminar);

module.exports = router;
