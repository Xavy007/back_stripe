const CampeonatoRepository = require('../repositories/campeonatoRepository');

const CAMPEONATO_TIPOS = ['liga', 'copa', 'amistoso', 'torneo'];
const C_ESTADOS = ['programado', 'en_curso', 'finalizado', 'suspendido', 'cancelado'];

// CREATE
const crearCampeonato = async (data) => {
    // Validaciones de campos obligatorios
    if (!data.nombre || data.nombre.trim() === '') {
        throw new Error('El nombre del campeonato es obligatorio');
    }
    
    if (!data.id_gestion || !Number.isInteger(data.id_gestion)) {
        throw new Error('El ID de gestión es obligatorio y debe ser un número');
    }
    
    if (!data.tipo) {
        throw new Error('El tipo de campeonato es obligatorio');
    }
    
    if (!CAMPEONATO_TIPOS.includes(data.tipo)) {
        throw new Error(`El tipo debe ser uno de: ${CAMPEONATO_TIPOS.join(', ')}`);
    }
    
    // Validar fechas si se proporcionan
    if (data.fecha_inicio && data.fecha_fin) {
        const fechaInicio = new Date(data.fecha_inicio);
        const fechaFin = new Date(data.fecha_fin);
        
        if (fechaInicio >= fechaFin) {
            throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
        }
    }
    
    // Validar que fecha_inicio no sea en el pasado
    /*if (data.fecha_inicio) {
        const fechaInicio = new Date(data.fecha_inicio);
        if (fechaInicio < new Date()) {
            throw new Error('La fecha de inicio no puede ser en el pasado');
        }
    }*/

    try {
        const nuevoCampeonato = await CampeonatoRepository.crearCampeonato({
            ...data,
            c_estado: data.c_estado || 'programado',
            estado: true // Siempre crear activo
        });
        return nuevoCampeonato;
    } catch (error) {
        throw new Error(`Error al crear el campeonato: ${error.message}`);
    }
};

// READ - Obtener todos los campeonatos activos
const obtenerCampeonatos = async () => {
    try {
        const campeonatos = await CampeonatoRepository.obtenerCampeonatos();
        
        if (!campeonatos) {
            return [];
        }
        
        return campeonatos;
    } catch (error) {
        throw new Error(`Error al obtener campeonatos: ${error.message}`);
    }
};

// READ - Obtener TODOS los campeonatos (incluyendo inactivos)
const obtenerTodosLosCampeonatos = async () => {
    try {
        const campeonatos = await CampeonatoRepository.obtenerTodosLosCampeonatos();
        
        if (!campeonatos) {
            return [];
        }
        
        return campeonatos;
    } catch (error) {
        throw new Error(`Error al obtener todos los campeonatos: ${error.message}`);
    }
};

// READ - Obtener un campeonato por ID
const obtenerCampeonatoPorId = async (id_campeonato) => {
    // Validar ID
    if (!id_campeonato || !Number.isInteger(parseInt(id_campeonato))) {
        throw new Error('El ID del campeonato debe ser un número válido');
    }
    
    try {
        const campeonato = await CampeonatoRepository.obtenerCampeonatoPorId(id_campeonato);
        
        if (!campeonato) {
            throw new Error('El campeonato no existe');
        }
        
        return campeonato;
    } catch (error) {
        throw new Error(`Error al obtener el campeonato: ${error.message}`);
    }
};

// READ - Obtener campeonato por ID (desde body)
const getbyId = async (id_campeonato) => {
    if (!id_campeonato || !Number.isInteger(parseInt(id_campeonato))) {
        throw new Error('El ID del campeonato debe ser un número válido');
    }
    
    try {
        const campeonato = await CampeonatoRepository.obtenerCampeonatoPorId(id_campeonato);
        
        if (!campeonato) {
            throw new Error('El campeonato no existe');
        }
        
        return campeonato;
    } catch (error) {
        throw new Error(`Error al obtener el campeonato: ${error.message}`);
    }
};

// READ - Obtener campeonato con relaciones
const obtenerCampeonatoConRelaciones = async (id_campeonato) => {
    if (!id_campeonato || !Number.isInteger(parseInt(id_campeonato))) {
        throw new Error('El ID del campeonato debe ser un número válido');
    }
    
    try {
        const campeonato = await CampeonatoRepository.obtenerCampeonatoConRelaciones(id_campeonato);
        
        if (!campeonato) {
            throw new Error('El campeonato no existe');
        }
        
        return campeonato;
    } catch (error) {
        throw new Error(`Error al obtener el campeonato con relaciones: ${error.message}`);
    }
};

// READ - Obtener campeonatos por tipo
const obtenerCampeonatosPorTipo = async (tipo) => {
    if (!tipo || !CAMPEONATO_TIPOS.includes(tipo.toLowerCase())) {
        throw new Error(`Debes proporcionar un tipo válido: ${CAMPEONATO_TIPOS.join(', ')}`);
    }
    
    try {
        const campeonatos = await CampeonatoRepository.obtenerCampeonatosPorTipo(tipo.toLowerCase());
        
        if (!campeonatos) {
            return [];
        }
        
        return campeonatos;
    } catch (error) {
        throw new Error(`Error al obtener campeonatos por tipo: ${error.message}`);
    }
};

