// services/partido.service.js
const { sequelize } = require('../models');
const {
  obtenerPartidoPorId,
  obtenerPartidos,
  crearPartido,
  actualizarPartido,
  eliminarPartido,
  asignarJuecesYPlanillero
} = require('../repositories/partido.repository');
const { softDeletePartido, verificarCruceCancha } = require('../repositories/partidoRepository');

const getPartidoPorId = async (id_partido) => {
  return obtenerPartidoPorId(id_partido);
};

const getPartidos = async (filtros) => {
  return obtenerPartidos(filtros);
};

const createPartido = async (data) => {
  await verificarCruceCancha(data.id_cancha, data.fecha_hora);
  const transaction = await sequelize.transaction();
  try {
    const partido = await crearPartido(data, { transaction });
    await transaction.commit();
    return partido;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updatePartido = async (id_partido, data) => {
  if (data.id_cancha || data.fecha_hora) {
    // Resolve final values: merge incoming with existing if partial update
    const existing = await obtenerPartidoPorId(id_partido);
    const cancha   = data.id_cancha  ?? existing?.id_cancha;
    const fechaHora= data.fecha_hora ?? existing?.fecha_hora;
    await verificarCruceCancha(cancha, fechaHora, id_partido);
  }
  const transaction = await sequelize.transaction();
  try {
    const partidoActualizado = await actualizarPartido(id_partido, data, { transaction });
    await transaction.commit();
    return partidoActualizado;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const deletePartido = async (id_partido) => {
  const transaction = await sequelize.transaction();
  try {
    const partidoEliminado = await softDeletePartido(id_partido, { transaction });
    await transaction.commit();
    return partidoEliminado;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const assignOficiales = async (id_partido, payload) => {
  const transaction = await sequelize.transaction();
  try {
    const partido = await asignarJuecesYPlanillero(id_partido, payload, { transaction });
    await transaction.commit();
    return partido;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  getPartidoPorId,
  getPartidos,
  createPartido,
  updatePartido,
  deletePartido,
  assignOficiales
};
