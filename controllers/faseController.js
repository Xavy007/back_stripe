const FaseService = require('../services/faseService');

// ============================================
// CREATE - Crear una nueva fase
// ============================================
const crearFase = async (req, res) => {
    try {
        const data = req.body;

        console.log('📨 Datos recibidos para crear fase:', data);

        const fase = await FaseService.crearFase(data);

        res.status(201).json({
            success: true,
            message: 'Fase creada exitosamente',
            data: fase
        });
    } catch (error) {
        console.error('❌ Error en crearFase:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener todas las fases activas
// ============================================
const obtenerFases = async (req, res) => {
    try {
        const fases = await FaseService.obtenerFases();

        res.status(200).json({
            success: true,
            message: 'Fases obtenidas exitosamente',
            data: fases,
            total: fases.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerFases:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener TODAS las fases (incluyendo inactivas)
// ============================================
const obtenerTodasLasFases = async (req, res) => {
    try {
        const fases = await FaseService.obtenerTodasLasFases();

        res.status(200).json({
            success: true,
            message: 'Todas las fases obtenidas exitosamente',
            data: fases,
            total: fases.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerTodasLasFases:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener una fase por ID
// ============================================
const obtenerFasePorId = async (req, res) => {
    try {
        const { id } = req.params;
        const fase = await FaseService.obtenerFasePorId(id);

        res.status(200).json({
            success: true,
            message: 'Fase obtenida exitosamente',
            data: fase
        });
    } catch (error) {
        console.error('❌ Error en obtenerFasePorId:', error);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener fases por CampeonatoCategoria
// ============================================
const obtenerFasesPorCampeonatoCategoria = async (req, res) => {
    try {
        const { id_cc } = req.params;
        const fases = await FaseService.obtenerFasesPorCampeonatoCategoria(id_cc);

        res.status(200).json({
            success: true,
            message: `${fases.length} fases encontradas`,
            data: fases,
            total: fases.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerFasesPorCampeonatoCategoria:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener fases por tipo
// ============================================
const obtenerFasesPorTipo = async (req, res) => {
    try {
        const { tipo } = req.params;
        const fases = await FaseService.obtenerFasesPorTipo(tipo);

        res.status(200).json({
            success: true,
            message: `${fases.length} fases de tipo "${tipo}" encontradas`,
            data: fases,
            total: fases.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerFasesPorTipo:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener fases por estado (f_estado)
// ============================================
const obtenerFasesPorEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        const fases = await FaseService.obtenerFasesPorEstado(estado);

        res.status(200).json({
            success: true,
            message: `${fases.length} fases en estado "${estado}" encontradas`,
            data: fases,
            total: fases.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerFasesPorEstado:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener fase con relaciones completas
// ============================================
const obtenerFaseConRelaciones = async (req, res) => {
    try {
        const { id } = req.params;
        const fase = await FaseService.obtenerFaseConRelaciones(id);

        res.status(200).json({
            success: true,
            message: 'Fase con relaciones obtenida exitosamente',
            data: fase
        });
    } catch (error) {
        console.error('❌ Error en obtenerFaseConRelaciones:', error);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// UPDATE - Actualizar una fase
// ============================================
const actualizarFase = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        console.log(`📨 Actualizando fase ${id} con:`, data);

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Se deben proporcionar datos para actualizar'
            });
        }

        const fase = await FaseService.actualizarFase(id, data);

        res.status(200).json({
            success: true,
            message: 'Fase actualizada exitosamente',
            data: fase
        });
    } catch (error) {
        console.error('❌ Error en actualizarFase:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// UPDATE - Cambiar estado de la fase (f_estado)
// ============================================
const cambiarEstadoFase = async (req, res) => {
    try {
        const { id } = req.params;
        const { f_estado } = req.body;

        if (!f_estado) {
            return res.status(400).json({
                success: false,
                message: 'El campo f_estado es requerido'
            });
        }

        console.log(`🔄 Cambiando estado de la fase ${id} a: ${f_estado}`);

        const fase = await FaseService.cambiarEstadoFase(id, f_estado);

        res.status(200).json({
            success: true,
            message: `Fase actualizada a estado "${f_estado}" exitosamente`,
            data: fase
        });
    } catch (error) {
        console.error('❌ Error en cambiarEstadoFase:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// DELETE - Eliminar (soft delete) una fase
// ============================================
const eliminarFase = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`🗑️ Eliminando fase con ID: ${id}`);

        const fase = await FaseService.eliminarFase(id);

        res.status(200).json({
            success: true,
            message: 'Fase eliminada exitosamente',
            data: fase
        });
    } catch (error) {
        console.error('❌ Error en eliminarFase:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    crearFase,
    obtenerFases,
    obtenerTodasLasFases,
    obtenerFasePorId,
    obtenerFasesPorCampeonatoCategoria,
    obtenerFasesPorTipo,
    obtenerFasesPorEstado,
    obtenerFaseConRelaciones,
    actualizarFase,
    cambiarEstadoFase,
    eliminarFase
};
