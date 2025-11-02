const CampeonatoCategoriaRepository = require('../repositories/campeonatoCategoriaRepository');
const { Campeonato, Categoria } = require('../models');

const FORMATO_VALUES = ['todos_vs_todos', 'eliminacion_directa', 'grupos_y_eliminacion', 'liga'];

// CREATE
const crearCampeonatoCategoria = async (data) => {
    // Validaciones de campos obligatorios
    if (!data.id_campeonato || !Number.isInteger(data.id_campeonato)) {
        throw new Error('El ID del campeonato es obligatorio y debe ser un número');
    }
    
    if (!data.id_categoria || !Number.isInteger(data.id_categoria)) {
        throw new Error('El ID de la categoría es obligatorio y debe ser un número');
    }
    
    if (!data.formato) {
        throw new Error('El formato es obligatorio');
    }
    
    if (!FORMATO_VALUES.includes(data.formato)) {
        throw new Error(`El formato debe ser uno de: ${FORMATO_VALUES.join(', ')}`);
    }
    
    // Validar que el campeonato existe
    const campeonato = await Campeonato.findByPk(data.id_campeonato);
    if (!campeonato) {
        throw new Error('El campeonato especificado no existe');
    }
    
    // Validar que la categoría existe
    const categoria = await Categoria.findByPk(data.id_categoria);
    if (!categoria) {
        throw new Error('La categoría especificada no existe');
    }
    
    // Validar que no exista ya esta combinación
    const existe = await CampeonatoCategoriaRepository.obtenerCampeonatoCategoriaPorCampeonatoYCategoria(
        data.id_campeonato, 
        data.id_categoria
    );
    if (existe) {
        throw new Error('Ya existe esta combinación de campeonato y categoría');
    }
    
    // Validar numero_grupos si se proporciona y el formato es grupos_y_eliminacion
    if (data.numero_grupos !== undefined && data.numero_grupos !== null) {
        if (!Number.isInteger(data.numero_grupos) || data.numero_grupos < 2) {
            throw new Error('El número de grupos debe ser un número entero mayor o igual a 2');
        }
        
        if (data.formato !== 'grupos_y_eliminacion') {
            throw new Error('El número de grupos solo se puede usar con formato "grupos_y_eliminacion"');
        }
    }

    try {
        const nuevaCC = await CampeonatoCategoriaRepository.crearCampeonatoCategoria({
            ...data,
            formato: data.formato.toLowerCase(),
            estado: true // Siempre crear activa
        });
        return nuevaCC;
    } catch (error) {
        throw new Error(`Error al crear la campeonato-categoría: ${error.message}`);
    }
};

// READ - Obtener todas las campeonato-categorías activas
const obtenerCampeonatoCategorias = async () => {
    try {
        const ccs = await CampeonatoCategoriaRepository.obtenerCampeonatoCategorias();
        
        if (!ccs) {
            return [];
        }
        
        return ccs;
    } catch (error) {
        throw new Error(`Error al obtener campeonato-categorías: ${error.message}`);
    }
};

// READ - Obtener TODAS las campeonato-categorías (incluyendo inactivas)
const obtenerTodasLasCampeonatoCategorias = async () => {
    try {
        const ccs = await CampeonatoCategoriaRepository.obtenerTodasLasCampeonatoCategorias();
        
        if (!ccs) {
            return [];
        }
        
        return ccs;
    } catch (error) {
        throw new Error(`Error al obtener todas las campeonato-categorías: ${error.message}`);
    }
};

// READ - Obtener una campeonato-categoría por ID
const obtenerCampeonatoCategoriaPorId = async (id_cc) => {
    // Validar ID
    if (!id_cc || !Number.isInteger(parseInt(id_cc))) {
        throw new Error('El ID de la campeonato-categoría debe ser un número válido');
    }
    
    try {
        const cc = await CampeonatoCategoriaRepository.obtenerCampeonatoCategoriaPorId(id_cc);
        
        if (!cc) {
            throw new Error('La campeonato-categoría no existe');
        }
        
        return cc;
    } catch (error) {
        throw new Error(`Error al obtener la campeonato-categoría: ${error.message}`);
    }
};

// READ - Obtener campeonato-categoría por ID (desde body)
const getbyId = async (id_cc) => {
    if (!id_cc || !Number.isInteger(parseInt(id_cc))) {
        throw new Error('El ID de la campeonato-categoría debe ser un número válido');
    }
    
    try {
        const cc = await CampeonatoCategoriaRepository.obtenerCampeonatoCategoriaPorId(id_cc);
        
        if (!cc) {
            throw new Error('La campeonato-categoría no existe');
        }
        
        return cc;
    } catch (error) {
        throw new Error(`Error al obtener la campeonato-categoría: ${error.message}`);
    }
};

