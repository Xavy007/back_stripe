/**
 * controllers/jugadorController.js
 * 
 * Controlador para manejar las peticiones HTTP relacionadas con jugadores
 * Utiliza el servicio jugadorService para la lógica de negocio
 */

const jugadorService = require('../services/jugadorService');

// ============================================
// CREATE - Crear jugador con persona nueva
// ============================================

const crearJugadorCompleto = async (req, res) => {
    try {
        const { datosPersona, datosJugador } = req.body;

        // Validar que se proporcionaron los datos necesarios
        if (!datosPersona || !datosJugador) {
            return res.status(400).json({
                success: false,
                message: 'Se deben proporcionar datosPersona y datosJugador'
            });
        }

        const resultado = await jugadorService.crearJugadorCompleto(datosPersona, datosJugador);

        return res.status(201).json(resultado);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// CREATE - Crear jugador para persona existente
// ============================================

const crearJugadorParaPersona = async (req, res) => {
    try {
        const { id_persona } = req.params;
        const { datosJugador } = req.body;

        if (!datosJugador) {
            return res.status(400).json({
                success: false,
                message: 'Se deben proporcionar los datos del jugador'
            });
        }

        const resultado = await jugadorService.crearJugadorParaPersona(id_persona, datosJugador);

        return res.status(201).json(resultado);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener todas las personas sin jugador
// ============================================

const obtenerPersonasSinJugador = async (req, res) => {
    try {
        const resultado = await jugadorService.obtenerPersonasSinJugador();

        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener todos los jugadores (solo activos)
// ============================================

const obtenerJugadores = async (req, res) => {
    try {
        const filtros = req.query;

        const resultado = await jugadorService.obtenerJugadores(filtros);

        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener todos los jugadores (incluidos inactivos)
// ============================================

const obtenerTodosLosJugadores = async (req, res) => {
    try {
        const resultado = await jugadorService.obtenerTodosLosJugadores();

        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener jugador por ID
// ============================================

const obtenerJugadorPorId = async (req, res) => {
    try {
        const { id_jugador } = req.params;

        const jugador = await jugadorService.obtenerJugadorPorId(id_jugador);

        return res.status(200).json({
            success: true,
            data: jugador
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener jugadores por club
// ============================================

const obtenerJugadoresPorClub = async (req, res) => {
    try {
        const { id_club } = req.params;

        const jugadores = await jugadorService.obtenerJugadoresPorClub(id_club);

        return res.status(200).json({
            success: true,
            message: `${jugadores.length} jugadores encontrados`,
            data: jugadores,
            total: jugadores.length
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener jugadores por nombre
// ============================================

const obtenerJugadoresPorNombre = async (req, res) => {
    try {
        const { nombre } = req.query;

        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: 'El parámetro nombre es requerido'
            });
        }

        const jugadores = await jugadorService.obtenerJugadoresPorNombre(nombre);

        return res.status(200).json({
            success: true,
            message: `${jugadores.length} jugadores encontrados`,
            data: jugadores,
            total: jugadores.length
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener jugadores por estatura
// ============================================

const obtenerJugadoresPorEstatura = async (req, res) => {
    try {
        const { estatura_minima, estatura_maxima } = req.query;

        if (!estatura_minima || !estatura_maxima) {
            return res.status(400).json({
                success: false,
                message: 'Los parámetros estatura_minima y estatura_maxima son requeridos'
            });
        }

        const jugadores = await jugadorService.obtenerJugadoresPorEstatura(
            parseInt(estatura_minima),
            parseInt(estatura_maxima)
        );

        return res.status(200).json({
            success: true,
            message: `${jugadores.length} jugadores encontrados`,
            data: jugadores,
            total: jugadores.length
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// UPDATE - Actualizar jugador
// ============================================

const actualizarJugador = async (req, res) => {
    try {
        const { id_jugador } = req.params;
        const data = req.body;

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Se deben proporcionar datos para actualizar'
            });
        }

        const jugador = await jugadorService.actualizarJugador(id_jugador, data);

        return res.status(200).json({
            success: true,
            message: 'Jugador actualizado exitosamente',
            data: jugador
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// DELETE - Eliminar jugador (soft delete)
// ============================================

const eliminarJugador = async (req, res) => {
    try {
        const { id_jugador } = req.params;

        const jugador = await jugadorService.eliminarJugador(id_jugador);

        return res.status(200).json({
            success: true,
            message: 'Jugador eliminado exitosamente',
            data: jugador
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    crearJugadorCompleto,
    crearJugadorParaPersona,
    obtenerPersonasSinJugador,
    obtenerJugadores,
    obtenerTodosLosJugadores,
    obtenerJugadorPorId,
    obtenerJugadoresPorClub,
    obtenerJugadoresPorNombre,
    obtenerJugadoresPorEstatura,
    actualizarJugador,
    eliminarJugador
};