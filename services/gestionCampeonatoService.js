const GestionCampeonatoRepository = require('../repositories/gestioncampeonatoRepository');

// CREATE
const crearGestion = async (data) => {
    // Validaciones de campos obligatorios
    if (!data.nombre || data.nombre.trim() === '') {
        throw new Error('El nombre de la gestión es obligatorio');
    }
    
    if (data.gestion === undefined || data.gestion === null) {
        throw new Error('El año de gestión es obligatorio');
    }
    
    // Validar que gestion sea un número entero
    if (!Number.isInteger(data.gestion)) {
        throw new Error('El año de gestión debe ser un número entero');
    }
    
    // Validar rango de años
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 2;
    const maxYear = currentYear + 1;
    
    if (data.gestion < minYear || data.gestion > maxYear) {
        throw new Error(`La gestión debe estar entre ${minYear} y ${maxYear}`);
    }
    
    // Validar que no exista una gestión con el mismo año
    const gestionExistente = await GestionCampeonatoRepository.obtenerGestionPorAno(data.gestion);
    if (gestionExistente) {
        throw new Error(`Ya existe una gestión para el año ${data.gestion}`);
    }
    
    if (data.descripcion && data.descripcion.trim() === '') {
        throw new Error('La descripción no puede estar vacía');
    }

    try {
        const nuevaGestion = await GestionCampeonatoRepository.crearGestion({
            ...data,
            estado: true // Siempre crear activa
        });
        return nuevaGestion;
    } catch (error) {
        throw new Error(`Error al crear la gestión: ${error.message}`);
    }
};

// READ - Obtener todas las gestiones activas
const obtenerGestiones = async () => {
    try {
        const gestiones = await GestionCampeonatoRepository.obtenerGestiones();
        
        if (!gestiones) {
            return [];
        }
        
        return gestiones;
    } catch (error) {
        throw new Error(`Error al obtener gestiones: ${error.message}`);
    }
};

// READ - Obtener TODAS las gestiones (incluyendo inactivas)
const obtenerTodasLasGestiones = async () => {
    try {
        const gestiones = await GestionCampeonatoRepository.obtenerTodasLasGestiones();
        
        if (!gestiones) {
            return [];
        }
        
        return gestiones;
    } catch (error) {
        throw new Error(`Error al obtener todas las gestiones: ${error.message}`);
    }
};

// READ - Obtener una gestión por ID
const obtenerGestionPorId = async (id_gestion) => {
    // Validar ID
    if (!id_gestion || !Number.isInteger(parseInt(id_gestion))) {
        throw new Error('El ID de la gestión debe ser un número válido');
    }
    
    try {
        const gestion = await GestionCampeonatoRepository.obtenerGestionPorId(id_gestion);
        
        if (!gestion) {
            throw new Error('La gestión no existe');
        }
        
        return gestion;
    } catch (error) {
        throw new Error(`Error al obtener la gestión: ${error.message}`);
    }
};

// READ - Obtener gestión por ID (desde body)
const getbyId = async (id_gestion) => {
    if (!id_gestion || !Number.isInteger(parseInt(id_gestion))) {
        throw new Error('El ID de la gestión debe ser un número válido');
    }
    
    try {
        const gestion = await GestionCampeonatoRepository.obtenerGestionPorId(id_gestion);
        
        if (!gestion) {
            throw new Error('La gestión no existe');
        }
        
        return gestion;
    } catch (error) {
        throw new Error(`Error al obtener la gestión: ${error.message}`);
    }
};

// READ - Obtener gestión por año
const obtenerGestionPorAno = async (gestion) => {
    if (gestion === undefined || !Number.isInteger(gestion)) {
        throw new Error('El año debe ser un número entero válido');
    }
    
    try {
        const g = await GestionCampeonatoRepository.obtenerGestionPorAno(gestion);
        
        if (!g) {
            throw new Error(`No existe gestión para el año ${gestion}`);
        }
        
        return g;
    } catch (error) {
        throw new Error(`Error al obtener gestión por año: ${error.message}`);
    }
};

// READ - Obtener gestión con campeonatos
const obtenerGestionConCampeonatos = async (id_gestion) => {
    if (!id_gestion || !Number.isInteger(parseInt(id_gestion))) {
        throw new Error('El ID de la gestión debe ser un número válido');
    }
    
    try {
        const gestion = await GestionCampeonatoRepository.obtenerGestionConCampeonatos(id_gestion);
        
        if (!gestion) {
            throw new Error('La gestión no existe');
        }
        
        return gestion;
    } catch (error) {
        throw new Error(`Error al obtener gestión con campeonatos: ${error.message}`);
    }
};

// UPDATE
const actualizarGestion = async (id_gestion, data) => {
    // Validar ID
    if (!id_gestion || !Number.isInteger(parseInt(id_gestion))) {
        throw new Error('El ID de la gestión debe ser un número válido');
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
    
    if (data.gestion !== undefined) {
        if (!Number.isInteger(data.gestion)) {
            throw new Error('El año de gestión debe ser un número entero');
        }
        
        // Validar rango de años
        const currentYear = new Date().getFullYear();
        const minYear = currentYear - 2;
        const maxYear = currentYear + 1;
        
        if (data.gestion < minYear || data.gestion > maxYear) {
            throw new Error(`La gestión debe estar entre ${minYear} y ${maxYear}`);
        }
        
        // Verificar que no exista otra gestión con el mismo año
        const gestionExistente = await GestionCampeonatoRepository.obtenerGestionPorAno(data.gestion);
        if (gestionExistente && gestionExistente.id_gestion !== parseInt(id_gestion)) {
            throw new Error(`Ya existe otra gestión para el año ${data.gestion}`);
        }
    }
    
    if (data.descripcion !== undefined && data.descripcion.trim() === '') {
        throw new Error('La descripción no puede estar vacía');
    }
    
    // No permitir cambiar estado o fecha de registro desde aquí
    delete data.estado;
    delete data.freg;
    
    try {
        const gestion = await GestionCampeonatoRepository.actualizarGestion(id_gestion, data);
        
        if (!gestion) {
            throw new Error('La gestión no existe');
        }
        
        return gestion;
    } catch (error) {
        throw new Error(`Error al actualizar la gestión: ${error.message}`);
    }
};

// DELETE (soft delete - cambiar estado a false)
const eliminarGestion = async (id_gestion) => {
    // Validar ID
    if (!id_gestion || !Number.isInteger(parseInt(id_gestion))) {
        throw new Error('El ID de la gestión debe ser un número válido');
    }
    
    try {
        // Verificar que existe y está activa
        const gestion = await GestionCampeonatoRepository.obtenerGestionPorId(id_gestion);
        if (!gestion) {
            throw new Error('La gestión no existe');
        }
        
        if (!gestion.estado) {
            throw new Error('La gestión ya está eliminada');
        }
        
        // Llamar al repositorio para desactivar
        const gestionEliminada = await GestionCampeonatoRepository.eliminarGestion(id_gestion);
        
        return gestionEliminada;
    } catch (error) {
        throw new Error(`Error al eliminar la gestión: ${error.message}`);
    }
};

module.exports = {
    crearGestion,
    obtenerGestiones,
    obtenerTodasLasGestiones,
    obtenerGestionPorId,
    getbyId,
    obtenerGestionPorAno,
    obtenerGestionConCampeonatos,
    actualizarGestion,
    eliminarGestion
};