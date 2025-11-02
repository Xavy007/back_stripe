const CategoriaService = require('../services/categoriaService');

// CREATE - Crear una nueva categoría
const crearCategoria = async (req, res) => {
    try {
        const categoria = await CategoriaService.crearCategoria(req.body);
        res.status(201).json({
            success: true,
            message: 'Categoría creada exitosamente',
            data: categoria
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener todas las categorías activas
const obtenerCategorias = async (req, res) => {
    try {
        const categorias = await CategoriaService.obtenerCategorias();
        res.status(200).json({
            success: true,
            message: 'Categorías obtenidas exitosamente',
            data: categorias,
            total: categorias.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener todas las categorías (incluyendo inactivas)
const obtenerTodasLasCategorias = async (req, res) => {
    try {
        const categorias = await CategoriaService.obtenerTodasLasCategorias();
        res.status(200).json({
            success: true,
            message: 'Todas las categorías obtenidas exitosamente',
            data: categorias,
            total: categorias.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener una categoría por ID (desde params)
const obtenerCategoriaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const categoria = await CategoriaService.obtenerCategoriaPorId(id);
        res.status(200).json({
            success: true,
            message: 'Categoría obtenida exitosamente',
            data: categoria
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener una categoría por ID (desde body)
const getbyId = async (req, res) => {
    try {
        const { id } = req.body;
        const categoria = await CategoriaService.getbyId(id);
        res.status(200).json({
            success: true,
            message: 'Categoría obtenida exitosamente',
            data: categoria
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener categorías por género
const obtenerCategoriasPorGenero = async (req, res) => {
    try {
        const { genero } = req.params;
        const categorias = await CategoriaService.obtenerCategoriasPorGenero(genero);
        res.status(200).json({
            success: true,
            message: `Categorías de género ${genero} obtenidas exitosamente`,
            data: categorias,
            total: categorias.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener categorías por edad
const obtenerCategoriasPorEdad = async (req, res) => {
    try {
        const { edad } = req.params;
        const categorias = await CategoriaService.obtenerCategoriasPorEdad(parseInt(edad));
        res.status(200).json({
            success: true,
            message: `Categorías para la edad ${edad} obtenidas exitosamente`,
            data: categorias,
            total: categorias.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE - Actualizar una categoría
const actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const categoria = await CategoriaService.actualizarCategoria(id, req.body);
        res.status(200).json({
            success: true,
            message: 'Categoría actualizada exitosamente',
            data: categoria
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE - Eliminar (desactivar) una categoría
const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const categoria = await CategoriaService.eliminarCategoria(id);
        res.status(200).json({
            success: true,
            message: 'Categoría eliminada exitosamente',
            data: categoria
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerTodasLasCategorias,
    obtenerCategoriaPorId,
    getbyId,
    obtenerCategoriasPorGenero,
    obtenerCategoriasPorEdad,
    actualizarCategoria,
    eliminarCategoria
};