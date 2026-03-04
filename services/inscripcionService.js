const InscripcionRepository = require('../repositories/inscripcionRepository');

// ============================================
// CREATE - Crear una nueva inscripción
// ============================================
const crearInscripcion = async (data) => {
    // Validaciones
    if (!data.id_cc || !Number.isInteger(parseInt(data.id_cc))) {
        throw new Error('El ID de campeonato-categoría es requerido y debe ser un número válido');
    }

    if (!data.id_equipo || !Number.isInteger(parseInt(data.id_equipo))) {
        throw new Error('El ID del equipo es requerido y debe ser un número válido');
    }

    // Verificar que el equipo no esté ya inscrito en este campeonato-categoría
    try {
        const inscripcionExistente = await InscripcionRepository.verificarInscripcionExistente(
            data.id_cc,
            data.id_equipo
        );

        if (inscripcionExistente) {
            throw new Error('El equipo ya está inscrito en este campeonato-categoría');
        }
    } catch (error) {
        if (error.message.includes('ya está inscrito')) {
            throw error;
        }
    }

    // Validar cantidad_jugadores si se proporciona
    if (data.cantidad_jugadores && data.cantidad_jugadores < 1) {
        throw new Error('La cantidad de jugadores debe ser al menos 1');
    }

    // Validar posicion_final si se proporciona
    if (data.posicion_final && data.posicion_final < 1) {
        throw new Error('La posición final debe ser al menos 1');
    }

    try {
        const nuevaInscripcion = await InscripcionRepository.crearInscripcion({
            ...data,
            fecha_inscripcion: data.fecha_inscripcion || new Date(),
            estado: true,
            freg: new Date()
        });
        return nuevaInscripcion;
    } catch (error) {
        throw new Error(`Error al crear la inscripción: ${error.message}`);
    }
};

// ============================================
// READ - Obtener todas las inscripciones activas
// ============================================
const obtenerInscripciones = async () => {
    try {
        const inscripciones = await InscripcionRepository.obtenerInscripciones();
        return inscripciones || [];
    } catch (error) {
        throw new Error(`Error al obtener inscripciones: ${error.message}`);
    }
};

// ============================================
// READ - Obtener TODAS las inscripciones (incluyendo inactivas)
// ============================================
const obtenerTodasLasInscripciones = async () => {
    try {
        const inscripciones = await InscripcionRepository.obtenerTodasLasInscripciones();
        return inscripciones || [];
    } catch (error) {
        throw new Error(`Error al obtener todas las inscripciones: ${error.message}`);
    }
};

// ============================================
// READ - Obtener una inscripción por ID
// ============================================
const obtenerInscripcionPorId = async (id_inscripcion) => {
    if (!id_inscripcion || !Number.isInteger(parseInt(id_inscripcion))) {
        throw new Error('El ID de la inscripción debe ser un número válido');
    }

    try {
        const inscripcion = await InscripcionRepository.obtenerInscripcionPorId(id_inscripcion);

        if (!inscripcion) {
            throw new Error('La inscripción no existe');
        }

        return inscripcion;
    } catch (error) {
        throw new Error(`Error al obtener la inscripción: ${error.message}`);
    }
};

// ============================================
// READ - Obtener inscripciones por CampeonatoCategoria
// ============================================
const obtenerInscripcionesPorCampeonatoCategoria = async (id_cc) => {
    if (!id_cc || !Number.isInteger(parseInt(id_cc))) {
        throw new Error('El ID de campeonato-categoría debe ser un número válido');
    }

    try {
        const inscripciones = await InscripcionRepository.obtenerInscripcionesPorCampeonatoCategoria(id_cc);
        return inscripciones || [];
    } catch (error) {
        throw new Error(`Error al obtener inscripciones por campeonato-categoría: ${error.message}`);
    }
};

// ============================================
// READ - Obtener inscripciones por Equipo
// ============================================
const obtenerInscripcionesPorEquipo = async (id_equipo) => {
    if (!id_equipo || !Number.isInteger(parseInt(id_equipo))) {
        throw new Error('El ID del equipo debe ser un número válido');
    }

    try {
        const inscripciones = await InscripcionRepository.obtenerInscripcionesPorEquipo(id_equipo);
        return inscripciones || [];
    } catch (error) {
        throw new Error(`Error al obtener inscripciones por equipo: ${error.message}`);
    }
};

