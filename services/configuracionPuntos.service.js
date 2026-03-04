// services/configuracionPuntos.service.js

/**
 * Servicio para gestionar la configuración de puntos en tiempo real
 * durante los partidos de volleyball
 */

const EventEmitter = require('events');
const { Campeonato } = require('../models');

class ConfiguracionPuntosService extends EventEmitter {
  constructor() {
    super();
    // Almacenamiento en memoria de configuraciones activas
    this.configuraciones = new Map();
    // Callbacks de monitoreo por campeonato
    this.monitores = new Map();
  }

  /**
   * Obtener configuración actual de un campeonato
   * @param {number} idcampeonato - ID del campeonato
   * @returns {Object} Configuración actual
   */
  async obtenerConfiguracion(idcampeonato) {
    try {
      // Verificar que el campeonato existe
      const campeonato = await Campeonato.findByPk(idcampeonato);

      if (!campeonato) {
        throw new Error(`Campeonato con ID ${idcampeonato} no encontrado`);
      }

      // Si ya existe en memoria, devolverla
      if (this.configuraciones.has(idcampeonato)) {
        return this.configuraciones.get(idcampeonato);
      }

      // Configuración por defecto del volleyball
      const configuracionDefault = {
        idcampeonato,
        puntos_por_set: 25,
        puntos_set_decisivo: 15, // Quinto set
        diferencia_minima: 2,
        max_sets: 5,
        timeouts_por_set: 2,
        duracion_timeout: 30, // segundos
        max_sustituciones: 6,
        permite_libero: true,
        rotacion_obligatoria: true,
        sistema_puntos: 'rally_point', // rally_point o side_out
        tarjetas_habilitadas: true,
        actualizadoAt: new Date()
      };

      // Guardar en memoria
      this.configuraciones.set(idcampeonato, configuracionDefault);

      return configuracionDefault;
    } catch (error) {
      console.error('Error obteniendo configuración:', error);
      throw error;
    }
  }

  /**
   * Actualizar configuración de un campeonato
   * @param {number} idcampeonato - ID del campeonato
   * @param {Object} cambios - Cambios a aplicar
   * @param {number} userId - ID del usuario que actualiza
   * @returns {Object} Configuración actualizada
   */
  async actualizarConfiguracion(idcampeonato, cambios, userId) {
    try {
      // Obtener configuración actual
      const configActual = await this.obtenerConfiguracion(idcampeonato);

      // Validar cambios
      const cambiosValidados = this.validarCambios(cambios);

      // Aplicar cambios
      const configActualizada = {
        ...configActual,
        ...cambiosValidados,
        actualizadoAt: new Date(),
        actualizadoPor: userId
      };

      // Guardar en memoria
      this.configuraciones.set(idcampeonato, configActualizada);

      // Emitir evento de actualización
      this.emit('configuracion:updated', {
        idcampeonato,
        configuracion: configActualizada,
        cambios: cambiosValidados,
        userId
      });

      console.log(`✅ Configuración actualizada para campeonato ${idcampeonato} por usuario ${userId}`);

      return configActualizada;
    } catch (error) {
      console.error('Error actualizando configuración:', error);
      throw error;
    }
  }

