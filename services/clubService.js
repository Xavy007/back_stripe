const ClubRepository = require('../repositories/clubRepository');

// CREATE
const crearClub = async (data) => {
    // Validaciones de campos obligatorios
    if (!data.nombre || data.nombre.trim() === '') {
        throw new Error('El nombre del club es obligatorio');
    }
    
    // Validar email si se proporciona
    if (data.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new Error('El email no es válido');
        }
    }
    
    // Validar que no exista un club con el mismo nombre
    const clubExistente = await ClubRepository.obtenerClubPorNombre(data.nombre);
    if (clubExistente) {
        throw new Error('Ya existe un club con ese nombre');
    }
    
    if (data.acronimo && data.acronimo.trim() === '') {
        throw new Error('El acrónimo no puede estar vacío');
    }
    
    if (data.direccion && data.direccion.trim() === '') {
        throw new Error('La dirección no puede estar vacía');
    }

    try {
        const nuevoClub = await ClubRepository.crearClub({
            ...data,
            estado: true // Siempre crear activo
        });
        return nuevoClub;
    } catch (error) {
        throw new Error(`Error al crear el club: ${error.message}`);
    }
};

// READ - Obtener todos los clubes activos
const obtenerClubs = async () => {
    try {
        const clubs = await ClubRepository.obtenerClubs();
        
        if (!clubs) {
            return [];
        }
        
        return clubs;
    } catch (error) {
        throw new Error(`Error al obtener clubes: ${error.message}`);
    }
};

// READ - Obtener TODOS los clubes (incluyendo inactivos)
const obtenerTodosLosClubs = async () => {
    try {
        const clubs = await ClubRepository.obtenerTodosLosClubs();
        
        if (!clubs) {
            return [];
        }
        
        return clubs;
    } catch (error) {
        throw new Error(`Error al obtener todos los clubes: ${error.message}`);
    }
};

// READ - Obtener un club por ID
const obtenerClubPorId = async (id_club) => {
    // Validar ID
    if (!id_club || !Number.isInteger(parseInt(id_club))) {
        throw new Error('El ID del club debe ser un número válido');
    }
    
    try {
        const club = await ClubRepository.obtenerClubPorId(id_club);
        
        if (!club) {
            throw new Error('El club no existe');
        }
        
        return club;
    } catch (error) {
        throw new Error(`Error al obtener el club: ${error.message}`);
    }
};

// READ - Obtener club por ID (desde body)
const getbyId = async (id_club) => {
    if (!id_club || !Number.isInteger(parseInt(id_club))) {
        throw new Error('El ID del club debe ser un número válido');
    }
    
    try {
        const club = await ClubRepository.obtenerClubPorId(id_club);
        
        if (!club) {
            throw new Error('El club no existe');
        }
        
        return club;
    } catch (error) {
        throw new Error(`Error al obtener el club: ${error.message}`);
    }
};

// UPDATE
const actualizarClub = async (id_club, data) => {
    // Validar ID
    if (!id_club || !Number.isInteger(parseInt(id_club))) {
        throw new Error('El ID del club debe ser un número válido');
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
        
        // Verificar que no exista otro club con el mismo nombre
        const clubExistente = await ClubRepository.obtenerClubPorNombre(data.nombre);
        if (clubExistente && clubExistente.id_club !== parseInt(id_club)) {
            throw new Error('Ya existe otro club con ese nombre');
        }
    }
    
    if (data.email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.email && !emailRegex.test(data.email)) {
            throw new Error('El email no es válido');
        }
    }
    
    if (data.acronimo !== undefined && data.acronimo.trim() === '') {
        throw new Error('El acrónimo no puede estar vacío');
    }
    
    if (data.direccion !== undefined && data.direccion.trim() === '') {
        throw new Error('La dirección no puede estar vacía');
    }
    
    // No permitir cambiar estado o fecha de registro desde aquí
    delete data.estado;
    delete data.freg;
    
    try {
        const club = await ClubRepository.actualizarClub(id_club, data);
        
        if (!club) {
            throw new Error('El club no existe');
        }
        
        return club;
    } catch (error) {
        throw new Error(`Error al actualizar el club: ${error.message}`);
    }
};

// DELETE (soft delete - cambiar estado a false)
const eliminarClub = async (id_club) => {
    // Validar ID
    if (!id_club || !Number.isInteger(parseInt(id_club))) {
        throw new Error('El ID del club debe ser un número válido');
    }
    
    try {
        // Verificar que existe y está activo
        const club = await ClubRepository.obtenerClubPorId(id_club);
        if (!club) {
            throw new Error('El club no existe');
        }
        
        if (!club.estado) {
            throw new Error('El club ya está eliminado');
        }
        
        // Llamar al repositorio para desactivar
        const clubEliminado = await ClubRepository.eliminarClub(id_club);
        
        return clubEliminado;
    } catch (error) {
        throw new Error(`Error al eliminar el club: ${error.message}`);
    }
};

module.exports = {
    crearClub,
    obtenerClubs,
    obtenerTodosLosClubs,
    obtenerClubPorId,
    getbyId,
    actualizarClub,
    eliminarClub
};