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

const setupInicial = async (req, res) => {
  try {
    const result = await service.obtener();
    const { nombre, acronimo, ciudad, email, telefono } = result.data;
    const yaInicializado = nombre !== 'Asociación de Voleibol' || !!(acronimo || ciudad || email || telefono);
    if (yaInicializado) {
      return res.status(403).json({ success: false, message: 'El sistema ya fue configurado' });
    }
    const archivo = req.file || null;
    const actualizado = await service.actualizar(req.body, archivo);
    res.json({ success: true, message: 'Configuración inicial guardada', data: actualizado.data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const obtenerEstado = async (req, res) => {
  try {
    const result = await service.obtener();
    const { nombre, acronimo, ciudad, email, telefono } = result.data;
    // Consideramos inicializado si el nombre fue personalizado (distinto al default)
    const inicializado = nombre !== 'Asociación de Voleibol' || !!(acronimo || ciudad || email || telefono);
    res.json({ success: true, inicializado });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { obtener, actualizar, obtenerEstado, setupInicial };
