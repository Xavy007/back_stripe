// controllers/mongodb/configuracionPuntos.controller.js
const configuracionPuntosService = require('../../services/mongodb/configuracionPuntos.service');

class ConfiguracionPuntosController {
  
  async obtener(req, res) {
    try {
      const { idcampeonato } = req.params;
      
      const config = await configuracionPuntosService.obtenerPorCampeonato(
        parseInt(idcampeonato)
      );

      res.json({
        success: true,
        data: config
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async crear(req, res) {
    try {
      const { idcampeonato, ...configuracion } = req.body;
      const userId = req.usuario.idusuario;

      const nuevaConfig = await configuracionPuntosService.crear(
        parseInt(idcampeonato),
        configuracion,
        userId
      );

      res.status(201).json({
        success: true,
        data: nuevaConfig,
        message: 'Configuración creada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async actualizar(req, res) {
    try {
      const { idcampeonato } = req.params;
      const cambios = req.body;
      const userId = req.usuario.idusuario;

      const actualizado = await configuracionPuntosService.actualizar(
        parseInt(idcampeonato),
        cambios,
        userId
      );

      res.json({
        success: true,
        data: actualizado,
        message: 'Configuración actualizada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async crearPorDefecto(req, res) {
    try {
      const { idcampeonato } = req.params;
      const config = await configuracionPuntosService.crearPorDefecto(
        parseInt(idcampeonato)
      );

      res.status(201).json({
        success: true,
        data: config,
        message: 'Configuración por defecto creada'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ConfiguracionPuntosController();
