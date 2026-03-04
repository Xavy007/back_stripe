const { Campeonato, CampeonatoCategoria, Categoria } = require('../models');

// CREATE
const crearCampeonato = async (data) => {
    return await Campeonato.create(data);
};

// READ - Obtener todos los campeonatos activos
const obtenerCampeonatos = async () => {
    return await Campeonato.findAll({
        where: { estado: true },
        include: [
            {
                model: CampeonatoCategoria,
                as: 'campeonatoCategorias',
                include: [
                    {
                        model: Categoria,
                        as: 'categoria'
                    }
                ]
            }
        ]
    });
};

// READ - Obtener TODOS los campeonatos (incluyendo inactivos)
const obtenerTodosLosCampeonatos = async () => {
    return await Campeonato.findAll();
};

// READ - Obtener un campeonato por ID
const obtenerCampeonatoPorId = async (id_campeonato) => {
    return await Campeonato.findByPk(id_campeonato);
};

// READ - Obtener campeonato por ID con relaciones
const obtenerCampeonatoConRelaciones = async (id_campeonato) => {
    return await Campeonato.findByPk(id_campeonato, {
        include: [
            { model: 'Partido', as: 'partidos' },
            { model: 'Grupo', as: 'grupos' },
            { model: 'CampeonatoCategoria', as: 'categorias' },
            { model: 'GestionCampeonato', as: 'gestion' }
        ]
    });
};

// READ - Obtener campeonatos por tipo
const obtenerCampeonatosPorTipo = async (tipo) => {
    return await Campeonato.findAll({
        where: { 
            tipo: tipo,
            estado: true 
        }
    });
};

// READ - Obtener campeonatos por estado
const obtenerCampeonatosPorEstado = async (c_estado) => {
    return await Campeonato.findAll({
        where: { 
            c_estado: c_estado,
            estado: true 
        }
    });
};

// READ - Obtener campeonatos por gestión
const obtenerCampeonatosPorGestion = async (id_gestion) => {
    return await Campeonato.findAll({
        where: { 
            id_gestion: id_gestion,
            estado: true 
        }
    });
};

// UPDATE
const actualizarCampeonato = async (id_campeonato, data) => {
    const campeonato = await Campeonato.findByPk(id_campeonato);
    if (!campeonato) {
        return null;
    }
    return await campeonato.update(data);
};

// DELETE (soft delete - cambiar estado a false)
const eliminarCampeonato = async (id_campeonato) => {
    const campeonato = await Campeonato.findByPk(id_campeonato);
    if (!campeonato) {
        return null;
    }
    
    return await campeonato.update({ estado: false });
};

module.exports = {
    crearCampeonato,
    obtenerCampeonatos,
    obtenerTodosLosCampeonatos,
    obtenerCampeonatoPorId,
    obtenerCampeonatoConRelaciones,
    obtenerCampeonatosPorTipo,
    obtenerCampeonatosPorEstado,
    obtenerCampeonatosPorGestion,
    actualizarCampeonato,
    eliminarCampeonato
};