const ClubService = require('../services/clubService');

// CREATE - Crear un nuevo club
const crearClub = async (req, res) => {
    try {
        const club = await ClubService.crearClub(req.body);
        res.status(201).json({
            success: true,
            message: 'Club creado exitosamente',
            data: club
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener todos los clubes activos
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

// READ - Obtener todos los clubes (incluyendo inactivos)
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

// READ - Obtener un club por ID (desde params)
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

// READ - Obtener un club por ID (desde body)
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

// UPDATE - Actualizar un club
const actualizarClub = async (req, res) => {
    try {
        const { id } = req.params;
        const club = await ClubService.actualizarClub(id, req.body);
        res.status(200).json({
            success: true,
            message: 'Club actualizado exitosamente',
            data: club
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE - Eliminar (desactivar) un club
const eliminarClub = async (req, res) => {
    try {
        const { id } = req.params;
        const club = await ClubService.eliminarClub(id);
        res.status(200).json({
            success: true,
            message: 'Club eliminado exitosamente',
            data: club
        });
    } catch (error) {
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
    eliminarClub
};