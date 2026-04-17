const service = require('../services/asociacionService');

const obtener = async (req, res) => {
  try {
    const result = await service.obtener();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const actualizar = async (req, res) => {
  try {
    const archivo = req.file || null;
    const result = await service.actualizar(req.body, archivo);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { obtener, actualizar };
