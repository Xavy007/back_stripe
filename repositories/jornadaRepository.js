const { Jornada, Fase, Grupo, Partido, CampeonatoCategoria, Campeonato, Categoria } = require('../models');

// ============================================
// CREATE - Crear una nueva jornada
// ============================================
const crearJornada = async (data) => {
    return await Jornada.create(data);
};

// ============================================
// READ - Obtener todas las jornadas activas
// ============================================
const obtenerJornadas = async () => {
    return await Jornada.findAll({
        where: { estado: true },
        include: [
            {
                model: Fase,
                as: 'fase',
                include: [
                    {
                        model: CampeonatoCategoria,
                        as: 'campeonatoCategoria',
                        include: [
                            { model: Campeonato, as: 'campeonato' },
                            { model: Categoria, as: 'categoria' }
                        ]
                    }
                ]
            },
            {
                model: Grupo,
                as: 'grupo'
            }
        ],
        order: [['numero', 'ASC']]
    });
};

// ============================================
// READ - Obtener TODAS las jornadas (incluyendo inactivas)
// ============================================
const obtenerTodasLasJornadas = async () => {
    return await Jornada.findAll({
        include: [
            {
                model: Fase,
                as: 'fase',
                include: [
                    {
                        model: CampeonatoCategoria,
                        as: 'campeonatoCategoria',
                        include: [
                            { model: Campeonato, as: 'campeonato' },
                            { model: Categoria, as: 'categoria' }
                        ]
                    }
                ]
            },
            {
                model: Grupo,
                as: 'grupo'
            }
        ],
        order: [['numero', 'ASC']]
    });
};

// ============================================
// READ - Obtener una jornada por ID
// ============================================
const obtenerJornadaPorId = async (id_jornada) => {
    return await Jornada.findByPk(id_jornada, {
        include: [
            {
                model: Fase,
                as: 'fase',
                include: [
                    {
                        model: CampeonatoCategoria,
                        as: 'campeonatoCategoria',
                        include: [
                            { model: Campeonato, as: 'campeonato' },
                            { model: Categoria, as: 'categoria' }
                        ]
                    }
                ]
            },
            {
                model: Grupo,
                as: 'grupo'
            },
            {
                model: Partido,
                as: 'partidos'
            }
        ]
    });
};

// ============================================
// READ - Obtener jornadas por Fase
// ============================================
const obtenerJornadasPorFase = async (id_fase) => {
    return await Jornada.findAll({
        where: {
            id_fase,
            estado: true
        },
        include: [
            {
                model: Grupo,
                as: 'grupo'
            },
            {
                model: Partido,
                as: 'partidos'
            }
        ],
        order: [['numero', 'ASC']]
    });
};

// ============================================
// READ - Obtener jornadas por Grupo
// ============================================
const obtenerJornadasPorGrupo = async (id_grupo) => {
    return await Jornada.findAll({
        where: {
            id_grupo,
            estado: true
        },
        include: [
            {
                model: Fase,
                as: 'fase'
            },
            {
                model: Partido,
                as: 'partidos'
            }
        ],
        order: [['numero', 'ASC']]
    });
};

// ============================================
// READ - Obtener jornadas por CampeonatoCategoria (id_cc)
// ============================================
const obtenerJornadasPorCampeonatoCategoria = async (id_cc) => {
    // Las jornadas se relacionan con id_cc a través de los Partidos
    return await Jornada.findAll({
        where: { estado: true },
        include: [
            {
                model: Partido,
                as: 'partidos',
                where: { id_cc, estado: true },
                required: true,
                attributes: ['id_partido']
            },
            {
                model: Grupo,
                as: 'grupo',
                required: false,
                attributes: ['id_grupo', 'clave', 'nombre']
            }
        ],
        order: [['numero', 'ASC']]
    });
};

// ============================================
// READ - Obtener jornadas por estado (j_estado)
// ============================================
const obtenerJornadasPorEstado = async (j_estado) => {
    return await Jornada.findAll({
        where: {
            j_estado,
            estado: true
        },
        include: [
            {
                model: Fase,
                as: 'fase',
                include: [
                    {
                        model: CampeonatoCategoria,
                        as: 'campeonatoCategoria',
                        include: [
                            { model: Campeonato, as: 'campeonato' },
                            { model: Categoria, as: 'categoria' }
                        ]
                    }
                ]
            },
            {
                model: Grupo,
                as: 'grupo'
            }
        ],
        order: [['fecha', 'ASC']]
    });
};

// ============================================
// UPDATE - Actualizar una jornada
// ============================================
const actualizarJornada = async (id_jornada, data) => {
    const jornada = await Jornada.findByPk(id_jornada);
    if (!jornada) {
        return null;
    }
    return await jornada.update(data);
};

// ============================================
// DELETE - Eliminar (soft delete) una jornada
// ============================================
const eliminarJornada = async (id_jornada) => {
    const jornada = await Jornada.findByPk(id_jornada);
    if (!jornada) {
        return null;
    }
    return await jornada.update({ estado: false });
};

// ============================================
// BONUS - Obtener jornada con relaciones completas
// ============================================
const obtenerJornadaConRelaciones = async (id_jornada) => {
    return await Jornada.findByPk(id_jornada, {
        include: [
            {
                model: Fase,
                as: 'fase',
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
                    }
                ]
            },
            {
                model: Grupo,
                as: 'grupo',
                attributes: ['id_grupo', 'clave', 'nombre']
            },
            {
                model: Partido,
                as: 'partidos',
                where: { estado: true },
                required: false
            }
        ]
    });
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
    actualizarJornada,
    eliminarJornada,
    obtenerJornadaConRelaciones
};
