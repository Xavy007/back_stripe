const CanchaService = require('../services/canchaService');

// CREATE - Crear una nueva cancha
const crearCancha = async (req, res) => {
    try {
        const cancha = await CanchaService.crearCancha(req.body);
        res.status(201).json({
            success: true,
            message: 'Cancha creada exitosamente',
            data: cancha
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener todas las canchas activas
const obtenerCanchas = async (req, res) => {
    try {
        const canchas = await CanchaService.obtenerCanchas();
        res.status(200).json({
            success: true,
            message: 'Canchas obtenidas exitosamente',
            data: canchas,
            total: canchas.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener todas las canchas (incluyendo inactivas)
const obtenerTodasLasCanchas = async (req, res) => {
    try {
        const canchas = await CanchaService.obtenerTodasLasCanchas();
        res.status(200).json({
            success: true,
            message: 'Todas las canchas obtenidas exitosamente',
            data: canchas,
            total: canchas.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener una cancha por ID
const obtenerCanchaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const cancha = await CanchaService.obtenerCanchaPorId(id);
        res.status(200).json({
            success: true,
            message: 'Cancha obtenida exitosamente',
            data: cancha
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE - Actualizar una cancha
const actualizarCancha = async (req, res) => {
    try {
        const { id } = req.params;
        const cancha = await CanchaService.actualizarCancha(id, req.body);
        res.status(200).json({
            success: true,
            message: 'Cancha actualizada exitosamente',
            data: cancha
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE - Eliminar (desactivar) una cancha
const eliminarCancha = async (req, res) => {
    try {
        const { id } = req.params;
        const cancha = await CanchaService.eliminarCancha(id);
        res.status(200).json({
            success: true,
            message: 'Cancha eliminada exitosamente',
            data: cancha
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    crearCancha,
    obtenerCanchas,
    obtenerTodasLasCanchas,
    obtenerCanchaPorId,
    actualizarCancha,
    eliminarCancha
};