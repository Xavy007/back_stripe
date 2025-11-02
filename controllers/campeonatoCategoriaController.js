const CampeonatoCategoriaService = require('../services/campeonatoCategoriaService');

// CREATE - Crear una nueva campeonato-categoría
const crearCampeonatoCategoria = async (req, res) => {
    try {
        const cc = await CampeonatoCategoriaService.crearCampeonatoCategoria(req.body);
        res.status(201).json({
            success: true,
            message: 'Campeonato-categoría creada exitosamente',
            data: cc
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener todas las campeonato-categorías activas
const obtenerCampeonatoCategorias = async (req, res) => {
    try {
        const ccs = await CampeonatoCategoriaService.obtenerCampeonatoCategorias();
        res.status(200).json({
            success: true,
            message: 'Campeonato-categorías obtenidas exitosamente',
            data: ccs,
            total: ccs.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener todas las campeonato-categorías (incluyendo inactivas)
const obtenerTodasLasCampeonatoCategorias = async (req, res) => {
    try {
        const ccs = await CampeonatoCategoriaService.obtenerTodasLasCampeonatoCategorias();
        res.status(200).json({
            success: true,
            message: 'Todas las campeonato-categorías obtenidas exitosamente',
            data: ccs,
            total: ccs.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener una campeonato-categoría por ID (desde params)
const obtenerCampeonatoCategoriaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const cc = await CampeonatoCategoriaService.obtenerCampeonatoCategoriaPorId(id);
        res.status(200).json({
            success: true,
            message: 'Campeonato-categoría obtenida exitosamente',
            data: cc
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener una campeonato-categoría por ID (desde body)
const getbyId = async (req, res) => {
    try {
        const { id } = req.body;
        const cc = await CampeonatoCategoriaService.getbyId(id);
        res.status(200).json({
            success: true,
            message: 'Campeonato-categoría obtenida exitosamente',
            data: cc
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener campeonato-categorías por campeonato
const obtenerCampeonatoCategoriasPorCampeonato = async (req, res) => {
    try {
        const { id_campeonato } = req.params;
        const ccs = await CampeonatoCategoriaService.obtenerCampeonatoCategoriasPorCampeonato(id_campeonato);
        res.status(200).json({
            success: true,
            message: `Campeonato-categorías del campeonato ${id_campeonato} obtenidas exitosamente`,
            data: ccs,
            total: ccs.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener campeonato-categorías por categoría
const obtenerCampeonatoCategoriasPorCategoria = async (req, res) => {
    try {
        const { id_categoria } = req.params;
        const ccs = await CampeonatoCategoriaService.obtenerCampeonatoCategoriasPorCategoria(id_categoria);
        res.status(200).json({
            success: true,
            message: `Campeonato-categorías de la categoría ${id_categoria} obtenidas exitosamente`,
            data: ccs,
            total: ccs.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener campeonato-categorías por formato
const obtenerCampeonatoCategoriasPorFormato = async (req, res) => {
    try {
        const { formato } = req.params;
        const ccs = await CampeonatoCategoriaService.obtenerCampeonatoCategoriasPorFormato(formato);
        res.status(200).json({
            success: true,
            message: `Campeonato-categorías con formato ${formato} obtenidas exitosamente`,
            data: ccs,
            total: ccs.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE - Actualizar una campeonato-categoría
const actualizarCampeonatoCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const cc = await CampeonatoCategoriaService.actualizarCampeonatoCategoria(id, req.body);
        res.status(200).json({
            success: true,
            message: 'Campeonato-categoría actualizada exitosamente',
            data: cc
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE - Eliminar (desactivar) una campeonato-categoría
const eliminarCampeonatoCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const cc = await CampeonatoCategoriaService.eliminarCampeonatoCategoria(id);
        res.status(200).json({
            success: true,
            message: 'Campeonato-categoría eliminada exitosamente',
            data: cc
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    crearCampeonatoCategoria,
    obtenerCampeonatoCategorias,
    obtenerTodasLasCampeonatoCategorias,
    obtenerCampeonatoCategoriaPorId,
    getbyId,
    obtenerCampeonatoCategoriasPorCampeonato,
    obtenerCampeonatoCategoriasPorCategoria,
    obtenerCampeonatoCategoriasPorFormato,
    actualizarCampeonatoCategoria,
    eliminarCampeonatoCategoria
};