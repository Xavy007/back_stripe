// src/repositories/eqTecnicoRepository.js
const { EqTecnico, Persona, Club } = require('../models');

// READ - Obtener todos los técnicos activos (estado = true)
const obtenerEqTecnicos = async () => {
  return await EqTecnico.findAll({
    where: { estado: true },
    include: [
      { model: Persona, as: 'persona' },
      { model: Club, as: 'club' }
    ],
    order: [['id_eqtecnico', 'ASC']]
  });
};

// READ - Obtener TODOS los técnicos (incluyendo inactivos)
const obtenerTodosLosEqTecnicos = async () => {
  return await EqTecnico.findAll({
    include: [
      { model: Persona, as: 'persona' },
      { model: Club, as: 'club' }
    ],
    order: [['id_eqtecnico', 'ASC']]
  });
};

// READ - Obtener un técnico por ID (solo activos por defecto)
const obtenerEqTecnicoPorId = async (id_eqtecnico, incluirInactivos = false) => {
  const where = { id_eqtecnico };
  if (!incluirInactivos) where.estado = true;

  return await EqTecnico.findOne({
    where,
    include: [
      { model: Persona, as: 'persona' },
      { model: Club, as: 'club' }
    ]
  });
};

// READ - Obtener técnicos por club
const obtenerEqTecnicosPorClub = async (id_club, incluirInactivos = false) => {
  const where = { id_club };
  if (!incluirInactivos) where.estado = true;

  return await EqTecnico.findAll({
    where,
    include: [
      { model: Persona, as: 'persona' },
      { model: Club, as: 'club' }
    ],
    order: [['rol', 'ASC']]
  });
};

// READ - Obtener técnicos por persona
const obtenerEqTecnicosPorPersona = async (id_persona, incluirInactivos = false) => {
  const where = { id_persona };
  if (!incluirInactivos) where.estado = true;

  return await EqTecnico.findAll({
    where,
    include: [
      { model: Persona, as: 'persona' },
      { model: Club, as: 'club' }
    ]
  });
};

// READ - Obtener técnicos vigentes (estado_eq = activo/suspendido y estado = true)
const obtenerEqTecnicosVigentes = async (id_club = null) => {
  const where = {
    estado: true,
    estado_eq: ['activo', 'suspendido']
  };
  if (id_club) where.id_club = id_club;

  return await EqTecnico.findAll({
    where,
    include: [
      { model: Persona, as: 'persona' },
      { model: Club, as: 'club' }
    ]
  });
};

// READ - Contar técnicos
const contarEqTecnicos = async () => {
  return await EqTecnico.count();
};

const contarEqTecnicosActivos = async () => {
  return await EqTecnico.count({ where: { estado: true } });
};

const contarEqTecnicosPorClub = async (id_club) => {
  return await EqTecnico.count({
    where: { id_club, estado: true }
  });
};

module.exports = {
  obtenerEqTecnicos,
  obtenerTodosLosEqTecnicos,
  obtenerEqTecnicoPorId,
  obtenerEqTecnicosPorClub,
  obtenerEqTecnicosPorPersona,
  obtenerEqTecnicosVigentes,
  contarEqTecnicos,
  contarEqTecnicosActivos,
  contarEqTecnicosPorClub
};
