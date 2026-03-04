const EquipoRepository = require('../repositories/equipoRepository');
const { Club, Categoria } = require('../models');

// CREATE
const crearEquipo = async (data) => {
    // Validaciones de campos obligatorios
    if (!data.nombre || data.nombre.trim() === '') {
        throw new Error('El nombre del equipo es obligatorio');
    }
    
    if (!data.id_club || !Number.isInteger(data.id_club)) {
        throw new Error('El ID del club es obligatorio y debe ser un número');
    }
    
    if (!data.id_categoria || !Number.isInteger(data.id_categoria)) {
        throw new Error('El ID de la categoría es obligatorio y debe ser un número');
    }
    
    // Validar que el club existe
    const club = await Club.findByPk(data.id_club);
    if (!club) {
        throw new Error('El club especificado no existe');
    }
    
    // Validar que la categoría existe
    const categoria = await Categoria.findByPk(data.id_categoria);
    if (!categoria) {
        throw new Error('La categoría especificada no existe');
    }

    try {
        const nuevoEquipo = await EquipoRepository.crearEquipo({
            ...data,
            estado: true // Siempre crear activo
        });
        return nuevoEquipo;
    } catch (error) {
        throw new Error(`Error al crear el equipo: ${error.message}`);
    }
};

// READ - Obtener todos los equipos activos
const obtenerEquipos = async () => {
    try {
        const equipos = await EquipoRepository.obtenerEquipos();
        
        if (!equipos) {
            return [];
        }
        
        return equipos;
    } catch (error) {
        throw new Error(`Error al obtener equipos: ${error.message}`);
    }
};

// READ - Obtener TODOS los equipos (incluyendo inactivos)
const obtenerTodosLosEquipos = async () => {
    try {
        const equipos = await EquipoRepository.obtenerTodosLosEquipos();
        
        if (!equipos) {
            return [];
        }
        
        return equipos;
    } catch (error) {
        throw new Error(`Error al obtener todos los equipos: ${error.message}`);
    }
};

// READ - Obtener un equipo por ID
const obtenerEquipoPorId = async (id_equipo) => {
    // Validar ID
    if (!id_equipo || !Number.isInteger(parseInt(id_equipo))) {
        throw new Error('El ID del equipo debe ser un número válido');
    }
    
    try {
        const equipo = await EquipoRepository.obtenerEquipoPorId(id_equipo);
        
        if (!equipo) {
            throw new Error('El equipo no existe');
        }
        
        return equipo;
    } catch (error) {
        throw new Error(`Error al obtener el equipo: ${error.message}`);
    }
};

// READ - Obtener equipo por ID (desde body)
const getbyId = async (id_equipo) => {
    if (!id_equipo || !Number.isInteger(parseInt(id_equipo))) {
        throw new Error('El ID del equipo debe ser un número válido');
    }
    
    try {
        const equipo = await EquipoRepository.obtenerEquipoPorId(id_equipo);
        
        if (!equipo) {
            throw new Error('El equipo no existe');
        }
        
        return equipo;
    } catch (error) {
        throw new Error(`Error al obtener el equipo: ${error.message}`);
    }
};

// READ - Obtener equipos por club
const obtenerEquiposPorClub = async (id_club) => {
    if (!id_club || !Number.isInteger(parseInt(id_club))) {
        throw new Error('El ID del club debe ser un número válido');
    }
    
    try {
        // Validar que el club existe
        const club = await Club.findByPk(id_club);
        if (!club) {
            throw new Error('El club especificado no existe');
        }
        
        const equipos = await EquipoRepository.obtenerEquiposPorClub(id_club);
        
        if (!equipos) {
            return [];
        }
        
        return equipos;
    } catch (error) {
        throw new Error(`Error al obtener equipos por club: ${error.message}`);
    }
};

// READ - Obtener equipos por categoría
const obtenerEquiposPorCategoria = async (id_categoria) => {
    if (!id_categoria || !Number.isInteger(parseInt(id_categoria))) {
        throw new Error('El ID de la categoría debe ser un número válido');
    }
    
    try {
        // Validar que la categoría existe
        const categoria = await Categoria.findByPk(id_categoria);
        if (!categoria) {
            throw new Error('La categoría especificada no existe');
        }
        
        const equipos = await EquipoRepository.obtenerEquiposPorCategoria(id_categoria);
        
        if (!equipos) {
            return [];
        }
        
        return equipos;
    } catch (error) {
        throw new Error(`Error al obtener equipos por categoría: ${error.message}`);
    }
};

