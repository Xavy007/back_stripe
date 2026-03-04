
const CarnetRepository = require('../repositories/carnetRepository');
const { Jugador, GestionCampeonato } = require('../models');

class CarnetService {
  /**
   * Solicitar un nuevo carnet
   * @param {number} id_jugador - ID del jugador
   * @param {number} id_gestion - ID de la gestión
   * @param {number} solicitado_por - ID del usuario que solicita
   * @param {number} duracion_dias - Duración en días (default: 365)
   * @returns {Promise<Object>}
   */
  static async solicitarCarnet(datos) {
    try {
      const {
        id_jugador,
        id_gestion,
        id_categoria,
        numero_dorsal,
        posicion,
        foto_carnet,
        solicitado_por,
        duracion_dias = 365,
        observaciones,
        estado_carnet = 'pendiente'
      } = datos;

      // 1. Validar que el jugador existe
      const jugador = await Jugador.findByPk(id_jugador);
      if (!jugador) {
        throw new Error('Jugador no encontrado');
      }

      // 2. Validar que la gestión existe
      const gestion = await GestionCampeonato.findByPk(id_gestion);
      if (!gestion) {
        throw new Error('Gestión de campeonato no encontrada');
      }

      // 3. Validar que no hay carnet activo o pendiente
      const existeCarnet = await CarnetRepository.existeCarnetActivoOPendiente(id_jugador, id_gestion);
      if (existeCarnet) {
        throw new Error('Ya existe un carnet activo o pendiente para esta gestión');
      }

      // 4. Validar duración de días
      if (duracion_dias < 1 || duracion_dias > 3650) {
        throw new Error('La duración debe estar entre 1 y 3650 días');
      }

      // 5. Calcular fechas
      const fecha_solicitud = new Date();
      const fecha_vencimiento = new Date(fecha_solicitud);
      fecha_vencimiento.setDate(fecha_vencimiento.getDate() + duracion_dias);

      // 6. Generar número de carnet
      const numero_carnet = this.generarNumeroCarnet(jugador, gestion);

      // 7. Crear carnet en BD
      const carnetData = {
        id_jugador,
        id_gestion,
        id_categoria,
        numero_dorsal,
        posicion,
        foto_carnet,
        numero_carnet,
        fecha_solicitud,
        fecha_vencimiento,
        duracion_dias,
        estado_carnet,
        solicitado_por,
        observaciones
      };

      const carnet = await CarnetRepository.crearCarnet(carnetData);

      return {
        exito: true,
        mensaje: 'Carnet solicitado exitosamente',
        carnet
      };
    } catch (error) {
      throw new Error(`Error al solicitar carnet: ${error.message}`);
    }
  }

  /**
   * Activar un carnet (cambiar de pendiente a activo)
   * @param {number} id_carnet - ID del carnet
   * @returns {Promise<Object>}
   */
  static async activarCarnet(id_carnet) {
    try {
      const carnet = await CarnetRepository.obtenerPorId(id_carnet);
      if (!carnet) {
        throw new Error('Carnet no encontrado');
      }

      if (carnet.estado_carnet !== 'pendiente') {
        throw new Error(`No se puede activar un carnet en estado "${carnet.estado_carnet}"`);
      }

      const carnetActualizado = await CarnetRepository.actualizarEstado(id_carnet, 'activo');

      return {
        exito: true,
        mensaje: 'Carnet activado exitosamente',
        carnet: carnetActualizado
      };
    } catch (error) {
      throw new Error(`Error al activar carnet: ${error.message}`);
    }
  }

  /**
   * Cancelar un carnet
   * @param {number} id_carnet - ID del carnet
   * @param {string} razon - Razón de cancelación
   * @returns {Promise<Object>}
   */
  static async cancelarCarnet(id_carnet, razon = '') {
    try {
      const carnet = await CarnetRepository.obtenerPorId(id_carnet);
      if (!carnet) {
        throw new Error('Carnet no encontrado');
      }

      if (carnet.estado_carnet === 'cancelado') {
        throw new Error('El carnet ya está cancelado');
      }

      const carnetActualizado = await CarnetRepository.actualizar(id_carnet, {
        estado_carnet: 'cancelado',
        observaciones: razon
      });

      return {
        exito: true,
        mensaje: 'Carnet cancelado exitosamente',
        carnet: carnetActualizado
      };
    } catch (error) {
      throw new Error(`Error al cancelar carnet: ${error.message}`);
    }
  }

  /**
   * Obtener carnet por ID
   * @param {number} id_carnet - ID del carnet
   * @returns {Promise<Object>}
   */
  static async obtenerCarnet(id_carnet) {
    try {
      const carnet = await CarnetRepository.obtenerPorId(id_carnet, true);
      if (!carnet) {
        throw new Error('Carnet no encontrado');
      }

      return {
        exito: true,
        carnet
      };
    } catch (error) {
      throw new Error(`Error al obtener carnet: ${error.message}`);
    }
  }

