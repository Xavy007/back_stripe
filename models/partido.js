/**
 * @file models/partido.js
 * @description Modelo Sequelize para la entidad Partido.
 *
 * Representa un encuentro deportivo entre dos equipos dentro de una
 * CampeonatoCategoria. Es la unidad mínima de competencia en el sistema
 * y el punto de convergencia de múltiples relaciones:
 *
 *   - Pertenece a un Campeonato y a una CampeonatoCategoria (id_cc).
 *   - Referencia dos Equipos: local y visitante.
 *   - Puede estar dentro de una Jornada (round-robin), Fase (eliminatoria)
 *     o Grupo (fase de grupos).
 *   - Tiene una Cancha asignada (puede ser null hasta la programación final).
 *   - Tiene una asignación de jueces (PartidoJuez, relación 1:1).
 *
 * Estados del partido (p_estado):
 *   programado → creado por el fixture, pendiente de jugarse.
 *   en_juego   → partido en curso (marcador en tiempo real via Socket.IO).
 *   finalizado → partido completado con resultado registrado.
 *   suspendido → partido no jugado temporalmente.
 *   wo         → walkover (equipo que no se presentó).
 *
 * Los campos resultado_local y resultado_visitante representan SETS ganados
 * (no puntos), siguiendo las reglas del vóleibol (máximo 3 sets por partido).
 *
 * Índices de BD definidos sobre columnas de alta frecuencia de consulta para
 * optimizar búsquedas por campeonato, categoría, cancha, equipo y estado.
 *
 * Tabla en BD: Partidos
 *
 * @module models/Partido
 */

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  /**
   * Clase Partido.
   * La lógica de negocio (calcular ganador, actualizar tabla de posiciones)
   * se delega a los servicios correspondientes.
   */
  class Partido extends Model {

    /**
     * Define las asociaciones ORM con otros modelos.
     * @param {object} models - Mapa de todos los modelos registrados.
     */
    static associate(models) {
      // Partido → Campeonato (N:1)
      Partido.belongsTo(models.Campeonato, {
        foreignKey: 'id_campeonato',
        as: 'campeonato'
      });

      // Partido → CampeonatoCategoria (N:1)
      // Relación principal: un partido siempre pertenece a una categoría específica.
      Partido.belongsTo(models.CampeonatoCategoria, {
        foreignKey: 'id_cc',
        as: 'campeonatoCategoria'
      });

      // Partido → Cancha (N:1)
      // La cancha puede asignarse posteriormente; null hasta la programación final.
      Partido.belongsTo(models.Cancha, {
        foreignKey: 'id_cancha',
        as: 'cancha'
      });

      // Partido → Equipo Local (N:1)
      Partido.belongsTo(models.Equipo, {
        foreignKey: 'equipo_local',
        as: 'equipoLocal'
      });

      // Partido → Equipo Visitante (N:1)
      Partido.belongsTo(models.Equipo, {
        foreignKey: 'equipo_visitante',
        as: 'equipoVisitante'
      });

      // Partido → Fase (N:1)
      // Solo presente en partidos de eliminatoria; null en round-robin.
      Partido.belongsTo(models.Fase, {
        foreignKey: 'id_fase',
        as: 'fase'
      });

      // Partido → Jornada (N:1)
      // Agrupa partidos del mismo round en formato round-robin o liga.
      Partido.belongsTo(models.Jornada, {
        foreignKey: 'id_jornada',
        as: 'jornada'
      });

      // Partido → Grupo (N:1)
      // Solo presente en partidos dentro de la fase de grupos.
      Partido.belongsTo(models.Grupo, {
        foreignKey: 'id_grupo',
        as: 'grupo'
      });

      // Partido → PartidoJuez (1:1)
      // Asignación de árbitros (principal, asistente, etc.) para este partido.
      Partido.hasOne(models.PartidoJuez, {
        foreignKey: 'id_partido',
        as: 'asignacionJueces'
      });
    }
  }

  Partido.init({

    /** Clave primaria autoincremental. */
    id_partido: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID único del partido'
    },

    /** FK → Campeonatos. */
    id_campeonato: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'FK → Campeonatos'
    },

    /**
     * FK → CampeonatoCategorias.
     * Identificador de la categoría específica dentro del campeonato.
     */
    id_cc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'FK → CampeonatoCategorias'
    },

    /**
     * FK → Canchas.
     * Puede ser null al generar el fixture; se asigna en la programación final.
     */
    id_cancha: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'FK → Canchas (asignada en la programación del fixture)'
    },

    /** FK → Equipos. Equipo que actúa como local. */
    equipo_local: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'FK → Equipos (local)'
    },

    /** FK → Equipos. Equipo que actúa como visitante. */
    equipo_visitante: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'FK → Equipos (visitante)'
    },

    /**
     * Estado operativo del partido.
     * Ciclo: programado → en_juego → finalizado.
     * 'wo' indica walkover (equipo que no se presentó).
     */
    p_estado: {
      type: DataTypes.ENUM('programado', 'en_juego', 'finalizado', 'suspendido', 'wo'),
      allowNull: false,
      defaultValue: 'programado',
      comment: 'Estado operativo del partido'
    },

    /**
     * Sets ganados por el equipo local (0–3).
     * En vóleibol se disputa al mejor de 5 sets (first to 3).
     */
    resultado_local: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 0, max: 3 },
      comment: 'Sets ganados por equipo local (0–3)'
    },

    /**
     * Sets ganados por el equipo visitante (0–3).
     */
    resultado_visitante: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 0, max: 3 },
      comment: 'Sets ganados por equipo visitante (0–3)'
    },

    /** Notas o incidencias del partido (protestas, incidentes, etc.). */
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: { len: [0, 2000] },
      comment: 'Notas o incidencias del partido'
    },

    /** URL del acta física digitalizada. */
    acta_url: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'URL del acta escaneada del partido'
    },

    /**
     * FK → Fases.
     * Presente solo en partidos de fase eliminatoria; null en round-robin.
     */
    id_fase: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'FK → Fases'
    },

    /** FK → Jornadas. Agrupa partidos del mismo round. */
    id_jornada: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'FK → Jornadas'
    },

    /** FK → Grupos. Solo presente en fase de grupos. */
    id_grupo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'FK → Grupos'
    },

    /** Fecha y hora programada para el inicio del partido. */
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Fecha y hora de inicio del partido'
    },

    /**
     * Soft delete.
     * false = partido eliminado lógicamente.
     */
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Soft delete: true = activo'
    },

    /** Fecha de registro en la base de datos. */
    freg: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha de registro'
    }

  }, {
    sequelize,
    modelName: 'Partido',
    tableName:  'Partidos',
    timestamps: true,

    /*
     * Índices de rendimiento.
     * La tabla Partidos crece rápidamente en campeonatos grandes.
     * Los índices cubren los patrones de consulta más frecuentes:
     *   - Por campeonato completo.
     *   - Por categoría específica (id_cc).
     *   - Por cancha y fecha (programación de instalaciones).
     *   - Por equipo (historial de local o visitante).
     *   - Por estado operativo (partidos en vivo, finalizados).
     *   - Índice compuesto (id_cc + p_estado) para el marcador en tiempo real.
     */
    indexes: [
      { name: 'idx_partido_campeonato',        fields: ['id_campeonato'] },
      { name: 'idx_partido_cc',                fields: ['id_cc'] },
      { name: 'idx_partido_cancha',            fields: ['id_cancha'] },
      { name: 'idx_partido_equipo_local',      fields: ['equipo_local'] },
      { name: 'idx_partido_equipo_visitante',  fields: ['equipo_visitante'] },
      { name: 'idx_partido_p_estado',          fields: ['p_estado'] },
      { name: 'idx_partido_fecha_hora',        fields: ['fecha_hora'] },
      { name: 'idx_partido_estado',            fields: ['estado'] },
      { name: 'idx_partido_cc_p_estado',       fields: ['id_cc', 'p_estado'] }
    ]
  });

  return Partido;
};
