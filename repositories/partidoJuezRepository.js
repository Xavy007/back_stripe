const { PartidoJuez, Partido, Juez, Persona, Usuario } = require('../models');

// ============================================
// CREATE - Crear una nueva asignación de jueces
// ============================================
const crearPartidoJuez = async (data) => {
    return await PartidoJuez.create(data);
};

// ============================================
// READ - Obtener todas las asignaciones activas
// ============================================
const obtenerPartidoJueces = async () => {
    return await PartidoJuez.findAll({
        where: { estado: true },
        include: [
            {
                model: Partido,
                as: 'partido'
            },
            {
                model: Juez,
                as: 'arbitro1',
                include: [
                    { model: Persona, as: 'persona' }
                ]
            },
            {
                model: Juez,
                as: 'arbitro2',
                include: [
                    { model: Persona, as: 'persona' }
                ]
            },
            {
                model: Juez,
                as: 'anotador',
                include: [
                    { model: Persona, as: 'persona' }
                ]
            },
            {
                model: Juez,
                as: 'cronometrista',
                include: [
                    { model: Persona, as: 'persona' }
                ]
            },
            {
                model: Usuario,
                as: 'planillero'
            }
        ],
        order: [['fecha_asignacion', 'DESC']]
    });
};

// ============================================
// READ - Obtener TODAS las asignaciones (incluyendo inactivas)
// ============================================
const obtenerTodosLosPartidoJueces = async () => {
    return await PartidoJuez.findAll({
        include: [
            {
                model: Partido,
                as: 'partido'
            },
            {
                model: Juez,
                as: 'arbitro1',
                include: [
                    { model: Persona, as: 'persona' }
                ]
            },
            {
                model: Juez,
                as: 'arbitro2',
                include: [
                    { model: Persona, as: 'persona' }
                ]
            },
            {
                model: Juez,
                as: 'anotador',
                include: [
                    { model: Persona, as: 'persona' }
                ]
            },
            {
                model: Juez,
                as: 'cronometrista',
                include: [
                    { model: Persona, as: 'persona' }
                ]
            },
            {
                model: Usuario,
                as: 'planillero'
            }
        ],
        order: [['fecha_asignacion', 'DESC']]
    });
};

// ============================================
// READ - Obtener una asignación por ID
// ============================================
const obtenerPartidoJuezPorId = async (id_partido_juez) => {
    return await PartidoJuez.findByPk(id_partido_juez, {
        include: [
            {
                model: Partido,
                as: 'partido'
            },
            {
                model: Juez,
                as: 'arbitro1',
                include: [
                    { model: Persona, as: 'persona' }
                ]
            },
            {
                model: Juez,
                as: 'arbitro2',
                include: [
                    { model: Persona, as: 'persona' }
                ]
            },
            {
                model: Juez,
                as: 'anotador',
                include: [
                    { model: Persona, as: 'persona' }
                ]
            },
            {
                model: Juez,
                as: 'cronometrista',
                include: [
                    { model: Persona, as: 'persona' }
                ]
            },
            {
                model: Usuario,
                as: 'planillero'
            }
        ]
    });
};

// ============================================
// READ - Obtener asignación por Partido
// ============================================
const obtenerPartidoJuezPorPartido = async (id_partido) => {
    return await PartidoJuez.findOne({
        where: {
            id_partido,
            estado: true
        },
        include: [
            {
                model: Juez,
                as: 'arbitro1',
                include: [
                    { model: Persona, as: 'persona' }
                ]
            },
            {
                model: Juez,
                as: 'arbitro2',
                include: [
                    { model: Persona, as: 'persona' }
                ]
            },
            {
                model: Juez,
                as: 'anotador',
                include: [
                    { model: Persona, as: 'persona' }
                ]
            },
            {
                model: Juez,
                as: 'cronometrista',
                include: [
                    { model: Persona, as: 'persona' }
                ]
            },
            {
                model: Usuario,
                as: 'planillero'
            }
        ]
    });
};

// ============================================
// READ - Obtener partidos de un juez
// ============================================
const obtenerPartidosPorJuez = async (id_juez) => {
    return await PartidoJuez.findAll({
        where: {
            estado: true,
            [require('sequelize').Op.or]: [
                { id_arbitro1: id_juez },
                { id_arbitro2: id_juez },
                { id_anotador: id_juez },
                { id_cronometrista: id_juez }
            ]
        },
        include: [
            {
                model: Partido,
                as: 'partido'
            }
        ],
        order: [['fecha_asignacion', 'DESC']]
    });
};

// ============================================
// UPDATE - Actualizar una asignación
// ============================================
const actualizarPartidoJuez = async (id_partido_juez, data) => {
    const partidoJuez = await PartidoJuez.findByPk(id_partido_juez);
    if (!partidoJuez) {
        return null;
    }
    return await partidoJuez.update(data);
};

// ============================================
// DELETE - Eliminar (soft delete) una asignación
// ============================================
const eliminarPartidoJuez = async (id_partido_juez) => {
    const partidoJuez = await PartidoJuez.findByPk(id_partido_juez);
    if (!partidoJuez) {
        return null;
    }
    return await partidoJuez.update({ estado: false });
};

module.exports = {
    crearPartidoJuez,
    obtenerPartidoJueces,
    obtenerTodosLosPartidoJueces,
    obtenerPartidoJuezPorId,
    obtenerPartidoJuezPorPartido,
    obtenerPartidosPorJuez,
    actualizarPartidoJuez,
    eliminarPartidoJuez
};
