const { Club } = require('../models');

// CREATE
const crearClub = async (data) => {
    return await Club.create(data);
};

// READ - Obtener todos los clubes activos
const obtenerClubs = async () => {
    return await Club.findAll({ 
        where: { estado: true }
    });
};

// READ - Obtener TODOS los clubes (incluyendo inactivos)
const obtenerTodosLosClubs = async () => {
    return await Club.findAll();
};

// READ - Obtener un club por ID
const obtenerClubPorId = async (id_club) => {
    return await Club.findByPk(id_club);
};

// READ - Obtener club por nombre
const obtenerClubPorNombre = async (nombre) => {
    return await Club.findOne({
        where: { nombre: nombre }
    });
};

// UPDATE
const actualizarClub = async (id_club, data) => {
    const club = await Club.findByPk(id_club);
    if (!club) {
        return null;
    }
    return await club.update(data);
};

// DELETE (soft delete - cambiar estado a false)
const eliminarClub = async (id_club) => {
    const club = await Club.findByPk(id_club);
    if (!club) {
        return null;
    }
    
    return await club.update({ estado: false });
};

// BONUS: Obtener clubes con sus relaciones (Equipos, Técnicos, Jugadores)
const obtenerClubConRelaciones = async (id_club) => {
    return await Club.findByPk(id_club, {
        include: [
            { model: 'Equipo', as: 'equipos' },
            { model: 'EqTecnico', as: 'tecnicos' },
            { model: 'Jugador', as: 'jugadores' }
        ]
    });
};

module.exports = {
    crearClub,
    obtenerClubs,
    obtenerTodosLosClubs,
    obtenerClubPorId,
    obtenerClubPorNombre,
    actualizarClub,
    eliminarClub,
    obtenerClubConRelaciones
};