// READ - Obtener campeonato-categorías por campeonato
const obtenerCampeonatoCategoriasPorCampeonato = async (id_campeonato) => {
    if (!id_campeonato || !Number.isInteger(parseInt(id_campeonato))) {
        throw new Error('El ID del campeonato debe ser un número válido');
    }
    
    try {
        const campeonato = await Campeonato.findByPk(id_campeonato);
        if (!campeonato) {
            throw new Error('El campeonato especificado no existe');
        }
        
        const ccs = await CampeonatoCategoriaRepository.obtenerCampeonatoCategoriasPorCampeonato(id_campeonato);
        
        if (!ccs) {
            return [];
        }
        
        return ccs;
    } catch (error) {
        throw new Error(`Error al obtener campeonato-categorías por campeonato: ${error.message}`);
    }
};

// READ - Obtener campeonato-categorías por categoría
const obtenerCampeonatoCategoriasPorCategoria = async (id_categoria) => {
    if (!id_categoria || !Number.isInteger(parseInt(id_categoria))) {
        throw new Error('El ID de la categoría debe ser un número válido');
    }
    
    try {
        const categoria = await Categoria.findByPk(id_categoria);
        if (!categoria) {
            throw new Error('La categoría especificada no existe');
        }
        
        const ccs = await CampeonatoCategoriaRepository.obtenerCampeonatoCategoriasPorCategoria(id_categoria);
        
        if (!ccs) {
            return [];
        }
        
        return ccs;
    } catch (error) {
        throw new Error(`Error al obtener campeonato-categorías por categoría: ${error.message}`);
    }
};

// READ - Obtener campeonato-categorías por formato
const obtenerCampeonatoCategoriasPorFormato = async (formato) => {
    if (!formato || !FORMATO_VALUES.includes(formato.toLowerCase())) {
        throw new Error(`El formato debe ser uno de: ${FORMATO_VALUES.join(', ')}`);
    }
    
    try {
        const ccs = await CampeonatoCategoriaRepository.obtenerCampeonatoCategoriasPorFormato(formato.toLowerCase());
        
        if (!ccs) {
            return [];
        }
        
        return ccs;
    } catch (error) {
        throw new Error(`Error al obtener campeonato-categorías por formato: ${error.message}`);
    }
};

// UPDATE
const actualizarCampeonatoCategoria = async (id_cc, data) => {
    // Validar ID
    if (!id_cc || !Number.isInteger(parseInt(id_cc))) {
        throw new Error('El ID de la campeonato-categoría debe ser un número válido');
    }
    
    // Validar que tenga datos para actualizar
    if (!data || Object.keys(data).length === 0) {
        throw new Error('Debes proporcionar datos para actualizar');
    }
    
    // Validar campos actualizables
    if (data.formato !== undefined) {
        if (!FORMATO_VALUES.includes(data.formato.toLowerCase())) {
            throw new Error(`El formato debe ser uno de: ${FORMATO_VALUES.join(', ')}`);
        }
        data.formato = data.formato.toLowerCase();
    }
    
    if (data.numero_grupos !== undefined && data.numero_grupos !== null) {
        if (!Number.isInteger(data.numero_grupos) || data.numero_grupos < 2) {
            throw new Error('El número de grupos debe ser un número entero mayor o igual a 2');
        }
    }
    
    // No permitir cambiar estado, campeonato, categoría o fecha de registro desde aquí
    delete data.estado;
    delete data.freg;
    delete data.id_campeonato;
    delete data.id_categoria;
    
    try {
        const cc = await CampeonatoCategoriaRepository.actualizarCampeonatoCategoria(id_cc, data);
        
        if (!cc) {
            throw new Error('La campeonato-categoría no existe');
        }
        
        return cc;
    } catch (error) {
        throw new Error(`Error al actualizar la campeonato-categoría: ${error.message}`);
    }
};

// DELETE (soft delete - cambiar estado a false)
const eliminarCampeonatoCategoria = async (id_cc) => {
    // Validar ID
    if (!id_cc || !Number.isInteger(parseInt(id_cc))) {
        throw new Error('El ID de la campeonato-categoría debe ser un número válido');
    }
    
    try {
        // Verificar que existe y está activa
        const cc = await CampeonatoCategoriaRepository.obtenerCampeonatoCategoriaPorId(id_cc);
        if (!cc) {
            throw new Error('La campeonato-categoría no existe');
        }
        
        if (!cc.estado) {
            throw new Error('La campeonato-categoría ya está eliminada');
        }
        
        // Llamar al repositorio para desactivar
        const ccEliminada = await CampeonatoCategoriaRepository.eliminarCampeonatoCategoria(id_cc);
        
        return ccEliminada;
    } catch (error) {
        throw new Error(`Error al eliminar la campeonato-categoría: ${error.message}`);
    }
};

module.exports = {
    crearCampeonatoCategoria,
    obtenerCampeonatoCategorias,
    obtenerTodasLasCampeonatoCategorias,
    obtenerCampeonatoCategoriaPorId,
    getbyId,
    obtenerCampeonatoCategoriasPorCampeonato,
    obtenerCampeonatoCategoriasPorCategoria,
    obtenerCampeonatoCategoriasPorFormato,
    actualizarCampeonatoCategoria,
    eliminarCampeonatoCategoria
};