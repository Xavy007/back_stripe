const CategoriaRepository = require('../repositories/categoriaRepository');

// CREATE
const crearCategoria = async (data) => {
    // Validaciones de campos obligatorios
    if (!data.nombre || data.nombre.trim() === '') {
        throw new Error('El nombre de la categoría es obligatorio');
    }
    
    if (!data.genero) {
        throw new Error('El género es obligatorio');
    }
    
    const generosValidos = ['masculino', 'femenino', 'mixto'];
    if (!generosValidos.includes(data.genero.toLowerCase())) {
        throw new Error(`El género debe ser uno de: ${generosValidos.join(', ')}`);
    }
    
    if (data.edad_inicio === undefined || data.edad_inicio === null) {
        throw new Error('La edad de inicio es obligatoria');
    }
    
    // Validar que edad_inicio sea un número entero
    if (!Number.isInteger(data.edad_inicio)) {
        throw new Error('La edad de inicio debe ser un número entero');
    }
    
    // Validar que edad_inicio sea mayor a 3
    if (data.edad_inicio < 4) {
        throw new Error('La edad de inicio debe ser mayor a 3 años');
    }
    
    // Validaciones opcionales
    if (data.edad_limite !== undefined && data.edad_limite !== null) {
        if (!Number.isInteger(data.edad_limite)) {
            throw new Error('La edad límite debe ser un número entero');
        }
        
        if (data.edad_limite < data.edad_inicio) {
            throw new Error('La edad límite no puede ser menor a la edad de inicio');
        }
    }
    
    if (data.descripcion && data.descripcion.trim() === '') {
        throw new Error('La descripción no puede estar vacía');
    }

    try {
        const nuevaCategoria = await CategoriaRepository.crearCategoria({
            ...data,
            genero: data.genero.toLowerCase(),
            estado: true // Siempre crear activa
        });
        return nuevaCategoria;
    } catch (error) {
        throw new Error(`Error al crear la categoría: ${error.message}`);
    }
};

// READ - Obtener todas las categorías activas
const obtenerCategorias = async () => {
    try {
        const categorias = await CategoriaRepository.obtenerCategorias();
        
        // Devolver vacío si no hay categorías en lugar de lanzar error
        if (!categorias) {
            return [];
        }
        
        return categorias;
    } catch (error) {
        throw new Error(`Error al obtener categorías: ${error.message}`);
    }
};

// READ - Obtener TODAS las categorías (incluyendo inactivas)
const obtenerTodasLasCategorias = async () => {
    try {
        const categorias = await CategoriaRepository.obtenerTodasLasCategorias();
        
        // Devolver vacío si no hay categorías en lugar de lanzar error
        if (!categorias) {
            return [];
        }
        
        return categorias;
    } catch (error) {
        throw new Error(`Error al obtener todas las categorías: ${error.message}`);
    }
};

// READ - Obtener una categoría por ID
const obtenerCategoriaPorId = async (id_categoria) => {
    // Validar ID
    if (!id_categoria || !Number.isInteger(parseInt(id_categoria))) {
        throw new Error('El ID de la categoría debe ser un número válido');
    }
    
    try {
        const categoria = await CategoriaRepository.obtenerCategoriaPorId(id_categoria);
        
        if (!categoria) {
            throw new Error('La categoría no existe');
        }
        
        return categoria;
    } catch (error) {
        throw new Error(`Error al obtener la categoría: ${error.message}`);
    }
};

// READ - Obtener categoría por ID (desde body)
const getbyId = async (id_categoria) => {
    if (!id_categoria || !Number.isInteger(parseInt(id_categoria))) {
        throw new Error('El ID de la categoría debe ser un número válido');
    }
    
    try {
        const categoria = await CategoriaRepository.obtenerCategoriaPorId(id_categoria);
        
        if (!categoria) {
            throw new Error('La categoría no existe');
        }
        
        return categoria;
    } catch (error) {
        throw new Error(`Error al obtener la categoría: ${error.message}`);
    }
};

