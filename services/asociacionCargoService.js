const repo = require('../repositories/asociacionCargoRepository');

const listar = async () => {
  const data = await repo.listar();
  return { success: true, data };
};

const listarPorGestion = async (id_gestion) => {
  const data = await repo.listarPorGestion(id_gestion);
  return { success: true, data };
};

const obtener = async (id_cargo) => {
  const data = await repo.obtener(id_cargo);
  if (!data) throw new Error('Cargo no encontrado');
  return { success: true, data };
};

const crear = async (datos) => {
  const data = await repo.crear(datos);
  return { success: true, message: 'Cargo registrado correctamente', data };
};

const actualizar = async (id_cargo, datos) => {
  const data = await repo.actualizar(id_cargo, datos);
  return { success: true, message: 'Cargo actualizado correctamente', data };
};

const eliminar = async (id_cargo) => {
  await repo.eliminar(id_cargo);
  return { success: true, message: 'Cargo eliminado correctamente' };
};

module.exports = { listar, listarPorGestion, obtener, crear, actualizar, eliminar };
