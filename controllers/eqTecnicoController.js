/**
 * controllers/eqTecnicoController.js
 * 
 * Controlador con validaciones y manejo de datos del usuario
 * VERSIÓN CORREGIDA - Manejo correcto de conversión de datos
 */

const {
    crearEqTecnicoService,
    obtenerEqTecnicosService,
    obtenerTodosLosEqTecnicosService,
    obtenerEqTecnicoPorIdService,
    obtenerEqTecnicoCompletoService,
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
    actualizarEqTecnicoService,
    eliminarEqTecnicoService
} = require('../services/eqTecnicoService');

// ============================================
// CREATE
// ============================================

/**
 * POST /api/eqtecnicos
 */
const crearEqTecnico = async (req, res) => {
    try {
        const data = req.body;

        console.log('=== CREAR EQUIPO TÉCNICO ===');
        console.log('Datos recibidos:', JSON.stringify(data, null, 2));

        // Validar que se proporcione 'crearPersona' o 'id_persona'
        if (data.crearPersona === undefined && !data.id_persona) {
            return res.status(400).json({
                success: false,
                message: 'Se debe especificar si se creará una nueva persona (crearPersona: true) o proporcionar id_persona',
                code: 'VALIDATION_ERROR'
            });
        }

        // OPCIÓN 1: Crear nueva persona
        if (data.crearPersona === true) {
            console.log('📝 Modo: Crear nueva persona');

            const camposRequeridos = ['ci', 'nombre', 'ap', 'am','fnac', 'genero', 'id_nacionalidad', 'id_categoria', 'id_club'];
            const camposFaltantes = camposRequeridos.filter(campo => !data[campo]);

            if (camposFaltantes.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Faltan campos requeridos: ${camposFaltantes.join(', ')}`,
                    code: 'MISSING_FIELDS'
                });
            }

            // Validar edad mínima (18 años)
            const fechaNac = new Date(data.fnac);
            const hoy = new Date();
            const edad = hoy.getFullYear() - fechaNac.getFullYear();
            const mes = hoy.getMonth() - fechaNac.getMonth();

            console.log(`Validando edad: ${edad} años (nacimiento: ${data.fnac})`);

            if (edad < 18 || (edad === 18 && mes < 0)) {
                return res.status(400).json({
                    success: false,
                    message: 'La persona debe tener al menos 18 años para ser Equipo Técnico',
                    code: 'AGE_VALIDATION_ERROR'
                });
            }

            // Validar que la fecha 'hasta' sea posterior a 'desde'
            if (data.desde && data.hasta) {
                const fechaDesde = new Date(data.desde);
                const fechaHasta = new Date(data.hasta);

                if (fechaHasta <= fechaDesde) {
                    return res.status(400).json({
                        success: false,
                        message: 'La fecha "hasta" debe ser posterior a la fecha "desde"',
                        code: 'DATE_VALIDATION_ERROR'
                    });
                }
            }

            // Convertir datos del formato del usuario al formato del service
            const datosConvertidos = {
                id_categoria: parseInt(data.id_categoria),
                id_club: parseInt(data.id_club),
                desde: data.desde || null,
                hasta: data.hasta || null,
                estado: data.estado !== undefined ? data.estado : true,
                datoPersona: {
                    nombre: data.nombre.trim(),
                    ap: data?.ap || ' ',
                    am: data?.am || ' ',
                    ci: data.ci,
                    fnac: data.fnac,
                    genero: data.genero,
                    id_nacionalidad: parseInt(data.id_nacionalidad)
                }
            };

            console.log('✓ Datos convertidos:', JSON.stringify(datosConvertidos, null, 2));

            const resultado = await crearEqTecnicoService(datosConvertidos);

            if (!resultado.success) {
                return res.status(400).json(resultado);
            }

            return res.status(201).json({
                success: true,
                message: resultado.message,
                data: resultado.data,
                meta: {
                    timestamp: new Date(),
                    userId: req.user?.id || null
                }
            });
        }

        // OPCIÓN 2: Usar persona existente
        else if (data.crearPersona === false || data.id_persona) {
            console.log('👤 Modo: Usar persona existente');

            const camposRequeridos = ['id_persona', 'id_categoria', 'id_club'];
            const camposFaltantes = camposRequeridos.filter(campo => !data[campo]);

            if (camposFaltantes.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Faltan campos requeridos: ${camposFaltantes.join(', ')}`,
                    code: 'MISSING_FIELDS'
                });
            }

            // Validar que la fecha 'hasta' sea posterior a 'desde'
            if (data.desde && data.hasta) {
                const fechaDesde = new Date(data.desde);
                const fechaHasta = new Date(data.hasta);

                if (fechaHasta <= fechaDesde) {
                    return res.status(400).json({
                        success: false,
                        message: 'La fecha "hasta" debe ser posterior a la fecha "desde"',
                        code: 'DATE_VALIDATION_ERROR'
                    });
                }
            }

            const datosConvertidos = {
                id_persona: parseInt(data.id_persona),
                id_categoria: parseInt(data.id_categoria),
                id_club: parseInt(data.id_club),
                desde: data.desde || null,
                hasta: data.hasta || null,
                estado: data.estado !== undefined ? data.estado : true
            };

            console.log('✓ Datos para crear:', JSON.stringify(datosConvertidos, null, 2));

            const resultado = await crearEqTecnicoService(datosConvertidos);

            if (!resultado.success) {
                return res.status(400).json(resultado);
            }

            return res.status(201).json({
                success: true,
                message: resultado.message,
                data: resultado.data,
                meta: {
                    timestamp: new Date(),
                    userId: req.user?.id || null
                }
            });
        }

    } catch (error) {
        console.error('❌ Error al crear Equipo Técnico:', error);
        return res.status(500).json({
            success: false,
            message: error.message,
            code: 'CREATE_ERROR',
            details: error.details || error.toString()
        });
    }
};

