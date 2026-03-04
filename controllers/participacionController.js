const ParticipacionService = require('../services/participacionService');

// ============================================
// CREATE - Crear una nueva participación
// ============================================
const crearParticipacion = async (req, res) => {
    try {
        const data = req.body;

        console.log('📨 Datos recibidos para crear participación:', data);

        const participacion = await ParticipacionService.crearParticipacion(data);

        res.status(201).json({
            success: true,
            message: 'Participación creada exitosamente',
            data: participacion
        });
    } catch (error) {
        console.error('❌ Error en crearParticipacion:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener todas las participaciones activas
// ============================================
const obtenerParticipaciones = async (req, res) => {
    try {
        const participaciones = await ParticipacionService.obtenerParticipaciones();

        res.status(200).json({
            success: true,
            message: 'Participaciones obtenidas exitosamente',
            data: participaciones,
            total: participaciones.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerParticipaciones:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener TODAS las participaciones (todos los estados)
// ============================================
const obtenerTodasLasParticipaciones = async (req, res) => {
    try {
        const participaciones = await ParticipacionService.obtenerTodasLasParticipaciones();

        res.status(200).json({
            success: true,
            message: 'Todas las participaciones obtenidas exitosamente',
            data: participaciones,
            total: participaciones.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerTodasLasParticipaciones:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener una participación por ID
// ============================================
const obtenerParticipacionPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const participacion = await ParticipacionService.obtenerParticipacionPorId(id);

        res.status(200).json({
            success: true,
            message: 'Participación obtenida exitosamente',
            data: participacion
        });
    } catch (error) {
        console.error('❌ Error en obtenerParticipacionPorId:', error);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener participaciones por Jugador
// ============================================
const obtenerParticipacionesPorJugador = async (req, res) => {
    try {
        const { id_jugador } = req.params;
        const participaciones = await ParticipacionService.obtenerParticipacionesPorJugador(id_jugador);

        res.status(200).json({
            success: true,
            message: `${participaciones.length} participaciones encontradas`,
            data: participaciones,
            total: participaciones.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerParticipacionesPorJugador:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener participaciones por Equipo
// ============================================
const obtenerParticipacionesPorEquipo = async (req, res) => {
    try {
        const { id_equipo } = req.params;
        const participaciones = await ParticipacionService.obtenerParticipacionesPorEquipo(id_equipo);

        res.status(200).json({
            success: true,
            message: `${participaciones.length} participaciones encontradas`,
            data: participaciones,
            total: participaciones.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerParticipacionesPorEquipo:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener participaciones por Campeonato
// ============================================
const obtenerParticipacionesPorCampeonato = async (req, res) => {
    try {
        const { id_campeonato } = req.params;
        const participaciones = await ParticipacionService.obtenerParticipacionesPorCampeonato(id_campeonato);

        res.status(200).json({
            success: true,
            message: `${participaciones.length} participaciones encontradas`,
            data: participaciones,
            total: participaciones.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerParticipacionesPorCampeonato:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener participaciones por CampeonatoCategoria
// ============================================
const obtenerParticipacionesPorCampeonatoCategoria = async (req, res) => {
    try {
        const { id_cc } = req.params;
        const participaciones = await ParticipacionService.obtenerParticipacionesPorCampeonatoCategoria(id_cc);

        res.status(200).json({
            success: true,
            message: `${participaciones.length} participaciones encontradas`,
            data: participaciones,
            total: participaciones.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerParticipacionesPorCampeonatoCategoria:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener participaciones por estado
// ============================================
const obtenerParticipacionesPorEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        const participaciones = await ParticipacionService.obtenerParticipacionesPorEstado(estado);

        res.status(200).json({
            success: true,
            message: `${participaciones.length} participaciones en estado "${estado}" encontradas`,
            data: participaciones,
            total: participaciones.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerParticipacionesPorEstado:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// UPDATE - Actualizar una participación
// ============================================
const actualizarParticipacion = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        console.log(`📨 Actualizando participación ${id} con:`, data);

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Se deben proporcionar datos para actualizar'
            });
        }

        const participacion = await ParticipacionService.actualizarParticipacion(id, data);

        res.status(200).json({
            success: true,
            message: 'Participación actualizada exitosamente',
            data: participacion
        });
    } catch (error) {
        console.error('❌ Error en actualizarParticipacion:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// UPDATE - Cambiar estado de la participación
// ============================================
const cambiarEstadoParticipacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!estado) {
            return res.status(400).json({
                success: false,
                message: 'El campo estado es requerido'
            });
        }

        console.log(`🔄 Cambiando estado de la participación ${id} a: ${estado}`);

        const participacion = await ParticipacionService.cambiarEstadoParticipacion(id, estado);

        res.status(200).json({
            success: true,
            message: `Participación actualizada a estado "${estado}" exitosamente`,
            data: participacion
        });
    } catch (error) {
        console.error('❌ Error en cambiarEstadoParticipacion:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    crearParticipacion,
    obtenerParticipaciones,
    obtenerTodasLasParticipaciones,
    obtenerParticipacionPorId,
    obtenerParticipacionesPorJugador,
    obtenerParticipacionesPorEquipo,
    obtenerParticipacionesPorCampeonato,
    obtenerParticipacionesPorCampeonatoCategoria,
    obtenerParticipacionesPorEstado,
    actualizarParticipacion,
    cambiarEstadoParticipacion
};