  /**
   * Obtener carnet por número
   * @param {string} numero_carnet - Número del carnet
   * @returns {Promise<Object>}
   */
  static async obtenerCarnetPorNumero(numero_carnet) {
    try {
      const carnet = await CarnetRepository.obtenerPorNumero(numero_carnet);
      if (!carnet) {
        throw new Error('Carnet no encontrado');
      }

      return {
        exito: true,
        carnet
      };
    } catch (error) {
      throw new Error(`Error al obtener carnet: ${error.message}`);
    }
  }

  /**
   * Obtener carnets de un jugador
   * @param {number} id_jugador - ID del jugador
   * @returns {Promise<Object>}
   */
  static async obtenerCarnetsPorJugador(id_jugador) {
    try {
      const jugador = await Jugador.findByPk(id_jugador);
      if (!jugador) {
        throw new Error('Jugador no encontrado');
      }

      const carnets = await CarnetRepository.obtenerPorJugador(id_jugador);

      return {
        exito: true,
        total: carnets.length,
        carnets
      };
    } catch (error) {
      throw new Error(`Error al obtener carnets: ${error.message}`);
    }
  }

  /**
   * Obtener carnet activo de un jugador en una gestión
   * @param {number} id_jugador - ID del jugador
   * @param {number} id_gestion - ID de la gestión
   * @returns {Promise<Object>}
   */
  static async obtenerCarnetActual(id_jugador, id_gestion) {
    try {
      const carnet = await CarnetRepository.obtenerCarnetActivo(id_jugador, id_gestion);

      if (!carnet) {
        return {
          exito: false,
          mensaje: 'No hay carnet activo para esta gestión',
          carnet: null
        };
      }

      // Calcular días restantes
      const hoy = new Date();
      const diasRestantes = Math.ceil((carnet.fecha_vencimiento - hoy) / (1000 * 60 * 60 * 24));

      return {
        exito: true,
        carnet: {
          ...carnet.toJSON(),
          diasRestantes: diasRestantes > 0 ? diasRestantes : 0
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener carnet: ${error.message}`);
    }
  }

  /**
   * Obtener todos los carnets de una gestión
   * @param {number} id_gestion - ID de la gestión
   * @param {string} estado - Estado opcional
   * @returns {Promise<Object>}
   */
  static async obtenerCarnetsPorGestion(id_gestion, estado = null) {
    try {
      const gestion = await GestionCampeonato.findByPk(id_gestion);
      if (!gestion) {
        throw new Error('Gestión no encontrada');
      }

      const carnets = await CarnetRepository.obtenerPorGestion(id_gestion, estado);

      return {
        exito: true,
        total: carnets.length,
        gestion,
        carnets
      };
    } catch (error) {
      throw new Error(`Error al obtener carnets: ${error.message}`);
    }
  }

  /**
   * Obtener carnets con paginación
   * @param {number} pagina - Página
   * @param {number} limite - Límite
   * @param {Object} filtros - Filtros
   * @returns {Promise<Object>}
   */
  static async obtenerConPaginacion(pagina = 1, limite = 10, filtros = {}) {
    try {
      const resultado = await CarnetRepository.obtenerConPaginacion(pagina, limite, filtros);

      return {
        exito: true,
        ...resultado
      };
    } catch (error) {
      throw new Error(`Error al obtener carnets: ${error.message}`);
    }
  }

  /**
   * Buscar carnets
   * @param {Object} criterios - Criterios de búsqueda
   * @returns {Promise<Object>}
   */
  static async buscarCarnets(criterios = {}) {
    try {
      const carnets = await CarnetRepository.buscar(criterios);

      return {
        exito: true,
        total: carnets.length,
        carnets
      };
    } catch (error) {
      throw new Error(`Error en búsqueda de carnets: ${error.message}`);
    }
  }

  /**
   * Marcar carnets vencidos automáticamente
   * @returns {Promise<Object>}
   */
  static async marcarCarnetsvencidos() {
    try {
      const cantidad = await CarnetRepository.marcarVencidos();

      return {
        exito: true,
        mensaje: `${cantidad} carnets fueron marcados como vencidos`,
        cantidad
      };
    } catch (error) {
      throw new Error(`Error al marcar vencidos: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas de una gestión
   * @param {number} id_gestion - ID de la gestión
   * @returns {Promise<Object>}
   */
  static async obtenerEstadisticas(id_gestion) {
    try {
      const gestion = await GestionCampeonato.findByPk(id_gestion);
      if (!gestion) {
        throw new Error('Gestión no encontrada');
      }

      const estadisticas = await CarnetRepository.obtenerEstadisticas(id_gestion);

      return {
        exito: true,
        gestion,
        estadisticas
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  /**
   * Generar número único de carnet
   * @param {Object} jugador - Objeto Jugador
   * @param {Object} gestion - Objeto GestionCampeonato
   * @returns {string}
   */
  static generarNumeroCarnet(jugador, gestion) {
    // Formato: GESTION-IDJUGADOR-RANDOM
    // Ejemplo: 2024-5-A1B2
    const random = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();
    return `${gestion.gestion}-${jugador.id_jugador}-${random}`;
  }
}

module.exports = CarnetService;