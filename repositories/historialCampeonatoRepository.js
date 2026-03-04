const { HistorialCampeonato, Campeonato, Categoria, Equipo, Club } = require('../models');

// ============================================
// CREATE - Crear un nuevo registro histórico
// ============================================
const crearHistorialCampeonato = async (data) => {
    return await HistorialCampeonato.create(data);
};

// ============================================
// READ - Obtener todos los registros históricos activos
// ============================================
const obtenerHistorialCampeonatos = async () => {
    return await HistorialCampeonato.findAll({
        where: { estado: true },
        include: [
            {
                model: Campeonato,
                as: 'campeonato'
            },
            {
                model: Categoria,
                as: 'categoria'
            },
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' }
                ]
            }
        ],
        order: [['posicion_final', 'ASC'], ['puntos', 'DESC']]
    });
};

// ============================================
// READ - Obtener TODOS los registros históricos (incluyendo inactivos)
// ============================================
const obtenerTodosLosHistorialCampeonatos = async () => {
    return await HistorialCampeonato.findAll({
        include: [
            {
                model: Campeonato,
                as: 'campeonato'
            },
            {
                model: Categoria,
                as: 'categoria'
            },
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' }
                ]
            }
        ],
        order: [['posicion_final', 'ASC'], ['puntos', 'DESC']]
    });
};

// ============================================
// READ - Obtener un registro histórico por ID
// ============================================
const obtenerHistorialCampeonatoPorId = async (id_historial) => {
    return await HistorialCampeonato.findByPk(id_historial, {
        include: [
            {
                model: Campeonato,
                as: 'campeonato'
            },
            {
                model: Categoria,
                as: 'categoria'
            },
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' }
                ]
            }
        ]
    });
};

// ============================================
// READ - Obtener historial por Campeonato
// ============================================
const obtenerHistorialPorCampeonato = async (id_campeonato) => {
    return await HistorialCampeonato.findAll({
        where: {
            id_campeonato,
            estado: true
        },
        include: [
            {
                model: Categoria,
                as: 'categoria'
            },
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' }
                ]
            }
        ],
        order: [['posicion_final', 'ASC']]
    });
};

// ============================================
// READ - Obtener historial por Equipo
// ============================================
const obtenerHistorialPorEquipo = async (id_equipo) => {
    return await HistorialCampeonato.findAll({
        where: {
            id_equipo,
            estado: true
        },
        include: [
            {
                model: Campeonato,
                as: 'campeonato'
            },
            {
                model: Categoria,
                as: 'categoria'
            }
        ],
        order: [['freg', 'DESC']]
    });
};

// ============================================
// READ - Obtener campeonatos ganados por un equipo
// ============================================
const obtenerCampeonatosGanados = async (id_equipo) => {
    return await HistorialCampeonato.findAll({
        where: {
            id_equipo,
            posicion_final: 1,
            estado: true
        },
        include: [
            {
                model: Campeonato,
                as: 'campeonato'
            },
            {
                model: Categoria,
                as: 'categoria'
            }
        ],
        order: [['freg', 'DESC']]
    });
};

// ============================================
// READ - Obtener top N equipos de un campeonato
// ============================================
const obtenerTopEquipos = async (id_campeonato, limite = 10) => {
    return await HistorialCampeonato.findAll({
        where: {
            id_campeonato,
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
                model: Categoria,
                as: 'categoria'
            }
        ],
        order: [['posicion_final', 'ASC'], ['puntos', 'DESC']],
        limit: limite
    });
};

// ============================================
// UPDATE - Actualizar un registro histórico
// ============================================
const actualizarHistorialCampeonato = async (id_historial, data) => {
    const historial = await HistorialCampeonato.findByPk(id_historial);
    if (!historial) {
        return null;
    }
    return await historial.update(data);
};

// ============================================
// DELETE - Eliminar (soft delete) un registro histórico
// ============================================
const eliminarHistorialCampeonato = async (id_historial) => {
    const historial = await HistorialCampeonato.findByPk(id_historial);
    if (!historial) {
        return null;
    }
    return await historial.update({ estado: false });
};

module.exports = {
    crearHistorialCampeonato,
    obtenerHistorialCampeonatos,
    obtenerTodosLosHistorialCampeonatos,
    obtenerHistorialCampeonatoPorId,
    obtenerHistorialPorCampeonato,
    obtenerHistorialPorEquipo,
    obtenerCampeonatosGanados,
    obtenerTopEquipos,
    actualizarHistorialCampeonato,
    eliminarHistorialCampeonato
};
