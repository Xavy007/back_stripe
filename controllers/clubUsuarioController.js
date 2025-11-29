// controllers/clubUsuarioController.js
const {
  crearAsignacion,
  actualizarAsignacion,
  desactivarAsignacion
} = require('../services/clubUsuarioService');

/**
 * Controlador para crear una asignación de usuario a club
 */
async function crear(req, res) {
  try {
    const data = req.body;
    const usuarioAccion = req.user?.id || 'sistema'; // ejemplo: usuario logueado
    const nuevoRegistro = await crearAsignacion(data, usuarioAccion);
    return res.status(201).json(nuevoRegistro);
  } catch (error) {
    return res.status(400).json({ mensaje: error.message });
  }
}

/**
 * Controlador para actualizar una asignación
 */
async function actualizar(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const usuarioAccion = req.user?.id || 'sistema';
    const actualizado = await actualizarAsignacion(id, data, usuarioAccion);
    if (!actualizado) {
      return res.status(404).json({ mensaje: 'Registro no encontrado' });
    }
    return res.json(actualizado);
  } catch (error) {
    return res.status(400).json({ mensaje: error.message });
  }
}

/**
 * Controlador para desactivar una asignación
 */
async function desactivar(req, res) {
  try {
    const { id } = req.params;
    const usuarioAccion = req.user?.id || 'sistema';
    const desactivado = await desactivarAsignacion(id, usuarioAccion);
    if (!desactivado) {
      return res.status(404).json({ mensaje: 'Registro no encontrado' });
    }
    return res.json(desactivado);
  } catch (error) {
    return res.status(400).json({ mensaje: error.message });
  }
}

// Exportar cada función individualmente
module.exports = {
  crear,
  actualizar,
  desactivar
};