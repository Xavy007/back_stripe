const { Grupo, CampeonatoCategoria, Campeonato, Categoria, GrupoInscripcion, Inscripcion, Equipo, Partido, Jornada } = require('../models');

// ============================================
// CREATE - Crear un nuevo grupo
// ============================================
const crearGrupo = async (data) => {
    return await Grupo.create(data);
};

// ============================================
// READ - Obtener todos los grupos activos
// ============================================
const obtenerGrupos = async () => {
    return await Grupo.findAll({
        where: { estado: true },
        include: [
            {
                model: CampeonatoCategoria,
                as: 'campeonatoCategoria',
                include: [
                    { model: Campeonato, as: 'campeonato' },
                    { model: Categoria, as: 'categoria' }
                ]
            }
        ],
        order: [['orden', 'ASC']]
    });
};

// ============================================
// READ - Obtener TODOS los grupos (incluyendo inactivos)
// ============================================
const obtenerTodosLosGrupos = async () => {
    return await Grupo.findAll({
        include: [
            {
                model: CampeonatoCategoria,
                as: 'campeonatoCategoria',
                include: [
                    { model: Campeonato, as: 'campeonato' },
                    { model: Categoria, as: 'categoria' }
                ]
            }
        ],
        order: [['orden', 'ASC']]
    });
};

// ============================================
// READ - Obtener un grupo por ID
// ============================================
const obtenerGrupoPorId = async (id_grupo) => {
    return await Grupo.findByPk(id_grupo, {
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
                    {
                        model: Inscripcion,
                        as: 'inscripcion',
                        include: [
                            { model: Equipo, as: 'equipo' }
                        ]
                    }
                ]
            },
            {
                model: Partido,
                as: 'partidos'
            },
            {
                model: Jornada,
                as: 'jornadas'
            }
        ]
    });
};

// ============================================
// READ - Obtener grupos por CampeonatoCategoria
// ============================================
const obtenerGruposPorCampeonatoCategoria = async (id_cc) => {
    return await Grupo.findAll({
        where: {
            id_cc,
            estado: true
        },
        include: [
            {
                model: GrupoInscripcion,
                as: 'grupoInscripciones',
                include: [
                    {
                        model: Inscripcion,
                        as: 'inscripcion',
                        include: [
                            { model: Equipo, as: 'equipo' }
                        ]
                    }
                ]
            }
        ],
        order: [['orden', 'ASC']]
    });
};

// ============================================
// READ - Obtener grupo por clave
// ============================================
const obtenerGrupoPorClave = async (id_cc, clave) => {
    return await Grupo.findOne({
        where: {
            id_cc,
            clave,
            estado: true
        },
        include: [
            {
                model: GrupoInscripcion,
                as: 'grupoInscripciones',
                include: [
                    {
                        model: Inscripcion,
                        as: 'inscripcion',
                        include: [
                            { model: Equipo, as: 'equipo' }
                        ]
                    }
                ]
            }
        ]
    });
};

// ============================================
// UPDATE - Actualizar un grupo
// ============================================
const actualizarGrupo = async (id_grupo, data) => {
    const grupo = await Grupo.findByPk(id_grupo);
    if (!grupo) {
        return null;
    }
    return await grupo.update(data);
};

// ============================================
// DELETE - Eliminar (soft delete) un grupo
// ============================================
const eliminarGrupo = async (id_grupo) => {
    const grupo = await Grupo.findByPk(id_grupo);
    if (!grupo) {
        return null;
    }
    return await grupo.update({ estado: false });
};

// ============================================
// BONUS - Obtener grupo con relaciones completas
// ============================================
const obtenerGrupoConRelaciones = async (id_grupo) => {
    return await Grupo.findByPk(id_grupo, {
        include: [
            {
                model: CampeonatoCategoria,
                as: 'campeonatoCategoria',
                include: [
                    {
                        model: Campeonato,
                        as: 'campeonato',
                        attributes: ['id_campeonato', 'nombre', 'tipo', 'c_estado']
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
                        model: Inscripcion,
                        as: 'inscripcion',
                        include: [
                            {
                                model: Equipo,
                                as: 'equipo',
                                attributes: ['id_equipo', 'nombre', 'id_club', 'id_categoria']
                            }
                        ]
                    }
                ]
            },
            {
                model: Partido,
                as: 'partidos',
                where: { estado: true },
                required: false
            },
            {
                model: Jornada,
                as: 'jornadas',
                where: { estado: true },
                required: false,
                order: [['numero', 'ASC']]
            }
        ]
    });
};

module.exports = {
    crearGrupo,
    obtenerGrupos,
    obtenerTodosLosGrupos,
    obtenerGrupoPorId,
    obtenerGruposPorCampeonatoCategoria,
    obtenerGrupoPorClave,
    actualizarGrupo,
    eliminarGrupo,
    obtenerGrupoConRelaciones
};
