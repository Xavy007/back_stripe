// services/provinciaService.js
const repo = require('../repositories/provinciaRepository');

const listarProvincias = async (filtros = {}) => {
  return await repo.obtenerProvincias(filtros);
};

const obtenerProvincia = async (id) => {
  const provincia = await repo.obtenerProvinciaPorId(id);
  if (!provincia) throw new Error('Provincia no encontrada');
  return provincia;
};

const crearProvincia = async (data) => {
  if (!data.nombre) throw new Error('El nombre es obligatorio');
  if (!data.id_departamento) throw new Error('El departamento es obligatorio');

  return await repo.crearProvincia({
    nombre: data.nombre,
    id_departamento: data.id_departamento
  });
};

const actualizarProvincia = async (id, data) => {
  const actualizada = await repo.actualizarProvincia(id, data);
  if (!actualizada) throw new Error('Provincia no encontrada');
  return actualizada;
};

const eliminarProvincia = async (id) => {
  const eliminada = await repo.eliminarProvincia(id);
  if (!eliminada) throw new Error('Provincia no encontrada');
  return true;
};

module.exports = {
  listarProvincias,
  obtenerProvincia,
  crearProvincia,
  actualizarProvincia,
  eliminarProvincia
};
