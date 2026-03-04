const EquipoService = require('../services/equipoService');

// CREATE - Crear un nuevo equipo
const crearEquipo = async (req, res) => {
    try {
        const equipo = await EquipoService.crearEquipo(req.body);
        res.status(201).json({
            success: true,
            message: 'Equipo creado exitosamente',
            data: equipo
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener todos los equipos activos
const obtenerEquipos = async (req, res) => {
    try {
        const equipos = await EquipoService.obtenerEquipos();
        res.status(200).json({
            success: true,
            message: 'Equipos obtenidos exitosamente',
            data: equipos,
            total: equipos.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener todos los equipos (incluyendo inactivos)
const obtenerTodosLosEquipos = async (req, res) => {
    try {
        const equipos = await EquipoService.obtenerTodosLosEquipos();
        res.status(200).json({
            success: true,
            message: 'Todos los equipos obtenidos exitosamente',
            data: equipos,
            total: equipos.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener un equipo por ID (desde params)
const obtenerEquipoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const equipo = await EquipoService.obtenerEquipoPorId(id);
        res.status(200).json({
            success: true,
            message: 'Equipo obtenido exitosamente',
            data: equipo
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener un equipo por ID (desde body)
const getbyId = async (req, res) => {
    try {
        const { id } = req.body;
        const equipo = await EquipoService.getbyId(id);
        res.status(200).json({
            success: true,
            message: 'Equipo obtenido exitosamente',
            data: equipo
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener equipos por club
const obtenerEquiposPorClub = async (req, res) => {
    try {
        const { id_club } = req.params;
        const equipos = await EquipoService.obtenerEquiposPorClub(id_club);
        res.status(200).json({
            success: true,
            message: `Equipos del club ${id_club} obtenidos exitosamente`,
            data: equipos,
            total: equipos.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener equipos por categoría
const obtenerEquiposPorCategoria = async (req, res) => {
    try {
        const { id_categoria } = req.params;
        const equipos = await EquipoService.obtenerEquiposPorCategoria(id_categoria);
        res.status(200).json({
            success: true,
            message: `Equipos de la categoría ${id_categoria} obtenidos exitosamente`,
            data: equipos,
            total: equipos.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener equipos por club y categoría
const obtenerEquiposPorClubYCategoria = async (req, res) => {
    try {
        const { id_club, id_categoria } = req.params;
        const equipos = await EquipoService.obtenerEquiposPorClubYCategoria(id_club, id_categoria);
        res.status(200).json({
            success: true,
            message: `Equipos del club ${id_club} en categoría ${id_categoria} obtenidos exitosamente`,
            data: equipos,
            total: equipos.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener equipo con relaciones
const obtenerEquipoConRelaciones = async (req, res) => {
    try {
        const { id } = req.params;
        const equipo = await EquipoService.obtenerEquipoConRelaciones(id);
        res.status(200).json({
            success: true,
            message: 'Equipo con relaciones obtenido exitosamente',
            data: equipo
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE - Actualizar un equipo
const actualizarEquipo = async (req, res) => {
    try {
        const { id } = req.params;
        const equipo = await EquipoService.actualizarEquipo(id, req.body);
        res.status(200).json({
            success: true,
            message: 'Equipo actualizado exitosamente',
            data: equipo
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE - Eliminar (desactivar) un equipo
const eliminarEquipo = async (req, res) => {
    try {
        const { id } = req.params;
        const equipo = await EquipoService.eliminarEquipo(id);
        res.status(200).json({
            success: true,
            message: 'Equipo eliminado exitosamente',
            data: equipo
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Obtener jugadores de un equipo específico (con filtro opcional por gestión)
const obtenerJugadoresDeEquipo = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_gestion } = req.query; // Parámetro opcional para filtrar por gestión
        const jugadores = await EquipoService.obtenerJugadoresDeEquipo(id, id_gestion ? parseInt(id_gestion) : null);
        res.status(200).json({
            success: true,
            message: 'Jugadores del equipo obtenidos exitosamente',
            data: jugadores,
            total: jugadores.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
            data: []
        });
    }
};

// Obtener plantilla habilitada (participaciones) de un equipo
const obtenerPlantillaHabilitada = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_campeonato } = req.query; // Parámetro opcional para filtrar por campeonato
        const plantilla = await EquipoService.obtenerPlantillaHabilitada(id, id_campeonato ? parseInt(id_campeonato) : null);
        res.status(200).json({
            success: true,
            message: 'Plantilla habilitada obtenida exitosamente',
            data: plantilla,
            total: plantilla.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
            data: []
        });
    }
};

module.exports = {
    crearEquipo,
    obtenerEquipos,
    obtenerTodosLosEquipos,
    obtenerEquipoPorId,
    getbyId,
    obtenerEquiposPorClub,
    obtenerEquiposPorCategoria,
    obtenerEquiposPorClubYCategoria,
    obtenerEquipoConRelaciones,
    actualizarEquipo,
    eliminarEquipo,
    obtenerJugadoresDeEquipo,
    obtenerPlantillaHabilitada
};