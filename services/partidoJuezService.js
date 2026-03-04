const PartidoJuezRepository = require('../repositories/partidoJuezRepository');

// ============================================
// CREATE - Crear una nueva asignación de jueces
// ============================================
const crearPartidoJuez = async (data) => {
    // Validaciones
    if (!data.id_partido || !Number.isInteger(parseInt(data.id_partido))) {
        throw new Error('El ID del partido es requerido y debe ser un número válido');
    }

    // Validar que al menos un árbitro esté asignado
    if (!data.id_arbitro1 && !data.id_arbitro2) {
        throw new Error('Debe asignar al menos un árbitro al partido');
    }

    // Validar que no se repitan los jueces en diferentes roles
    const jueces = [data.id_arbitro1, data.id_arbitro2, data.id_anotador, data.id_cronometrista].filter(Boolean);
    const juecesUnicos = new Set(jueces);

    if (jueces.length !== juecesUnicos.size) {
        throw new Error('Un mismo juez no puede tener múltiples roles en el mismo partido');
    }

    try {
        const nuevoPartidoJuez = await PartidoJuezRepository.crearPartidoJuez({
            ...data,
            confirmado: data.confirmado || false,
            fecha_asignacion: data.fecha_asignacion || new Date(),
            estado: true,
            freg: new Date()
        });
        return nuevoPartidoJuez;
    } catch (error) {
        throw new Error(`Error al crear la asignación de jueces: ${error.message}`);
    }
};

// ============================================
// READ - Obtener todas las asignaciones activas
// ============================================
const obtenerPartidoJueces = async () => {
    try {
        const partidoJueces = await PartidoJuezRepository.obtenerPartidoJueces();
        return partidoJueces || [];
    } catch (error) {
        throw new Error(`Error al obtener asignaciones de jueces: ${error.message}`);
    }
};

// ============================================
// READ - Obtener TODAS las asignaciones (incluyendo inactivas)
// ============================================
const obtenerTodosLosPartidoJueces = async () => {
    try {
        const partidoJueces = await PartidoJuezRepository.obtenerTodosLosPartidoJueces();
        return partidoJueces || [];
    } catch (error) {
        throw new Error(`Error al obtener todas las asignaciones de jueces: ${error.message}`);
    }
};

// ============================================
// READ - Obtener una asignación por ID
// ============================================
const obtenerPartidoJuezPorId = async (id_partido_juez) => {
    if (!id_partido_juez || !Number.isInteger(parseInt(id_partido_juez))) {
        throw new Error('El ID de la asignación debe ser un número válido');
    }

    try {
        const partidoJuez = await PartidoJuezRepository.obtenerPartidoJuezPorId(id_partido_juez);

        if (!partidoJuez) {
            throw new Error('La asignación de jueces no existe');
        }

        return partidoJuez;
    } catch (error) {
        throw new Error(`Error al obtener la asignación de jueces: ${error.message}`);
    }
};

// ============================================
// READ - Obtener asignación por Partido
// ============================================
const obtenerPartidoJuezPorPartido = async (id_partido) => {
    if (!id_partido || !Number.isInteger(parseInt(id_partido))) {
        throw new Error('El ID del partido debe ser un número válido');
    }

    try {
        const partidoJuez = await PartidoJuezRepository.obtenerPartidoJuezPorPartido(id_partido);

        if (!partidoJuez) {
            throw new Error('No hay asignación de jueces para este partido');
        }

        return partidoJuez;
    } catch (error) {
        throw new Error(`Error al obtener la asignación por partido: ${error.message}`);
    }
};

// ============================================
// READ - Obtener partidos de un juez
// ============================================
const obtenerPartidosPorJuez = async (id_juez) => {
    if (!id_juez || !Number.isInteger(parseInt(id_juez))) {
        throw new Error('El ID del juez debe ser un número válido');
    }

    try {
        const partidos = await PartidoJuezRepository.obtenerPartidosPorJuez(id_juez);
        return partidos || [];
    } catch (error) {
        throw new Error(`Error al obtener partidos del juez: ${error.message}`);
    }
};

// ============================================
// UPDATE - Actualizar una asignación
// ============================================
const actualizarPartidoJuez = async (id_partido_juez, data) => {
    if (!id_partido_juez || !Number.isInteger(parseInt(id_partido_juez))) {
        throw new Error('El ID de la asignación debe ser un número válido');
    }

    if (!data || Object.keys(data).length === 0) {
        throw new Error('Debes proporcionar datos para actualizar');
    }

    // Validar que no se repitan los jueces en diferentes roles si se están actualizando
    const jueces = [data.id_arbitro1, data.id_arbitro2, data.id_anotador, data.id_cronometrista].filter(Boolean);
    if (jueces.length > 0) {
        const juecesUnicos = new Set(jueces);
        if (jueces.length !== juecesUnicos.size) {
            throw new Error('Un mismo juez no puede tener múltiples roles en el mismo partido');
        }
    }

    // No permitir cambiar estado o freg desde aquí
    delete data.estado;
    delete data.freg;

    try {
        const partidoJuez = await PartidoJuezRepository.actualizarPartidoJuez(id_partido_juez, data);

        if (!partidoJuez) {
            throw new Error('La asignación de jueces no existe');
        }

        return partidoJuez;
    } catch (error) {
        throw new Error(`Error al actualizar la asignación de jueces: ${error.message}`);
    }
};

// ============================================
// UPDATE - Confirmar asignación de jueces
// ============================================
const confirmarPartidoJuez = async (id_partido_juez) => {
    if (!id_partido_juez || !Number.isInteger(parseInt(id_partido_juez))) {
        throw new Error('El ID de la asignación debe ser un número válido');
    }

    try {
        const partidoJuez = await PartidoJuezRepository.actualizarPartidoJuez(id_partido_juez, { confirmado: true });

        if (!partidoJuez) {
            throw new Error('La asignación de jueces no existe');
        }

        return partidoJuez;
    } catch (error) {
        throw new Error(`Error al confirmar la asignación de jueces: ${error.message}`);
    }
};

// ============================================
// DELETE - Eliminar (soft delete) una asignación
// ============================================
const eliminarPartidoJuez = async (id_partido_juez) => {
    if (!id_partido_juez || !Number.isInteger(parseInt(id_partido_juez))) {
        throw new Error('El ID de la asignación debe ser un número válido');
    }

    try {
        const partidoJuez = await PartidoJuezRepository.obtenerPartidoJuezPorId(id_partido_juez);
        if (!partidoJuez) {
            throw new Error('La asignación de jueces no existe');
        }

        if (!partidoJuez.estado) {
            throw new Error('La asignación de jueces ya está eliminada');
        }

        const partidoJuezEliminado = await PartidoJuezRepository.eliminarPartidoJuez(id_partido_juez);
        return partidoJuezEliminado;
    } catch (error) {
        throw new Error(`Error al eliminar la asignación de jueces: ${error.message}`);
    }
};

module.exports = {
    crearPartidoJuez,
    obtenerPartidoJueces,
    obtenerTodosLosPartidoJueces,
    obtenerPartidoJuezPorId,
    obtenerPartidoJuezPorPartido,
    obtenerPartidosPorJuez,
    actualizarPartidoJuez,
    confirmarPartidoJuez,
    eliminarPartidoJuez
};
