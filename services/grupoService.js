const GrupoRepository = require('../repositories/grupoRepository');

// ============================================
// CREATE - Crear un nuevo grupo
// ============================================
const crearGrupo = async (data) => {
    // Validaciones
    if (!data.id_cc || !Number.isInteger(parseInt(data.id_cc))) {
        throw new Error('El ID de campeonato-categoría es requerido y debe ser un número válido');
    }

    if (!data.clave || data.clave.trim() === '') {
        throw new Error('La clave del grupo es obligatoria');
    }

    if (!data.nombre || data.nombre.trim() === '') {
        throw new Error('El nombre del grupo es obligatorio');
    }

    // Validar que la clave no contenga espacios
    if (data.clave.includes(' ')) {
        throw new Error('La clave no puede contener espacios');
    }

    // Validar cantidad_equipos_max si se proporciona
    if (data.cantidad_equipos_max && data.cantidad_equipos_max < 2) {
        throw new Error('La cantidad máxima de equipos debe ser al menos 2');
    }

    // Validar orden
    if (data.orden && data.orden < 1) {
        throw new Error('El orden debe ser al menos 1');
    }

    // Verificar que no exista un grupo con la misma clave en el mismo campeonato-categoría
    try {
        const grupoExistente = await GrupoRepository.obtenerGrupoPorClave(data.id_cc, data.clave);
        if (grupoExistente) {
            throw new Error(`Ya existe un grupo con la clave "${data.clave}" en este campeonato-categoría`);
        }
    } catch (error) {
        if (error.message.includes('Ya existe')) {
            throw error;
        }
    }

    try {
        const nuevoGrupo = await GrupoRepository.crearGrupo({
            ...data,
            estado: true,
            freg: new Date()
        });
        return nuevoGrupo;
    } catch (error) {
        throw new Error(`Error al crear el grupo: ${error.message}`);
    }
};

// ============================================
// READ - Obtener todos los grupos activos
// ============================================
const obtenerGrupos = async () => {
    try {
        const grupos = await GrupoRepository.obtenerGrupos();
        return grupos || [];
    } catch (error) {
        throw new Error(`Error al obtener grupos: ${error.message}`);
    }
};

// ============================================
// READ - Obtener TODOS los grupos (incluyendo inactivos)
// ============================================
const obtenerTodosLosGrupos = async () => {
    try {
        const grupos = await GrupoRepository.obtenerTodosLosGrupos();
        return grupos || [];
    } catch (error) {
        throw new Error(`Error al obtener todos los grupos: ${error.message}`);
    }
};

// ============================================
// READ - Obtener un grupo por ID
// ============================================
const obtenerGrupoPorId = async (id_grupo) => {
    if (!id_grupo || !Number.isInteger(parseInt(id_grupo))) {
        throw new Error('El ID del grupo debe ser un número válido');
    }

    try {
        const grupo = await GrupoRepository.obtenerGrupoPorId(id_grupo);

        if (!grupo) {
            throw new Error('El grupo no existe');
        }

        return grupo;
    } catch (error) {
        throw new Error(`Error al obtener el grupo: ${error.message}`);
    }
};

// ============================================
// READ - Obtener grupos por CampeonatoCategoria
// ============================================
const obtenerGruposPorCampeonatoCategoria = async (id_cc) => {
    if (!id_cc || !Number.isInteger(parseInt(id_cc))) {
        throw new Error('El ID de campeonato-categoría debe ser un número válido');
    }

    try {
        const grupos = await GrupoRepository.obtenerGruposPorCampeonatoCategoria(id_cc);
        return grupos || [];
    } catch (error) {
        throw new Error(`Error al obtener grupos por campeonato-categoría: ${error.message}`);
    }
};