// ============================================
// READ - Obtener inscripciones por Grupo
// ============================================
const obtenerInscripcionesPorGrupo = async (grupo) => {
    if (!grupo || grupo.trim() === '') {
        throw new Error('El grupo es requerido');
    }

    try {
        const inscripciones = await InscripcionRepository.obtenerInscripcionesPorGrupo(grupo);
        return inscripciones || [];
    } catch (error) {
        throw new Error(`Error al obtener inscripciones por grupo: ${error.message}`);
    }
};

// ============================================
// UPDATE - Actualizar una inscripción
// ============================================
const actualizarInscripcion = async (id_inscripcion, data) => {
    if (!id_inscripcion || !Number.isInteger(parseInt(id_inscripcion))) {
        throw new Error('El ID de la inscripción debe ser un número válido');
    }

    if (!data || Object.keys(data).length === 0) {
        throw new Error('Debes proporcionar datos para actualizar');
    }

    // Validar grupo si se proporciona
    if (data.grupo !== undefined && data.grupo !== null && data.grupo.trim() === '') {
        throw new Error('El grupo no puede estar vacío');
    }

    // Validar serie si se proporciona
    if (data.serie !== undefined && data.serie !== null && data.serie.trim() === '') {
        throw new Error('La serie no puede estar vacía');
    }

    // Validar posicion_final si se proporciona
    if (data.posicion_final !== undefined && data.posicion_final < 1) {
        throw new Error('La posición final debe ser al menos 1');
    }

    // Validar cantidad_jugadores si se proporciona
    if (data.cantidad_jugadores !== undefined && data.cantidad_jugadores < 1) {
        throw new Error('La cantidad de jugadores debe ser al menos 1');
    }

    // No permitir cambiar estado o freg desde aquí
    delete data.estado;
    delete data.freg;

    try {
        const inscripcion = await InscripcionRepository.actualizarInscripcion(id_inscripcion, data);

        if (!inscripcion) {
            throw new Error('La inscripción no existe');
        }

        return inscripcion;
    } catch (error) {
        throw new Error(`Error al actualizar la inscripción: ${error.message}`);
    }
};

// ============================================
// DELETE - Eliminar (soft delete) una inscripción
// ============================================
const eliminarInscripcion = async (id_inscripcion) => {
    if (!id_inscripcion || !Number.isInteger(parseInt(id_inscripcion))) {
        throw new Error('El ID de la inscripción debe ser un número válido');
    }

    try {
        const inscripcion = await InscripcionRepository.obtenerInscripcionPorId(id_inscripcion);
        if (!inscripcion) {
            throw new Error('La inscripción no existe');
        }

        if (!inscripcion.estado) {
            throw new Error('La inscripción ya está eliminada');
        }

        const inscripcionEliminada = await InscripcionRepository.eliminarInscripcion(id_inscripcion);
        return inscripcionEliminada;
    } catch (error) {
        throw new Error(`Error al eliminar la inscripción: ${error.message}`);
    }
};

// ============================================
// BONUS - Obtener inscripción con relaciones completas
// ============================================
const obtenerInscripcionConRelaciones = async (id_inscripcion) => {
    if (!id_inscripcion || !Number.isInteger(parseInt(id_inscripcion))) {
        throw new Error('El ID de la inscripción debe ser un número válido');
    }

    try {
        const inscripcion = await InscripcionRepository.obtenerInscripcionConRelaciones(id_inscripcion);

        if (!inscripcion) {
            throw new Error('La inscripción no existe');
        }

        return inscripcion;
    } catch (error) {
        throw new Error(`Error al obtener la inscripción con relaciones: ${error.message}`);
    }
};

module.exports = {
    crearInscripcion,
    obtenerInscripciones,
    obtenerTodasLasInscripciones,
    obtenerInscripcionPorId,
    obtenerInscripcionesPorCampeonatoCategoria,
    obtenerInscripcionesPorEquipo,
    obtenerInscripcionesPorGrupo,
    actualizarInscripcion,
    eliminarInscripcion,
    obtenerInscripcionConRelaciones
};
