/**
 * services/equipoTecnicoService.js
 * 
 * Service - Wrapper del repositorio con respuestas estandarizadas
 */

const {
    crearEqTecnico,
    obtenerEqTecnicos,
    obtenerTodosLosEqTecnicos,
    obtenerEqTecnicoPorId,
    obtenerEqTecnicoCompleto,
    obtenerEqTecnicosPorPersona,
    obtenerEqTecnicosPorCategoria,
    obtenerEqTecnicosPorClub,
    obtenerEqTecnicosPorPeriodo,
    obtenerEqTecnicosActuales,
    esEqTecnico,
    obtenerEqTecnicoPorIdPersona,
    actualizarEqTecnico,
    eliminarEqTecnico,
    obtenerPersonasSinEqTecnico,
    contarEqTecnicosPorClub,
    verificarDisponibilidadPeriodo
} = require('../repositories/eqTecnicoRepository');

// ============================================
// CREATE
// ============================================

/**
 * Crear un nuevo equipo técnico
 */
const crearEqTecnicoService = async (data) => {
    try {
        const resultado = await crearEqTecnico(data);
        
        return {
            success: true,
            message: 'Equipo técnico creado exitosamente',
            data: resultado,
            code: 'CREATE_SUCCESS'
        };
    } catch (error) {
        return {
            success: false,
            message: `Error al crear equipo técnico: ${error.message}`,
            code: 'CREATE_ERROR',
            details: error
        };
    }
};

// ============================================
// READ - Obtener equipos activos
// ============================================

/**
 * Obtener todos los equipos técnicos activos
 */
const obtenerEqTecnicosService = async (filtros = {}) => {
    try {
        const resultado = await obtenerEqTecnicos(filtros);
        
        return {
            success: true,
            message: resultado.message,
            data: resultado.data,
            total: resultado.total,
            code: 'GET_SUCCESS'
        };
    } catch (error) {
        return {
            success: false,
            message: `Error al obtener equipos técnicos: ${error.message}`,
            code: 'GET_ERROR',
            details: error
        };
    }
};

const obtenerTodosLosEqTecnicosService = async () => {
    try {
        const resultado = await obtenerTodosLosEqTecnicos();
        
        return {
            success: true,
            message: resultado.message,
            data: resultado.data,
            total: resultado.total,
            code: 'GET_SUCCESS'
        };
    } catch (error) {
        return {
            success: false,
            message: `Error al obtener equipos técnicos: ${error.message}`,
            code: 'GET_ERROR',
            details: error
        };
    }
};


const obtenerEqTecnicoPorIdService = async (id_eqtecnico) => {
    try {
        const resultado = await obtenerEqTecnicoPorId(id_eqtecnico);

        if (!resultado.data) {
            return {
                success: false,
                message: 'El equipo técnico no existe',
                code: 'NOT_FOUND'
            };
        }

        return {
            success: true,
            message: 'Equipo técnico encontrado',
            data: resultado.data,
            code: 'GET_SUCCESS'
        };
    } catch (error) {
        return {
            success: false,
            message: `Error al obtener equipo técnico: ${error.message}`,
            code: 'GET_ERROR',
            details: error
        };
    }
};


const obtenerEqTecnicoCompletoService = async (id_eqtecnico) => {
    try {
        const resultado = await obtenerEqTecnicoCompleto(id_eqtecnico);

        return {
            success: true,
            message: 'Equipo técnico encontrado',
            data: resultado,
            code: 'GET_SUCCESS'
        };
    } catch (error) {
        return {
            success: false,
            message: `Error al obtener equipo técnico: ${error.message}`,
            code: 'GET_ERROR',
            details: error
        };
    }
};

// ============================================
// READ - Obtener por relaciones
// ============================================

/**
 * Obtener equipos técnicos por persona
 */
