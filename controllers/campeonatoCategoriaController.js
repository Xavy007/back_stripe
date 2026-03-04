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

// UPDATE - Actualizar configuración de formato
const actualizarConfiguracion = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            formato,
            numero_grupos,
            cantidad_equipos_max,
            observaciones,
            ida_vuelta,
            dias_entre_jornadas,
            hora_inicio_partidos,
            dias_juego
        } = req.body;

        const dataActualizar = {};
        if (formato !== undefined) dataActualizar.formato = formato;
        if (numero_grupos !== undefined) dataActualizar.numero_grupos = numero_grupos;
        if (cantidad_equipos_max !== undefined) dataActualizar.cantidad_equipos_max = cantidad_equipos_max;
        if (observaciones !== undefined) dataActualizar.observaciones = observaciones;
        if (ida_vuelta !== undefined) dataActualizar.ida_vuelta = ida_vuelta;
        if (dias_entre_jornadas !== undefined) dataActualizar.dias_entre_jornadas = dias_entre_jornadas;
        if (hora_inicio_partidos !== undefined) dataActualizar.hora_inicio_partidos = hora_inicio_partidos;
        if (dias_juego !== undefined) dataActualizar.dias_juego = dias_juego;

        const cc = await CampeonatoCategoriaService.actualizarCampeonatoCategoria(id, dataActualizar);
        res.status(200).json({
            success: true,
            message: 'Configuración actualizada exitosamente',
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
    actualizarConfiguracion,
    eliminarCampeonatoCategoria
};