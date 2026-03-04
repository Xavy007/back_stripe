const express = require('express');
const router = express.Router();
const ClubController = require('../controllers/clubController');
const { crearUploadConfig } = require('../config/uploadConfig');

// ============================================
// CONFIGURACIÓN DE UPLOAD PARA CLUBES
// ============================================
const { upload, attachFilePath, handleMulterError } = crearUploadConfig(
    'clubes',     // carpeta
    'logo',       // prefijo
    true          // usar acrónimo
);

// ============================================
// RUTAS CRUD
// ============================================

// GET - Listar clubes
router.get('/', ClubController.obtenerClubs);
router.get('/todos', ClubController.obtenerTodosLosClubs);

// GET - Obtener por ID
router.get('/:id', ClubController.obtenerClubPorId);
router.post('/getbyId', ClubController.getbyId);

// CREATE - Con subida de archivo
router.post('/', 
    upload.single('logo'),
    handleMulterError,
    attachFilePath,
    ClubController.crearClub
);

// UPDATE - Con subida de archivo opcional
router.put('/:id', 
    upload.single('logo'),
    handleMulterError,
    attachFilePath,
    ClubController.actualizarClub
);

// UPDATE - Solo cambiar estado (sin archivo)
router.put('/:id/estado', ClubController.cambiarEstadoClub);

// DELETE
router.delete('/:id', ClubController.eliminarClub);

module.exports = router;
