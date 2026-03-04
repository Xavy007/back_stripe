const { Fase, CampeonatoCategoria, Campeonato, Categoria, Jornada, Partido } = require('../models');

// ============================================
// CREATE - Crear una nueva fase
// ============================================
const crearFase = async (data) => {
    return await Fase.create(data);
};

// ============================================
// READ - Obtener todas las fases activas
// ============================================
const obtenerFases = async () => {
    return await Fase.findAll({
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
// READ - Obtener TODAS las fases (incluyendo inactivas)
// ============================================
const obtenerTodasLasFases = async () => {
    return await Fase.findAll({
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
// READ - Obtener una fase por ID
// ============================================
const obtenerFasePorId = async (id_fase) => {
    return await Fase.findByPk(id_fase, {
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
                model: Jornada,
                as: 'jornadas'
            },
            {
                model: Partido,
                as: 'partidos'
            }
        ]
    });
};

// ============================================
// READ - Obtener fases por CampeonatoCategoria
// ============================================
const obtenerFasesPorCampeonatoCategoria = async (id_cc) => {
    return await Fase.findAll({
        where: {
            id_cc,
            estado: true
        },
        include: [
            {
                model: Jornada,
                as: 'jornadas'
            },
            {
                model: Partido,
                as: 'partidos'
            }
        ],
        order: [['orden', 'ASC']]
    });
};

// ============================================
// READ - Obtener fases por tipo
// ============================================
const obtenerFasesPorTipo = async (tipo) => {
    return await Fase.findAll({
        where: {
            tipo,
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
            }
        ],
        order: [['orden', 'ASC']]
    });
};

// ============================================
// READ - Obtener fases por estado (f_estado)
// ============================================
const obtenerFasesPorEstado = async (f_estado) => {
    return await Fase.findAll({
        where: {
            f_estado,
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
            }
        ],
        order: [['orden', 'ASC']]
    });
};

// ============================================
// UPDATE - Actualizar una fase
// ============================================
const actualizarFase = async (id_fase, data) => {
    const fase = await Fase.findByPk(id_fase);
    if (!fase) {
        return null;
    }
    return await fase.update(data);
};

// ============================================
// DELETE - Eliminar (soft delete) una fase
// ============================================
const eliminarFase = async (id_fase) => {
    const fase = await Fase.findByPk(id_fase);
    if (!fase) {
        return null;
    }
    return await fase.update({ estado: false });
};

// ============================================
// BONUS - Obtener fase con relaciones completas
// ============================================
const obtenerFaseConRelaciones = async (id_fase) => {
    return await Fase.findByPk(id_fase, {
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
                model: Jornada,
                as: 'jornadas',
                where: { estado: true },
                required: false,
                order: [['numero', 'ASC']]
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
    crearFase,
    obtenerFases,
    obtenerTodasLasFases,
    obtenerFasePorId,
    obtenerFasesPorCampeonatoCategoria,
    obtenerFasesPorTipo,
    obtenerFasesPorEstado,
    actualizarFase,
    eliminarFase,
    obtenerFaseConRelaciones
};
