// repositories/juez.repository.js
const { Juez, Persona } = require('../models');

// LISTAR jueces (solo estado = true)
const obtenerJueces = async () => {
  return Juez.findAll({
    where: { estado: true },
    include: [{ model: Persona, as: 'persona' }]
  });
};

// OBTENER por ID
const obtenerJuezPorId = async (id_juez) => {
  return Juez.findByPk(id_juez, {
    include: [{ model: Persona, as: 'persona' }]
  });
};

// CREAR juez (espera id_persona ya creado)
const crearJuez = async (data, { transaction } = {}) => {
  return Juez.create(data, { transaction });
};

// ACTUALIZAR juez
const actualizarJuez = async (id_juez, data, { transaction } = {}) => {
  const juez = await Juez.findByPk(id_juez);
  if (!juez) return null;
  return juez.update(data, { transaction });
};

// SOFT DELETE juez (estado = false)
const softDeleteJuez = async (id_juez, { transaction } = {}) => {
  const juez = await Juez.findByPk(id_juez);
  if (!juez) return null;
  return juez.update({ estado: false }, { transaction });
};

module.exports = {
  obtenerJueces,
  obtenerJuezPorId,
  crearJuez,
  actualizarJuez,
  softDeleteJuez
};