// ============================================
// READ - Obtener grupo por clave
// ============================================
const obtenerGrupoPorClave = async (id_cc, clave) => {
    if (!id_cc || !Number.isInteger(parseInt(id_cc))) {
        throw new Error('El ID de campeonato-categoría debe ser un número válido');
    }

    if (!clave || clave.trim() === '') {
        throw new Error('La clave del grupo es requerida');
    }

    try {
        const grupo = await GrupoRepository.obtenerGrupoPorClave(id_cc, clave);

        if (!grupo) {
            throw new Error('El grupo no existe');
        }

        return grupo;
    } catch (error) {
        throw new Error(`Error al obtener el grupo por clave: ${error.message}`);
    }
};

// ============================================
// UPDATE - Actualizar un grupo
// ============================================
const actualizarGrupo = async (id_grupo, data) => {
    if (!id_grupo || !Number.isInteger(parseInt(id_grupo))) {
        throw new Error('El ID del grupo debe ser un número válido');
    }

    if (!data || Object.keys(data).length === 0) {
        throw new Error('Debes proporcionar datos para actualizar');
    }

    // Validar nombre si se proporciona
    if (data.nombre !== undefined && data.nombre.trim() === '') {
        throw new Error('El nombre no puede estar vacío');
    }

    // Validar clave si se proporciona
    if (data.clave !== undefined) {
        if (data.clave.trim() === '') {
            throw new Error('La clave no puede estar vacía');
        }
        if (data.clave.includes(' ')) {
            throw new Error('La clave no puede contener espacios');
        }
    }

    // Validar cantidad_equipos_max si se proporciona
    if (data.cantidad_equipos_max !== undefined && data.cantidad_equipos_max < 2) {
        throw new Error('La cantidad máxima de equipos debe ser al menos 2');
    }

    // Validar orden si se proporciona
    if (data.orden !== undefined && data.orden < 1) {
        throw new Error('El orden debe ser al menos 1');
    }

    // No permitir cambiar estado o freg desde aquí
    delete data.estado;
    delete data.freg;

    try {
        const grupo = await GrupoRepository.actualizarGrupo(id_grupo, data);

        if (!grupo) {
            throw new Error('El grupo no existe');
        }

        return grupo;
    } catch (error) {
        throw new Error(`Error al actualizar el grupo: ${error.message}`);
    }
};

// ============================================
// DELETE - Eliminar (soft delete) un grupo
// ============================================
const eliminarGrupo = async (id_grupo) => {
    if (!id_grupo || !Number.isInteger(parseInt(id_grupo))) {
        throw new Error('El ID del grupo debe ser un número válido');
    }

    try {
        const grupo = await GrupoRepository.obtenerGrupoPorId(id_grupo);
        if (!grupo) {
            throw new Error('El grupo no existe');
        }

        if (!grupo.estado) {
            throw new Error('El grupo ya está eliminado');
        }

        const grupoEliminado = await GrupoRepository.eliminarGrupo(id_grupo);
        return grupoEliminado;
    } catch (error) {
        throw new Error(`Error al eliminar el grupo: ${error.message}`);
    }
};

// ============================================
// BONUS - Obtener grupo con relaciones completas
// ============================================
const obtenerGrupoConRelaciones = async (id_grupo) => {
    if (!id_grupo || !Number.isInteger(parseInt(id_grupo))) {
        throw new Error('El ID del grupo debe ser un número válido');
    }

    try {
        const grupo = await GrupoRepository.obtenerGrupoConRelaciones(id_grupo);

        if (!grupo) {
            throw new Error('El grupo no existe');
        }

        return grupo;
    } catch (error) {
        throw new Error(`Error al obtener el grupo con relaciones: ${error.message}`);
    }
};

module.exports = {
    crearGrupo,
    obtenerGrupos,
    obtenerTodosLosGrupos,
    obtenerGrupoPorId,
    obtenerGruposPorCampeonatoCategoria,
    obtenerGrupoPorClave,
    actualizarGrupo,
    eliminarGrupo,
    obtenerGrupoConRelaciones
};
