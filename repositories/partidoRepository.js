const {
  Partido,
  Equipo,
  Cancha,
  Grupo,
  Jornada,
  Fase,
  Juez,
  Persona,
  Usuario,
  Campeonato,
  CampeonatoCategoria
} = require('../models');

// READ - por ID (con todo el detalle)
const obtenerPartidoPorId = async (id) => {
  return Partido.findByPk(id, {
    include: [
      { model: Campeonato, as: 'campeonato' },
      { model: CampeonatoCategoria, as: 'campeonatoCategoria' },
      { model: Equipo, as: 'equipoLocal' },
      { model: Equipo, as: 'equipoVisitante' },
      { model: Cancha, as: 'cancha' },
      { model: Grupo, as: 'grupo' },
      { model: Jornada, as: 'jornada' },
      { model: Fase, as: 'fase' },
      {
        model: Juez,
        as: 'arbitro1',
        include: [{ model: Persona, as: 'persona' }]
      },
      {
        model: Juez,
        as: 'arbitro2',
        include: [{ model: Persona, as: 'persona' }]
      },
      {
        model: Juez,
        as: 'anotador',
        include: [{ model: Persona, as: 'persona' }]
      },
      {
        model: Juez,
        as: 'cronometrista',
        include: [{ model: Persona, as: 'persona' }]
      },
      {
        model: Usuario,
        as: 'planillero'
      }
    ]
  });
};

// READ - list con filtros
const obtenerPartidos = async (filters = {}) => {
  const { id_campeonato, id_cc, p_estado } = filters;

  const where = {};
  if (id_campeonato) where.id_campeonato = id_campeonato;
  if (id_cc) where.id_cc = id_cc;
  if (p_estado) where.p_estado = p_estado;

  return Partido.findAll({
    where,
    include: [
      { model: Equipo, as: 'equipoLocal' },
      { model: Equipo, as: 'equipoVisitante' },
      { model: Cancha, as: 'cancha' }
    ],
    order: [['fecha_hora', 'ASC']]
  });
};

// CREATE
const crearPartido = async (data, transaction) => {
  return Partido.create(data, { transaction });
};

// UPDATE
const actualizarPartido = async (id, data, transaction) => {
  const partido = await Partido.findByPk(id);
  if (!partido) return null;
  return partido.update(data, { transaction });
};

// DELETE lógico
const eliminarPartido = async (id, transaction) => {
  const partido = await Partido.findByPk(id);
  if (!partido) return null;
  return partido.update({ estado: false }, { transaction });
};

// Asignar jueces y planillero
const asignarJuecesYPlanillero = async (id, payload, transaction) => {
  const partido = await Partido.findByPk(id);
  if (!partido) return null;

  const {
    id_arbitro1,
    id_arbitro2,
    id_anotador,
    id_cronometrista,
    id_planillero
  } = payload;

  return partido.update(
    {
      id_arbitro1,
      id_arbitro2,
      id_anotador,
      id_cronometrista,
      id_planillero
    },
    { transaction }
  );
};
const softDeletePartido = async (id_partido, { transaction } = {}) => {
  const partido = await Partido.findByPk(id_partido);
  if (!partido) return null;

  return partido.update({ estado: false }, { transaction });
};

module.exports = {
  obtenerPartidoPorId,
  obtenerPartidos,
  crearPartido,
  actualizarPartido,
  eliminarPartido,
  asignarJuecesYPlanillero,
  softDeletePartido
};
