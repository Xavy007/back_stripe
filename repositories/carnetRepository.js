'use strict';
const { Carnet, Jugador, GestionCampeonato, Persona } = require('../models');
const { Op } = require('sequelize');

class CarnetRepository {
  /**
   * Crear un nuevo carnet
   * @param {Object} data - Datos del carnet
   * @returns {Promise<Carnet>}
   */
  static async crearCarnet(data) {
    try {
      const carnet = await Carnet.create(data);
      return carnet;
    } catch (error) {
      throw new Error(`Error al crear carnet: ${error.message}`);
    }
  }

  /**
   * Obtener carnet por ID
   * @param {number} id_carnet - ID del carnet
   * @param {boolean} incluirRelaciones - Si incluir relaciones
   * @returns {Promise<Carnet>}
   */
  static async obtenerPorId(id_carnet, incluirRelaciones = false) {
    try {
      const opciones = { where: { id_carnet } };
      
      if (incluirRelaciones) {
        opciones.include = [
          {
            model: Jugador,
            as: 'jugador',
            include: [{ model: Persona }]
          },
          {
            model: GestionCampeonato,
            as: 'gestion'
          }
        ];
      }

      const carnet = await Carnet.findByPk(id_carnet, opciones);
      return carnet;
    } catch (error) {
      throw new Error(`Error al obtener carnet: ${error.message}`);
    }
  }

  /**
   * Obtener carnet por número
   * @param {string} numero_carnet - Número del carnet
   * @returns {Promise<Carnet>}
   */
  static async obtenerPorNumero(numero_carnet) {
    try {
      const carnet = await Carnet.findOne({
        where: { numero_carnet },
        include: [
          {
            model: Jugador,
            as: 'jugador',
            include: [{ model: Persona }]
          },
          {
            model: GestionCampeonato,
            as: 'gestion'
          }
        ]
      });
      return carnet;
    } catch (error) {
      throw new Error(`Error al obtener carnet por número: ${error.message}`);
    }
  }

  /**
   * Obtener todos los carnets de un jugador
   * @param {number} id_jugador - ID del jugador
   * @returns {Promise<Carnet[]>}
   */
  static async obtenerPorJugador(id_jugador) {
    try {
      const carnets = await Carnet.findAll({
        where: { id_jugador },
        include: [
          {
            model: GestionCampeonato,
            as: 'gestion',
            attributes: ['id_gestion', 'nombre', 'gestion']
          }
        ],
        order: [['fecha_solicitud', 'DESC']]
      });
      return carnets;
    } catch (error) {
      throw new Error(`Error al obtener carnets del jugador: ${error.message}`);
    }
  }

  /**
   * Obtener carnet activo de un jugador en una gestión específica
   * @param {number} id_jugador - ID del jugador
   * @param {number} id_gestion - ID de la gestión
   * @returns {Promise<Carnet>}
   */
  static async obtenerCarnetActivo(id_jugador, id_gestion) {
    try {
      const carnet = await Carnet.findOne({
        where: {
          id_jugador,
          id_gestion,
          estado_carnet: 'activo'
        },
        include: [
          {
            model: Jugador,
            as: 'jugador',
            attributes: ['id_jugador', 'estatura'],
            include: [
              {
                model: Persona,
                attributes: ['id_persona', 'nombre', 'apellido', 'ci']
              }
            ]
          },
          {
            model: GestionCampeonato,
            as: 'gestion',
            attributes: ['id_gestion', 'nombre', 'gestion']
          }
        ]
      });
      return carnet;
    } catch (error) {
      throw new Error(`Error al obtener carnet activo: ${error.message}`);
    }
  }

  /**
   * Verificar si existe carnet activo o pendiente para jugador en gestión
   * @param {number} id_jugador - ID del jugador
   * @param {number} id_gestion - ID de la gestión
   * @returns {Promise<boolean>}
   */
  static async existeCarnetActivoOPendiente(id_jugador, id_gestion) {
    try {
      const carnet = await Carnet.findOne({
        where: {
          id_jugador,
          id_gestion,
          estado_carnet: { [Op.in]: ['pendiente', 'activo'] }
        }
      });
      return !!carnet;
    } catch (error) {
      throw new Error(`Error al verificar carnet: ${error.message}`);
    }
  }

