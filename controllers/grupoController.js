const GrupoService = require('../services/grupoService');

// ============================================
// CREATE - Crear un nuevo grupo
// ============================================
const crearGrupo = async (req, res) => {
    try {
        const data = req.body;

        console.log('📨 Datos recibidos para crear grupo:', data);

        const grupo = await GrupoService.crearGrupo(data);

        res.status(201).json({
            success: true,
            message: 'Grupo creado exitosamente',
            data: grupo
        });
    } catch (error) {
        console.error('❌ Error en crearGrupo:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener todos los grupos activos
// ============================================
const obtenerGrupos = async (req, res) => {
    try {
        const grupos = await GrupoService.obtenerGrupos();

        res.status(200).json({
            success: true,
            message: 'Grupos obtenidos exitosamente',
            data: grupos,
            total: grupos.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerGrupos:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener TODOS los grupos (incluyendo inactivos)
// ============================================
const obtenerTodosLosGrupos = async (req, res) => {
    try {
        const grupos = await GrupoService.obtenerTodosLosGrupos();

        res.status(200).json({
            success: true,
            message: 'Todos los grupos obtenidos exitosamente',
            data: grupos,
            total: grupos.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerTodosLosGrupos:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener un grupo por ID
// ============================================
const obtenerGrupoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const grupo = await GrupoService.obtenerGrupoPorId(id);

        res.status(200).json({
            success: true,
            message: 'Grupo obtenido exitosamente',
            data: grupo
        });
    } catch (error) {
        console.error('❌ Error en obtenerGrupoPorId:', error);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener grupos por CampeonatoCategoria
// ============================================
const obtenerGruposPorCampeonatoCategoria = async (req, res) => {
    try {
        const { id_cc } = req.params;
        const grupos = await GrupoService.obtenerGruposPorCampeonatoCategoria(id_cc);

        res.status(200).json({
            success: true,
            message: `${grupos.length} grupos encontrados`,
            data: grupos,
            total: grupos.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerGruposPorCampeonatoCategoria:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener grupos por Fase
// ============================================
const obtenerGruposPorFase = async (req, res) => {
    try {
        const { id_fase } = req.params;
        const grupos = await GrupoService.obtenerGruposPorFase(id_fase);

        res.status(200).json({
            success: true,
            message: `${grupos.length} grupos encontrados`,
            data: grupos,
            total: grupos.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerGruposPorFase:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener grupo por clave
// ============================================
const obtenerGrupoPorClave = async (req, res) => {
    try {
        const { id_cc, clave } = req.params;
        const grupo = await GrupoService.obtenerGrupoPorClave(id_cc, clave);

        res.status(200).json({
            success: true,
            message: 'Grupo obtenido exitosamente',
            data: grupo
        });
    } catch (error) {
        console.error('❌ Error en obtenerGrupoPorClave:', error);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener grupo con relaciones completas
// ============================================
const obtenerGrupoConRelaciones = async (req, res) => {
    try {
        const { id } = req.params;
        const grupo = await GrupoService.obtenerGrupoConRelaciones(id);

        res.status(200).json({
            success: true,
            message: 'Grupo con relaciones obtenido exitosamente',
            data: grupo
        });
    } catch (error) {
        console.error('❌ Error en obtenerGrupoConRelaciones:', error);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// UPDATE - Actualizar un grupo
// ============================================
const actualizarGrupo = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        console.log(`📨 Actualizando grupo ${id} con:`, data);

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Se deben proporcionar datos para actualizar'
            });
        }

        const grupo = await GrupoService.actualizarGrupo(id, data);

        res.status(200).json({
            success: true,
            message: 'Grupo actualizado exitosamente',
            data: grupo
        });
    } catch (error) {
        console.error('❌ Error en actualizarGrupo:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// DELETE - Eliminar (soft delete) un grupo
// ============================================
const eliminarGrupo = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`🗑️ Eliminando grupo con ID: ${id}`);

        const grupo = await GrupoService.eliminarGrupo(id);

        res.status(200).json({
            success: true,
            message: 'Grupo eliminado exitosamente',
            data: grupo
        });
    } catch (error) {
        console.error('❌ Error en eliminarGrupo:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    crearGrupo,
    obtenerGrupos,
    obtenerTodosLosGrupos,
    obtenerGrupoPorId,
    obtenerGruposPorCampeonatoCategoria,
    obtenerGruposPorFase,
    obtenerGrupoPorClave,
    obtenerGrupoConRelaciones,
    actualizarGrupo,
    eliminarGrupo
};
