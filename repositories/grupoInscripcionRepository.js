const { GrupoInscripcion, Grupo, Inscripcion, Equipo, Club } = require('../models');

// ============================================
// CREATE - Crear una nueva asignación de grupo
// ============================================
const crearGrupoInscripcion = async (data) => {
    return await GrupoInscripcion.create(data);
};

// ============================================
// READ - Obtener todas las asignaciones activas
// ============================================
const obtenerGrupoInscripciones = async () => {
    return await GrupoInscripcion.findAll({
        where: { estado: true },
        include: [
            {
                model: Grupo,
                as: 'grupo'
            },
            {
                model: Inscripcion,
                as: 'inscripcion',
                include: [
                    {
                        model: Equipo,
                        as: 'equipo',
                        include: [
                            { model: Club, as: 'club' }
                        ]
                    }
                ]
            }
        ],
        order: [['slot_grupo', 'ASC']]
    });
};

// ============================================
// READ - Obtener TODAS las asignaciones (incluyendo inactivas)
// ============================================
const obtenerTodasLasGrupoInscripciones = async () => {
    return await GrupoInscripcion.findAll({
        include: [
            {
                model: Grupo,
                as: 'grupo'
            },
            {
                model: Inscripcion,
                as: 'inscripcion',
                include: [
                    {
                        model: Equipo,
                        as: 'equipo',
                        include: [
                            { model: Club, as: 'club' }
                        ]
                    }
                ]
            }
        ],
        order: [['slot_grupo', 'ASC']]
    });
};

// ============================================
// READ - Obtener una asignación por ID
// ============================================
const obtenerGrupoInscripcionPorId = async (id_grupo_inscripcion) => {
    return await GrupoInscripcion.findByPk(id_grupo_inscripcion, {
        include: [
            {
                model: Grupo,
                as: 'grupo'
            },
            {
                model: Inscripcion,
                as: 'inscripcion',
                include: [
                    {
                        model: Equipo,
                        as: 'equipo',
                        include: [
                            { model: Club, as: 'club' }
                        ]
                    }
                ]
            }
        ]
    });
};

// ============================================
// READ - Obtener asignaciones por Grupo
// ============================================
const obtenerGrupoInscripcionesPorGrupo = async (id_grupo) => {
    return await GrupoInscripcion.findAll({
        where: {
            id_grupo,
            estado: true
        },
        include: [
            {
                model: Inscripcion,
                as: 'inscripcion',
                include: [
                    {
                        model: Equipo,
                        as: 'equipo',
                        include: [
                            { model: Club, as: 'club' }
                        ]
                    }
                ]
            }
        ],
        order: [['slot_grupo', 'ASC']]
    });
};

// ============================================
// READ - Obtener asignaciones por Inscripcion
// ============================================
const obtenerGrupoInscripcionesPorInscripcion = async (id_inscripcion) => {
    return await GrupoInscripcion.findAll({
        where: {
            id_inscripcion,
            estado: true
        },
        include: [
            {
                model: Grupo,
                as: 'grupo'
            }
        ]
    });
};

// ============================================
// READ - Obtener asignaciones por Bombo
// ============================================
const obtenerGrupoInscripcionesPorBombo = async (id_grupo, bombo) => {
    return await GrupoInscripcion.findAll({
        where: {
            id_grupo,
            bombo,
            estado: true
        },
        include: [
            {
                model: Inscripcion,
                as: 'inscripcion',
                include: [
                    {
                        model: Equipo,
                        as: 'equipo',
                        include: [
                            { model: Club, as: 'club' }
                        ]
                    }
                ]
            }
        ],
        order: [['slot_grupo', 'ASC']]
    });
};

// ============================================
// UPDATE - Actualizar una asignación
// ============================================
const actualizarGrupoInscripcion = async (id_grupo_inscripcion, data) => {
    const grupoInscripcion = await GrupoInscripcion.findByPk(id_grupo_inscripcion);
    if (!grupoInscripcion) {
        return null;
    }
    return await grupoInscripcion.update(data);
};

// ============================================
// DELETE - Eliminar (soft delete) una asignación
// ============================================
const eliminarGrupoInscripcion = async (id_grupo_inscripcion) => {
    const grupoInscripcion = await GrupoInscripcion.findByPk(id_grupo_inscripcion);
    if (!grupoInscripcion) {
        return null;
    }
    return await grupoInscripcion.update({ estado: false });
};

module.exports = {
    crearGrupoInscripcion,
    obtenerGrupoInscripciones,
    obtenerTodasLasGrupoInscripciones,
    obtenerGrupoInscripcionPorId,
    obtenerGrupoInscripcionesPorGrupo,
    obtenerGrupoInscripcionesPorInscripcion,
    obtenerGrupoInscripcionesPorBombo,
    actualizarGrupoInscripcion,
    eliminarGrupoInscripcion
};
