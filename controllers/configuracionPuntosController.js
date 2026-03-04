// controllers/configuracionPuntosController.js

const configuracionService = require('../services/configuracionPuntos.service');

/**
 * GET /api/configuracion-puntos/:idcampeonato
 * Obtener configuración de puntos de un campeonato
 */
const obtenerConfiguracion = async (req, res) => {
  try {
    const { idcampeonato } = req.params;

    if (!idcampeonato) {
      return res.status(400).json({
        success: false,
        message: 'ID de campeonato es requerido'
      });
    }

    const configuracion = await configuracionService.obtenerConfiguracion(parseInt(idcampeonato));

    res.status(200).json({
      success: true,
      message: 'Configuración obtenida exitosamente',
      data: configuracion
    });
  } catch (error) {
    console.error('Error obteniendo configuración:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener configuración'
    });
  }
};

/**
 * PUT /api/configuracion-puntos/:idcampeonato
 * Actualizar configuración de puntos de un campeonato
 */
const actualizarConfiguracion = async (req, res) => {
  try {
    const { idcampeonato } = req.params;
    const cambios = req.body;
    const userId = req.usuario?.id_usuario || 1; // TODO: Obtener de sesión

    if (!idcampeonato) {
      return res.status(400).json({
        success: false,
        message: 'ID de campeonato es requerido'
      });
    }

    const configuracion = await configuracionService.actualizarConfiguracion(
      parseInt(idcampeonato),
      cambios,
      userId
    );

    res.status(200).json({
      success: true,
      message: 'Configuración actualizada exitosamente',
      data: configuracion
    });
  } catch (error) {
    console.error('Error actualizando configuración:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error al actualizar configuración'
    });
  }
};

/**
 * POST /api/configuracion-puntos/:idcampeonato/reset
 * Resetear configuración a valores por defecto
 */
const resetearConfiguracion = async (req, res) => {
  try {
    const { idcampeonato } = req.params;
    const userId = req.usuario?.id_usuario || 1; // TODO: Obtener de sesión

    if (!idcampeonato) {
      return res.status(400).json({
        success: false,
        message: 'ID de campeonato es requerido'
      });
    }

    const configuracion = await configuracionService.resetearConfiguracion(
      parseInt(idcampeonato),
      userId
    );

    res.status(200).json({
      success: true,
      message: 'Configuración reseteada exitosamente',
      data: configuracion
    });
  } catch (error) {
    console.error('Error reseteando configuración:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al resetear configuración'
    });
  }
};

/**
 * GET /api/configuracion-puntos/activas
 * Obtener todas las configuraciones activas (debug)
 */
const obtenerConfiguracionesActivas = async (req, res) => {
  try {
    const configuraciones = configuracionService.obtenerConfiguracionesActivas();

    res.status(200).json({
      success: true,
      message: 'Configuraciones activas obtenidas',
      data: configuraciones,
      total: Object.keys(configuraciones).length
    });
  } catch (error) {
    console.error('Error obteniendo configuraciones activas:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener configuraciones activas'
    });
  }
};

/**
 * DELETE /api/configuracion-puntos/:idcampeonato
 * Limpiar configuración de un campeonato
 */
const limpiarConfiguracion = async (req, res) => {
  try {
    const { idcampeonato } = req.params;

    if (!idcampeonato) {
      return res.status(400).json({
        success: false,
        message: 'ID de campeonato es requerido'
      });
    }

    configuracionService.limpiarConfiguracion(parseInt(idcampeonato));

    res.status(200).json({
      success: true,
      message: 'Configuración limpiada exitosamente'
    });
  } catch (error) {
    console.error('Error limpiando configuración:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al limpiar configuración'
    });
  }
};

module.exports = {
  obtenerConfiguracion,
  actualizarConfiguracion,
  resetearConfiguracion,
  obtenerConfiguracionesActivas,
  limpiarConfiguracion
};