// READ - Obtener equipos por club y categoría
const obtenerEquiposPorClubYCategoria = async (id_club, id_categoria) => {
    if (!id_club || !Number.isInteger(parseInt(id_club))) {
        throw new Error('El ID del club debe ser un número válido');
    }
    
    if (!id_categoria || !Number.isInteger(parseInt(id_categoria))) {
        throw new Error('El ID de la categoría debe ser un número válido');
    }
    
    try {
        const equipos = await EquipoRepository.obtenerEquiposPorClubYCategoria(id_club, id_categoria);
        
        if (!equipos) {
            return [];
        }
        
        return equipos;
    } catch (error) {
        throw new Error(`Error al obtener equipos por club y categoría: ${error.message}`);
    }
};

// READ - Obtener equipo con relaciones
const obtenerEquipoConRelaciones = async (id_equipo) => {
    if (!id_equipo || !Number.isInteger(parseInt(id_equipo))) {
        throw new Error('El ID del equipo debe ser un número válido');
    }
    
    try {
        const equipo = await EquipoRepository.obtenerEquipoConRelaciones(id_equipo);
        
        if (!equipo) {
            throw new Error('El equipo no existe');
        }
        
        return equipo;
    } catch (error) {
        throw new Error(`Error al obtener equipo con relaciones: ${error.message}`);
    }
};

// UPDATE
const actualizarEquipo = async (id_equipo, data) => {
    // Validar ID
    if (!id_equipo || !Number.isInteger(parseInt(id_equipo))) {
        throw new Error('El ID del equipo debe ser un número válido');
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
    
    if (data.id_club !== undefined) {
        if (!Number.isInteger(data.id_club)) {
            throw new Error('El ID del club debe ser un número');
        }
        
        const club = await Club.findByPk(data.id_club);
        if (!club) {
            throw new Error('El club especificado no existe');
        }
    }
    
    if (data.id_categoria !== undefined) {
        if (!Number.isInteger(data.id_categoria)) {
            throw new Error('El ID de la categoría debe ser un número');
        }
        
        const categoria = await Categoria.findByPk(data.id_categoria);
        if (!categoria) {
            throw new Error('La categoría especificada no existe');
        }
    }
    
    // No permitir cambiar estado o fecha de registro desde aquí
    delete data.estado;
    delete data.freg;
    
    try {
        const equipo = await EquipoRepository.actualizarEquipo(id_equipo, data);
        
        if (!equipo) {
            throw new Error('El equipo no existe');
        }
        
        return equipo;
    } catch (error) {
        throw new Error(`Error al actualizar el equipo: ${error.message}`);
    }
};

// DELETE (soft delete - cambiar estado a false)
const eliminarEquipo = async (id_equipo) => {
    // Validar ID
    if (!id_equipo || !Number.isInteger(parseInt(id_equipo))) {
        throw new Error('El ID del equipo debe ser un número válido');
    }
    
    try {
        // Verificar que existe y está activo
        const equipo = await EquipoRepository.obtenerEquipoPorId(id_equipo);
        if (!equipo) {
            throw new Error('El equipo no existe');
        }
        
        if (!equipo.estado) {
            throw new Error('El equipo ya está eliminado');
        }
        
        // Llamar al repositorio para desactivar
        const equipoEliminado = await EquipoRepository.eliminarEquipo(id_equipo);
        
        return equipoEliminado;
    } catch (error) {
        throw new Error(`Error al eliminar el equipo: ${error.message}`);
    }
};

// Obtener jugadores de un equipo específico (con filtro opcional por gestión)
const obtenerJugadoresDeEquipo = async (id_equipo, id_gestion = null) => {
    try {
        const jugadores = await EquipoRepository.obtenerJugadoresDeEquipo(id_equipo, id_gestion);
        return jugadores;
    } catch (error) {
        throw new Error(`Error al obtener jugadores del equipo: ${error.message}`);
    }
};

// Obtener plantilla habilitada (participaciones) de un equipo
const obtenerPlantillaHabilitada = async (id_equipo, id_campeonato = null) => {
    try {
        const plantilla = await EquipoRepository.obtenerPlantillaHabilitada(id_equipo, id_campeonato);
        return plantilla;
    } catch (error) {
        throw new Error(`Error al obtener plantilla habilitada: ${error.message}`);
    }
};

module.exports = {
    crearEquipo,
    obtenerEquipos,
    obtenerTodosLosEquipos,
    obtenerEquipoPorId,
    getbyId,
    obtenerEquiposPorClub,
    obtenerEquiposPorCategoria,
    obtenerEquiposPorClubYCategoria,
    obtenerEquipoConRelaciones,
    actualizarEquipo,
    eliminarEquipo,
    obtenerJugadoresDeEquipo,
    obtenerPlantillaHabilitada
};