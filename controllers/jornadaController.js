const JornadaService = require('../services/jornadaService');

// ============================================
// CREATE - Crear una nueva jornada
// ============================================
const crearJornada = async (req, res) => {
    try {
        const data = req.body;

        console.log('📨 Datos recibidos para crear jornada:', data);

        const jornada = await JornadaService.crearJornada(data);

        res.status(201).json({
            success: true,
            message: 'Jornada creada exitosamente',
            data: jornada
        });
    } catch (error) {
        console.error('❌ Error en crearJornada:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener todas las jornadas activas
// ============================================
const obtenerJornadas = async (req, res) => {
    try {
        const jornadas = await JornadaService.obtenerJornadas();

        res.status(200).json({
            success: true,
            message: 'Jornadas obtenidas exitosamente',
            data: jornadas,
            total: jornadas.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerJornadas:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener TODAS las jornadas (incluyendo inactivas)
// ============================================
const obtenerTodasLasJornadas = async (req, res) => {
    try {
        const jornadas = await JornadaService.obtenerTodasLasJornadas();

        res.status(200).json({
            success: true,
            message: 'Todas las jornadas obtenidas exitosamente',
            data: jornadas,
            total: jornadas.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerTodasLasJornadas:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener una jornada por ID
// ============================================
const obtenerJornadaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const jornada = await JornadaService.obtenerJornadaPorId(id);

        res.status(200).json({
            success: true,
            message: 'Jornada obtenida exitosamente',
            data: jornada
        });
    } catch (error) {
        console.error('❌ Error en obtenerJornadaPorId:', error);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener jornadas por Fase
// ============================================
const obtenerJornadasPorFase = async (req, res) => {
    try {
        const { id_fase } = req.params;
        const jornadas = await JornadaService.obtenerJornadasPorFase(id_fase);

        res.status(200).json({
            success: true,
            message: `${jornadas.length} jornadas encontradas`,
            data: jornadas,
            total: jornadas.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerJornadasPorFase:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener jornadas por Grupo
// ============================================
const obtenerJornadasPorGrupo = async (req, res) => {
    try {
        const { id_grupo } = req.params;
        const jornadas = await JornadaService.obtenerJornadasPorGrupo(id_grupo);

        res.status(200).json({
            success: true,
            message: `${jornadas.length} jornadas encontradas`,
            data: jornadas,
            total: jornadas.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerJornadasPorGrupo:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener jornadas por CampeonatoCategoria (id_cc)
// ============================================
const obtenerJornadasPorCampeonatoCategoria = async (req, res) => {
    try {
        const { id_cc } = req.params;
        const jornadas = await JornadaService.obtenerJornadasPorCampeonatoCategoria(id_cc);

        res.status(200).json({
            success: true,
            message: `${jornadas.length} jornadas encontradas`,
            data: jornadas,
            total: jornadas.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerJornadasPorCampeonatoCategoria:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener jornadas por estado (j_estado)
// ============================================
const obtenerJornadasPorEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        const jornadas = await JornadaService.obtenerJornadasPorEstado(estado);

        res.status(200).json({
            success: true,
            message: `${jornadas.length} jornadas en estado "${estado}" encontradas`,
            data: jornadas,
            total: jornadas.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerJornadasPorEstado:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener jornada con relaciones completas
// ============================================
const obtenerJornadaConRelaciones = async (req, res) => {
    try {
        const { id } = req.params;
        const jornada = await JornadaService.obtenerJornadaConRelaciones(id);

        res.status(200).json({
            success: true,
            message: 'Jornada con relaciones obtenida exitosamente',
            data: jornada
        });
    } catch (error) {
        console.error('❌ Error en obtenerJornadaConRelaciones:', error);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// UPDATE - Actualizar una jornada
// ============================================
const actualizarJornada = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        console.log(`📨 Actualizando jornada ${id} con:`, data);

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Se deben proporcionar datos para actualizar'
            });
        }

        const jornada = await JornadaService.actualizarJornada(id, data);

        res.status(200).json({
            success: true,
            message: 'Jornada actualizada exitosamente',
            data: jornada
        });
    } catch (error) {
        console.error('❌ Error en actualizarJornada:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// UPDATE - Cambiar estado de la jornada (j_estado)
// ============================================
const cambiarEstadoJornada = async (req, res) => {
    try {
        const { id } = req.params;
        const { j_estado } = req.body;

        if (!j_estado) {
            return res.status(400).json({
                success: false,
                message: 'El campo j_estado es requerido'
            });
        }

        console.log(`🔄 Cambiando estado de la jornada ${id} a: ${j_estado}`);

        const jornada = await JornadaService.cambiarEstadoJornada(id, j_estado);

        res.status(200).json({
            success: true,
            message: `Jornada actualizada a estado "${j_estado}" exitosamente`,
            data: jornada
        });
    } catch (error) {
        console.error('❌ Error en cambiarEstadoJornada:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// DELETE - Eliminar (soft delete) una jornada
// ============================================
const eliminarJornada = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`🗑️ Eliminando jornada con ID: ${id}`);

        const jornada = await JornadaService.eliminarJornada(id);

        res.status(200).json({
            success: true,
            message: 'Jornada eliminada exitosamente',
            data: jornada
        });
    } catch (error) {
        console.error('❌ Error en eliminarJornada:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    crearJornada,
    obtenerJornadas,
    obtenerTodasLasJornadas,
    obtenerJornadaPorId,
    obtenerJornadasPorFase,
    obtenerJornadasPorGrupo,
    obtenerJornadasPorCampeonatoCategoria,
    obtenerJornadasPorEstado,
    obtenerJornadaConRelaciones,
    actualizarJornada,
    cambiarEstadoJornada,
    eliminarJornada
};
