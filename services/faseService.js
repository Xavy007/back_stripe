const FaseRepository = require('../repositories/faseRepository');

// ============================================
// CREATE - Crear una nueva fase
// ============================================
const crearFase = async (data) => {
    // Validaciones
    if (!data.id_cc || !Number.isInteger(parseInt(data.id_cc))) {
        throw new Error('El ID de campeonato-categoría es requerido y debe ser un número válido');
    }

    if (!data.nombre || data.nombre.trim() === '') {
        throw new Error('El nombre de la fase es obligatorio');
    }

    if (!data.tipo) {
        throw new Error('El tipo de fase es obligatorio');
    }

    const tiposValidos = ['grupos', 'liga', 'eliminatoria', 'final_four'];
    if (!tiposValidos.includes(data.tipo)) {
        throw new Error('El tipo de fase debe ser: grupos, liga, eliminatoria o final_four');
    }

    // Validar orden
    if (data.orden && data.orden < 1) {
        throw new Error('El orden debe ser al menos 1');
    }

    // Validar fechas si se proporcionan
    if (data.fecha_inicio && data.fecha_fin) {
        const fechaInicio = new Date(data.fecha_inicio);
        const fechaFin = new Date(data.fecha_fin);

        if (fechaInicio >= fechaFin) {
            throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
        }
    }

    try {
        const nuevaFase = await FaseRepository.crearFase({
            ...data,
            f_estado: data.f_estado || 'planificada',
            estado: true,
            freg: new Date()
        });
        return nuevaFase;
    } catch (error) {
        throw new Error(`Error al crear la fase: ${error.message}`);
    }
};

// ============================================
// READ - Obtener todas las fases activas
// ============================================
const obtenerFases = async () => {
    try {
        const fases = await FaseRepository.obtenerFases();
        return fases || [];
    } catch (error) {
        throw new Error(`Error al obtener fases: ${error.message}`);
    }
};

// ============================================
// READ - Obtener TODAS las fases (incluyendo inactivas)
// ============================================
const obtenerTodasLasFases = async () => {
    try {
        const fases = await FaseRepository.obtenerTodasLasFases();
        return fases || [];
    } catch (error) {
        throw new Error(`Error al obtener todas las fases: ${error.message}`);
    }
};

// ============================================
// READ - Obtener una fase por ID
// ============================================
const obtenerFasePorId = async (id_fase) => {
    if (!id_fase || !Number.isInteger(parseInt(id_fase))) {
        throw new Error('El ID de la fase debe ser un número válido');
    }

    try {
        const fase = await FaseRepository.obtenerFasePorId(id_fase);

        if (!fase) {
            throw new Error('La fase no existe');
        }

        return fase;
    } catch (error) {
        throw new Error(`Error al obtener la fase: ${error.message}`);
    }
};

// ============================================
// READ - Obtener fases por CampeonatoCategoria
// ============================================
const obtenerFasesPorCampeonatoCategoria = async (id_cc) => {
    if (!id_cc || !Number.isInteger(parseInt(id_cc))) {
        throw new Error('El ID de campeonato-categoría debe ser un número válido');
    }

    try {
        const fases = await FaseRepository.obtenerFasesPorCampeonatoCategoria(id_cc);
        return fases || [];
    } catch (error) {
        throw new Error(`Error al obtener fases por campeonato-categoría: ${error.message}`);
    }
};

// ============================================
// READ - Obtener fases por tipo
// ============================================
const obtenerFasesPorTipo = async (tipo) => {
    const tiposValidos = ['grupos', 'liga', 'eliminatoria', 'final_four'];
    if (!tiposValidos.includes(tipo)) {
        throw new Error('El tipo de fase debe ser: grupos, liga, eliminatoria o final_four');
    }

    try {
        const fases = await FaseRepository.obtenerFasesPorTipo(tipo);
        return fases || [];
    } catch (error) {
        throw new Error(`Error al obtener fases por tipo: ${error.message}`);
    }
};

// ============================================
// READ - Obtener fases por estado (f_estado)
// ============================================
const obtenerFasesPorEstado = async (f_estado) => {
    const estadosValidos = ['planificada', 'en_curso', 'finalizada'];
    if (!estadosValidos.includes(f_estado)) {
        throw new Error('El estado debe ser: planificada, en_curso o finalizada');
    }

    try {
        const fases = await FaseRepository.obtenerFasesPorEstado(f_estado);
        return fases || [];
    } catch (error) {
        throw new Error(`Error al obtener fases por estado: ${error.message}`);
    }
};

