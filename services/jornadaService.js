const JornadaRepository = require('../repositories/jornadaRepository');

// ============================================
// CREATE - Crear una nueva jornada
// ============================================
const crearJornada = async (data) => {
    // Validaciones
    if (!data.id_fase || !Number.isInteger(parseInt(data.id_fase))) {
        throw new Error('El ID de la fase es requerido y debe ser un número válido');
    }

    if (!data.id_grupo || !Number.isInteger(parseInt(data.id_grupo))) {
        throw new Error('El ID del grupo es requerido y debe ser un número válido');
    }

    if (!data.numero || !Number.isInteger(parseInt(data.numero))) {
        throw new Error('El número de jornada es requerido y debe ser un número válido');
    }

    if (data.numero < 1) {
        throw new Error('El número de jornada debe ser al menos 1');
    }

    if (!data.nombre || data.nombre.trim() === '') {
        throw new Error('El nombre de la jornada es obligatorio');
    }

    try {
        const nuevaJornada = await JornadaRepository.crearJornada({
            ...data,
            j_estado: data.j_estado || 'planificada',
            estado: true,
            freg: new Date()
        });
        return nuevaJornada;
    } catch (error) {
        throw new Error(`Error al crear la jornada: ${error.message}`);
    }
};

// ============================================
// READ - Obtener todas las jornadas activas
// ============================================
const obtenerJornadas = async () => {
    try {
        const jornadas = await JornadaRepository.obtenerJornadas();
        return jornadas || [];
    } catch (error) {
        throw new Error(`Error al obtener jornadas: ${error.message}`);
    }
};

// ============================================
// READ - Obtener TODAS las jornadas (incluyendo inactivas)
// ============================================
const obtenerTodasLasJornadas = async () => {
    try {
        const jornadas = await JornadaRepository.obtenerTodasLasJornadas();
        return jornadas || [];
    } catch (error) {
        throw new Error(`Error al obtener todas las jornadas: ${error.message}`);
    }
};

// ============================================
// READ - Obtener una jornada por ID
// ============================================
const obtenerJornadaPorId = async (id_jornada) => {
    if (!id_jornada || !Number.isInteger(parseInt(id_jornada))) {
        throw new Error('El ID de la jornada debe ser un número válido');
    }

    try {
        const jornada = await JornadaRepository.obtenerJornadaPorId(id_jornada);

        if (!jornada) {
            throw new Error('La jornada no existe');
        }

        return jornada;
    } catch (error) {
        throw new Error(`Error al obtener la jornada: ${error.message}`);
    }
};

// ============================================
// READ - Obtener jornadas por Fase
// ============================================
const obtenerJornadasPorFase = async (id_fase) => {
    if (!id_fase || !Number.isInteger(parseInt(id_fase))) {
        throw new Error('El ID de la fase debe ser un número válido');
    }

    try {
        const jornadas = await JornadaRepository.obtenerJornadasPorFase(id_fase);
        return jornadas || [];
    } catch (error) {
        throw new Error(`Error al obtener jornadas por fase: ${error.message}`);
    }
};

// ============================================
// READ - Obtener jornadas por Grupo
// ============================================
const obtenerJornadasPorGrupo = async (id_grupo) => {
    if (!id_grupo || !Number.isInteger(parseInt(id_grupo))) {
        throw new Error('El ID del grupo debe ser un número válido');
    }

    try {
        const jornadas = await JornadaRepository.obtenerJornadasPorGrupo(id_grupo);
        return jornadas || [];
    } catch (error) {
        throw new Error(`Error al obtener jornadas por grupo: ${error.message}`);
    }
};

// ============================================
// READ - Obtener jornadas por CampeonatoCategoria (id_cc)
// ============================================
const obtenerJornadasPorCampeonatoCategoria = async (id_cc) => {
    if (!id_cc || !Number.isInteger(parseInt(id_cc))) {
        throw new Error('El ID del campeonato-categoría debe ser un número válido');
    }

    try {
        const jornadas = await JornadaRepository.obtenerJornadasPorCampeonatoCategoria(id_cc);
        return jornadas || [];
    } catch (error) {
        throw new Error(`Error al obtener jornadas por campeonato-categoría: ${error.message}`);
    }
};

