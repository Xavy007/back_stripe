// repositories/provinciaRepository.js
const { Provincia, Departamento } = require('../models');

// Crear provincia
const crearProvincia = async (data) => {
  return await Provincia.create(data);
};

// Obtener todas las provincias (opcionalmente filtradas por departamento)
const obtenerProvincias = async (filtros = {}) => {
  const where = {};

  if (filtros.id_departamento) {
    where.id_departamento = filtros.id_departamento;
  }

  return await Provincia.findAll({
    where,
    include: [
      {
        model: Departamento,
        as: 'departamento',
        attributes: ['id_departamento', 'nombre']
      }
    ],
    order: [['id_provincia', 'ASC']]
  });
};

// Obtener una provincia por id
const obtenerProvinciaPorId = async (id_provincia) => {
  return await Provincia.findByPk(id_provincia, {
    include: [
      {
        model: Departamento,
        as: 'departamento',
        attributes: ['id_departamento', 'nombre']
      }
    ]
  });
};

// Actualizar provincia
const actualizarProvincia = async (id_provincia, data) => {
  const provincia = await Provincia.findByPk(id_provincia);
  if (!provincia) return null;
  return await provincia.update(data);
};

// Eliminar provincia (DELETE real, no soft delete)
const eliminarProvincia = async (id_provincia) => {
  const provincia = await Provincia.findByPk(id_provincia);
  if (!provincia) return null;
  return await provincia.destroy();
};

module.exports = {
  crearProvincia,
  obtenerProvincias,
  obtenerProvinciaPorId,
  actualizarProvincia,
  eliminarProvincia
};