// READ - Obtener campeonatos por estado
const obtenerCampeonatosPorEstado = async (c_estado) => {
    if (!c_estado || !C_ESTADOS.includes(c_estado.toLowerCase())) {
        throw new Error(`Debes proporcionar un estado válido: ${C_ESTADOS.join(', ')}`);
    }
    
    try {
        const campeonatos = await CampeonatoRepository.obtenerCampeonatosPorEstado(c_estado.toLowerCase());
        
        if (!campeonatos) {
            return [];
        }
        
        return campeonatos;
    } catch (error) {
        throw new Error(`Error al obtener campeonatos por estado: ${error.message}`);
    }
};

// READ - Obtener campeonatos por gestión
const obtenerCampeonatosPorGestion = async (id_gestion) => {
    if (!id_gestion || !Number.isInteger(parseInt(id_gestion))) {
        throw new Error('El ID de gestión debe ser un número válido');
    }
    
    try {
        const campeonatos = await CampeonatoRepository.obtenerCampeonatosPorGestion(id_gestion);
        
        if (!campeonatos) {
            return [];
        }
        
        return campeonatos;
    } catch (error) {
        throw new Error(`Error al obtener campeonatos por gestión: ${error.message}`);
    }
};

// UPDATE
const actualizarCampeonato = async (id_campeonato, data) => {
    // Validar ID
    if (!id_campeonato || !Number.isInteger(parseInt(id_campeonato))) {
        throw new Error('El ID del campeonato debe ser un número válido');
    }
    
    // Validar que tenga datos para actualizar
    if (!data || Object.keys(data).length === 0) {
        throw new Error('Debes proporcionar datos para actualizar');
    }
    
    // Validar campos actualizables
    if (data.nombre !== undefined) {
        if (data.nombre.trim() === '') {
            throw new Error('El nombre no puede estar vacío');
        }
    }
    
    if (data.tipo !== undefined) {
        if (!CAMPEONATO_TIPOS.includes(data.tipo)) {
            throw new Error(`El tipo debe ser uno de: ${CAMPEONATO_TIPOS.join(', ')}`);
        }
    }
    
    if (data.c_estado !== undefined) {
        if (!C_ESTADOS.includes(data.c_estado)) {
            throw new Error(`El estado debe ser uno de: ${C_ESTADOS.join(', ')}`);
        }
    }
    
    // Validar fechas si se proporcionan
    if (data.fecha_inicio || data.fecha_fin) {
        const campeonatoActual = await CampeonatoRepository.obtenerCampeonatoPorId(id_campeonato);
        const fechaInicio = data.fecha_inicio ? new Date(data.fecha_inicio) : new Date(campeonatoActual.fecha_inicio);
        const fechaFin = data.fecha_fin ? new Date(data.fecha_fin) : new Date(campeonatoActual.fecha_fin);
        
        if (fechaInicio >= fechaFin) {
            throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
        }
    }
    
    // No permitir cambiar estado o fecha de registro desde aquí
    delete data.estado;
    delete data.freg;
    delete data.id_gestion; // No permitir cambiar gestión
    
    try {
        const campeonato = await CampeonatoRepository.actualizarCampeonato(id_campeonato, data);
        
        if (!campeonato) {
            throw new Error('El campeonato no existe');
        }
        
        return campeonato;
    } catch (error) {
        throw new Error(`Error al actualizar el campeonato: ${error.message}`);
    }
};

// DELETE (soft delete - cambiar estado a false)
const eliminarCampeonato = async (id_campeonato) => {
    // Validar ID
    if (!id_campeonato || !Number.isInteger(parseInt(id_campeonato))) {
        throw new Error('El ID del campeonato debe ser un número válido');
    }
    
    try {
        // Verificar que existe y está activo
        const campeonato = await CampeonatoRepository.obtenerCampeonatoPorId(id_campeonato);
        if (!campeonato) {
            throw new Error('El campeonato no existe');
        }
        
        if (!campeonato.estado) {
            throw new Error('El campeonato ya está eliminado');
        }
        
        // Llamar al repositorio para desactivar
        const campeonatoEliminado = await CampeonatoRepository.eliminarCampeonato(id_campeonato);
        
        return campeonatoEliminado;
    } catch (error) {
        throw new Error(`Error al eliminar el campeonato: ${error.message}`);
    }
};

module.exports = {
    crearCampeonato,
    obtenerCampeonatos,
    obtenerTodosLosCampeonatos,
    obtenerCampeonatoPorId,
    getbyId,
    obtenerCampeonatoConRelaciones,
    obtenerCampeonatosPorTipo,
    obtenerCampeonatosPorEstado,
    obtenerCampeonatosPorGestion,
    actualizarCampeonato,
    eliminarCampeonato
};