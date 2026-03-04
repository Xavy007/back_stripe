const HistorialCampeonatoService = require('../services/historialCampeonatoService');

// ============================================
// CREATE - Crear un nuevo registro histórico
// ============================================
const crearHistorialCampeonato = async (req, res) => {
    try {
        const data = req.body;

        console.log('📨 Datos recibidos para crear registro histórico:', data);

        const historial = await HistorialCampeonatoService.crearHistorialCampeonato(data);

        res.status(201).json({
            success: true,
            message: 'Registro histórico creado exitosamente',
            data: historial
        });
    } catch (error) {
        console.error('❌ Error en crearHistorialCampeonato:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener todos los registros históricos activos
// ============================================
const obtenerHistorialCampeonatos = async (req, res) => {
    try {
        const historial = await HistorialCampeonatoService.obtenerHistorialCampeonatos();

        res.status(200).json({
            success: true,
            message: 'Registros históricos obtenidos exitosamente',
            data: historial,
            total: historial.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerHistorialCampeonatos:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener TODOS los registros históricos (incluyendo inactivos)
// ============================================
const obtenerTodosLosHistorialCampeonatos = async (req, res) => {
    try {
        const historial = await HistorialCampeonatoService.obtenerTodosLosHistorialCampeonatos();

        res.status(200).json({
            success: true,
            message: 'Todos los registros históricos obtenidos exitosamente',
            data: historial,
            total: historial.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerTodosLosHistorialCampeonatos:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener un registro histórico por ID
// ============================================
const obtenerHistorialCampeonatoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const historial = await HistorialCampeonatoService.obtenerHistorialCampeonatoPorId(id);

        res.status(200).json({
            success: true,
            message: 'Registro histórico obtenido exitosamente',
            data: historial
        });
    } catch (error) {
        console.error('❌ Error en obtenerHistorialCampeonatoPorId:', error);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener historial por Campeonato
// ============================================
const obtenerHistorialPorCampeonato = async (req, res) => {
    try {
        const { id_campeonato } = req.params;
        const historial = await HistorialCampeonatoService.obtenerHistorialPorCampeonato(id_campeonato);

        res.status(200).json({
            success: true,
            message: `${historial.length} registros encontrados`,
            data: historial,
            total: historial.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerHistorialPorCampeonato:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener historial por CampeonatoCategoria
// ============================================
const obtenerHistorialPorCampeonatoCategoria = async (req, res) => {
    try {
        const { id_cc } = req.params;
        const historial = await HistorialCampeonatoService.obtenerHistorialPorCampeonatoCategoria(id_cc);

        res.status(200).json({
            success: true,
            message: `${historial.length} registros encontrados`,
            data: historial,
            total: historial.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerHistorialPorCampeonatoCategoria:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener historial por Equipo
// ============================================
const obtenerHistorialPorEquipo = async (req, res) => {
    try {
        const { id_equipo } = req.params;
        const historial = await HistorialCampeonatoService.obtenerHistorialPorEquipo(id_equipo);

        res.status(200).json({
            success: true,
            message: `${historial.length} registros encontrados`,
            data: historial,
            total: historial.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerHistorialPorEquipo:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener campeonatos ganados por un equipo
// ============================================
const obtenerCampeonatosGanados = async (req, res) => {
    try {
        const { id_equipo } = req.params;
        const campeonatosGanados = await HistorialCampeonatoService.obtenerCampeonatosGanados(id_equipo);

        res.status(200).json({
            success: true,
            message: `${campeonatosGanados.length} campeonatos ganados`,
            data: campeonatosGanados,
            total: campeonatosGanados.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerCampeonatosGanados:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener top N equipos de un campeonato
// ============================================
const obtenerTopEquipos = async (req, res) => {
    try {
        const { id_campeonato } = req.params;
        const { limite = 10 } = req.query;
        const topEquipos = await HistorialCampeonatoService.obtenerTopEquipos(id_campeonato, parseInt(limite));

        res.status(200).json({
            success: true,
            message: `Top ${topEquipos.length} equipos obtenidos`,
            data: topEquipos,
            total: topEquipos.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerTopEquipos:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// UPDATE - Actualizar un registro histórico
// ============================================
const actualizarHistorialCampeonato = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        console.log(`📨 Actualizando registro histórico ${id} con:`, data);

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Se deben proporcionar datos para actualizar'
            });
        }

        const historial = await HistorialCampeonatoService.actualizarHistorialCampeonato(id, data);

        res.status(200).json({
            success: true,
            message: 'Registro histórico actualizado exitosamente',
            data: historial
        });
    } catch (error) {
        console.error('❌ Error en actualizarHistorialCampeonato:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// DELETE - Eliminar (soft delete) un registro histórico
// ============================================
const eliminarHistorialCampeonato = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`🗑️ Eliminando registro histórico con ID: ${id}`);

        const historial = await HistorialCampeonatoService.eliminarHistorialCampeonato(id);

        res.status(200).json({
            success: true,
            message: 'Registro histórico eliminado exitosamente',
            data: historial
        });
    } catch (error) {
        console.error('❌ Error en eliminarHistorialCampeonato:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    crearHistorialCampeonato,
    obtenerHistorialCampeonatos,
    obtenerTodosLosHistorialCampeonatos,
    obtenerHistorialCampeonatoPorId,
    obtenerHistorialPorCampeonato,
    obtenerHistorialPorCampeonatoCategoria,
    obtenerHistorialPorEquipo,
    obtenerCampeonatosGanados,
    obtenerTopEquipos,
    actualizarHistorialCampeonato,
    eliminarHistorialCampeonato
};
