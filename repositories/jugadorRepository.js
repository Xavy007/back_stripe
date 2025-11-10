/**
 * repositories/jugadorRepository.js
 * 
 * Repositorio para operaciones de base de datos con jugadores
 * Corrigido con alias correctos de Sequelize
 */

const { Jugador, Persona, Club, Direccion, sequelize } = require('../models');
const { Op } = require('sequelize');

// ============================================
// CREATE
// ============================================

const crearJugador = async (data, transaction = null) => {
    try {
        const jugador = await Jugador.create(data, { transaction });
        return jugador;
    } catch (error) {
        throw new Error(`Error al crear jugador: ${error.message}`);
    }
};

// ============================================
// READ - Sin includes (sin club)
// ============================================

const obtenerJugadores = async (filtros = {}) => {
    try {
        const where = { estado: true };

        // Filtros adicionales
        if (filtros.id_club) {
            where.id_club = filtros.id_club;
        }

        const jugadores = await Jugador.findAll({
            where,
            include: [
                {
                    model: Persona,
                    attributes: ['id_persona', 'nombre', 'ap', 'am', 'ci', 'fnac', 'genero'],
                    required: false
                },
                {
                    model: Club,
                    attributes: ['id_club', 'nombre'],
                    required: false
                },
                {
                    model: Direccion,
                    attributes: ['id_direccion', 'calle', 'numero', 'localidad', 'provincia', 'pais'],
                    required: false
                }
            ],
            attributes: ['id_jugador', 'id_persona', 'id_club', 'estatura', 'estado', 'freg']
        });

        return {
            success: true,
            message: `${jugadores.length} jugadores encontrados`,
            data: jugadores,
            total: jugadores.length
        };
    } catch (error) {
        throw new Error(`Error al obtener jugadores: ${error.message}`);
    }
};

// ============================================
// READ - Todos los jugadores (incluyendo inactivos)
// ============================================

const obtenerTodosLosJugadores = async () => {
    try {
        const jugadores = await Jugador.findAll({
            include: [
                {
                    model: Persona,
                    attributes: ['id_persona', 'nombre', 'ap', 'am', 'ci'],
                    required: false
                },
                {
                    model: Club,
                    attributes: ['id_club', 'nombre'],
                    required: false
                }
            ],
            attributes: ['id_jugador', 'id_persona', 'id_club', 'estatura', 'estado', 'freg']
        });

        return {
            success: true,
            message: `${jugadores.length} jugadores encontrados (incluidos inactivos)`,
            data: jugadores,
            total: jugadores.length
        };
    } catch (error) {
        throw new Error(`Error al obtener jugadores: ${error.message}`);
    }
};

// ============================================
// READ - Obtener jugador por ID
// ============================================

const obtenerJugadorPorId = async (id_jugador) => {
    try {
        const jugador = await Jugador.findByPk(id_jugador, {
            include: [
                {
                    model: Persona,
                    attributes: ['id_persona', 'nombre', 'ap', 'am', 'ci', 'fnac', 'genero'],
                    required: false
                },
                {
                    model: Club,
                    attributes: ['id_club', 'nombre'],
                    required: false
                },
                {
                    model: Direccion,
                    attributes: ['id_direccion', 'calle', 'numero', 'piso', 'departamento', 'localidad', 'provincia', 'codigo_postal', 'pais', 'telefono', 'celular', 'correo'],
                    required: false
                }
            ],
            attributes: ['id_jugador', 'id_persona', 'id_club', 'estatura', 'estado', 'freg']
        });

        if (!jugador) {
            throw new Error('El jugador no existe');
        }

        return {
            success: true,
            data: jugador
        };
    } catch (error) {
        throw new Error(`Error al obtener jugador: ${error.message}`);
    }
};

// ============================================
// READ - Obtener jugador completo con dirección
// ============================================

const obtenerJugadorCompleto = async (id_jugador) => {
    try {
        const jugador = await Jugador.findByPk(id_jugador, {
            include: [
                {
                    model: Persona,
                    attributes: ['id_persona', 'nombre', 'ap', 'am', 'ci', 'fnac', 'genero', 'foto'],
                    required: false
                },
                {
                    model: Club,
                    attributes: ['id_club', 'nombre'],
                    required: false
                },
                {
                    model: Direccion,
                    attributes: ['id_direccion', 'calle', 'numero', 'piso', 'departamento', 'localidad', 'provincia', 'codigo_postal', 'pais', 'telefono', 'celular', 'correo'],
                    required: false
                }
            ]
        });

        if (!jugador) {
            throw new Error('El jugador no existe');
        }

        return jugador;
    } catch (error) {
        throw new Error(`Error al obtener jugador: ${error.message}`);
    }
};

