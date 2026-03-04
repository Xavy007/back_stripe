const GestionCampeonatoService = require('../services/gestionCampeonatoService');

// CREATE - Crear una nueva gestión
const crearGestion = async (req, res) => {
    try {
        const gestion = await GestionCampeonatoService.crearGestion(req.body);
        res.status(201).json({
            success: true,
            message: 'Gestión creada exitosamente',
            data: gestion
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener todas las gestiones activas
const obtenerGestiones = async (req, res) => {
    try {
        const gestiones = await GestionCampeonatoService.obtenerGestiones();
        res.status(200).json({
            success: true,
            message: 'Gestiones obtenidas exitosamente',
            data: gestiones,
            total: gestiones.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener todas las gestiones (incluyendo inactivas)
const obtenerTodasLasGestiones = async (req, res) => {
    try {
        const gestiones = await GestionCampeonatoService.obtenerTodasLasGestiones();
        res.status(200).json({
            success: true,
            message: 'Todas las gestiones obtenidas exitosamente',
            data: gestiones,
            total: gestiones.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener una gestión por ID (desde params)
const obtenerGestionPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const gestion = await GestionCampeonatoService.obtenerGestionPorId(id);
        res.status(200).json({
            success: true,
            message: 'Gestión obtenida exitosamente',
            data: gestion
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener una gestión por ID (desde body)
const getbyId = async (req, res) => {
    try {
        const { id } = req.body;
        const gestion = await GestionCampeonatoService.getbyId(id);
        res.status(200).json({
            success: true,
            message: 'Gestión obtenida exitosamente',
            data: gestion
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener gestión por año
const obtenerGestionPorAno = async (req, res) => {
    try {
        const { ano } = req.params;
        const gestion = await GestionCampeonatoService.obtenerGestionPorAno(parseInt(ano));
        res.status(200).json({
            success: true,
            message: `Gestión del año ${ano} obtenida exitosamente`,
            data: gestion
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener gestión con campeonatos
const obtenerGestionConCampeonatos = async (req, res) => {
    try {
        const { id } = req.params;
        const gestion = await GestionCampeonatoService.obtenerGestionConCampeonatos(id);
        res.status(200).json({
            success: true,
            message: 'Gestión con campeonatos obtenida exitosamente',
            data: gestion
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE - Actualizar una gestión
const actualizarGestion = async (req, res) => {
    try {
        const { id } = req.params;
        const gestion = await GestionCampeonatoService.actualizarGestion(id, req.body);
        res.status(200).json({
            success: true,
            message: 'Gestión actualizada exitosamente',
            data: gestion
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE - Eliminar (desactivar) una gestión
const eliminarGestion = async (req, res) => {
    try {
        const { id } = req.params;
        const gestion = await GestionCampeonatoService.eliminarGestion(id);
        res.status(200).json({
            success: true,
            message: 'Gestión eliminada exitosamente',
            data: gestion
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    crearGestion,
    obtenerGestiones,
    obtenerTodasLasGestiones,
    obtenerGestionPorId,
    getbyId,
    obtenerGestionPorAno,
    obtenerGestionConCampeonatos,
    actualizarGestion,
    eliminarGestion
};