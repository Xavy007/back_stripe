const GrupoInscripcionRepository = require('../repositories/grupoInscripcionRepository');

// ============================================
// CREATE - Crear una nueva asignación de grupo
// ============================================
const crearGrupoInscripcion = async (data) => {
    // Validaciones
    if (!data.id_grupo || !Number.isInteger(parseInt(data.id_grupo))) {
        throw new Error('El ID del grupo es requerido y debe ser un número válido');
    }

    if (!data.id_inscripcion || !Number.isInteger(parseInt(data.id_inscripcion))) {
        throw new Error('El ID de la inscripción es requerido y debe ser un número válido');
    }

    if (!data.bombo || !Number.isInteger(parseInt(data.bombo))) {
        throw new Error('El bombo es requerido y debe ser un número válido');
    }

    if (data.bombo < 1) {
        throw new Error('El bombo debe ser al menos 1');
    }

    if (!data.slot_grupo || !Number.isInteger(parseInt(data.slot_grupo))) {
        throw new Error('El slot del grupo es requerido y debe ser un número válido');
    }

    if (data.slot_grupo < 1) {
        throw new Error('El slot del grupo debe ser al menos 1');
    }

    try {
        const nuevaGrupoInscripcion = await GrupoInscripcionRepository.crearGrupoInscripcion({
            ...data,
            estado: true,
            freg: new Date()
        });
        return nuevaGrupoInscripcion;
    } catch (error) {
        throw new Error(`Error al crear la asignación de grupo: ${error.message}`);
    }
};

// ============================================
// READ - Obtener todas las asignaciones activas
// ============================================
const obtenerGrupoInscripciones = async () => {
    try {
        const grupoInscripciones = await GrupoInscripcionRepository.obtenerGrupoInscripciones();
        return grupoInscripciones || [];
    } catch (error) {
        throw new Error(`Error al obtener asignaciones de grupo: ${error.message}`);
    }
};

// ============================================
// READ - Obtener TODAS las asignaciones (incluyendo inactivas)
// ============================================
const obtenerTodasLasGrupoInscripciones = async () => {
    try {
        const grupoInscripciones = await GrupoInscripcionRepository.obtenerTodasLasGrupoInscripciones();
        return grupoInscripciones || [];
    } catch (error) {
        throw new Error(`Error al obtener todas las asignaciones de grupo: ${error.message}`);
    }
};

// ============================================
// READ - Obtener una asignación por ID
// ============================================
const obtenerGrupoInscripcionPorId = async (id_grupo_inscripcion) => {
    if (!id_grupo_inscripcion || !Number.isInteger(parseInt(id_grupo_inscripcion))) {
        throw new Error('El ID de la asignación debe ser un número válido');
    }

    try {
        const grupoInscripcion = await GrupoInscripcionRepository.obtenerGrupoInscripcionPorId(id_grupo_inscripcion);

        if (!grupoInscripcion) {
            throw new Error('La asignación de grupo no existe');
        }

        return grupoInscripcion;
    } catch (error) {
        throw new Error(`Error al obtener la asignación de grupo: ${error.message}`);
    }
};

// ============================================
// READ - Obtener asignaciones por Grupo
// ============================================
const obtenerGrupoInscripcionesPorGrupo = async (id_grupo) => {
    if (!id_grupo || !Number.isInteger(parseInt(id_grupo))) {
        throw new Error('El ID del grupo debe ser un número válido');
    }

    try {
        const grupoInscripciones = await GrupoInscripcionRepository.obtenerGrupoInscripcionesPorGrupo(id_grupo);
        return grupoInscripciones || [];
    } catch (error) {
        throw new Error(`Error al obtener asignaciones por grupo: ${error.message}`);
    }
};

// ============================================
// READ - Obtener asignaciones por Inscripcion
// ============================================
const obtenerGrupoInscripcionesPorInscripcion = async (id_inscripcion) => {
    if (!id_inscripcion || !Number.isInteger(parseInt(id_inscripcion))) {
        throw new Error('El ID de la inscripción debe ser un número válido');
    }

    try {
        const grupoInscripciones = await GrupoInscripcionRepository.obtenerGrupoInscripcionesPorInscripcion(id_inscripcion);
        return grupoInscripciones || [];
    } catch (error) {
        throw new Error(`Error al obtener asignaciones por inscripción: ${error.message}`);
    }
};

// ============================================
// READ - Obtener asignaciones por Bombo
// ============================================
const obtenerGrupoInscripcionesPorBombo = async (id_grupo, bombo) => {
    if (!id_grupo || !Number.isInteger(parseInt(id_grupo))) {
        throw new Error('El ID del grupo debe ser un número válido');
    }

    if (!bombo || !Number.isInteger(parseInt(bombo)) || bombo < 1) {
        throw new Error('El bombo debe ser un número válido mayor o igual a 1');
    }

    try {
        const grupoInscripciones = await GrupoInscripcionRepository.obtenerGrupoInscripcionesPorBombo(id_grupo, bombo);
        return grupoInscripciones || [];
    } catch (error) {
        throw new Error(`Error al obtener asignaciones por bombo: ${error.message}`);
    }
};

// ============================================
// UPDATE - Actualizar una asignación
// ============================================
const actualizarGrupoInscripcion = async (id_grupo_inscripcion, data) => {
    if (!id_grupo_inscripcion || !Number.isInteger(parseInt(id_grupo_inscripcion))) {
        throw new Error('El ID de la asignación debe ser un número válido');
    }

    if (!data || Object.keys(data).length === 0) {
        throw new Error('Debes proporcionar datos para actualizar');
    }

    // Validar bombo si se proporciona
    if (data.bombo !== undefined && (data.bombo < 1 || !Number.isInteger(parseInt(data.bombo)))) {
        throw new Error('El bombo debe ser un número válido mayor o igual a 1');
    }

    // Validar slot_grupo si se proporciona
    if (data.slot_grupo !== undefined && (data.slot_grupo < 1 || !Number.isInteger(parseInt(data.slot_grupo)))) {
        throw new Error('El slot del grupo debe ser un número válido mayor o igual a 1');
    }

    // No permitir cambiar estado o freg desde aquí
    delete data.estado;
    delete data.freg;

    try {
        const grupoInscripcion = await GrupoInscripcionRepository.actualizarGrupoInscripcion(id_grupo_inscripcion, data);

        if (!grupoInscripcion) {
            throw new Error('La asignación de grupo no existe');
        }

        return grupoInscripcion;
    } catch (error) {
        throw new Error(`Error al actualizar la asignación de grupo: ${error.message}`);
    }
};

// ============================================
// DELETE - Eliminar (soft delete) una asignación
// ============================================
const eliminarGrupoInscripcion = async (id_grupo_inscripcion) => {
    if (!id_grupo_inscripcion || !Number.isInteger(parseInt(id_grupo_inscripcion))) {
        throw new Error('El ID de la asignación debe ser un número válido');
    }

    try {
        const grupoInscripcion = await GrupoInscripcionRepository.obtenerGrupoInscripcionPorId(id_grupo_inscripcion);
        if (!grupoInscripcion) {
            throw new Error('La asignación de grupo no existe');
        }

        if (!grupoInscripcion.estado) {
            throw new Error('La asignación de grupo ya está eliminada');
        }

        const grupoInscripcionEliminada = await GrupoInscripcionRepository.eliminarGrupoInscripcion(id_grupo_inscripcion);
        return grupoInscripcionEliminada;
    } catch (error) {
        throw new Error(`Error al eliminar la asignación de grupo: ${error.message}`);
    }
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
