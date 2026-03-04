const GrupoInscripcionService = require('../services/grupoInscripcionService');

// ============================================
// CREATE - Crear una nueva asignación de grupo
// ============================================
const crearGrupoInscripcion = async (req, res) => {
    try {
        const data = req.body;

        console.log('📨 Datos recibidos para crear asignación de grupo:', data);

        const grupoInscripcion = await GrupoInscripcionService.crearGrupoInscripcion(data);

        res.status(201).json({
            success: true,
            message: 'Asignación de grupo creada exitosamente',
            data: grupoInscripcion
        });
    } catch (error) {
        console.error('❌ Error en crearGrupoInscripcion:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener todas las asignaciones activas
// ============================================
const obtenerGrupoInscripciones = async (req, res) => {
    try {
        const grupoInscripciones = await GrupoInscripcionService.obtenerGrupoInscripciones();

        res.status(200).json({
            success: true,
            message: 'Asignaciones de grupo obtenidas exitosamente',
            data: grupoInscripciones,
            total: grupoInscripciones.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerGrupoInscripciones:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener TODAS las asignaciones (incluyendo inactivas)
// ============================================
const obtenerTodasLasGrupoInscripciones = async (req, res) => {
    try {
        const grupoInscripciones = await GrupoInscripcionService.obtenerTodasLasGrupoInscripciones();

        res.status(200).json({
            success: true,
            message: 'Todas las asignaciones de grupo obtenidas exitosamente',
            data: grupoInscripciones,
            total: grupoInscripciones.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerTodasLasGrupoInscripciones:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener una asignación por ID
// ============================================
const obtenerGrupoInscripcionPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const grupoInscripcion = await GrupoInscripcionService.obtenerGrupoInscripcionPorId(id);

        res.status(200).json({
            success: true,
            message: 'Asignación de grupo obtenida exitosamente',
            data: grupoInscripcion
        });
    } catch (error) {
        console.error('❌ Error en obtenerGrupoInscripcionPorId:', error);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener asignaciones por Grupo
// ============================================
const obtenerGrupoInscripcionesPorGrupo = async (req, res) => {
    try {
        const { id_grupo } = req.params;
        const grupoInscripciones = await GrupoInscripcionService.obtenerGrupoInscripcionesPorGrupo(id_grupo);

        res.status(200).json({
            success: true,
            message: `${grupoInscripciones.length} asignaciones encontradas`,
            data: grupoInscripciones,
            total: grupoInscripciones.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerGrupoInscripcionesPorGrupo:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener asignaciones por Inscripcion
// ============================================
const obtenerGrupoInscripcionesPorInscripcion = async (req, res) => {
    try {
        const { id_inscripcion } = req.params;
        const grupoInscripciones = await GrupoInscripcionService.obtenerGrupoInscripcionesPorInscripcion(id_inscripcion);

        res.status(200).json({
            success: true,
            message: `${grupoInscripciones.length} asignaciones encontradas`,
            data: grupoInscripciones,
            total: grupoInscripciones.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerGrupoInscripcionesPorInscripcion:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener asignaciones por Bombo
// ============================================
const obtenerGrupoInscripcionesPorBombo = async (req, res) => {
    try {
        const { id_grupo, bombo } = req.params;
        const grupoInscripciones = await GrupoInscripcionService.obtenerGrupoInscripcionesPorBombo(id_grupo, bombo);

        res.status(200).json({
            success: true,
            message: `${grupoInscripciones.length} asignaciones en bombo ${bombo} encontradas`,
            data: grupoInscripciones,
            total: grupoInscripciones.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerGrupoInscripcionesPorBombo:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// UPDATE - Actualizar una asignación
// ============================================
const actualizarGrupoInscripcion = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        console.log(`📨 Actualizando asignación de grupo ${id} con:`, data);

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Se deben proporcionar datos para actualizar'
            });
        }

        const grupoInscripcion = await GrupoInscripcionService.actualizarGrupoInscripcion(id, data);

        res.status(200).json({
            success: true,
            message: 'Asignación de grupo actualizada exitosamente',
            data: grupoInscripcion
        });
    } catch (error) {
        console.error('❌ Error en actualizarGrupoInscripcion:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// DELETE - Eliminar (soft delete) una asignación
// ============================================
const eliminarGrupoInscripcion = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`🗑️ Eliminando asignación de grupo con ID: ${id}`);

        const grupoInscripcion = await GrupoInscripcionService.eliminarGrupoInscripcion(id);

        res.status(200).json({
            success: true,
            message: 'Asignación de grupo eliminada exitosamente',
            data: grupoInscripcion
        });
    } catch (error) {
        console.error('❌ Error en eliminarGrupoInscripcion:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    crearGrupoInscripcion,
    obtenerGrupoInscripciones,
    obtenerTodasLasGrupoInscripciones,
    obtenerGrupoInscripcionPorId,
    obtenerGrupoInscripcionesPorGrupo,
    obtenerGrupoInscripcionesPorInscripcion,
    obtenerGrupoInscripcionesPorBombo,
    actualizarGrupoInscripcion,
    eliminarGrupoInscripcion
};
