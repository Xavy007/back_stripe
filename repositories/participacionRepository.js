const { Participacion, Jugador, Persona, Equipo, Club, Campeonato, Categoria, CampeonatoCategoria } = require('../models');

// ============================================
// CREATE - Crear una nueva participación
// ============================================
const crearParticipacion = async (data) => {
    return await Participacion.create(data);
};

// ============================================
// READ - Obtener todas las participaciones activas
// ============================================
const obtenerParticipaciones = async () => {
    return await Participacion.findAll({
        where: { estado: 'activo' },
        include: [
            {
                model: Jugador,
                as: 'jugador',
                include: [
                    { model: Persona, as: 'persona' }
                ]
            },
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' }
                ]
            },
            {
                model: Campeonato,
                as: 'campeonato'
            },
            {
                model: Categoria,
                as: 'categoria'
            }
        ],
        order: [['fecha_inscripcion', 'DESC']]
    });
};

// ============================================
// READ - Obtener TODAS las participaciones (todos los estados)
// ============================================
const obtenerTodasLasParticipaciones = async () => {
    return await Participacion.findAll({
        include: [
            {
                model: Jugador,
                as: 'jugador',
                include: [
                    { model: Persona, as: 'persona' }
                ]
            },
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' }
                ]
            },
            {
                model: Campeonato,
                as: 'campeonato'
            },
            {
                model: Categoria,
                as: 'categoria'
            }
        ],
        order: [['fecha_inscripcion', 'DESC']]
    });
};

// ============================================
// READ - Obtener una participación por ID
// ============================================
const obtenerParticipacionPorId = async (id_participacion) => {
    return await Participacion.findByPk(id_participacion, {
        include: [
            {
                model: Jugador,
                as: 'jugador',
                include: [
                    { model: Persona, as: 'persona' }
                ]
            },
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' }
                ]
            },
            {
                model: Campeonato,
                as: 'campeonato'
            },
            {
                model: Categoria,
                as: 'categoria'
            },
            {
                model: CampeonatoCategoria,
                as: 'campeonatoCategoria'
            }
        ]
    });
};

// ============================================
// READ - Obtener participaciones por Jugador
// ============================================
const obtenerParticipacionesPorJugador = async (id_jugador) => {
    return await Participacion.findAll({
        where: { id_jugador },
        include: [
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' }
                ]
            },
            {
                model: Campeonato,
                as: 'campeonato'
            },
            {
                model: Categoria,
                as: 'categoria'
            }
        ],
        order: [['fecha_inscripcion', 'DESC']]
    });
};

// ============================================
// READ - Obtener participaciones por Equipo
// ============================================
const obtenerParticipacionesPorEquipo = async (id_equipo) => {
    return await Participacion.findAll({
        where: { id_equipo },
        include: [
            {
                model: Jugador,
                as: 'jugador',
                include: [
                    { model: Persona, as: 'persona' }
                ]
            },
            {
                model: Campeonato,
                as: 'campeonato'
            },
            {
                model: Categoria,
                as: 'categoria'
            }
        ],
        order: [['dorsal', 'ASC']]
    });
};

// ============================================
// READ - Obtener participaciones por Campeonato
// ============================================
const obtenerParticipacionesPorCampeonato = async (id_campeonato) => {
    return await Participacion.findAll({
        where: { id_campeonato },
        include: [
            {
                model: Jugador,
                as: 'jugador',
                include: [
                    { model: Persona, as: 'persona' }
                ]
            },
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' }
                ]
            },
            {
                model: Categoria,
                as: 'categoria'
            }
        ],
        order: [['fecha_inscripcion', 'DESC']]
    });
};

// ============================================
// READ - Obtener participaciones por CampeonatoCategoria
// ============================================
const obtenerParticipacionesPorCampeonatoCategoria = async (id_cc) => {
    return await Participacion.findAll({
        where: { id_cc },
        include: [
            {
                model: Jugador,
                as: 'jugador',
                include: [
                    { model: Persona, as: 'persona' }
                ]
            },
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' }
                ]
            }
        ],
        order: [['dorsal', 'ASC']]
    });
};

// ============================================
// READ - Obtener participaciones por estado
// ============================================
const obtenerParticipacionesPorEstado = async (estado) => {
    return await Participacion.findAll({
        where: { estado },
        include: [
            {
                model: Jugador,
                as: 'jugador',
                include: [
                    { model: Persona, as: 'persona' }
                ]
            },
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' }
                ]
            },
            {
                model: Campeonato,
                as: 'campeonato'
            },
            {
                model: Categoria,
                as: 'categoria'
            }
        ],
        order: [['fecha_inscripcion', 'DESC']]
    });
};

// ============================================
// UPDATE - Actualizar una participación
// ============================================
const actualizarParticipacion = async (id_participacion, data) => {
    const participacion = await Participacion.findByPk(id_participacion);
    if (!participacion) {
        return null;
    }
    return await participacion.update(data);
};

// ============================================
// DELETE - No hay soft delete, se cambia el estado
// ============================================
const cambiarEstadoParticipacion = async (id_participacion, estado) => {
    const participacion = await Participacion.findByPk(id_participacion);
    if (!participacion) {
        return null;
    }
    return await participacion.update({ estado });
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
