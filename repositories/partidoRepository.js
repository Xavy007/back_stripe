const { Op } = require('sequelize');
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

const MATCH_DURATION_MS = 2 * 60 * 60 * 1000; // 2 horas

/**
 * Verifica si ya hay un partido activo en la misma cancha que se solaparía
 * con la fecha/hora dada. Lanza error si hay cruce.
 * @param {number} id_cancha
 * @param {string|Date} fecha_hora  - Inicio del partido a programar
 * @param {number} [excludeId]      - id_partido a excluir (en edición)
 */
const verificarCruceCancha = async (id_cancha, fecha_hora, excludeId = null) => {
  if (!id_cancha || !fecha_hora) return;

  const inicio = new Date(fecha_hora);
  const fin    = new Date(inicio.getTime() + MATCH_DURATION_MS);

  const where = {
    id_cancha,
    estado: true,
    p_estado: { [Op.notIn]: ['finalizado', 'suspendido', 'wo'] },
    // Overlapping interval: existing.start < nuevo.fin AND existing.fin > nuevo.start
    fecha_hora: {
      [Op.lt]: fin,
      [Op.gt]: new Date(inicio.getTime() - MATCH_DURATION_MS)
    }
  };

  if (excludeId) where.id_partido = { [Op.ne]: excludeId };

  const conflicto = await Partido.findOne({ where });
  if (conflicto) {
    const fechaConflicto = new Date(conflicto.fecha_hora).toLocaleString('es-BO', {
      dateStyle: 'short', timeStyle: 'short'
    });
    const err = new Error(
      `Cruce de horario: la cancha ya tiene un partido programado el ${fechaConflicto}`
    );
    err.status = 409;
    throw err;
  }
};

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
  softDeletePartido,
  verificarCruceCancha
};