// UPDATE
const actualizarCategoria = async (id_categoria, data) => {
    // Validar ID
    if (!id_categoria || !Number.isInteger(parseInt(id_categoria))) {
        throw new Error('El ID de la categoría debe ser un número válido');
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
    
    if (data.genero !== undefined) {
        const generosValidos = ['masculino', 'femenino', 'mixto'];
        if (!generosValidos.includes(data.genero.toLowerCase())) {
            throw new Error(`El género debe ser uno de: ${generosValidos.join(', ')}`);
        }
        data.genero = data.genero.toLowerCase();
    }
    
    if (data.edad_inicio !== undefined) {
        if (!Number.isInteger(data.edad_inicio)) {
            throw new Error('La edad de inicio debe ser un número entero');
        }
        if (data.edad_inicio < 4) {
            throw new Error('La edad de inicio debe ser mayor a 3 años');
        }
    }
    
    if (data.edad_limite !== undefined && data.edad_limite !== null) {
        if (!Number.isInteger(data.edad_limite)) {
            throw new Error('La edad límite debe ser un número entero');
        }
        
        // Obtener la edad_inicio actual si no está siendo actualizada
        const categoriaActual = await CategoriaRepository.obtenerCategoriaPorId(id_categoria);
        const edadInicio = data.edad_inicio !== undefined ? data.edad_inicio : categoriaActual.edad_inicio;
        
        if (data.edad_limite < edadInicio) {
            throw new Error('La edad límite no puede ser menor a la edad de inicio');
        }
    }
    
    if (data.descripcion !== undefined && data.descripcion.trim() === '') {
        throw new Error('La descripción no puede estar vacía');
    }
    
    // No permitir cambiar estado o fecha de registro desde aquí
    delete data.estado;
    delete data.freg;
    
    try {
        const categoria = await CategoriaRepository.actualizarCategoria(id_categoria, data);
        
        if (!categoria) {
            throw new Error('La categoría no existe');
        }
        
        return categoria;
    } catch (error) {
        throw new Error(`Error al actualizar la categoría: ${error.message}`);
    }
};

// DELETE (soft delete - cambiar estado a false)
const eliminarCategoria = async (id_categoria) => {
    // Validar ID
    if (!id_categoria || !Number.isInteger(parseInt(id_categoria))) {
        throw new Error('El ID de la categoría debe ser un número válido');
    }
    
    try {
        // Verificar que existe y está activa
        const categoria = await CategoriaRepository.obtenerCategoriaPorId(id_categoria);
        if (!categoria) {
            throw new Error('La categoría no existe');
        }
        
        if (!categoria.estado) {
            throw new Error('La categoría ya está eliminada');
        }
        
        // Llamar al repositorio para desactivar
        const categoriaEliminada = await CategoriaRepository.eliminarCategoria(id_categoria);
        
        return categoriaEliminada;
    } catch (error) {
        throw new Error(`Error al eliminar la categoría: ${error.message}`);
    }
};

// BONUS: Obtener categorías por género
const obtenerCategoriasPorGenero = async (genero) => {
    if (!genero || !['masculino', 'femenino', 'mixto'].includes(genero.toLowerCase())) {
        throw new Error('Debes proporcionar un género válido: masculino, femenino o mixto');
    }
    
    try {
        const categorias = await CategoriaRepository.obtenerCategoriasPorGenero(genero.toLowerCase());
        
        // Devolver vacío si no hay categorías en lugar de lanzar error
        if (!categorias) {
            return [];
        }
        
        return categorias;
    } catch (error) {
        throw new Error(`Error al obtener categorías por género: ${error.message}`);
    }
};

// BONUS: Obtener categorías por rango de edad
const obtenerCategoriasPorEdad = async (edad) => {
    if (!Number.isInteger(edad) || edad < 0) {
        throw new Error('La edad debe ser un número entero positivo');
    }
    
    try {
        const categorias = await CategoriaRepository.obtenerCategoriasPorEdad(edad);
        
        // Devolver vacío si no hay categorías en lugar de lanzar error
        if (!categorias) {
            return [];
        }
        
        return categorias;
    } catch (error) {
        throw new Error(`Error al obtener categorías por edad: ${error.message}`);
    }
};

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerTodasLasCategorias,
    obtenerCategoriaPorId,
    getbyId,
    actualizarCategoria,
    eliminarCategoria,
    obtenerCategoriasPorGenero,
    obtenerCategoriasPorEdad
};