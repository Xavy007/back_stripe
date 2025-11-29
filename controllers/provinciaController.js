// controllers/provinciaController.js
const service = require('../services/provinciaService');

// GET /api/provincias
// GET /api/provincias?id_departamento=1  (con filtro)
const getProvincias = async (req, res) => {
  try {
    const filtros = {};
    if (req.query.id_departamento) {
      filtros.id_departamento = Number(req.query.id_departamento);
    }

    const data = await service.listarProvincias(filtros);
    res.json({ success: true, data });
  } catch (err) {
    console.error('Error getProvincias:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/provincias/:id
const getProvincia = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await service.obtenerProvincia(id);
    res.json({ success: true, data });
  } catch (err) {
    console.error('Error getProvincia:', err);
    res.status(404).json({ success: false, message: err.message });
  }
};

// POST /api/provincias
const postProvincia = async (req, res) => {
  try {
    const data = await service.crearProvincia(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('Error postProvincia:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/provincias/:id
const putProvincia = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await service.actualizarProvincia(id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    console.error('Error putProvincia:', err);
    res.status(404).json({ success: false, message: err.message });
  }
};

// DELETE /api/provincias/:id
const deleteProvincia = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await service.eliminarProvincia(id);
    res.json({ success: true, message: 'Provincia eliminada' });
  } catch (err) {
    console.error('Error deleteProvincia:', err);
    res.status(404).json({ success: false, message: err.message });
  }
};

module.exports = {
  getProvincias,
  getProvincia,
  postProvincia,
  putProvincia,
  deleteProvincia
};
