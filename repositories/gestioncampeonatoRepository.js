const { GestionCampeonato } = require('../models');

// CREATE
const crearGestion = async (data) => {
    return await GestionCampeonato.create(data);
};

// READ - Obtener todas las gestiones activas
const obtenerGestiones = async () => {
    return await GestionCampeonato.findAll({ 
        where: { estado: true }
    });
};

// READ - Obtener TODAS las gestiones (incluyendo inactivas)
const obtenerTodasLasGestiones = async () => {
    return await GestionCampeonato.findAll();
};

// READ - Obtener una gestión por ID
const obtenerGestionPorId = async (id_gestion) => {
    return await GestionCampeonato.findByPk(id_gestion);
};

// READ - Obtener gestión por año
const obtenerGestionPorAno = async (gestion) => {
    return await GestionCampeonato.findOne({
        where: { gestion: gestion }
    });
};

// READ - Obtener gestión con campeonatos
const obtenerGestionConCampeonatos = async (id_gestion) => {
    return await GestionCampeonato.findByPk(id_gestion, {
        include: [
            { model: 'Campeonato', as: 'campeonatos' }
        ]
    });
};

// UPDATE
const actualizarGestion = async (id_gestion, data) => {
    const gestion = await GestionCampeonato.findByPk(id_gestion);
    if (!gestion) {
        return null;
    }
    return await gestion.update(data);
};

// DELETE (soft delete - cambiar estado a false)
const eliminarGestion = async (id_gestion) => {
    const gestion = await GestionCampeonato.findByPk(id_gestion);
    if (!gestion) {
        return null;
    }
    
    return await gestion.update({ estado: false });
};

module.exports = {
    crearGestion,
    obtenerGestiones,
    obtenerTodasLasGestiones,
    obtenerGestionPorId,
    obtenerGestionPorAno,
    obtenerGestionConCampeonatos,
    actualizarGestion,
    eliminarGestion
};