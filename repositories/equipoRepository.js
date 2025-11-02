const { Equipo } = require('../models');

// CREATE
const crearEquipo = async (data) => {
    return await Equipo.create(data);
};

// READ - Obtener todos los equipos activos
const obtenerEquipos = async () => {
    return await Equipo.findAll({ 
        where: { estado: true }
    });
};

// READ - Obtener TODOS los equipos (incluyendo inactivos)
const obtenerTodosLosEquipos = async () => {
    return await Equipo.findAll();
};

// READ - Obtener un equipo por ID
const obtenerEquipoPorId = async (id_equipo) => {
    return await Equipo.findByPk(id_equipo);
};

// READ - Obtener equipos por club
const obtenerEquiposPorClub = async (id_club) => {
    return await Equipo.findAll({
        where: { 
            id_club: id_club,
            estado: true 
        }
    });
};

// READ - Obtener equipos por categoría
const obtenerEquiposPorCategoria = async (id_categoria) => {
    return await Equipo.findAll({
        where: { 
            id_categoria: id_categoria,
            estado: true 
        }
    });
};

// READ - Obtener equipos por club y categoría
const obtenerEquiposPorClubYCategoria = async (id_club, id_categoria) => {
    return await Equipo.findAll({
        where: { 
            id_club: id_club,
            id_categoria: id_categoria,
            estado: true 
        }
    });
};

// READ - Obtener equipo con relaciones
const obtenerEquipoConRelaciones = async (id_equipo) => {
    return await Equipo.findByPk(id_equipo, {
            include: [
                        { model: Participacion },
                        { model: TablaPosicion },
                        { model: HistorialCampeonato }
                    ]
    });
};

// UPDATE
const actualizarEquipo = async (id_equipo, data) => {
    const equipo = await Equipo.findByPk(id_equipo);
    if (!equipo) {
        return null;
    }
    return await equipo.update(data);
};

// DELETE (soft delete - cambiar estado a false)
const eliminarEquipo = async (id_equipo) => {
    const equipo = await Equipo.findByPk(id_equipo);
    if (!equipo) {
        return null;
    }
    
    return await equipo.update({ estado: false });
};

module.exports = {
    crearEquipo,
    obtenerEquipos,
    obtenerTodosLosEquipos,
    obtenerEquipoPorId,
    obtenerEquiposPorClub,
    obtenerEquiposPorCategoria,
    obtenerEquiposPorClubYCategoria,
    obtenerEquipoConRelaciones,
    actualizarEquipo,
    eliminarEquipo
};