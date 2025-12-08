// controllers/juez.controller.js
const juezService = require('../services/juezService');

// GET /api/jueces
const getJueces = async (req, res, next) => {
  try {
    const jueces = await juezService.getJueces();
    res.json(jueces);
  } catch (error) {
    next(error);
  }
};

// GET /api/jueces/:id
const getJuezById = async (req, res, next) => {
  try {
    const juez = await juezService.getJuezPorId(req.params.id);
    if (!juez || juez.estado === false) {
      return res.status(404).json({ message: 'Juez no encontrado' });
    }
    res.json(juez);
  } catch (error) {
    next(error);
  }
};

// POST /api/jueces
// body: { persona: {...}, juez: {...} }
const createJuez = async (req, res, next) => {
    console.log(req)
  try {
    const juez = await juezService.createJuez(req.body);
    res.status(201).json(juez);
  } catch (error) {
    next(error);
  }
};

// PUT /api/jueces/:id
// body: { persona: {...}, juez: {...} }
const updateJuez = async (req, res, next) => {
  try {
    const juez = await juezService.updateJuez(req.params.id, req.body);
    if (!juez) {
      return res.status(404).json({ message: 'Juez no encontrado' });
    }
    res.json(juez);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/jueces/:id  (soft delete)
const deleteJuez = async (req, res, next) => {
  try {
    const juez = await juezService.deleteJuez(req.params.id);
    if (!juez) {
      return res.status(404).json({ message: 'Juez no encontrado' });
    }
    res.json({ message: 'Juez eliminado (soft delete)' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJueces,
  getJuezById,
  createJuez,
  updateJuez,
  deleteJuez
};