// ============================================
// READ - Obtener jugadores por Club
// ============================================

const obtenerJugadoresPorClub = async (id_club) => {
    try {
        const jugadores = await Jugador.findAll({
            where: {
                id_club: id_club,
                estado: true
            },
            include: [
                {
                    model: Persona,
                    attributes: ['id_persona', 'nombre', 'ap', 'am', 'ci'],
                    required: false
                },
                {
                    model: Club,
                    attributes: ['id_club', 'nombre'],
                    required: false
                },
                {
                    model: Direccion,
                    attributes: ['id_direccion', 'localidad', 'provincia'],
                    required: false
                }
            ],
            attributes: ['id_jugador', 'id_persona', 'id_club', 'estatura', 'estado']
        });

        return jugadores;
    } catch (error) {
        throw new Error(`Error al obtener jugadores por club: ${error.message}`);
    }
};

// ============================================
// READ - Obtener jugadores por nombre
// ============================================

const obtenerJugadoresPorNombre = async (nombre) => {
    try {
        const jugadores = await Jugador.findAll({
            where: { estado: true },
            include: [
                {
                    model: Persona,
                    where: {
                        [Op.or]: [
                            { nombre: { [Op.iLike]: `%${nombre}%` } },
                            { ap: { [Op.iLike]: `%${nombre}%` } },
                            { am: { [Op.iLike]: `%${nombre}%` } }
                        ]
                    },
                    attributes: ['id_persona', 'nombre', 'ap', 'am', 'ci', 'fnac', 'genero'],
                    required: true
                },
                {
                    model: Club,
                    attributes: ['id_club', 'nombre'],
                    required: false
                },
                {
                    model: Direccion,
                    attributes: ['id_direccion', 'localidad', 'provincia'],
                    required: false
                }
            ],
            attributes: ['id_jugador', 'id_persona', 'id_club', 'estatura', 'estado']
        });

        return jugadores;
    } catch (error) {
        throw new Error(`Error al obtener jugadores por nombre: ${error.message}`);
    }
};

// ============================================
// READ - Obtener jugadores por estatura
// ============================================

const obtenerJugadoresPorEstatura = async (estatura_minima, estatura_maxima) => {
    try {
        const jugadores = await Jugador.findAll({
            where: {
                estado: true,
                estatura: {
                    [Op.between]: [estatura_minima, estatura_maxima]
                }
            },
            include: [
                {
                    model: Persona,
                    attributes: ['id_persona', 'nombre', 'ap', 'am', 'ci'],
                    required: false
                },
                {
                    model: Club,
                    attributes: ['id_club', 'nombre'],
                    required: false
                }
            ],
            attributes: ['id_jugador', 'id_persona', 'id_club', 'estatura', 'estado']
        });

        return jugadores;
    } catch (error) {
        throw new Error(`Error al obtener jugadores por estatura: ${error.message}`);
    }
};

// ============================================
// READ - Obtener jugadores por localidad
// ============================================

const obtenerJugadoresPorLocalidad = async (localidad) => {
    try {
        const jugadores = await Jugador.findAll({
            where: { estado: true },
            include: [
                {
                    model: Persona,
                    attributes: ['id_persona', 'nombre', 'ap', 'am', 'ci'],
                    required: false
                },
                {
                    model: Club,
                    attributes: ['id_club', 'nombre'],
                    required: false
                },
                {
                    model: Direccion,
                    where: {
                        localidad: {
                            [Op.iLike]: localidad
                        }
                    },
                    attributes: ['id_direccion', 'calle', 'numero', 'localidad', 'provincia'],
                    required: false
                }
            ],
            attributes: ['id_jugador', 'id_persona', 'id_club', 'estatura', 'estado']
        });

        return jugadores;
    } catch (error) {
        throw new Error(`Error al obtener jugadores por localidad: ${error.message}`);
    }
};

// ============================================
// READ - Obtener jugadores por provincia
// ============================================

const obtenerJugadoresPorProvincia = async (provincia) => {
    try {
        const jugadores = await Jugador.findAll({
            where: { estado: true },
            include: [
                {
                    model: Persona,
                    attributes: ['id_persona', 'nombre', 'ap', 'am', 'ci'],
                    required: false
                },
                {
                    model: Club,
                    attributes: ['id_club', 'nombre'],
                    required: false
                },
                {
                    model: Direccion,
                    where: {
                        provincia: {
                            [Op.iLike]: provincia
                        }
                    },
                    attributes: ['id_direccion', 'calle', 'numero', 'localidad', 'provincia'],
                    required: false
                }
            ],
            attributes: ['id_jugador', 'id_persona', 'id_club', 'estatura', 'estado']
        });

        return jugadores;
    } catch (error) {
        throw new Error(`Error al obtener jugadores por provincia: ${error.message}`);
    }
};

