const service = require('../services/asociacionCargoService');

const listar = async (req, res) => {
  try {
    const result = await service.listar();
    res.json(result);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

const listarPorGestion = async (req, res) => {
  try {
    const result = await service.listarPorGestion(req.params.id_gestion);
    res.json(result);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

const obtener = async (req, res) => {
  try {
    const result = await service.obtener(req.params.id);
    res.json(result);
  } catch (e) {
    res.status(404).json({ success: false, message: e.message });
  }
};

const crear = async (req, res) => {
  try {
    const result = await service.crear(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

const actualizar = async (req, res) => {
  try {
    const result = await service.actualizar(req.params.id, req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

const eliminar = async (req, res) => {
  try {
    const result = await service.eliminar(req.params.id);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

module.exports = { listar, listarPorGestion, obtener, crear, actualizar, eliminar };
