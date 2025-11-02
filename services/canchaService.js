const CanchaRepository = require('../repositories/canchaRepository'); // Importar repositorio

// CREATE
const crearCancha = async (data) => {
    // Validaciones de campos obligatorios
    if (!data.nombre || data.nombre.trim() === '') {
        throw new Error('El nombre de la cancha es obligatorio');
    }
    
    if (data.nombre.length < 3 || data.nombre.length > 255) {
        throw new Error('El nombre debe tener entre 3 y 255 caracteres');
    }
    
    if (!data.tipo) {
        throw new Error('El tipo de cancha es obligatorio');
    }
    
    const tiposValidos = ['coliseo', 'abierta', 'otro'];
    if (!tiposValidos.includes(data.tipo)) {
        throw new Error(`El tipo debe ser uno de: ${tiposValidos.join(', ')}`);
    }
    
    // Validaciones opcionales pero si vienen, deben ser válidas
    if (data.capacidad && (data.capacidad <= 0 || !Number.isInteger(data.capacidad))) {
        throw new Error('La capacidad debe ser un número entero positivo');
    }
    
    if (data.descripcion && data.descripcion.trim() === '') {
        throw new Error('La descripción no puede estar vacía');
    }
    
    if (data.direccion && data.direccion.trim() === '') {
        throw new Error('La dirección no puede estar vacía');
    }
    
    if (data.ubicacion && data.ubicacion.trim() === '') {
        throw new Error('La ubicación no puede estar vacía');
    }

    try {
        const nuevaCancha = await CanchaRepository.crearCancha({
            ...data,
            estado: true // Siempre crear activa
        });
        return nuevaCancha;
    } catch (error) {
        throw new Error(`Error al crear la cancha: ${error.message}`);
    }
};

// READ - Obtener todas las canchas activas
const obtenerCanchas = async () => {
    try {
        const canchas = await CanchaRepository.obtenerCanchas();
        
        if (!canchas || canchas.length === 0) {
            throw new Error('No hay canchas registradas');
        }
        
        return canchas;
    } catch (error) {
        throw new Error(`Error al obtener canchas: ${error.message}`);
    }
};

// READ - Obtener una cancha por ID
const obtenerCanchaPorId = async (id_cancha) => {
    // Validar ID
    if (!id_cancha || !Number.isInteger(parseInt(id_cancha))) {
        throw new Error('El ID de la cancha debe ser un número válido');
    }
    
    try {
        const cancha = await CanchaRepository.obtenerCanchaPorId(id_cancha);
        
        if (!cancha) {
            throw new Error('La cancha no existe');
        }
        
        return cancha;
    } catch (error) {
        throw new Error(`Error al obtener la cancha: ${error.message}`);
    }
};

// UPDATE
const actualizarCancha = async (id_cancha, data) => {
    // Validar ID
    if (!id_cancha || !Number.isInteger(parseInt(id_cancha))) {
        throw new Error('El ID de la cancha debe ser un número válido');
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
        if (data.nombre.length < 3 || data.nombre.length > 255) {
            throw new Error('El nombre debe tener entre 3 y 255 caracteres');
        }
    }
    
    if (data.tipo !== undefined) {
        const tiposValidos = ['coliseo', 'abierta', 'otro'];
        if (!tiposValidos.includes(data.tipo)) {
            throw new Error(`El tipo debe ser uno de: ${tiposValidos.join(', ')}`);
        }
    }
    
    if (data.capacidad !== undefined) {
        if (data.capacidad <= 0 || !Number.isInteger(data.capacidad)) {
            throw new Error('La capacidad debe ser un número entero positivo');
        }
    }
    
    if (data.descripcion !== undefined && data.descripcion.trim() === '') {
        throw new Error('La descripción no puede estar vacía');
    }
    
    if (data.direccion !== undefined && data.direccion.trim() === '') {
        throw new Error('La dirección no puede estar vacía');
    }
    
    if (data.ubicacion !== undefined && data.ubicacion.trim() === '') {
        throw new Error('La ubicación no puede estar vacía');
    }
    
    // No permitir cambiar estado o fecha de registro desde aquí
    delete data.estado;
    delete data.freg;
    
    try {
        const cancha = await CanchaRepository.actualizarCancha(id_cancha, data);
        
        if (!cancha) {
            throw new Error('La cancha no existe');
        }
        
        return cancha;
    } catch (error) {
        throw new Error(`Error al actualizar la cancha: ${error.message}`);
    }
};

// DELETE (soft delete - cambiar estado a false)
const eliminarCancha = async (id_cancha) => {
    // Validar ID
    if (!id_cancha || !Number.isInteger(parseInt(id_cancha))) {
        throw new Error('El ID de la cancha debe ser un número válido');
    }
    
    try {
        // Verificar que existe y está activa
        const cancha = await CanchaRepository.obtenerCanchaPorId(id_cancha);
        if (!cancha) {
            throw new Error('La cancha no existe');
        }
        
        if (!cancha.estado) {
            throw new Error('La cancha ya está eliminada');
        }
        
        // Llamar al repositorio para desactivar
        const canchaeliminada = await CanchaRepository.eliminarCancha(id_cancha);
        
        return canchaeliminada;
    } catch (error) {
        throw new Error(`Error al eliminar la cancha: ${error.message}`);
    }
};

// BONUS: Obtener todas las canchas (incluyendo inactivas)
const obtenerTodasLasCanchas = async () => {
    try {
        return await CanchaRepository.obtenerTodasLasCanchas();
    } catch (error) {
        throw new Error(`Error al obtener todas las canchas: ${error.message}`);
    }
};

module.exports = {
    crearCancha,
    obtenerCanchaPorId,
    obtenerCanchas,
    actualizarCancha,
    eliminarCancha,
    obtenerTodasLasCanchas
};