// ============================================
// READ - Obtener dirección del jugador
// ============================================

const obtenerDireccionJugador = async (id_jugador) => {
    try {
        const direccion = await Direccion.findOne({
            where: { id_jugador: id_jugador, estado: true },
            attributes: ['id_direccion', 'calle', 'numero', 'piso', 'departamento', 'localidad', 'provincia', 'codigo_postal', 'pais', 'telefono', 'celular', 'correo']
        });

        if (!direccion) {
            throw new Error('La dirección del jugador no existe');
        }

        return direccion;
    } catch (error) {
        throw new Error(`Error al obtener dirección: ${error.message}`);
    }
};

// ============================================
// READ - Verificar si es jugador
// ============================================

const esJugador = async (id_persona) => {
    try {
        const jugador = await Jugador.findOne({
            where: { id_persona: id_persona }
        });

        return !!jugador;
    } catch (error) {
        throw new Error(`Error al verificar jugador: ${error.message}`);
    }
};

// ============================================
// READ - Obtener jugador por ID de persona
// ============================================

const obtenerJugadorPorIdPersona = async (id_persona) => {
    try {
        const jugador = await Jugador.findOne({
            where: { id_persona: id_persona }
        });

        return jugador;
    } catch (error) {
        throw new Error(`Error al obtener jugador: ${error.message}`);
    }
};

// ============================================
// READ - Obtener personas sin jugador
// ============================================

const obtenerPersonasSinJugador = async () => {
    try {
        const personas = await Persona.findAll({
            where: { estado: true },
            attributes: ['id_persona', 'nombre', 'ap', 'am', 'ci', 'fnac', 'genero', 'estado'],
            include: [
                {
                    model: Jugador,
                    attributes: [],
                    required: false
                }
            ]
        });

        // Filtrar personas que no tengan jugador
        const personasSinJugador = personas.filter(p => !p.Jugador);

        return personasSinJugador;
    } catch (error) {
        throw new Error(`Error al obtener personas sin jugador: ${error.message}`);
    }
};

// ============================================
// UPDATE
// ============================================

const actualizarJugador = async (id_jugador, data) => {
    try {
        const jugador = await Jugador.findByPk(id_jugador);

        if (!jugador) {
            throw new Error('El jugador no existe');
        }

        await jugador.update(data);

        // Retornar jugador actualizado con includes
        const jugadorActualizado = await Jugador.findByPk(id_jugador, {
            include: [
                {
                    model: Persona,
                    attributes: ['id_persona', 'nombre', 'ap', 'am', 'ci'],
                    required: false
                },
                {
                    model: Club,
                    attributes: ['id_club', 'nombre'],
                    required: false
                }
            ]
        });

        return jugadorActualizado;
    } catch (error) {
        throw new Error(`Error al actualizar jugador: ${error.message}`);
    }
};

// ============================================
// UPDATE - Actualizar dirección
// ============================================

const actualizarDireccionJugador = async (id_jugador, data) => {
    try {
        let direccion = await Direccion.findOne({
            where: { id_jugador: id_jugador, estado: true }
        });

        if (!direccion) {
            // Si no existe, crear una nueva
            data.id_jugador = id_jugador;
            data.estado = true;
            direccion = await Direccion.create(data);
        } else {
            // Si existe, actualizar
            await direccion.update(data);
        }

        return direccion;
    } catch (error) {
        throw new Error(`Error al actualizar dirección: ${error.message}`);
    }
};

// ============================================
// DELETE - Soft delete
// ============================================

const eliminarJugador = async (id_jugador) => {
    try {
        const jugador = await Jugador.findByPk(id_jugador);

        if (!jugador) {
            throw new Error('El jugador no existe');
        }

        await jugador.update({ estado: false });

        // Opcional: también marcar la dirección como inactiva
        await Direccion.update(
            { estado: false },
            { where: { id_jugador: id_jugador } }
        );

        return jugador;
    } catch (error) {
        throw new Error(`Error al eliminar jugador: ${error.message}`);
    }
};

module.exports = {
    crearJugador,
    obtenerJugadores,
    obtenerTodosLosJugadores,
    obtenerJugadorPorId,
    obtenerJugadorCompleto,
    obtenerJugadoresPorClub,
    obtenerJugadoresPorNombre,
    obtenerJugadoresPorEstatura,
    obtenerJugadoresPorLocalidad,
    obtenerJugadoresPorProvincia,
    obtenerDireccionJugador,
    esJugador,
    obtenerJugadorPorIdPersona,
    obtenerPersonasSinJugador,
    actualizarJugador,
    actualizarDireccionJugador,
    eliminarJugador
};