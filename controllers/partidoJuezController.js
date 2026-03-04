const PartidoJuezService = require('../services/partidoJuezService');

// ============================================
// CREATE - Crear una nueva asignación de jueces
// ============================================
const crearPartidoJuez = async (req, res) => {
    try {
        const data = req.body;

        console.log('📨 Datos recibidos para crear asignación de jueces:', data);

        const partidoJuez = await PartidoJuezService.crearPartidoJuez(data);

        res.status(201).json({
            success: true,
            message: 'Asignación de jueces creada exitosamente',
            data: partidoJuez
        });
    } catch (error) {
        console.error('❌ Error en crearPartidoJuez:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener todas las asignaciones activas
// ============================================
const obtenerPartidoJueces = async (req, res) => {
    try {
        const partidoJueces = await PartidoJuezService.obtenerPartidoJueces();

        res.status(200).json({
            success: true,
            message: 'Asignaciones de jueces obtenidas exitosamente',
            data: partidoJueces,
            total: partidoJueces.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerPartidoJueces:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener TODAS las asignaciones (incluyendo inactivas)
// ============================================
const obtenerTodosLosPartidoJueces = async (req, res) => {
    try {
        const partidoJueces = await PartidoJuezService.obtenerTodosLosPartidoJueces();

        res.status(200).json({
            success: true,
            message: 'Todas las asignaciones de jueces obtenidas exitosamente',
            data: partidoJueces,
            total: partidoJueces.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerTodosLosPartidoJueces:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener una asignación por ID
// ============================================
const obtenerPartidoJuezPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const partidoJuez = await PartidoJuezService.obtenerPartidoJuezPorId(id);

        res.status(200).json({
            success: true,
            message: 'Asignación de jueces obtenida exitosamente',
            data: partidoJuez
        });
    } catch (error) {
        console.error('❌ Error en obtenerPartidoJuezPorId:', error);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener asignación por Partido
// ============================================
const obtenerPartidoJuezPorPartido = async (req, res) => {
    try {
        const { id_partido } = req.params;
        const partidoJuez = await PartidoJuezService.obtenerPartidoJuezPorPartido(id_partido);

        res.status(200).json({
            success: true,
            message: 'Asignación de jueces obtenida exitosamente',
            data: partidoJuez
        });
    } catch (error) {
        console.error('❌ Error en obtenerPartidoJuezPorPartido:', error);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener partidos de un juez
// ============================================
const obtenerPartidosPorJuez = async (req, res) => {
    try {
        const { id_juez } = req.params;
        const partidos = await PartidoJuezService.obtenerPartidosPorJuez(id_juez);

        res.status(200).json({
            success: true,
            message: `${partidos.length} partidos encontrados`,
            data: partidos,
            total: partidos.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerPartidosPorJuez:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// UPDATE - Actualizar una asignación
// ============================================
const actualizarPartidoJuez = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        console.log(`📨 Actualizando asignación de jueces ${id} con:`, data);

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Se deben proporcionar datos para actualizar'
            });
        }

        const partidoJuez = await PartidoJuezService.actualizarPartidoJuez(id, data);

        res.status(200).json({
            success: true,
            message: 'Asignación de jueces actualizada exitosamente',
            data: partidoJuez
        });
    } catch (error) {
        console.error('❌ Error en actualizarPartidoJuez:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// UPDATE - Confirmar asignación de jueces
// ============================================
const confirmarPartidoJuez = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`✅ Confirmando asignación de jueces ${id}`);

        const partidoJuez = await PartidoJuezService.confirmarPartidoJuez(id);

        res.status(200).json({
            success: true,
            message: 'Asignación de jueces confirmada exitosamente',
            data: partidoJuez
        });
    } catch (error) {
        console.error('❌ Error en confirmarPartidoJuez:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// DELETE - Eliminar (soft delete) una asignación
// ============================================
const eliminarPartidoJuez = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`🗑️ Eliminando asignación de jueces con ID: ${id}`);

        const partidoJuez = await PartidoJuezService.eliminarPartidoJuez(id);

        res.status(200).json({
            success: true,
            message: 'Asignación de jueces eliminada exitosamente',
            data: partidoJuez
        });
    } catch (error) {
        console.error('❌ Error en eliminarPartidoJuez:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    crearPartidoJuez,
    obtenerPartidoJueces,
    obtenerTodosLosPartidoJueces,
    obtenerPartidoJuezPorId,
    obtenerPartidoJuezPorPartido,
    obtenerPartidosPorJuez,
    actualizarPartidoJuez,
    confirmarPartidoJuez,
    eliminarPartidoJuez
};
