/*const express = require('express');
const router = express.Router();
const jugadorController = require('../controllers/jugadorController');

router.post('/', jugadorController.crearJugadorCompleto);

router.post('/persona/:id_persona', jugadorController.crearJugadorParaPersona);

router.get('/personas-sin-jugador', jugadorController.obtenerPersonasSinJugador);

router.get('/todos', jugadorController.obtenerTodosLosJugadores);
router.get('/:id_jugador', jugadorController.obtenerJugadorPorId);
router.get('/club/:id_club', jugadorController.obtenerJugadoresPorClub);


router.get('/', jugadorController.obtenerJugadores);

router.get('/buscar/nombre', jugadorController.obtenerJugadoresPorNombre);

router.get('/buscar/estatura', jugadorController.obtenerJugadoresPorEstatura);


router.put('/:id_jugador', jugadorController.actualizarJugador);

router.delete('/:id_jugador', jugadorController.eliminarJugador);

module.exports = router;*/
// ===============================================
// ARCHIVO: routes/jugador.routes.js
// VERSIÓN ACTUALIZADA CON MULTER Y PARSING
// ===============================================

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const jugadorController = require('../controllers/jugadorController');

// ✅ CONFIGURAR MULTER PARA SUBIR FOTOS
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Asegúrate de que existe la carpeta uploads/fotos/
    cb(null, path.join(__dirname, '../uploads/fotos/'));
  },
  filename: (req, file, cb) => {
    // Generar nombre único para la foto
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'jugador-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Solo permitir imágenes
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen (jpg, png, gif, webp)'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  }
});

// ✅ MIDDLEWARE PARA PARSEAR FORMDATA CON JSON
// Este middleware parsea automáticamente datosPersona y datosJugador
const parseFormDataJSON = (req, res, next) => {
  try {
    // Si existen datosPersona y datosJugador como strings, parsearlos
    if (req.body.datosPersona && typeof req.body.datosPersona === 'string') {
      req.body.datosPersona = JSON.parse(req.body.datosPersona);
    }
    if (req.body.datosJugador && typeof req.body.datosJugador === 'string') {
      req.body.datosJugador = JSON.parse(req.body.datosJugador);
    }
    
    // Agregar información del archivo si existe
    if (req.file) {
      req.body.fotoPath = req.file.filename;
      req.body.fotoBuffer = req.file.buffer;
    }
    
    next();
  } catch (err) {
    console.error('❌ Error parseando FormData JSON:', err);
    return res.status(400).json({
      message: 'Error parseando datos. Verifica que datosPersona y datosJugador sean JSON válido',
      error: err.message
    });
  }
};

// ===============================================
// RUTAS
// ===============================================

// ✅ POST - CREAR JUGADOR COMPLETO (Persona nueva + Jugador)
router.post('/', upload.single('foto'), parseFormDataJSON, jugadorController.crearJugadorCompleto);

// ✅ POST - CREAR JUGADOR PARA PERSONA EXISTENTE
router.post('/persona/:id_persona', upload.single('foto'), parseFormDataJSON, jugadorController.crearJugadorParaPersona);

// GET - PERSONAS SIN JUGADOR
router.get('/personas-sin-jugador', jugadorController.obtenerPersonasSinJugador);

// GET - OBTENER TODOS
router.get('/todos', jugadorController.obtenerTodosLosJugadores);

// GET - OBTENER POR ID
router.get('/:id_jugador', jugadorController.obtenerJugadorPorId);

// GET - OBTENER POR CLUB
router.get('/club/:id_club', jugadorController.obtenerJugadoresPorClub);

// GET - OBTENER TODOS (GENERAL)
router.get('/', jugadorController.obtenerJugadores);

// GET - BUSCAR POR NOMBRE
router.get('/buscar/nombre', jugadorController.obtenerJugadoresPorNombre);

// GET - BUSCAR POR ESTATURA
router.get('/buscar/estatura', jugadorController.obtenerJugadoresPorEstatura);

// ✅ PUT - ACTUALIZAR JUGADOR
router.put('/:id_jugador', upload.single('foto'), parseFormDataJSON, jugadorController.actualizarJugador);

// DELETE - ELIMINAR JUGADOR
router.delete('/:id_jugador', jugadorController.eliminarJugador);

module.exports = router;