  /**
   * Iniciar monitoreo de cambios en un campeonato
   * @param {number} idcampeonato - ID del campeonato
   * @param {Function} callback - Función a ejecutar cuando hay cambios
   */
  iniciarMonitoreo(idcampeonato, callback) {
    if (!this.monitores.has(idcampeonato)) {
      this.monitores.set(idcampeonato, []);
    }

    this.monitores.get(idcampeonato).push(callback);

    console.log(`🔍 Monitoreo iniciado para campeonato ${idcampeonato}`);

    // Listener de eventos
    const eventListener = (data) => {
      if (data.idcampeonato === idcampeonato) {
        callback(data);
      }
    };

    this.on('configuracion:updated', eventListener);

    // Retornar función para detener monitoreo
    return () => {
      this.off('configuracion:updated', eventListener);
      const callbacks = this.monitores.get(idcampeonato);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * Detener monitoreo de un campeonato
   * @param {number} idcampeonato - ID del campeonato
   */
  detenerMonitoreo(idcampeonato) {
    this.monitores.delete(idcampeonato);
    console.log(`⏹️ Monitoreo detenido para campeonato ${idcampeonato}`);
  }

  /**
   * Validar que los cambios sean válidos
   * @param {Object} cambios - Cambios propuestos
   * @returns {Object} Cambios validados
   */
  validarCambios(cambios) {
    const validados = {};

    // Validar puntos por set
    if (cambios.puntos_por_set !== undefined) {
      if (typeof cambios.puntos_por_set === 'number' && cambios.puntos_por_set >= 15 && cambios.puntos_por_set <= 30) {
        validados.puntos_por_set = cambios.puntos_por_set;
      } else {
        throw new Error('puntos_por_set debe ser un número entre 15 y 30');
      }
    }

    // Validar puntos set decisivo
    if (cambios.puntos_set_decisivo !== undefined) {
      if (typeof cambios.puntos_set_decisivo === 'number' && cambios.puntos_set_decisivo >= 10 && cambios.puntos_set_decisivo <= 20) {
        validados.puntos_set_decisivo = cambios.puntos_set_decisivo;
      } else {
        throw new Error('puntos_set_decisivo debe ser un número entre 10 y 20');
      }
    }

    // Validar diferencia mínima
    if (cambios.diferencia_minima !== undefined) {
      if (typeof cambios.diferencia_minima === 'number' && cambios.diferencia_minima >= 1 && cambios.diferencia_minima <= 5) {
        validados.diferencia_minima = cambios.diferencia_minima;
      } else {
        throw new Error('diferencia_minima debe ser un número entre 1 y 5');
      }
    }

    // Validar max sets
    if (cambios.max_sets !== undefined) {
      if ([3, 5].includes(cambios.max_sets)) {
        validados.max_sets = cambios.max_sets;
      } else {
        throw new Error('max_sets debe ser 3 o 5');
      }
    }

    // Validar timeouts
    if (cambios.timeouts_por_set !== undefined) {
      if (typeof cambios.timeouts_por_set === 'number' && cambios.timeouts_por_set >= 0 && cambios.timeouts_por_set <= 3) {
        validados.timeouts_por_set = cambios.timeouts_por_set;
      } else {
        throw new Error('timeouts_por_set debe ser un número entre 0 y 3');
      }
    }

    // Validar duración timeout
    if (cambios.duracion_timeout !== undefined) {
      if (typeof cambios.duracion_timeout === 'number' && cambios.duracion_timeout >= 30 && cambios.duracion_timeout <= 60) {
        validados.duracion_timeout = cambios.duracion_timeout;
      } else {
        throw new Error('duracion_timeout debe ser un número entre 30 y 60 segundos');
      }
    }

    // Validar max sustituciones
    if (cambios.max_sustituciones !== undefined) {
      if (typeof cambios.max_sustituciones === 'number' && cambios.max_sustituciones >= 0 && cambios.max_sustituciones <= 12) {
        validados.max_sustituciones = cambios.max_sustituciones;
      } else {
        throw new Error('max_sustituciones debe ser un número entre 0 y 12');
      }
    }

    // Validar booleanos
    ['permite_libero', 'rotacion_obligatoria', 'tarjetas_habilitadas'].forEach(campo => {
      if (cambios[campo] !== undefined) {
        if (typeof cambios[campo] === 'boolean') {
          validados[campo] = cambios[campo];
        } else {
          throw new Error(`${campo} debe ser un valor booleano`);
        }
      }
    });

    // Validar sistema de puntos
    if (cambios.sistema_puntos !== undefined) {
      if (['rally_point', 'side_out'].includes(cambios.sistema_puntos)) {
        validados.sistema_puntos = cambios.sistema_puntos;
      } else {
        throw new Error('sistema_puntos debe ser "rally_point" o "side_out"');
      }
    }

    return validados;
  }

  /**
   * Limpiar configuración de un campeonato (cuando termina)
   * @param {number} idcampeonato - ID del campeonato
   */
  limpiarConfiguracion(idcampeonato) {
    this.configuraciones.delete(idcampeonato);
    this.detenerMonitoreo(idcampeonato);
    console.log(`🗑️ Configuración limpiada para campeonato ${idcampeonato}`);
  }

  /**
   * Obtener todas las configuraciones activas (para debugging)
   * @returns {Object} Configuraciones activas
   */
  obtenerConfiguracionesActivas() {
    const activas = {};
    this.configuraciones.forEach((config, idcampeonato) => {
      activas[idcampeonato] = config;
    });
    return activas;
  }

  /**
   * Resetear configuración a valores por defecto
   * @param {number} idcampeonato - ID del campeonato
   * @param {number} userId - ID del usuario que resetea
   * @returns {Object} Configuración reseteada
   */
  async resetearConfiguracion(idcampeonato, userId) {
    // Eliminar de memoria
    this.configuraciones.delete(idcampeonato);

    // Obtener configuración por defecto
    const configDefault = await this.obtenerConfiguracion(idcampeonato);

    // Emitir evento
    this.emit('configuracion:updated', {
      idcampeonato,
      configuracion: configDefault,
      cambios: { reset: true },
      userId
    });

    console.log(`🔄 Configuración reseteada para campeonato ${idcampeonato}`);

    return configDefault;
  }
}

// Exportar instancia única (Singleton)
module.exports = new ConfiguracionPuntosService();
