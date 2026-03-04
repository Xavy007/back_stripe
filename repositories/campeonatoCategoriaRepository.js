const { CampeonatoCategoria, Categoria, Campeonato } = require('../models');

// CREATE
const crearCampeonatoCategoria = async (data) => {
    return await CampeonatoCategoria.create(data);
};

// READ - Obtener todas las campeonato-categorías activas
const obtenerCampeonatoCategorias = async () => {
    return await CampeonatoCategoria.findAll({
        where: { estado: true },
        include: [
            {
                model: Categoria,
                as: 'categoria',
                attributes: ['id_categoria', 'nombre', 'descripcion', 'genero']
            },
            {
                model: Campeonato,
                as: 'campeonato',
                attributes: ['id_campeonato', 'nombre', 'tipo']
            }
        ]
    });
};

// READ - Obtener TODAS las campeonato-categorías (incluyendo inactivas)
const obtenerTodasLasCampeonatoCategorias = async () => {
    return await CampeonatoCategoria.findAll();
};

// READ - Obtener una campeonato-categoría por ID
const obtenerCampeonatoCategoriaPorId = async (id_cc) => {
    return await CampeonatoCategoria.findByPk(id_cc, {
        include: [
            {
                model: Categoria,
                as: 'categoria',
                attributes: ['id_categoria', 'nombre', 'descripcion', 'genero', 'edad_inicio', 'edad_limite']
            },
            {
                model: Campeonato,
                as: 'campeonato',
                attributes: ['id_campeonato', 'nombre', 'tipo']
            }
        ]
    });
};

// READ - Obtener campeonato-categorías por campeonato
const obtenerCampeonatoCategoriasPorCampeonato = async (id_campeonato) => {
    return await CampeonatoCategoria.findAll({
        where: {
            id_campeonato: id_campeonato,
            estado: true
        },
        include: [
            {
                model: Categoria,
                as: 'categoria',
                attributes: ['id_categoria', 'nombre', 'descripcion', 'genero', 'edad_inicio', 'edad_limite']
            }
        ]
    });
};

// READ - Obtener campeonato-categorías por categoría
const obtenerCampeonatoCategoriasPorCategoria = async (id_categoria) => {
    return await CampeonatoCategoria.findAll({
        where: { 
            id_categoria: id_categoria,
            estado: true 
        }
    });
};

// READ - Obtener campeonato-categorías por formato
const obtenerCampeonatoCategoriasPorFormato = async (formato) => {
    return await CampeonatoCategoria.findAll({
        where: { 
            formato: formato,
            estado: true 
        }
    });
};

// READ - Obtener campeonato-categoría por campeonato y categoría
const obtenerCampeonatoCategoriaPorCampeonatoYCategoria = async (id_campeonato, id_categoria) => {
    return await CampeonatoCategoria.findOne({
        where: { 
            id_campeonato: id_campeonato,
            id_categoria: id_categoria
        }
    });
};

// UPDATE
const actualizarCampeonatoCategoria = async (id_cc, data) => {
    const cc = await CampeonatoCategoria.findByPk(id_cc);
    if (!cc) {
        return null;
    }
    return await cc.update(data);
};

// DELETE (soft delete - cambiar estado a false)
const eliminarCampeonatoCategoria = async (id_cc) => {
    const cc = await CampeonatoCategoria.findByPk(id_cc);
    if (!cc) {
        return null;
    }
    
    return await cc.update({ estado: false });
};

module.exports = {
    crearCampeonatoCategoria,
    obtenerCampeonatoCategorias,
    obtenerTodasLasCampeonatoCategorias,
    obtenerCampeonatoCategoriaPorId,
    obtenerCampeonatoCategoriasPorCampeonato,
    obtenerCampeonatoCategoriasPorCategoria,
    obtenerCampeonatoCategoriasPorFormato,
    obtenerCampeonatoCategoriaPorCampeonatoYCategoria,
    actualizarCampeonatoCategoria,
    eliminarCampeonatoCategoria
};