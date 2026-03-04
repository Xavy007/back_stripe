const { Inscripcion, CampeonatoCategoria, Campeonato, Categoria, Equipo, Club, GrupoInscripcion, Grupo } = require('../models');

// ============================================
// CREATE - Crear una nueva inscripción
// ============================================
const crearInscripcion = async (data) => {
    return await Inscripcion.create(data);
};

// ============================================
// READ - Obtener todas las inscripciones activas
// ============================================
const obtenerInscripciones = async () => {
    return await Inscripcion.findAll({
        where: { estado: true },
        include: [
            {
                model: CampeonatoCategoria,
                as: 'campeonatoCategoria',
                include: [
                    { model: Campeonato, as: 'campeonato' },
                    { model: Categoria, as: 'categoria' }
                ]
            },
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' },
                    { model: Categoria, as: 'categoria' }
                ]
            }
        ],
        order: [['fecha_inscripcion', 'DESC']]
    });
};

// ============================================
// READ - Obtener TODAS las inscripciones (incluyendo inactivas)
// ============================================
const obtenerTodasLasInscripciones = async () => {
    return await Inscripcion.findAll({
        include: [
            {
                model: CampeonatoCategoria,
                as: 'campeonatoCategoria',
                include: [
                    { model: Campeonato, as: 'campeonato' },
                    { model: Categoria, as: 'categoria' }
                ]
            },
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' },
                    { model: Categoria, as: 'categoria' }
                ]
            }
        ],
        order: [['fecha_inscripcion', 'DESC']]
    });
};

// ============================================
// READ - Obtener una inscripción por ID
// ============================================
const obtenerInscripcionPorId = async (id_inscripcion) => {
    return await Inscripcion.findByPk(id_inscripcion, {
        include: [
            {
                model: CampeonatoCategoria,
                as: 'campeonatoCategoria',
                include: [
                    { model: Campeonato, as: 'campeonato' },
                    { model: Categoria, as: 'categoria' }
                ]
            },
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' },
                    { model: Categoria, as: 'categoria' }
                ]
            },
            {
                model: GrupoInscripcion,
                as: 'grupoInscripciones',
                include: [
                    { model: Grupo, as: 'grupo' }
                ]
            }
        ]
    });
};

// ============================================
// READ - Obtener inscripciones por CampeonatoCategoria
// ============================================
const obtenerInscripcionesPorCampeonatoCategoria = async (id_cc) => {
    return await Inscripcion.findAll({
        where: {
            id_cc,
            estado: true
        },
        include: [
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' }
                ]
            }
        ],
        order: [['fecha_inscripcion', 'ASC']]
    });
};

// ============================================
// READ - Obtener inscripciones por Equipo
// ============================================
const obtenerInscripcionesPorEquipo = async (id_equipo) => {
    return await Inscripcion.findAll({
        where: {
            id_equipo,
            estado: true
        },
        include: [
            {
                model: CampeonatoCategoria,
                as: 'campeonatoCategoria',
                include: [
                    { model: Campeonato, as: 'campeonato' },
                    { model: Categoria, as: 'categoria' }
                ]
            },
            {
                model: GrupoInscripcion,
                as: 'grupoInscripciones',
                include: [
                    { model: Grupo, as: 'grupo' }
                ]
            }
        ],
        order: [['fecha_inscripcion', 'DESC']]
    });
};

// ============================================
// READ - Obtener inscripciones por Grupo
// ============================================
const obtenerInscripcionesPorGrupo = async (grupo) => {
    return await Inscripcion.findAll({
        where: {
            grupo,
            estado: true
        },
        include: [
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' }
                ]
            },
            {
                model: CampeonatoCategoria,
                as: 'campeonatoCategoria',
                include: [
                    { model: Campeonato, as: 'campeonato' },
                    { model: Categoria, as: 'categoria' }
                ]
            }
        ],
        order: [['posicion_final', 'ASC']]
    });
};

// ============================================
// READ - Verificar si equipo ya está inscrito
// ============================================
const verificarInscripcionExistente = async (id_cc, id_equipo) => {
    return await Inscripcion.findOne({
        where: {
            id_cc,
            id_equipo,
            estado: true
        }
    });
};

// ============================================
// UPDATE - Actualizar una inscripción
// ============================================
const actualizarInscripcion = async (id_inscripcion, data) => {
    const inscripcion = await Inscripcion.findByPk(id_inscripcion);
    if (!inscripcion) {
        return null;
    }
    return await inscripcion.update(data);
};

// ============================================
// DELETE - Eliminar (soft delete) una inscripción
// ============================================
const eliminarInscripcion = async (id_inscripcion) => {
    const inscripcion = await Inscripcion.findByPk(id_inscripcion);
    if (!inscripcion) {
        return null;
    }
    return await inscripcion.update({ estado: false });
};

// ============================================
// BONUS - Obtener inscripción con relaciones completas
// ============================================
const obtenerInscripcionConRelaciones = async (id_inscripcion) => {
    return await Inscripcion.findByPk(id_inscripcion, {
        include: [
            {
                model: CampeonatoCategoria,
                as: 'campeonatoCategoria',
                include: [
                    {
                        model: Campeonato,
                        as: 'campeonato',
                        attributes: ['id_campeonato', 'nombre', 'tipo', 'c_estado', 'fecha_inicio', 'fecha_fin']
                    },
                    {
                        model: Categoria,
                        as: 'categoria',
                        attributes: ['id_categoria', 'nombre', 'genero', 'edad_minima', 'edad_maxima']
                    }
                ]
            },
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    {
                        model: Club,
                        as: 'club',
                        attributes: ['id_club', 'nombre', 'acronimo', 'logo']
                    },
                    {
                        model: Categoria,
                        as: 'categoria',
                        attributes: ['id_categoria', 'nombre', 'genero']
                    }
                ]
            },
            {
                model: GrupoInscripcion,
                as: 'grupoInscripciones',
                where: { estado: true },
                required: false,
                include: [
                    {
                        model: Grupo,
                        as: 'grupo',
                        attributes: ['id_grupo', 'clave', 'nombre']
                    }
                ]
            }
        ]
    });
};

module.exports = {
    crearInscripcion,
    obtenerInscripciones,
    obtenerTodasLasInscripciones,
    obtenerInscripcionPorId,
    obtenerInscripcionesPorCampeonatoCategoria,
    obtenerInscripcionesPorEquipo,
    obtenerInscripcionesPorGrupo,
    verificarInscripcionExistente,
    actualizarInscripcion,
    eliminarInscripcion,
    obtenerInscripcionConRelaciones
};
