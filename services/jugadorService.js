/**
 * repositories/jugadorRepository.js
 * 
 * VERSIÓN ULTRA SIMPLIFICADA - Sin includes en absoluto
 * Evita todos los errores de Sequelize
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
// READ - Obtener todos los jugadores
// ============================================

const obtenerJugadores = async (filtros = {}) => {
    try {
        const where = { estado: true };

        if (filtros.id_club) {
            where.id_club = parseInt(filtros.id_club);
        }

        // Query SUPER simple - sin includes
        const jugadores = await Jugador.findAll({
            where,
            order: [['id_jugador', 'DESC']],
            raw: true
        });

        return {
            success: true,
            message: `${jugadores.length} jugadores encontrados`,
            data: jugadores,
            total: jugadores.length
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Obtener todos los jugadores (incluyendo inactivos)
// ============================================

const obtenerTodosLosJugadores = async () => {
    try {
        const jugadores = await Jugador.findAll({
            order: [['id_jugador', 'DESC']],
            raw: true
        });

        return {
            success: true,
            message: `${jugadores.length} jugadores encontrados`,
            data: jugadores,
            total: jugadores.length
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Obtener jugador por ID
// ============================================

const obtenerJugadorPorId = async (id_jugador) => {
    try {
        const jugador = await Jugador.findByPk(id_jugador, {
            raw: true
        });

        if (!jugador) {
            throw new Error('El jugador no existe');
        }

        return {
            success: true,
            data: jugador
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Obtener jugador completo
// ============================================

const obtenerJugadorCompleto = async (id_jugador) => {
    try {
        const jugador = await Jugador.findByPk(id_jugador, {
            raw: true
        });

        if (!jugador) {
            throw new Error('El jugador no existe');
        }

        // Obtener datos relacionados por separado
        const persona = await Persona.findByPk(jugador.id_persona, {
            attributes: ['id_persona', 'nombre', 'ap', 'am', 'ci', 'fnac', 'genero', 'foto'],
            raw: true
        });

        const club = await Club.findByPk(jugador.id_club, {
            attributes: ['id_club', 'nombre'],
            raw: true
        });

        const direccion = await Direccion.findOne({
            where: { id_jugador: id_jugador, estado: true },
            attributes: ['id_direccion', 'calle', 'numero', 'piso', 'departamento', 'localidad', 'provincia', 'codigo_postal', 'pais', 'telefono', 'celular', 'correo'],
            raw: true
        });

        return {
            ...jugador,
            Persona: persona,
            Club: club,
            Direccion: direccion
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Obtener jugadores por Club
// ============================================

const obtenerJugadoresPorClub = async (id_club) => {
    try {
        const jugadores = await Jugador.findAll({
            where: {
                id_club: parseInt(id_club),
                estado: true
            },
            raw: true
        });

        return jugadores;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Obtener jugadores por nombre
// ============================================

const obtenerJugadoresPorNombre = async (nombre) => {
    try {
        // Buscar personas por nombre
        const personas = await Persona.findAll({
            where: {
                [Op.or]: [
                    { nombre: { [Op.iLike]: `%${nombre}%` } },
                    { ap: { [Op.iLike]: `%${nombre}%` } },
                    { am: { [Op.iLike]: `%${nombre}%` } }
                ]
            },
            attributes: ['id_persona'],
            raw: true
        });

        if (personas.length === 0) {
            return [];
        }

        const personaIds = personas.map(p => p.id_persona);

        // Obtener jugadores de esas personas
        const jugadores = await Jugador.findAll({
            where: {
                id_persona: { [Op.in]: personaIds },
                estado: true
            },
            raw: true
        });

        return jugadores;
    } catch (error) {
        throw new Error(error.message);
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
            raw: true
        });

        return jugadores;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Obtener jugadores por localidad
// ============================================

const obtenerJugadoresPorLocalidad = async (localidad) => {
    try {
        // Buscar direcciones
        const direcciones = await Direccion.findAll({
            where: {
                localidad: { [Op.iLike]: localidad },
                estado: true
            },
            attributes: ['id_jugador'],
            raw: true
        });

        if (direcciones.length === 0) {
            return [];
        }

        const jugadorIds = direcciones.map(d => d.id_jugador);

        // Obtener jugadores
        const jugadores = await Jugador.findAll({
            where: {
                id_jugador: { [Op.in]: jugadorIds },
                estado: true
            },
            raw: true
        });

        return jugadores;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Obtener jugadores por provincia
// ============================================

const obtenerJugadoresPorProvincia = async (provincia) => {
    try {
        // Buscar direcciones
        const direcciones = await Direccion.findAll({
            where: {
                provincia: { [Op.iLike]: provincia },
                estado: true
            },
            attributes: ['id_jugador'],
            raw: true
        });

        if (direcciones.length === 0) {
            return [];
        }

        const jugadorIds = direcciones.map(d => d.id_jugador);

        // Obtener jugadores
        const jugadores = await Jugador.findAll({
            where: {
                id_jugador: { [Op.in]: jugadorIds },
                estado: true
            },
            raw: true
        });

        return jugadores;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Obtener dirección del jugador
// ============================================

const obtenerDireccionJugador = async (id_jugador) => {
    try {
        const direccion = await Direccion.findOne({
            where: { id_jugador: id_jugador, estado: true },
            attributes: ['id_direccion', 'calle', 'numero', 'piso', 'departamento', 'localidad', 'provincia', 'codigo_postal', 'pais', 'telefono', 'celular', 'correo'],
            raw: true
        });

        if (!direccion) {
            throw new Error('La dirección del jugador no existe');
        }

        return direccion;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Verificar si es jugador
// ============================================

const esJugador = async (id_persona) => {
    try {
        const jugador = await Jugador.findOne({
            where: { id_persona: id_persona },
            raw: true
        });

        return !!jugador;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Obtener jugador por ID de persona
// ============================================

const obtenerJugadorPorIdPersona = async (id_persona) => {
    try {
        const jugador = await Jugador.findOne({
            where: { id_persona: id_persona },
            raw: true
        });

        return jugador;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Obtener personas sin jugador
// ============================================

const obtenerPersonasSinJugador = async () => {
    try {
        // Obtener todas las personas
        const personas = await Persona.findAll({
            where: { estado: true },
            attributes: ['id_persona', 'nombre', 'ap', 'am', 'ci', 'fnac', 'genero', 'estado'],
            raw: true
        });

        // Obtener ids de personas que son jugadores
        const jugadores = await Jugador.findAll({
            attributes: ['id_persona'],
            raw: true
        });

        const jugadorIds = jugadores.map(j => j.id_persona);

        // Filtrar personas que no son jugadores
        const personasSinJugador = personas.filter(p => !jugadorIds.includes(p.id_persona));

        return personasSinJugador;
    } catch (error) {
        throw new Error(error.message);
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

        return jugador.toJSON();
    } catch (error) {
        throw new Error(error.message);
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

        return direccion.toJSON();
    } catch (error) {
        throw new Error(error.message);
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

        // Marcar dirección como inactiva
        await Direccion.update(
            { estado: false },
            { where: { id_jugador: id_jugador } }
        );

        return jugador.toJSON();
    } catch (error) {
        throw new Error(error.message);
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