const express = require('express');
const router  = express.Router();
const controller = require('../controllers/asociacionController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { crearUploadConfig } = require('../config/uploadConfig');

const { upload, attachFilePath, handleMulterError } = crearUploadConfig('asociacion', 'logo', false);

// GET — público (carnets y reportes lo necesitan sin autenticación)
router.get('/', controller.obtener);

// GET /estado — público, verifica si la asociación ya fue configurada
router.get('/estado', controller.obtenerEstado);

// POST /setup — público, solo funciona si el sistema aún no fue configurado
router.post('/setup', controller.setupInicial);

// PUT — solo admin puede modificar los datos de la asociación
router.put('/',
  authMiddleware,
  roleMiddleware(['admin']),
  upload.single('logo'),
  handleMulterError,
  attachFilePath,
  controller.actualizar
);

module.exports = router;
