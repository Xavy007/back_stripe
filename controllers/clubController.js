const ClubService = require('../services/clubService');

/*
// ============================================
// CREATE - Crear un nuevo club con logo
// ============================================
const crearClub = async (req, res) => {
    try {
        const data = req.body;
        const fotoPath = req.body.fotoPath; // 📷 Ruta del logo guardado por multer

        // 📷 Agregar logo si existe
        if (fotoPath) {
            data.logo = fotoPath;
            console.log('📷 Logo agregado:', fotoPath);
        }

        console.log('📨 Datos recibidos para crear club:', data);

        const club = await ClubService.crearClub(data);
        
        res.status(201).json({
            success: true,
            message: 'Club creado exitosamente',
            data: club
        });
    } catch (error) {
        console.error('❌ Error en crearClub:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// UPDATE - Actualizar un club con logo opcional
// ============================================
const actualizarClub = async (req, res) => {
    console.log(req)
    console.log(req.params)
    try {
        const { id } = req.params;
        const data = req.body;
        const fotoPath = req.body.fotoPath; // 📷 Ruta del logo nuevo si existe

        console.log('📨 Body completo recibido:', req.body);
        console.log('📨 ID del club:', id);
        console.log('📨 Keys del body:', Object.keys(req.body));

        // Validar que req.body no esté vacío
        if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
            console.error('❌ Body vacío o inválido');
            return res.status(400).json({
                success: false,
                message: 'Se deben proporcionar datos para actualizar'
            });
        }

        // 📷 Agregar logo si existe
        if (fotoPath) {
            data.logo = fotoPath;
            console.log('📷 Logo actualizado:', fotoPath);
        }

        console.log('📨 Actualizando club con datos:', data);

        const club = await ClubService.actualizarClub(id, data);
        
        res.status(200).json({
            success: true,
            message: 'Club actualizado exitosamente',
            data: club
        });
    } catch (error) {
        console.error('❌ Error en actualizarClub:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};*/

const crearClub = async (req, res) => {
    try {
        console.log('═══════════════════════════════════════');
        console.log('📨 CREAR CLUB - Inicio');
        console.log('═══════════════════════════════════════');
        console.log('📨 Body completo:', req.body);
        console.log('📨 File completo:', req.file);
        console.log('📨 Headers:', req.headers);
        
        const fotoPath = req.body.fotoPath;

        const data = {
            nombre: req.body.nombre,
            acronimo: req.body.acronimo || '',
            direccion: req.body.direccion || '',
            telefono: req.body.telefono || '',
            email: req.body.email || '',
            redes_sociales: req.body.redes_sociales || '{}',
            personeria: req.body.personeria === 'true' || req.body.personeria === true,
            estado: req.body.estado === 'true' || req.body.estado === true,
        };

        if (fotoPath) {
            data.logo = fotoPath;
            console.log('✅ Logo agregado:', data.logo);
        } else {
            console.log('⚠️ No hay logo para agregar');
        }

        console.log('📨 Datos finales:', data);
        console.log('═══════════════════════════════════════');

        const club = await ClubService.crearClub(data);
        
        res.status(201).json({
            success: true,
            message: 'Club creado exitosamente',
            data: club
        });
    } catch (error) {
        console.error('❌ Error en crearClub:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const actualizarClub = async (req, res) => {
    try {
        console.log('═══════════════════════════════════════');
        console.log('📝 ACTUALIZAR CLUB - Inicio');
        console.log('═══════════════════════════════════════');
        
        const { id } = req.params;
        const fotoPath = req.body.fotoPath;
        
        console.log('📨 ID del club:', id);
        console.log('📨 Body completo:', req.body);
        console.log('📨 File completo:', req.file);

        const data = {};
        
        if (req.body.nombre) data.nombre = req.body.nombre;
        if (req.body.acronimo) data.acronimo = req.body.acronimo;
        if (req.body.direccion) data.direccion = req.body.direccion;
        if (req.body.telefono) data.telefono = req.body.telefono;
        if (req.body.email) data.email = req.body.email;
        if (req.body.redes_sociales) data.redes_sociales = req.body.redes_sociales;
        if (req.body.personeria !== undefined) {
            data.personeria = req.body.personeria === 'true' || req.body.personeria === true;
        }
        if (req.body.estado !== undefined) {
            data.estado = req.body.estado === 'true' || req.body.estado === true;
        }

        if (fotoPath) {
            data.logo = fotoPath;
            console.log('✅ Logo nuevo:', data.logo);
        } else if (req.body.logoExistente) {
            data.logo = req.body.logoExistente;
            console.log('✅ Logo existente mantenido:', data.logo);
        }

        console.log('📨 Datos procesados:', data);
        console.log('📨 Cantidad de campos:', Object.keys(data).length);
        console.log('═══════════════════════════════════════');

        if (!data || Object.keys(data).length === 0) {
            console.error('❌ No hay datos para actualizar');
            return res.status(400).json({
                success: false,
                message: 'Se deben proporcionar datos para actualizar'
            });
        }

        const club = await ClubService.actualizarClub(id, data);
        
        res.status(200).json({
            success: true,
            message: 'Club actualizado exitosamente',
            data: club
        });
    } catch (error) {
        console.error('❌ Error en actualizarClub:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

































































// ============================================
// READ - Obtener todos los clubes activos
// ============================================
const obtenerClubs = async (req, res) => {
    try {
        const clubs = await ClubService.obtenerClubs();
        res.status(200).json({
            success: true,
            message: 'Clubes obtenidos exitosamente',
            data: clubs,
            total: clubs.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener todos los clubes (incluyendo inactivos)
// ============================================
const obtenerTodosLosClubs = async (req, res) => {
    try {
        const clubs = await ClubService.obtenerTodosLosClubs();
        res.status(200).json({
            success: true,
            message: 'Todos los clubes obtenidos exitosamente',
            data: clubs,
            total: clubs.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener un club por ID (desde params)
// ============================================
const obtenerClubPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const club = await ClubService.obtenerClubPorId(id);
        res.status(200).json({
            success: true,
            message: 'Club obtenido exitosamente',
            data: club
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener un club por ID (desde body)
// ============================================
const getbyId = async (req, res) => {
    try {
        const { id } = req.body;
        const club = await ClubService.getbyId(id);
        res.status(200).json({
            success: true,
            message: 'Club obtenido exitosamente',
            data: club
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};


// ============================================
// UPDATE - Cambiar solo el estado de un club
// ============================================
const cambiarEstadoClub = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (estado === undefined) {
            return res.status(400).json({
                success: false,
                message: 'El campo estado es requerido'
            });
        }

        console.log(`🔄 Cambiando estado del club ${id} a: ${estado}`);

        const club = await ClubService.actualizarClub(id, { estado });
        
        res.status(200).json({
            success: true,
            message: `Club ${estado ? 'activado' : 'desactivado'} exitosamente`,
            data: club
        });
    } catch (error) {
        console.error('❌ Error en cambiarEstadoClub:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// DELETE - Eliminar (desactivar) un club
// ============================================
const eliminarClub = async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log(`🗑️ Eliminando club con ID: ${id}`);
        
        const club = await ClubService.eliminarClub(id);
        
        res.status(200).json({
            success: true,
            message: 'Club eliminado exitosamente',
            data: club
        });
    } catch (error) {
        console.error('❌ Error en eliminarClub:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    crearClub,
    obtenerClubs,
    obtenerTodosLosClubs,
    obtenerClubPorId,
    getbyId,
    actualizarClub,
    cambiarEstadoClub,
    eliminarClub
};
