const ParticipacionRepository = require('../repositories/participacionRepository');

// ============================================
// CREATE - Crear una nueva participación
// ============================================
const crearParticipacion = async (data) => {
    // Validaciones
    if (!data.id_jugador || !Number.isInteger(parseInt(data.id_jugador))) {
        throw new Error('El ID del jugador es requerido y debe ser un número válido');
    }

    if (!data.id_equipo || !Number.isInteger(parseInt(data.id_equipo))) {
        throw new Error('El ID del equipo es requerido y debe ser un número válido');
    }

    if (!data.id_campeonato || !Number.isInteger(parseInt(data.id_campeonato))) {
        throw new Error('El ID del campeonato es requerido y debe ser un número válido');
    }

    if (!data.id_categoria || !Number.isInteger(parseInt(data.id_categoria))) {
        throw new Error('El ID de la categoría es requerido y debe ser un número válido');
    }

    const dorsalNum = parseInt(data.dorsal);
    if (!data.dorsal || isNaN(dorsalNum)) {
        throw new Error('El dorsal es requerido y debe ser un número válido');
    }

    if (dorsalNum < 1 || dorsalNum > 99) {
        throw new Error('El dorsal debe estar entre 1 y 99');
    }

    try {
        // Crear objeto solo con los campos que existen en la tabla
        const nuevaParticipacion = await ParticipacionRepository.crearParticipacion({
            id_jugador: parseInt(data.id_jugador),
            id_equipo: parseInt(data.id_equipo),
            id_campeonato: parseInt(data.id_campeonato),
            id_categoria: parseInt(data.id_categoria),
            dorsal: dorsalNum,
            posicion: ['Armador', 'Opuesto', 'Central', 'Libero', 'Punta', 'Entrenador', 'Otro'].includes(data.posicion) ? data.posicion : null,
            estado: data.estado || 'activo',
            fecha_inscripcion: data.fecha_inscripcion || new Date(),
            cantidad_partidos: data.cantidad_partidos || 0,
            cantidad_goles: data.cantidad_goles || 0,
            cantidad_tarjetas_amarillas: data.cantidad_tarjetas_amarillas || 0,
            cantidad_tarjetas_rojas: data.cantidad_tarjetas_rojas || 0,
            freg: new Date()
        });
        return nuevaParticipacion;
    } catch (error) {
        throw new Error(`Error al crear la participación: ${error.message}`);
    }
};

// ============================================
// READ - Obtener todas las participaciones activas
// ============================================
const obtenerParticipaciones = async () => {
    try {
        const participaciones = await ParticipacionRepository.obtenerParticipaciones();
        return participaciones || [];
    } catch (error) {
        throw new Error(`Error al obtener participaciones: ${error.message}`);
    }
};

// ============================================
// READ - Obtener TODAS las participaciones (todos los estados)
// ============================================
const obtenerTodasLasParticipaciones = async () => {
    try {
        const participaciones = await ParticipacionRepository.obtenerTodasLasParticipaciones();
        return participaciones || [];
    } catch (error) {
        throw new Error(`Error al obtener todas las participaciones: ${error.message}`);
    }
};

// ============================================
// READ - Obtener una participación por ID
// ============================================
const obtenerParticipacionPorId = async (id_participacion) => {
    if (!id_participacion || !Number.isInteger(parseInt(id_participacion))) {
        throw new Error('El ID de la participación debe ser un número válido');
    }

    try {
        const participacion = await ParticipacionRepository.obtenerParticipacionPorId(id_participacion);

        if (!participacion) {
            throw new Error('La participación no existe');
        }

        return participacion;
    } catch (error) {
        throw new Error(`Error al obtener la participación: ${error.message}`);
    }
};

// ============================================
// READ - Obtener participaciones por Jugador
// ============================================
const obtenerParticipacionesPorJugador = async (id_jugador) => {
    if (!id_jugador || !Number.isInteger(parseInt(id_jugador))) {
        throw new Error('El ID del jugador debe ser un número válido');
    }

    try {
        const participaciones = await ParticipacionRepository.obtenerParticipacionesPorJugador(id_jugador);
        return participaciones || [];
    } catch (error) {
        throw new Error(`Error al obtener participaciones por jugador: ${error.message}`);
    }
};

// ============================================
// READ - Obtener participaciones por Equipo
// ============================================
const obtenerParticipacionesPorEquipo = async (id_equipo) => {
    if (!id_equipo || !Number.isInteger(parseInt(id_equipo))) {
        throw new Error('El ID del equipo debe ser un número válido');
    }

    try {
        const participaciones = await ParticipacionRepository.obtenerParticipacionesPorEquipo(id_equipo);
        return participaciones || [];
    } catch (error) {
        throw new Error(`Error al obtener participaciones por equipo: ${error.message}`);
    }
};

// ============================================
// READ - Obtener participaciones por Campeonato
// ============================================
const obtenerParticipacionesPorCampeonato = async (id_campeonato) => {
    if (!id_campeonato || !Number.isInteger(parseInt(id_campeonato))) {
        throw new Error('El ID del campeonato debe ser un número válido');
    }

    try {
        const participaciones = await ParticipacionRepository.obtenerParticipacionesPorCampeonato(id_campeonato);
        return participaciones || [];
    } catch (error) {
        throw new Error(`Error al obtener participaciones por campeonato: ${error.message}`);
    }
};