const obtenerEqTecnicosPorPersonaService = async (id_persona) => {
    try {
        const resultado = await obtenerEqTecnicosPorPersona(id_persona);

        return {
            success: true,
            message: `${resultado.length} equipos técnicos encontrados`,
            data: resultado,
            total: resultado.length,
            code: 'GET_SUCCESS'
        };
    } catch (error) {
        return {
            success: false,
            message: `Error al obtener equipos técnicos: ${error.message}`,
            code: 'GET_ERROR',
            details: error
        };
    }
};

/**
 * Obtener equipos técnicos por categoría
 */
const obtenerEqTecnicosPorCategoriaService = async (id_categoria) => {
    try {
        const resultado = await obtenerEqTecnicosPorCategoria(id_categoria);

        return {
            success: true,
            message: `${resultado.length} equipos técnicos encontrados`,
            data: resultado,
            total: resultado.length,
            code: 'GET_SUCCESS'
        };
    } catch (error) {
        return {
            success: false,
            message: `Error al obtener equipos técnicos: ${error.message}`,
            code: 'GET_ERROR',
            details: error
        };
    }
};

/**
 * Obtener equipos técnicos por club
 */
const obtenerEqTecnicosPorClubService = async (id_club) => {
    try {
        const resultado = await obtenerEqTecnicosPorClub(id_club);

        return {
            success: true,
            message: `${resultado.length} equipos técnicos encontrados`,
            data: resultado,
            total: resultado.length,
            code: 'GET_SUCCESS'
        };
    } catch (error) {
        return {
            success: false,
            message: `Error al obtener equipos técnicos: ${error.message}`,
            code: 'GET_ERROR',
            details: error
        };
    }
};

/**
 * Obtener equipos técnicos por período
 */
const obtenerEqTecnicosPorPeriodoService = async (fecha) => {
    try {
        const resultado = await obtenerEqTecnicosPorPeriodo(fecha);

        return {
            success: true,
            message: `${resultado.length} equipos técnicos encontrados`,
            data: resultado,
            total: resultado.length,
            code: 'GET_SUCCESS'
        };
    } catch (error) {
        return {
            success: false,
            message: `Error al obtener equipos técnicos: ${error.message}`,
            code: 'GET_ERROR',
            details: error
        };
    }
};

/**
 * Obtener equipos técnicos activos actualmente
 */
const obtenerEqTecnicosActualesService = async () => {
    try {
        const resultado = await obtenerEqTecnicosActuales();

        return {
            success: true,
            message: `${resultado.length} equipos técnicos activos encontrados`,
            data: resultado,
            total: resultado.length,
            code: 'GET_SUCCESS'
        };
    } catch (error) {
        return {
            success: false,
            message: `Error al obtener equipos técnicos: ${error.message}`,
            code: 'GET_ERROR',
            details: error
        };
    }
};

/**
 * Verificar si una persona es equipo técnico
 */
const esEqTecnicoService = async (id_persona) => {
    try {
        const resultado = await esEqTecnico(id_persona);

        return {
            success: true,
            message: resultado ? 'La persona es equipo técnico' : 'La persona no es equipo técnico',
            data: { esEqTecnico: resultado },
            code: 'GET_SUCCESS'
        };
    } catch (error) {
        return {
            success: false,
            message: `Error al verificar: ${error.message}`,
            code: 'GET_ERROR',
            details: error
        };
    }
};

/**
 * Obtener equipo técnico por ID de persona
 */
const obtenerEqTecnicoPorIdPersonaService = async (id_persona) => {
    try {
        const resultado = await obtenerEqTecnicoPorIdPersona(id_persona);

        if (!resultado) {
            return {
                success: false,
                message: 'El equipo técnico no existe',
                code: 'NOT_FOUND'
            };
        }

        return {
            success: true,
            message: 'Equipo técnico encontrado',
            data: resultado,
            code: 'GET_SUCCESS'
        };
    } catch (error) {
        return {
            success: false,
            message: `Error al obtener equipo técnico: ${error.message}`,
            code: 'GET_ERROR',
            details: error
        };
    }
};

/**
 * Obtener personas sin ser equipo técnico
 */