// ============================================
// READ
// ============================================

/**
 * GET /api/eqtecnicos
 */
const obtenerEqTecnicos = async (req, res) => {
    try {
        const resultado = await obtenerEqTecnicosService(req.query);

        return res.status(200).json({
            success: resultado.success,
            message: resultado.message,
            data: resultado.data,
            total: resultado.total,
            meta: {
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('Error al obtener Equipos Técnicos:', error);
        return res.status(400).json({
            success: false,
            message: error.message,
            code: 'GET_ERROR'
        });
    }
};

/**
 * GET /api/eqtecnicos/todos
 */
const obtenerTodosLosEqTecnicos = async (req, res) => {
    try {
        const resultado = await obtenerTodosLosEqTecnicosService();

        return res.status(200).json({
            success: resultado.success,
            message: resultado.message,
            data: resultado.data,
            total: resultado.total,
            meta: {
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('Error al obtener todos los Equipos Técnicos:', error);
        return res.status(400).json({
            success: false,
            message: error.message,
            code: 'GET_ERROR'
        });
    }
};

/**
 * GET /api/eqtecnicos/actuales
 */
const obtenerEqTecnicosActuales = async (req, res) => {
    try {
        const resultado = await obtenerEqTecnicosActualesService();

        return res.status(200).json({
            success: resultado.success,
            message: resultado.message,
            data: resultado.data,
            total: resultado.total,
            meta: {
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('Error al obtener equipos técnicos activos:', error);
        return res.status(400).json({
            success: false,
            message: error.message,
            code: 'GET_ERROR'
        });
    }
};

/**
 * GET /api/eqtecnicos/personas-disponibles
 */
const obtenerPersonasDisponibles = async (req, res) => {
    try {
        const resultado = await obtenerPersonasSinEqTecnicoService();

        return res.status(200).json({
            success: resultado.success,
            message: resultado.message,
            data: resultado.data,
            total: resultado.total,
            meta: {
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('Error al obtener personas disponibles:', error);
        return res.status(400).json({
            success: false,
            message: error.message,
            code: 'GET_ERROR'
        });
    }
};

/**
 * GET /api/eqtecnicos/contar/club/:id_club
 */
const contarPorClub = async (req, res) => {
    try {
        const resultado = await contarEqTecnicosPorClubService(req.params.id_club);

        return res.status(200).json({
            success: resultado.success,
            message: resultado.message,
            data: resultado.data,
            meta: {
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('Error al contar equipos técnicos:', error);
        return res.status(400).json({
            success: false,
            message: error.message,
            code: 'GET_ERROR'
        });
    }
};

/**
 * GET /api/eqtecnicos/disponibilidad
 */
const verificarDisponibilidad = async (req, res) => {
    try {
        const { id_persona, desde, hasta, excluyendo_id } = req.query;

        if (!id_persona || !desde || !hasta) {
            return res.status(400).json({
                success: false,
                message: 'Se requieren: id_persona, desde, hasta',
                code: 'MISSING_FIELDS'
            });
        }

        const resultado = await verificarDisponibilidadPeriodoService(
            id_persona,
            desde,
            hasta,
            excluyendo_id
        );

        return res.status(200).json({
            success: resultado.success,
            message: resultado.message,
            data: resultado.data,
            meta: {
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('Error al verificar disponibilidad:', error);
        return res.status(400).json({
            success: false,
            message: error.message,
            code: 'GET_ERROR'
        });
    }
};

/**
 * GET /api/eqtecnicos/club/:id_club/categoria/:id_categoria
 */
const obtenerEqTecnicosClubCategoria = async (req, res) => {
    try {
        const { id_club, id_categoria } = req.params;

        if (!id_club || !id_categoria) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere ID de Club y ID de Categoría',
                code: 'MISSING_FIELDS'
            });
        }

        // Usar el service con filtros
        const resultado = await obtenerEqTecnicosService({ 
            id_club: parseInt(id_club), 
            id_categoria: parseInt(id_categoria) 
        });

        return res.status(200).json({
            success: resultado.success,
            message: resultado.message,
            data: resultado.data,
            total: resultado.total,
            meta: {
                timestamp: new Date(),
                filters: { id_club, id_categoria }
            }
        });
    } catch (error) {
        console.error('Error al obtener equipos técnicos:', error);
        return res.status(400).json({
            success: false,
            message: error.message,
            code: 'GET_ERROR'
        });
    }
};

/**
 * GET /api/eqtecnicos/persona/:id_persona
 */
const obtenerPorPersona = async (req, res) => {
    try {
        const resultado = await obtenerEqTecnicosPorPersonaService(req.params.id_persona);

        return res.status(200).json({
            success: resultado.success,
            message: resultado.message,
            data: resultado.data,
            total: resultado.total,
            meta: {
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('Error al obtener equipos técnicos:', error);
        return res.status(400).json({
            success: false,
            message: error.message,
            code: 'GET_ERROR'
        });
    }
};

/**
 * GET /api/eqtecnicos/categoria/:id_categoria
 */
const obtenerPorCategoria = async (req, res) => {
    try {
        const resultado = await obtenerEqTecnicosPorCategoriaService(req.params.id_categoria);

        return res.status(200).json({
            success: resultado.success,
            message: resultado.message,
            data: resultado.data,
            total: resultado.total,
            meta: {
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('Error al obtener equipos técnicos:', error);
        return res.status(400).json({
            success: false,
            message: error.message,
            code: 'GET_ERROR'
        });
    }
};

/**
 * GET /api/eqtecnicos/club/:id_club
 */
const obtenerPorClub = async (req, res) => {
    try {
        const resultado = await obtenerEqTecnicosPorClubService(req.params.id_club);

        return res.status(200).json({
            success: resultado.success,
            message: resultado.message,
            data: resultado.data,
            total: resultado.total,
            meta: {
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('Error al obtener equipos técnicos:', error);
        return res.status(400).json({
            success: false,
            message: error.message,
            code: 'GET_ERROR'
        });
    }
};

/**
 * GET /api/eqtecnicos/verificar/:id_persona
 */
const verificarEqTecnico = async (req, res) => {
    try {
        const { id_persona } = req.params;
        const { id_club, id_categoria } = req.query;

        if (!id_persona || !id_club || !id_categoria) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere ID de Persona, ID de Club y ID de Categoría',
                code: 'MISSING_FIELDS'
            });
        }

        // Verificar si la persona es equipo técnico
        const resultado = await esEqTecnicoService(id_persona);

        return res.status(200).json({
            success: resultado.success,
            message: resultado.message,
            data: {
                ...resultado.data,
                id_persona: parseInt(id_persona),
                id_club: parseInt(id_club),
                id_categoria: parseInt(id_categoria)
            },
            meta: {
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('Error al verificar equipo técnico:', error);
        return res.status(400).json({
            success: false,
            message: error.message,
            code: 'VERIFICATION_ERROR'
        });
    }
};

/**
 * GET /api/eqtecnicos/:id/completo
 */
const obtenerCompleto = async (req, res) => {
    try {
        const resultado = await obtenerEqTecnicoCompletoService(req.params.id);

        if (!resultado.success) {
            return res.status(404).json(resultado);
        }

        return res.status(200).json({
            success: resultado.success,
            message: resultado.message,
            data: resultado.data,
            meta: {
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('Error al obtener equipo técnico:', error);
        return res.status(400).json({
            success: false,
            message: error.message,
            code: 'GET_ERROR'
        });
    }
};

/**
 * GET /api/eqtecnicos/:id
 */
const obtenerPorId = async (req, res) => {
    try {
        const resultado = await obtenerEqTecnicoPorIdService(req.params.id);

        if (!resultado.success) {
            return res.status(404).json(resultado);
        }

        return res.status(200).json({
            success: resultado.success,
            message: resultado.message,
            data: resultado.data,
            meta: {
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('Error al obtener equipo técnico:', error);
        return res.status(400).json({
            success: false,
            message: error.message,
            code: 'GET_ERROR'
        });
    }
};

// ============================================
// UPDATE
// ============================================

/**
 * PUT /api/eqtecnicos/:id
 */
const actualizar = async (req, res) => {
    try {
        const data = req.body;

        // Validar que la fecha 'hasta' sea posterior a 'desde' si se actualizan ambas
        if (data.desde && data.hasta) {
            const fechaDesde = new Date(data.desde);
            const fechaHasta = new Date(data.hasta);

            if (fechaHasta <= fechaDesde) {
                return res.status(400).json({
                    success: false,
                    message: 'La fecha "hasta" debe ser posterior a la fecha "desde"',
                    code: 'DATE_VALIDATION_ERROR'
                });
            }
        }

        const resultado = await actualizarEqTecnicoService(req.params.id, data);

        if (!resultado.success) {
            return res.status(400).json(resultado);
        }

        return res.status(200).json({
            success: resultado.success,
            message: resultado.message,
            data: resultado.data,
            meta: {
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('Error al actualizar Equipo Técnico:', error);
        return res.status(400).json({
            success: false,
            message: error.message,
            code: 'UPDATE_ERROR'
        });
    }
};

// ============================================
// DELETE
// ============================================

/**
 * DELETE /api/eqtecnicos/:id
 */
const eliminar = async (req, res) => {
    try {
        const resultado = await eliminarEqTecnicoService(req.params.id);

        if (!resultado.success) {
            return res.status(404).json(resultado);
        }

        return res.status(200).json({
            success: resultado.success,
            message: resultado.message,
            data: resultado.data,
            meta: {
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('Error al eliminar Equipo Técnico:', error);
        return res.status(400).json({
            success: false,
            message: error.message,
            code: 'DELETE_ERROR'
        });
    }
};

module.exports = {
    crearEqTecnico,
    obtenerEqTecnicos,
    obtenerTodosLosEqTecnicos,
    obtenerEqTecnicosActuales,
    obtenerPersonasDisponibles,
    contarPorClub,
    verificarDisponibilidad,
    obtenerEqTecnicosClubCategoria,
    obtenerPorPersona,
    obtenerPorCategoria,
    obtenerPorClub,
    verificarEqTecnico,
    obtenerCompleto,
    obtenerPorId,
    actualizar,
    eliminar
};