// ============================================
// READ - Obtener jornadas por estado (j_estado)
// ============================================
const obtenerJornadasPorEstado = async (j_estado) => {
    const estadosValidos = ['planificada', 'en_curso', 'finalizada'];
    if (!estadosValidos.includes(j_estado)) {
        throw new Error('El estado debe ser: planificada, en_curso o finalizada');
    }

    try {
        const jornadas = await JornadaRepository.obtenerJornadasPorEstado(j_estado);
        return jornadas || [];
    } catch (error) {
        throw new Error(`Error al obtener jornadas por estado: ${error.message}`);
    }
};

// ============================================
// UPDATE - Actualizar una jornada
// ============================================
const actualizarJornada = async (id_jornada, data) => {
    if (!id_jornada || !Number.isInteger(parseInt(id_jornada))) {
        throw new Error('El ID de la jornada debe ser un número válido');
    }

    if (!data || Object.keys(data).length === 0) {
        throw new Error('Debes proporcionar datos para actualizar');
    }

    // Validar nombre si se proporciona
    if (data.nombre !== undefined && data.nombre.trim() === '') {
        throw new Error('El nombre no puede estar vacío');
    }

    // Validar numero si se proporciona
    if (data.numero !== undefined && (data.numero < 1 || !Number.isInteger(parseInt(data.numero)))) {
        throw new Error('El número de jornada debe ser un número válido mayor o igual a 1');
    }

    // Validar j_estado si se proporciona
    if (data.j_estado) {
        const estadosValidos = ['planificada', 'en_curso', 'finalizada'];
        if (!estadosValidos.includes(data.j_estado)) {
            throw new Error('El estado debe ser: planificada, en_curso o finalizada');
        }
    }

    // No permitir cambiar estado o freg desde aquí
    delete data.estado;
    delete data.freg;

    try {
        const jornada = await JornadaRepository.actualizarJornada(id_jornada, data);

        if (!jornada) {
            throw new Error('La jornada no existe');
        }

        return jornada;
    } catch (error) {
        throw new Error(`Error al actualizar la jornada: ${error.message}`);
    }
};

// ============================================
// UPDATE - Cambiar estado de la jornada (j_estado)
// ============================================
const cambiarEstadoJornada = async (id_jornada, nuevoEstado) => {
    const estadosValidos = ['planificada', 'en_curso', 'finalizada'];
    if (!estadosValidos.includes(nuevoEstado)) {
        throw new Error('El estado debe ser: planificada, en_curso o finalizada');
    }

    try {
        const jornada = await JornadaRepository.actualizarJornada(id_jornada, { j_estado: nuevoEstado });

        if (!jornada) {
            throw new Error('La jornada no existe');
        }

        return jornada;
    } catch (error) {
        throw new Error(`Error al cambiar estado de la jornada: ${error.message}`);
    }
};

// ============================================
// DELETE - Eliminar (soft delete) una jornada
// ============================================
const eliminarJornada = async (id_jornada) => {
    if (!id_jornada || !Number.isInteger(parseInt(id_jornada))) {
        throw new Error('El ID de la jornada debe ser un número válido');
    }

    try {
        const jornada = await JornadaRepository.obtenerJornadaPorId(id_jornada);
        if (!jornada) {
            throw new Error('La jornada no existe');
        }

        if (!jornada.estado) {
            throw new Error('La jornada ya está eliminada');
        }

        const jornadaEliminada = await JornadaRepository.eliminarJornada(id_jornada);
        return jornadaEliminada;
    } catch (error) {
        throw new Error(`Error al eliminar la jornada: ${error.message}`);
    }
};

// ============================================
// BONUS - Obtener jornada con relaciones completas
// ============================================
const obtenerJornadaConRelaciones = async (id_jornada) => {
    if (!id_jornada || !Number.isInteger(parseInt(id_jornada))) {
        throw new Error('El ID de la jornada debe ser un número válido');
    }

    try {
        const jornada = await JornadaRepository.obtenerJornadaConRelaciones(id_jornada);

        if (!jornada) {
            throw new Error('La jornada no existe');
        }

        return jornada;
    } catch (error) {
        throw new Error(`Error al obtener la jornada con relaciones: ${error.message}`);
    }
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
    cambiarEstadoJornada,
    eliminarJornada,
    obtenerJornadaConRelaciones
};