const obtenerPersonasSinEqTecnicoService = async () => {
    try {
        const resultado = await obtenerPersonasSinEqTecnico();

        return {
            success: true,
            message: `${resultado.length} personas sin equipo técnico encontradas`,
            data: resultado,
            total: resultado.length,
            code: 'GET_SUCCESS'
        };
    } catch (error) {
        return {
            success: false,
            message: `Error al obtener personas: ${error.message}`,
            code: 'GET_ERROR',
            details: error
        };
    }
};

/**
 * Contar equipos técnicos por club
 */
const contarEqTecnicosPorClubService = async (id_club) => {
    try {
        const cantidad = await contarEqTecnicosPorClub(id_club);

        return {
            success: true,
            message: 'Cantidad obtenida exitosamente',
            data: { cantidad },
            code: 'GET_SUCCESS'
        };
    } catch (error) {
        return {
            success: false,
            message: `Error al contar equipos técnicos: ${error.message}`,
            code: 'GET_ERROR',
            details: error
        };
    }
};

/**
 * Verificar disponibilidad de período
 */
const verificarDisponibilidadPeriodoService = async (id_persona, desde, hasta, excluyendo_id = null) => {
    try {
        const disponible = await verificarDisponibilidadPeriodo(id_persona, desde, hasta, excluyendo_id);

        return {
            success: true,
            message: disponible ? 'Período disponible' : 'Período no disponible',
            data: { disponible },
            code: 'GET_SUCCESS'
        };
    } catch (error) {
        return {
            success: false,
            message: `Error al verificar disponibilidad: ${error.message}`,
            code: 'GET_ERROR',
            details: error
        };
    }
};

// ============================================
// UPDATE
// ============================================

/**
 * Actualizar un equipo técnico
 */
const actualizarEqTecnicoService = async (id_eqtecnico, data) => {
    try {
        const resultado = await actualizarEqTecnico(id_eqtecnico, data);

        if (!resultado) {
            return {
                success: false,
                message: 'El equipo técnico no existe',
                code: 'NOT_FOUND'
            };
        }

        return {
            success: true,
            message: 'Equipo técnico actualizado exitosamente',
            data: resultado,
            code: 'UPDATE_SUCCESS'
        };
    } catch (error) {
        return {
            success: false,
            message: `Error al actualizar equipo técnico: ${error.message}`,
            code: 'UPDATE_ERROR',
            details: error
        };
    }
};

// ============================================
// DELETE
// ============================================

/**
 * Eliminar un equipo técnico (soft delete)
 */
const eliminarEqTecnicoService = async (id_eqtecnico) => {
    try {
        const resultado = await eliminarEqTecnico(id_eqtecnico);

        if (!resultado) {
            return {
                success: false,
                message: 'El equipo técnico no existe',
                code: 'NOT_FOUND'
            };
        }

        return {
            success: true,
            message: 'Equipo técnico eliminado exitosamente',
            data: resultado,
            code: 'DELETE_SUCCESS'
        };
    } catch (error) {
        return {
            success: false,
            message: `Error al eliminar equipo técnico: ${error.message}`,
            code: 'DELETE_ERROR',
            details: error
        };
    }
};

module.exports = {
    // CREATE
    crearEqTecnicoService,
    
    // READ - Activos
    obtenerEqTecnicosService,
    obtenerTodosLosEqTecnicosService,
    obtenerEqTecnicoPorIdService,
    obtenerEqTecnicoCompletoService,
    
    // READ - Por relaciones
    obtenerEqTecnicosPorPersonaService,
    obtenerEqTecnicosPorCategoriaService,
    obtenerEqTecnicosPorClubService,
    obtenerEqTecnicosPorPeriodoService,
    obtenerEqTecnicosActualesService,
    esEqTecnicoService,
    obtenerEqTecnicoPorIdPersonaService,
    obtenerPersonasSinEqTecnicoService,
    contarEqTecnicosPorClubService,
    verificarDisponibilidadPeriodoService,
    
    // UPDATE
    actualizarEqTecnicoService,
    
    // DELETE
    eliminarEqTecnicoService
};