  /**
   * Obtener todos los carnets de una gestión
   * @param {number} id_gestion - ID de la gestión
   * @param {string} estado - Estado opcional para filtrar
   * @returns {Promise<Carnet[]>}
   */
  static async obtenerPorGestion(id_gestion, estado = null) {
    try {
      const where = { id_gestion };
      if (estado) {
        where.estado_carnet = estado;
      }

      const carnets = await Carnet.findAll({
        where,
        include: [
          {
            model: Jugador,
            as: 'jugador',
            attributes: ['id_jugador', 'estatura'],
            include: [
              {
                model: Persona,
                attributes: ['id_persona', 'nombre', 'apellido', 'ci']
              }
            ]
          },
          {
            model: GestionCampeonato,
            as: 'gestion',
            attributes: ['id_gestion', 'nombre', 'gestion']
          }
        ],
        order: [['fecha_solicitud', 'DESC']]
      });
      return carnets;
    } catch (error) {
      throw new Error(`Error al obtener carnets por gestión: ${error.message}`);
    }
  }

  /**
   * Obtener carnets por estado
   * @param {string} estado_carnet - Estado a buscar
   * @param {number} limite - Límite de registros
   * @returns {Promise<Carnet[]>}
   */
  static async obtenerPorEstado(estado_carnet, limite = 50) {
    try {
      const carnets = await Carnet.findAll({
        where: { estado_carnet },
        include: [
          {
            model: Jugador,
            as: 'jugador',
            include: [{ model: Persona }]
          },
          {
            model: GestionCampeonato,
            as: 'gestion'
          }
        ],
        limit: limite,
        order: [['fecha_solicitud', 'DESC']]
      });
      return carnets;
    } catch (error) {
      throw new Error(`Error al obtener carnets por estado: ${error.message}`);
    }
  }

  /**
   * Obtener carnets vencidos
   * @returns {Promise<Carnet[]>}
   */
  static async obtenerVencidos() {
    try {
      const ahora = new Date();
      const carnets = await Carnet.findAll({
        where: {
          fecha_vencimiento: { [Op.lt]: ahora },
          estado_carnet: 'activo'
        },
        include: [
          {
            model: Jugador,
            as: 'jugador',
            include: [{ model: Persona }]
          }
        ],
        order: [['fecha_vencimiento', 'ASC']]
      });
      return carnets;
    } catch (error) {
      throw new Error(`Error al obtener carnets vencidos: ${error.message}`);
    }
  }

  /**
   * Actualizar carnet
   * @param {number} id_carnet - ID del carnet
   * @param {Object} datos - Datos a actualizar
   * @returns {Promise<Carnet>}
   */
  static async actualizar(id_carnet, datos) {
    try {
      const carnet = await Carnet.findByPk(id_carnet);
      if (!carnet) {
        throw new Error('Carnet no encontrado');
      }

      await carnet.update(datos);
      return carnet;
    } catch (error) {
      throw new Error(`Error al actualizar carnet: ${error.message}`);
    }
  }

  /**
   * Actualizar estado de carnet
   * @param {number} id_carnet - ID del carnet
   * @param {string} estado_carnet - Nuevo estado
   * @returns {Promise<Carnet>}
   */
  static async actualizarEstado(id_carnet, estado_carnet) {
    try {
      return await this.actualizar(id_carnet, { estado_carnet });
    } catch (error) {
      throw new Error(`Error al actualizar estado: ${error.message}`);
    }
  }

  /**
   * Marcar todos los carnets vencidos como vencido
   * @returns {Promise<number>} - Cantidad de carnets actualizados
   */
  static async marcarVencidos() {
    try {
      const ahora = new Date();
      const [cantidad] = await Carnet.update(
        { estado_carnet: 'vencido' },
        {
          where: {
            fecha_vencimiento: { [Op.lt]: ahora },
            estado_carnet: 'activo'
          }
        }
      );
      return cantidad;
    } catch (error) {
      throw new Error(`Error al marcar vencidos: ${error.message}`);
    }
  }