// ============================================
// UPDATE - Actualizar una fase
// ============================================
const actualizarFase = async (id_fase, data) => {
    if (!id_fase || !Number.isInteger(parseInt(id_fase))) {
        throw new Error('El ID de la fase debe ser un número válido');
    }

    if (!data || Object.keys(data).length === 0) {
        throw new Error('Debes proporcionar datos para actualizar');
    }

    // Validar nombre si se proporciona
    if (data.nombre !== undefined && data.nombre.trim() === '') {
        throw new Error('El nombre no puede estar vacío');
    }

    // Validar tipo si se proporciona
    if (data.tipo) {
        const tiposValidos = ['grupos', 'liga', 'eliminatoria', 'final_four'];
        if (!tiposValidos.includes(data.tipo)) {
            throw new Error('El tipo de fase debe ser: grupos, liga, eliminatoria o final_four');
        }
    }

    // Validar f_estado si se proporciona
    if (data.f_estado) {
        const estadosValidos = ['planificada', 'en_curso', 'finalizada'];
        if (!estadosValidos.includes(data.f_estado)) {
            throw new Error('El estado debe ser: planificada, en_curso o finalizada');
        }
    }

    // Validar orden si se proporciona
    if (data.orden !== undefined && data.orden < 1) {
        throw new Error('El orden debe ser al menos 1');
    }

    // Validar fechas si se proporcionan
    if (data.fecha_inicio && data.fecha_fin) {
        const fechaInicio = new Date(data.fecha_inicio);
        const fechaFin = new Date(data.fecha_fin);

        if (fechaInicio >= fechaFin) {
            throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
        }
    }

    // No permitir cambiar estado o freg desde aquí
    delete data.estado;
    delete data.freg;

    try {
        const fase = await FaseRepository.actualizarFase(id_fase, data);

        if (!fase) {
            throw new Error('La fase no existe');
        }

        return fase;
    } catch (error) {
        throw new Error(`Error al actualizar la fase: ${error.message}`);
    }
};

// ============================================
// UPDATE - Cambiar estado de la fase (f_estado)
// ============================================
const cambiarEstadoFase = async (id_fase, nuevoEstado) => {
    const estadosValidos = ['planificada', 'en_curso', 'finalizada'];
    if (!estadosValidos.includes(nuevoEstado)) {
        throw new Error('El estado debe ser: planificada, en_curso o finalizada');
    }

    try {
        const fase = await FaseRepository.actualizarFase(id_fase, { f_estado: nuevoEstado });

        if (!fase) {
            throw new Error('La fase no existe');
        }

        return fase;
    } catch (error) {
        throw new Error(`Error al cambiar estado de la fase: ${error.message}`);
    }
};

// ============================================
// DELETE - Eliminar (soft delete) una fase
// ============================================
const eliminarFase = async (id_fase) => {
    if (!id_fase || !Number.isInteger(parseInt(id_fase))) {
        throw new Error('El ID de la fase debe ser un número válido');
    }

    try {
        const fase = await FaseRepository.obtenerFasePorId(id_fase);
        if (!fase) {
            throw new Error('La fase no existe');
        }

        if (!fase.estado) {
            throw new Error('La fase ya está eliminada');
        }

        const faseEliminada = await FaseRepository.eliminarFase(id_fase);
        return faseEliminada;
    } catch (error) {
        throw new Error(`Error al eliminar la fase: ${error.message}`);
    }
};

// ============================================
// BONUS - Obtener fase con relaciones completas
// ============================================
const obtenerFaseConRelaciones = async (id_fase) => {
    if (!id_fase || !Number.isInteger(parseInt(id_fase))) {
        throw new Error('El ID de la fase debe ser un número válido');
    }

    try {
        const fase = await FaseRepository.obtenerFaseConRelaciones(id_fase);

        if (!fase) {
            throw new Error('La fase no existe');
        }

        return fase;
    } catch (error) {
        throw new Error(`Error al obtener la fase con relaciones: ${error.message}`);
    }
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
    cambiarEstadoFase,
    eliminarFase,
    obtenerFaseConRelaciones
};