// ============================================
// READ - Obtener participaciones por CampeonatoCategoria
// ============================================
const obtenerParticipacionesPorCampeonatoCategoria = async (id_cc) => {
    if (!id_cc || !Number.isInteger(parseInt(id_cc))) {
        throw new Error('El ID de campeonato-categoría debe ser un número válido');
    }

    try {
        const participaciones = await ParticipacionRepository.obtenerParticipacionesPorCampeonatoCategoria(id_cc);
        return participaciones || [];
    } catch (error) {
        throw new Error(`Error al obtener participaciones por campeonato-categoría: ${error.message}`);
    }
};

// ============================================
// READ - Obtener participaciones por estado
// ============================================
const obtenerParticipacionesPorEstado = async (estado) => {
    const estadosValidos = ['activo', 'suspendido', 'baja', 'vetado'];
    if (!estadosValidos.includes(estado)) {
        throw new Error('El estado debe ser: activo, suspendido, baja o vetado');
    }

    try {
        const participaciones = await ParticipacionRepository.obtenerParticipacionesPorEstado(estado);
        return participaciones || [];
    } catch (error) {
        throw new Error(`Error al obtener participaciones por estado: ${error.message}`);
    }
};

// ============================================
// UPDATE - Actualizar una participación
// ============================================
const actualizarParticipacion = async (id_participacion, data) => {
    if (!id_participacion || !Number.isInteger(parseInt(id_participacion))) {
        throw new Error('El ID de la participación debe ser un número válido');
    }

    if (!data || Object.keys(data).length === 0) {
        throw new Error('Debes proporcionar datos para actualizar');
    }

    // Validar dorsal si se proporciona
    if (data.dorsal !== undefined) {
        if (!Number.isInteger(parseInt(data.dorsal)) || data.dorsal < 1 || data.dorsal > 99) {
            throw new Error('El dorsal debe estar entre 1 y 99');
        }
    }

    // Normalizar posicion: si no es un valor válido, guardarlo como null
    if (data.posicion !== undefined) {
        const posicionesValidas = ['Armador', 'Opuesto', 'Central', 'Libero', 'Punta', 'Entrenador', 'Otro'];
        data.posicion = posicionesValidas.includes(data.posicion) ? data.posicion : null;
    }

    // Validar estado si se proporciona
    if (data.estado) {
        const estadosValidos = ['activo', 'suspendido', 'baja', 'vetado'];
        if (!estadosValidos.includes(data.estado)) {
            throw new Error('El estado debe ser: activo, suspendido, baja o vetado');
        }
    }

    // Validar cantidades si se proporcionan
    if (data.cantidad_partidos !== undefined && data.cantidad_partidos < 0) {
        throw new Error('La cantidad de partidos no puede ser negativa');
    }

    if (data.cantidad_goles !== undefined && data.cantidad_goles < 0) {
        throw new Error('La cantidad de goles no puede ser negativa');
    }

    if (data.cantidad_tarjetas_amarillas !== undefined && data.cantidad_tarjetas_amarillas < 0) {
        throw new Error('Las tarjetas amarillas no pueden ser negativas');
    }

    if (data.cantidad_tarjetas_rojas !== undefined && data.cantidad_tarjetas_rojas < 0) {
        throw new Error('Las tarjetas rojas no pueden ser negativas');
    }

    // No permitir cambiar freg desde aquí
    delete data.freg;

    try {
        const participacion = await ParticipacionRepository.actualizarParticipacion(id_participacion, data);

        if (!participacion) {
            throw new Error('La participación no existe');
        }

        return participacion;
    } catch (error) {
        throw new Error(`Error al actualizar la participación: ${error.message}`);
    }
};

// ============================================
// UPDATE - Cambiar estado de la participación
// ============================================
const cambiarEstadoParticipacion = async (id_participacion, nuevoEstado) => {
    const estadosValidos = ['activo', 'suspendido', 'baja', 'vetado'];
    if (!estadosValidos.includes(nuevoEstado)) {
        throw new Error('El estado debe ser: activo, suspendido, baja o vetado');
    }

    try {
        const participacion = await ParticipacionRepository.cambiarEstadoParticipacion(id_participacion, nuevoEstado);

        if (!participacion) {
            throw new Error('La participación no existe');
        }

        return participacion;
    } catch (error) {
        throw new Error(`Error al cambiar estado de la participación: ${error.message}`);
    }
};

module.exports = {
    crearParticipacion,
    obtenerParticipaciones,
    obtenerTodasLasParticipaciones,
    obtenerParticipacionPorId,
    obtenerParticipacionesPorJugador,
    obtenerParticipacionesPorEquipo,
    obtenerParticipacionesPorCampeonato,
    obtenerParticipacionesPorCampeonatoCategoria,
    obtenerParticipacionesPorEstado,
    actualizarParticipacion,
    cambiarEstadoParticipacion
};
