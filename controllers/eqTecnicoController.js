// src/controllers/eqTecnicoController.js
const eqTecnicoService = require('../services/eqTecnicoService');

// CREATE  POST /api/eqtecnico
const crearEqTecnico = async (req, res) => {
  try {
    const tecnico = await eqTecnicoService.crearEqTecnico(req.body);
    return res.status(201).json({
      success: true,
      message: 'Miembro del cuerpo técnico creado correctamente',
      data: tecnico
    });
  } catch (error) {
    console.error('EqTecnicoController crearEqTecnico error:', error);
    return res.status(400).json({
      success: false,
      message: 'Error al crear el equipo técnico: ' + error.message
    });
  }
};

// GET /api/eqtecnico
const listarEqTecnicos = async (req, res) => {
  try {
    const tecnicos = await eqTecnicoService.listarEqTecnicos();
    return res.json({ success: true, data: tecnicos });
  } catch (error) {
    console.error('EqTecnicoController listarEqTecnicos error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el cuerpo técnico'
    });
  }
};

// GET /api/eqtecnico/todos
const listarTodosLosEqTecnicos = async (req, res) => {
  try {
    const tecnicos = await eqTecnicoService.listarTodosLosEqTecnicos();
    return res.json({ success: true, data: tecnicos });
  } catch (error) {
    console.error('EqTecnicoController listarTodos error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener todos los registros de cuerpo técnico'
    });
  }
};

// GET /api/eqtecnico/:id
const obtenerEqTecnicoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const tecnico = await eqTecnicoService.obtenerEqTecnicoDetalle(id);

    if (!tecnico) {
      return res.status(404).json({
        success: false,
        message: 'Miembro del cuerpo técnico no encontrado'
      });
    }

    return res.json({ success: true, data: tecnico });
  } catch (error) {
    console.error('EqTecnicoController obtenerPorId error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el miembro del cuerpo técnico'
    });
  }
};

// GET /api/eqtecnico/club/:id_club
const listarEqTecnicosPorClub = async (req, res) => {
  try {
    const { id_club } = req.params;
    const tecnicos = await eqTecnicoService.listarEqTecnicosPorClub(id_club);
    return res.json({ success: true, data: tecnicos });
  } catch (error) {
    console.error('EqTecnicoController listarPorClub error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener técnicos por club'
    });
  }
};

// GET /api/eqtecnico/persona/:id_persona
const listarEqTecnicosPorPersona = async (req, res) => {
  try {
    const { id_persona } = req.params;
    const tecnicos = await eqTecnicoService.listarEqTecnicosPorPersona(id_persona);
    return res.json({ success: true, data: tecnicos });
  } catch (error) {
    console.error('EqTecnicoController listarPorPersona error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener técnicos por persona'
    });
  }
};

// GET /api/eqtecnico/vigentes  (opcional ?id_club=)
const listarEqTecnicosVigentes = async (req, res) => {
  try {
    const { id_club } = req.query;
    const tecnicos = await eqTecnicoService.listarEqTecnicosVigentes(id_club);
    return res.json({ success: true, data: tecnicos });
  } catch (error) {
    console.error('EqTecnicoController listarVigentes error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener técnicos vigentes'
    });
  }
};

// GET /api/eqtecnico/resumen
const obtenerResumenEqTecnico = async (req, res) => {
  try {
    const resumen = await eqTecnicoService.obtenerResumenEqTecnico();
    return res.json({ success: true, data: resumen });
  } catch (error) {
    console.error('EqTecnicoController resumen error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el resumen del cuerpo técnico'
    });
  }
};

// PUT /api/eqtecnico/:id
const actualizarEqTecnico = async (req, res) => {
  try {
    const { id } = req.params;
    const tecnicoActualizado = await eqTecnicoService.actualizarEqTecnico(id, req.body);
 console.log(tecnicoActualizado);
    if (!tecnicoActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Miembro del cuerpo técnico no encontrado'
      });
    }

    return res.json({
      success: true,
      message: 'Miembro del cuerpo técnico actualizado correctamente',
      data: tecnicoActualizado
    });
  } catch (error) {
    console.error('EqTecnicoController actualizar error:', error);
    return res.status(400).json({
      success: false,
      message: 'Error al actualizar el cuerpo técnico: ' + error.message
    });
  }
};

// PATCH /api/eqtecnico/:id/estado_eq
const actualizarEstadoEqTecnico = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_eq } = req.body;

    const tecnico = await eqTecnicoService.actualizarEstadoEqTecnico(id, estado_eq);

    if (!tecnico) {
      return res.status(404).json({
        success: false,
        message: 'Miembro del cuerpo técnico no encontrado'
      });
    }

    return res.json({
      success: true,
      message: 'Estado del cuerpo técnico actualizado correctamente',
      data: tecnico
    });
  } catch (error) {
    console.error('EqTecnicoController actualizarEstadoEq error:', error);
    return res.status(400).json({
      success: false,
      message: 'Error al actualizar el estado del cuerpo técnico: ' + error.message
    });
  }
};

// DELETE /api/eqtecnico/:id  (soft delete)
const eliminarEqTecnico = async (req, res) => {
  try {
    const { id } = req.params;
    const tecnicoEliminado = await eqTecnicoService.eliminarEqTecnico(id);

    if (!tecnicoEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Miembro del cuerpo técnico no encontrado'
      });
    }

    return res.json({
      success: true,
      message: 'Miembro del cuerpo técnico eliminado correctamente'
    });
  } catch (error) {
    console.error('EqTecnicoController eliminar error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el cuerpo técnico'
    });
  }
};

module.exports = {
  crearEqTecnico,
  listarEqTecnicos,
  listarTodosLosEqTecnicos,
  obtenerEqTecnicoPorId,
  listarEqTecnicosPorClub,
  listarEqTecnicosPorPersona,
  listarEqTecnicosVigentes,
  obtenerResumenEqTecnico,
  actualizarEqTecnico,
  actualizarEstadoEqTecnico,
  eliminarEqTecnico
};
