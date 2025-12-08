// services/juez.service.js
const { sequelize, Persona } = require('../models');
const {
  obtenerJueces,
  obtenerJuezPorId,
  crearJuez,
  actualizarJuez,
  softDeleteJuez
} = require('../repositories/juezRepository');

// LISTAR
const getJueces = async () => {
  return obtenerJueces();
};

// DETALLE
const getJuezPorId = async (id_juez) => {
  return obtenerJuezPorId(id_juez);
};

// CREAR Persona + Juez en una transacción
const createJuez = async (payload) => {
  const transaction = await sequelize.transaction();
  try {
    const { persona: personaData, juez: juezData } = payload;

    // 1) Crear Persona
    const persona = await Persona.create(personaData, { transaction });

    // 2) Crear Juez vinculado
    const nuevoJuez = await crearJuez(
      {
        ...juezData,
        id_persona: persona.id_persona
      },
      { transaction }
    );

    await transaction.commit();

    // Recargar con include de Persona
    const juezConPersona = await obtenerJuezPorId(nuevoJuez.id_juez);
    return juezConPersona;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// ACTUALIZAR Persona + Juez
const updateJuez = async (id_juez, payload) => {
  const transaction = await sequelize.transaction();
  try {
    const juezExistente = await obtenerJuezPorId(id_juez);
    if (!juezExistente) {
      await transaction.rollback();
      return null;
    }

    const { persona: personaData, juez: juezData } = payload;

    // Actualizar Persona si viene en el payload
    if (personaData) {
      const persona = await Persona.findByPk(juezExistente.id_persona);
      if (!persona) {
        throw new Error('Persona asociada no encontrada');
      }
      await persona.update(personaData, { transaction });
    }

    // Actualizar Juez
    if (juezData) {
      await actualizarJuez(
        id_juez,
        {
          ...juezData
        },
        { transaction }
      );
    }

    await transaction.commit();
    return obtenerJuezPorId(id_juez);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// SOFT DELETE
const deleteJuez = async (id_juez) => {
  const transaction = await sequelize.transaction();
  try {
    const juez = await softDeleteJuez(id_juez, { transaction });
    await transaction.commit();
    return juez;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  getJueces,
  getJuezPorId,
  createJuez,
  updateJuez,
  deleteJuez
};
