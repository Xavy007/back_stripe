// src/services/eqTecnicoService.js
const {
  obtenerEqTecnicos,
  obtenerTodosLosEqTecnicos,
  obtenerEqTecnicoPorId,
  obtenerEqTecnicosPorClub,
  obtenerEqTecnicosPorPersona,
  obtenerEqTecnicosVigentes,
  contarEqTecnicos,
  contarEqTecnicosActivos,
  contarEqTecnicosPorClub
} = require('../repositories/eqTecnicoRepository');

const { EqTecnico, Persona } = require('../models');

// CREATE - Crea persona + eqTecnico (estado_eq y estado con defaults)
const crearEqTecnico = async (payload) => {
  const {
    id_club,
    rol,
    fecha_inicio,
    fecha_fin,
    observaciones,
    datoPersona
  } = payload;

  // 1) Crear persona
  const persona = await Persona.create(datoPersona);

  // 2) Crear eqTecnico
  const tecnico = await EqTecnico.create({
    id_persona: persona.id_persona,
    id_club,
    rol,
    // estado_eq: se deja default 'activo'
    // estado: se deja default true
    fecha_inicio,
    fecha_fin,
    observaciones
  });

  // 3) Devolver con includes
  return await obtenerEqTecnicoPorId(tecnico.id_eqtecnico, true);
};

// READ delegando al repositorio
const listarEqTecnicos = async () => {
  return await obtenerEqTecnicos();
};

const listarTodosLosEqTecnicos = async () => {
  return await obtenerTodosLosEqTecnicos();
};

const obtenerEqTecnicoDetalle = async (id_eqtecnico, incluirInactivos = false) => {
  return await obtenerEqTecnicoPorId(id_eqtecnico, incluirInactivos);
};

const listarEqTecnicosPorClub = async (id_club, incluirInactivos = false) => {
  return await obtenerEqTecnicosPorClub(id_club, incluirInactivos);
};

const listarEqTecnicosPorPersona = async (id_persona, incluirInactivos = false) => {
  return await obtenerEqTecnicosPorPersona(id_persona, incluirInactivos);
};

const listarEqTecnicosVigentes = async (id_club = null) => {
  return await obtenerEqTecnicosVigentes(id_club);
};

const obtenerResumenEqTecnico = async () => {
  const total = await contarEqTecnicos();
  const activos = await contarEqTecnicosActivos();

  return {
    total,
    activos
  };
};

const obtenerCantidadEqTecnicosPorClub = async (id_club) => {
  const cantidad = await contarEqTecnicosPorClub(id_club);
  return { id_club, cantidad };
};

// UPDATE - Actualizar datos de persona + eqTecnico (sin tocar soft delete)
const actualizarEqTecnico = async (id_eqtecnico, payload) => {
  const tecnico = await EqTecnico.findByPk(id_eqtecnico, {
    include: [{ model: Persona, as: 'persona' }]
  });

  if (!tecnico) {
    return null;
  }

  const {
    id_club,
    rol,
    fecha_inicio,
    fecha_fin,
    observaciones,
    datoPersona
  } = payload;

  // ==== VALIDAR CI ÚNICO (si viene en datoPersona) ====
  if (datoPersona && datoPersona.ci) {
    const existente = await Persona.findOne({
      where: {
        ci: datoPersona.ci,
        id_persona: { [Op.ne]: tecnico.persona.id_persona } // excluir la misma persona
      }
    });

    if (existente) {
      throw new Error('Ya existe otra persona con este CI');
    }
  }

  // Actualizar persona si viene datoPersona
  if (datoPersona && tecnico.persona) {
    await tecnico.persona.update(datoPersona);
  }

  // Actualizar EqTecnico
  await tecnico.update({
    id_club: id_club ?? tecnico.id_club,
    rol: rol ?? tecnico.rol,
    fecha_inicio: fecha_inicio ?? tecnico.fecha_inicio,
    fecha_fin: fecha_fin ?? tecnico.fecha_fin,
    observaciones: observaciones ?? tecnico.observaciones
    // estado_eq y estado no se tocan aquí
  });

  return await obtenerEqTecnicoPorId(id_eqtecnico, true);
};

// CAMBIAR estado_eq (negocio) sin afectar soft delete
const actualizarEstadoEqTecnico = async (id_eqtecnico, nuevoEstadoEq) => {
  const tecnico = await EqTecnico.findByPk(id_eqtecnico);
  if (!tecnico) {
    return null;
  }

  await tecnico.update({ estado_eq: nuevoEstadoEq });
  return tecnico;
};

// DELETE - soft delete: estado = false
const eliminarEqTecnico = async (id_eqtecnico) => {
  const tecnico = await EqTecnico.findByPk(id_eqtecnico);
  if (!tecnico) {
    return null;
  }

  await tecnico.update({ estado: false });
  return tecnico;
};

module.exports = {
  crearEqTecnico,
  listarEqTecnicos,
  listarTodosLosEqTecnicos,
  obtenerEqTecnicoDetalle,
  listarEqTecnicosPorClub,
  listarEqTecnicosPorPersona,
  listarEqTecnicosVigentes,
  obtenerResumenEqTecnico,
  obtenerCantidadEqTecnicosPorClub,
  actualizarEqTecnico,
  actualizarEstadoEqTecnico,
  eliminarEqTecnico
};
