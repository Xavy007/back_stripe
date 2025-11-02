const CampeonatoService = require('../services/campeonatoService');

// CREATE - Crear un nuevo campeonato
const crearCampeonato = async (req, res) => {
    try {
        const campeonato = await CampeonatoService.crearCampeonato(req.body);
        res.status(201).json({
            success: true,
            message: 'Campeonato creado exitosamente',
            data: campeonato
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener todos los campeonatos activos
const obtenerCampeonatos = async (req, res) => {
    try {
        const campeonatos = await CampeonatoService.obtenerCampeonatos();
        res.status(200).json({
            success: true,
            message: 'Campeonatos obtenidos exitosamente',
            data: campeonatos,
            total: campeonatos.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener todos los campeonatos (incluyendo inactivos)
const obtenerTodosLosCampeonatos = async (req, res) => {
    try {
        const campeonatos = await CampeonatoService.obtenerTodosLosCampeonatos();
        res.status(200).json({
            success: true,
            message: 'Todos los campeonatos obtenidos exitosamente',
            data: campeonatos,
            total: campeonatos.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener un campeonato por ID (desde params)
const obtenerCampeonatoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const campeonato = await CampeonatoService.obtenerCampeonatoPorId(id);
        res.status(200).json({
            success: true,
            message: 'Campeonato obtenido exitosamente',
            data: campeonato
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener un campeonato por ID (desde body)
const getbyId = async (req, res) => {
    try {
        const { id } = req.body;
        const campeonato = await CampeonatoService.getbyId(id);
        res.status(200).json({
            success: true,
            message: 'Campeonato obtenido exitosamente',
            data: campeonato
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener campeonato con relaciones
const obtenerCampeonatoConRelaciones = async (req, res) => {
    try {
        const { id } = req.params;
        const campeonato = await CampeonatoService.obtenerCampeonatoConRelaciones(id);
        res.status(200).json({
            success: true,
            message: 'Campeonato con relaciones obtenido exitosamente',
            data: campeonato
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener campeonatos por tipo
const obtenerCampeonatosPorTipo = async (req, res) => {
    try {
        const { tipo } = req.params;
        const campeonatos = await CampeonatoService.obtenerCampeonatosPorTipo(tipo);
        res.status(200).json({
            success: true,
            message: `Campeonatos de tipo ${tipo} obtenidos exitosamente`,
            data: campeonatos,
            total: campeonatos.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener campeonatos por estado
const obtenerCampeonatosPorEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        const campeonatos = await CampeonatoService.obtenerCampeonatosPorEstado(estado);
        res.status(200).json({
            success: true,
            message: `Campeonatos en estado ${estado} obtenidos exitosamente`,
            data: campeonatos,
            total: campeonatos.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener campeonatos por gestión
const obtenerCampeonatosPorGestion = async (req, res) => {
    try {
        const { id_gestion } = req.params;
        const campeonatos = await CampeonatoService.obtenerCampeonatosPorGestion(id_gestion);
        res.status(200).json({
            success: true,
            message: `Campeonatos de la gestión ${id_gestion} obtenidos exitosamente`,
            data: campeonatos,
            total: campeonatos.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE - Actualizar un campeonato
const actualizarCampeonato = async (req, res) => {
    try {
        const { id } = req.params;
        const campeonato = await CampeonatoService.actualizarCampeonato(id, req.body);
        res.status(200).json({
            success: true,
            message: 'Campeonato actualizado exitosamente',
            data: campeonato
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE - Eliminar (desactivar) un campeonato
const eliminarCampeonato = async (req, res) => {
    try {
        const { id } = req.params;
        const campeonato = await CampeonatoService.eliminarCampeonato(id);
        res.status(200).json({
            success: true,
            message: 'Campeonato eliminado exitosamente',
            data: campeonato
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    crearCampeonato,
    obtenerCampeonatos,
    obtenerTodosLosCampeonatos,
    obtenerCampeonatoPorId,
    getbyId,
    obtenerCampeonatoConRelaciones,
    obtenerCampeonatosPorTipo,
    obtenerCampeonatosPorEstado,
    obtenerCampeonatosPorGestion,
    actualizarCampeonato,
    eliminarCampeonato
};