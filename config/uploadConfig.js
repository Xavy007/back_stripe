const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Configuración de upload para archivos con nombre personalizado
 * @param {string} carpeta - Nombre de la subcarpeta (ej: 'clubes', 'jugadores', 'equipos')
 * @param {string} prefijo - Prefijo del archivo (ej: 'logo', 'foto', 'documento')
 * @param {boolean} usarAcronimo - Si debe usar acrónimo o nombre completo
 */
const crearUploadConfig = (carpeta = 'general', prefijo = 'archivo', usarAcronimo = true) => {
    
    // Directorio de uploads
    const uploadDir = path.resolve(__dirname, `../../uploads/${carpeta}`);
    
    console.log(`📁 [${carpeta}] Directorio de uploads:`, uploadDir);
    console.log(`📁 [${carpeta}] ¿Existe el directorio?`, fs.existsSync(uploadDir));
    
    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
        try {
            fs.mkdirSync(uploadDir, { recursive: true });
            console.log(`✅ [${carpeta}] Directorio creado exitosamente`);
        } catch (error) {
            console.error(`❌ [${carpeta}] Error al crear directorio:`, error);
        }
    }
    
    // Verificar permisos de escritura
    try {
        fs.accessSync(uploadDir, fs.constants.W_OK);
        console.log(`✅ [${carpeta}] El directorio tiene permisos de escritura`);
    } catch (error) {
        console.error(`❌ [${carpeta}] Sin permisos de escritura en:`, uploadDir);
    }
    
    // Configuración de multer
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            console.log(`📂 [${carpeta}] Guardando en:`, uploadDir);
            console.log(`📂 [${carpeta}] Archivo recibido:`, file.originalname);
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            let identificador;
            
            if (usarAcronimo) {
                // Usar acrónimo (o nombre si no hay)
                identificador = (req.body.acronimo || req.body.nombre || 'DEFAULT')
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, '')
                    .substring(0, 10);
            } else {
                // Usar nombre completo limpio
                identificador = (req.body.nombre || 'archivo')
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '')
                    .substring(0, 30);
            }
            
            // Fecha: YYYYMMDD
            const ahora = new Date();
            const fecha = `${ahora.getFullYear()}${String(ahora.getMonth() + 1).padStart(2, '0')}${String(ahora.getDate()).padStart(2, '0')}`;
            
            // Número random de 3 dígitos
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            
            // Extensión
            const ext = path.extname(file.originalname).toLowerCase();
            
            // Nombre final: logo-CSR-20241209-456.jpg
            const filename = `${prefijo}-${identificador}-${fecha}-${random}${ext}`;
            
            console.log(`📝 [${carpeta}] Identificador:`, identificador);
            console.log(`📝 [${carpeta}] Fecha:`, fecha);
            console.log(`📝 [${carpeta}] Archivo generado:`, filename);
            
            cb(null, filename);
        }
    });
    
    // Configurar multer
    const upload = multer({ 
        storage: storage,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        fileFilter: (req, file, cb) => {
            console.log(`🔍 [${carpeta}] Validando archivo:`, file.originalname);
            console.log(`🔍 [${carpeta}] MIME type:`, file.mimetype);
            
            if (file.mimetype.startsWith('image/')) {
                console.log(`✅ [${carpeta}] Archivo válido`);
                cb(null, true);
            } else {
                console.log(`❌ [${carpeta}] Archivo rechazado (no es imagen)`);
                cb(new Error('Solo se permiten imágenes'));
            }
        }
    });
    
    // Middleware para agregar ruta al body
    const attachFilePath = (req, res, next) => {
        console.log(`📎 [${carpeta}] attachFilePath - req.file:`, req.file);
        
        if (req.file) {
            req.body.fotoPath = `/uploads/${carpeta}/${req.file.filename}`;
            console.log(`📷 [${carpeta}] Path agregado:`, req.body.fotoPath);
            console.log(`📷 [${carpeta}] Ubicación física:`, req.file.path);
        } else {
            console.log(`⚠️ [${carpeta}] No hay archivo en req.file`);
        }
        next();
    };
    
    // Middleware de error para multer
    const handleMulterError = (err, req, res, next) => {
        if (err instanceof multer.MulterError) {
            console.error(`❌ [${carpeta}] Error de Multer:`, err.message);
            return res.status(400).json({
                success: false,
                message: `Error al subir archivo: ${err.message}`
            });
        } else if (err) {
            console.error(`❌ [${carpeta}] Error general:`, err.message);
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        next();
    };
    
    return {
        upload,
        attachFilePath,
        handleMulterError,
        uploadDir
    };
};

module.exports = { crearUploadConfig };
