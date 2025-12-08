// controllers/partido.controller.js
const partidoService = require('../services/partidoService');

const obtenePartido = async (req, res, next) => {
  try {
    const partido = await partidoService.getPartidoPorId(req.params.id);
    if (!partido) return res.status(404).json({ message: 'Partido no encontrado' });
    res.json(partido);
  } catch (error) {
    next(error);
  }
};

const obtenerPartidos = async (req, res, next) => {
  try {
    const partidos = await partidoService.getPartidos(req.query);
    res.json(partidos);
  } catch (error) {
    next(error);
  }
};

const crearPartido = async (req, res, next) => {
  try {
    const partido = await partidoService.createPartido(req.body);
    res.status(201).json(partido);
  } catch (error) {
    next(error);
  }
};

const actualizarPartido = async (req, res, next) => {
  try {
    const partido = await partidoService.updatePartido(req.params.id, req.body);
    if (!partido) return res.status(404).json({ message: 'Partido no encontrado' });
    res.json(partido);
  } catch (error) {
    next(error);
  }
};

const eliminarPartido = async (req, res, next) => {
  try {
    const partido = await partidoService.deletePartido(req.params.id);
    if (!partido) return res.status(404).json({ message: 'Partido no encontrado' });
    res.json({ message: 'Partido eliminado' });
  } catch (error) {
    next(error);
  }
};

const assignOficiales = async (req, res, next) => {
  try {
    const partido = await partidoService.assignOficiales(req.params.id, req.body);
    if (!partido) return res.status(404).json({ message: 'Partido no encontrado' });
    res.json(partido);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerPartidos,
  obtenerPartidos,
  crearPartido,
  actualizarPartido,
  eliminarPartido,
  assignOficiales
};
