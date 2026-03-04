const InscripcionService = require('../services/inscripcionService');

// ============================================
// CREATE - Crear una nueva inscripción
// ============================================
const crearInscripcion = async (req, res) => {
    try {
        const data = req.body;

        console.log('📨 Datos recibidos para crear inscripción:', data);

        const inscripcion = await InscripcionService.crearInscripcion(data);

        res.status(201).json({
            success: true,
            message: 'Inscripción creada exitosamente',
            data: inscripcion
        });
    } catch (error) {
        console.error('❌ Error en crearInscripcion:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener todas las inscripciones activas
// ============================================
const obtenerInscripciones = async (req, res) => {
    try {
        const inscripciones = await InscripcionService.obtenerInscripciones();

        res.status(200).json({
            success: true,
            message: 'Inscripciones obtenidas exitosamente',
            data: inscripciones,
            total: inscripciones.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerInscripciones:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener TODAS las inscripciones (incluyendo inactivas)
// ============================================
const obtenerTodasLasInscripciones = async (req, res) => {
    try {
        const inscripciones = await InscripcionService.obtenerTodasLasInscripciones();

        res.status(200).json({
            success: true,
            message: 'Todas las inscripciones obtenidas exitosamente',
            data: inscripciones,
            total: inscripciones.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerTodasLasInscripciones:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener una inscripción por ID
// ============================================
const obtenerInscripcionPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const inscripcion = await InscripcionService.obtenerInscripcionPorId(id);

        res.status(200).json({
            success: true,
            message: 'Inscripción obtenida exitosamente',
            data: inscripcion
        });
    } catch (error) {
        console.error('❌ Error en obtenerInscripcionPorId:', error);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener inscripciones por CampeonatoCategoria
// ============================================
const obtenerInscripcionesPorCampeonatoCategoria = async (req, res) => {
    try {
        const { id_cc } = req.params;
        const inscripciones = await InscripcionService.obtenerInscripcionesPorCampeonatoCategoria(id_cc);

        res.status(200).json({
            success: true,
            message: `${inscripciones.length} inscripciones encontradas`,
            data: inscripciones,
            total: inscripciones.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerInscripcionesPorCampeonatoCategoria:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener inscripciones por Campeonato
// ============================================
const obtenerInscripcionesPorCampeonato = async (req, res) => {
    try {
        const { id_campeonato } = req.params;
        const inscripciones = await InscripcionService.obtenerInscripcionesPorCampeonato(id_campeonato);

        res.status(200).json({
            success: true,
            message: `${inscripciones.length} inscripciones encontradas`,
            data: inscripciones,
            total: inscripciones.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerInscripcionesPorCampeonato:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener inscripciones por Equipo
// ============================================
const obtenerInscripcionesPorEquipo = async (req, res) => {
    try {
        const { id_equipo } = req.params;
        const inscripciones = await InscripcionService.obtenerInscripcionesPorEquipo(id_equipo);

        res.status(200).json({
            success: true,
            message: `${inscripciones.length} inscripciones encontradas`,
            data: inscripciones,
            total: inscripciones.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerInscripcionesPorEquipo:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener inscripciones por Grupo
// ============================================
const obtenerInscripcionesPorGrupo = async (req, res) => {
    try {
        const { grupo } = req.params;
        const inscripciones = await InscripcionService.obtenerInscripcionesPorGrupo(grupo);

        res.status(200).json({
            success: true,
            message: `${inscripciones.length} inscripciones en grupo "${grupo}" encontradas`,
            data: inscripciones,
            total: inscripciones.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerInscripcionesPorGrupo:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener inscripción con relaciones completas
// ============================================
const obtenerInscripcionConRelaciones = async (req, res) => {
    try {
        const { id } = req.params;
        const inscripcion = await InscripcionService.obtenerInscripcionConRelaciones(id);

        res.status(200).json({
            success: true,
            message: 'Inscripción con relaciones obtenida exitosamente',
            data: inscripcion
        });
    } catch (error) {
        console.error('❌ Error en obtenerInscripcionConRelaciones:', error);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// UPDATE - Actualizar una inscripción
// ============================================
const actualizarInscripcion = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        console.log(`📨 Actualizando inscripción ${id} con:`, data);

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Se deben proporcionar datos para actualizar'
            });
        }

        const inscripcion = await InscripcionService.actualizarInscripcion(id, data);

        res.status(200).json({
            success: true,
            message: 'Inscripción actualizada exitosamente',
            data: inscripcion
        });
    } catch (error) {
        console.error('❌ Error en actualizarInscripcion:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener inscripciones por estado
// ============================================
const obtenerInscripcionesPorEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        const inscripciones = await InscripcionService.obtenerInscripcionesPorEstado(estado);

        res.status(200).json({
            success: true,
            message: `${inscripciones.length} inscripciones con estado "${estado}" encontradas`,
            data: inscripciones,
            total: inscripciones.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerInscripcionesPorEstado:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// UPDATE - Cambiar estado de inscripción
// ============================================
const cambiarEstadoInscripcion = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        console.log(`📝 Cambiando estado de inscripción ${id} a: ${estado}`);

        if (!estado) {
            return res.status(400).json({
                success: false,
                message: 'El estado es requerido'
            });
        }

        const inscripcion = await InscripcionService.cambiarEstadoInscripcion(id, estado);

        res.status(200).json({
            success: true,
            message: 'Estado de inscripción actualizado exitosamente',
            data: inscripcion
        });
    } catch (error) {
        console.error('❌ Error en cambiarEstadoInscripcion:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// DELETE - Eliminar (soft delete) una inscripción
// ============================================
const eliminarInscripcion = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`🗑️ Eliminando inscripción con ID: ${id}`);

        const inscripcion = await InscripcionService.eliminarInscripcion(id);

        res.status(200).json({
            success: true,
            message: 'Inscripción eliminada exitosamente',
            data: inscripcion
        });
    } catch (error) {
        console.error('❌ Error en eliminarInscripcion:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    crearInscripcion,
    obtenerInscripciones,
    obtenerTodasLasInscripciones,
    obtenerInscripcionPorId,
    obtenerInscripcionesPorCampeonato,
    obtenerInscripcionesPorCampeonatoCategoria,
    obtenerInscripcionesPorEquipo,
    obtenerInscripcionesPorGrupo,
    obtenerInscripcionesPorEstado,
    obtenerInscripcionConRelaciones,
    actualizarInscripcion,
    cambiarEstadoInscripcion,
    eliminarInscripcion
};