  /**
   * Eliminar carnet (borrado suave - cambiar estado)
   * @param {number} id_carnet - ID del carnet
   * @returns {Promise<Carnet>}
   */
  static async eliminar(id_carnet) {
    try {
      return await this.actualizar(id_carnet, { estado: false });
    } catch (error) {
      throw new Error(`Error al eliminar carnet: ${error.message}`);
    }
  }

  /**
   * Eliminar carnet de forma permanente
   * @param {number} id_carnet - ID del carnet
   * @returns {Promise<number>} - 1 si fue eliminado
   */
  static async eliminarPermanente(id_carnet) {
    try {
      const carnet = await Carnet.findByPk(id_carnet);
      if (!carnet) {
        throw new Error('Carnet no encontrado');
      }

      await carnet.destroy();
      return 1;
    } catch (error) {
      throw new Error(`Error al eliminar carnet permanentemente: ${error.message}`);
    }
  }

  /**
   * Obtener total de carnets
   * @param {Object} filtros - Filtros opcionales
   * @returns {Promise<number>}
   */
  static async obtenerTotal(filtros = {}) {
    try {
      const total = await Carnet.count({
        where: filtros
      });
      return total;
    } catch (error) {
      throw new Error(`Error al contar carnets: ${error.message}`);
    }
  }

  /**
   * Obtener carnets con paginación
   * @param {number} pagina - Número de página
   * @param {number} limite - Registros por página
   * @param {Object} filtros - Filtros opcionales
   * @returns {Promise<{data: Carnet[], total: number, paginas: number}>}
   */
  static async obtenerConPaginacion(pagina = 1, limite = 10, filtros = {}) {
    try {
      const offset = (pagina - 1) * limite;

      const { count, rows } = await Carnet.findAndCountAll({
        where: filtros,
        include: [
          {
            model: Jugador,
            as: 'jugador',
            include: [{ model: Persona }]
          },
          {
            model: GestionCampeonato,
            as: 'gestion'
          }
        ],
        limit: limite,
        offset: offset,
        order: [['fecha_solicitud', 'DESC']],
        distinct: true
      });

      const total = count;
      const paginas = Math.ceil(total / limite);

      return {
        data: rows,
        total,
        pagina,
        limite,
        paginas
      };
    } catch (error) {
      throw new Error(`Error al obtener carnets con paginación: ${error.message}`);
    }
  }

  /**
   * Buscar carnets por criterios múltiples
   * @param {Object} criterios - Criterios de búsqueda
   * @returns {Promise<Carnet[]>}
   */
  static async buscar(criterios = {}) {
    try {
      const where = {};

      if (criterios.id_jugador) {
        where.id_jugador = criterios.id_jugador;
      }

      if (criterios.id_gestion) {
        where.id_gestion = criterios.id_gestion;
      }

      if (criterios.estado_carnet) {
        where.estado_carnet = criterios.estado_carnet;
      }

      if (criterios.numero_carnet) {
        where.numero_carnet = {
          [Op.like]: `%${criterios.numero_carnet}%`
        };
      }

      const carnets = await Carnet.findAll({
        where,
        include: [
          {
            model: Jugador,
            as: 'jugador',
            include: [{ model: Persona }]
          },
          {
            model: GestionCampeonato,
            as: 'gestion'
          }
        ],
        order: [['fecha_solicitud', 'DESC']]
      });

      return carnets;
    } catch (error) {
      throw new Error(`Error en búsqueda de carnets: ${error.message}`);
    }
  }


  static async obtenerEstadisticas(id_gestion) {
    try {
      const total = await Carnet.count({
        where: { id_gestion }
      });

      const activos = await Carnet.count({
        where: { id_gestion, estado_carnet: 'activo' }
      });

      const pendientes = await Carnet.count({
        where: { id_gestion, estado_carnet: 'pendiente' }
      });

      const vencidos = await Carnet.count({
        where: { id_gestion, estado_carnet: 'vencido' }
      });

      const cancelados = await Carnet.count({
        where: { id_gestion, estado_carnet: 'cancelado' }
      });

      return {
        total,
        activos,
        pendientes,
        vencidos,
        cancelados,
        porcentajeActivos: ((activos / total) * 100).toFixed(2) + '%',
        porcentajeVencidos: ((vencidos / total) * 100).toFixed(2) + '%'
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }
}

module.exports = CarnetRepository;