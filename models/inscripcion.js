/**
 * @file models/inscripcion.js
 * @description Modelo Sequelize para la entidad Inscripcion.
 *
 * Representa la participación formal de un Equipo en una categoría específica
 * de un campeonato (CampeonatoCategoria). Es el enlace entre los equipos
 * y la estructura competitiva del sistema.
 *
 * Flujo de inscripción:
 *   1. El administrador crea la inscripción vinculando un Equipo a un id_cc.
 *   2. Opcionalmente se asigna el equipo a un grupo o serie para el fixture.
 *   3. Al concluir el campeonato, se registra la posición final.
 *
 * Relaciones:
 *   Inscripcion → CampeonatoCategoria (id_cc): categoría en la que participa.
 *   Inscripcion → Equipo (id_equipo)         : equipo inscrito.
 *   Inscripcion → GrupoInscripcion (1:N)     : asignación a grupos del fixture.
 *
 * Campos de asignación de fixture:
 *   - grupo  : letra o código del grupo (ej: 'A', 'B', 'G1').
 *   - serie  : número de serie o zona (ej: '1', '2', '3').
 *   Ambos pueden ser null si el equipo aún no ha sido asignado.
 *
 * Tabla en BD: Inscripciones
 *
 * @module models/Inscripcion
 */

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  /**
   * Clase Inscripcion.
   * Incluye getters para verificar el estado de asignación al fixture y
   * la posición final del equipo en la competencia.
   */
  class Inscripcion extends Model {

    /**
     * Define las asociaciones ORM con otros modelos.
     * @param {object} models - Mapa de todos los modelos registrados.
     */
    static associate(models) {
      // Inscripcion → CampeonatoCategoria (N:1)
      // La inscripción es válida para una categoría específica del campeonato.
      Inscripcion.belongsTo(models.CampeonatoCategoria, {
        foreignKey: 'id_cc',
        as: 'campeonatoCategoria'
      });

      // Inscripcion → Equipo (N:1)
      // El equipo que se inscribe en la competencia.
      Inscripcion.belongsTo(models.Equipo, {
        foreignKey: 'id_equipo',
        as: 'equipo'
      });

      // Inscripcion → GrupoInscripcion (1:N)
      // Permite que un equipo sea asignado a grupos específicos del fixture.
      Inscripcion.hasMany(models.GrupoInscripcion, {
        foreignKey: 'id_inscripcion',
        as: 'grupoInscripciones'
      });
    }

    /* ─────────────────────────────────────────────────
     * Getters calculados
     * ───────────────────────────────────────────────── */

    /** @returns {boolean} true si la inscripción está activa (no cancelada). */
    get estaActiva() { return this.estado === true; }

    /**
     * Indica si el equipo ya fue asignado a un grupo del fixture.
     * @returns {boolean}
     */
    get tieneGrupo() { return this.grupo !== null && this.grupo !== undefined; }

    /**
     * Indica si el equipo ya fue asignado a una serie/zona del fixture.
     * @returns {boolean}
     */
    get tieneSerie() { return this.serie !== null && this.serie !== undefined; }

    /**
     * Posición final del equipo en formato legible con sufijo ordinal en español.
     * @returns {string} Ej: '1er lugar', '2do lugar', '3er lugar'.
     */
    get posicionFinalTexto() {
      if (!this.posicion_final) return 'Sin definir';
      const sufijo = (n) => {
        if (n === 1) return 'er';
        if (n === 2) return 'do';
        if (n === 3) return 'er';
        return 'to';
      };
      return `${this.posicion_final}${sufijo(this.posicion_final)} lugar`;
    }

    /**
     * Indica si el equipo tiene jugadores registrados para esta inscripción.
     * @returns {boolean}
     */
    get jugoCompleto() {
      return this.cantidad_jugadores && this.cantidad_jugadores > 0;
    }

    /**
     * Cadena descriptiva para logs y reportes.
     * @returns {string} Nombre del equipo con grupo y posición si están disponibles.
     */
    get resumen() {
      if (this.equipo && this.campeonatoCategoria) {
        const grupo    = this.grupo          ? ` - Grupo ${this.grupo}` : '';
        const posicion = this.posicion_final ? ` - ${this.posicionFinalTexto}` : '';
        return `${this.equipo.nombre}${grupo}${posicion}`;
      }
      return 'Inscripción sin datos';
    }
  }

  /* ─────────────────────────────────────────────────
   * Definición de columnas y validaciones
   * ───────────────────────────────────────────────── */
  Inscripcion.init({

    /** Clave primaria autoincremental. */
    id_inscripcion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID único de la inscripción'
    },

    /**
     * FK → CampeonatoCategorias.
     * Identifica la categoría específica del campeonato en la que participa el equipo.
     */
    id_cc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'CampeonatoCategorias', key: 'id_cc' },
      validate: { notNull: { msg: 'La categoría-campeonato es requerida' } },
      comment: 'FK → CampeonatoCategorias'
    },

    /**
     * FK → Equipos.
     * El equipo que participa en esta categoría del campeonato.
     */
    id_equipo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Equipos', key: 'id_equipo' },
      validate: { notNull: { msg: 'El equipo es requerido' } },
      comment: 'FK → Equipos'
    },

    /**
     * Grupo al que pertenece el equipo en la fase de grupos.
     * Formato libre: 'A', 'B', 'G1', 'G2', etc. (máx. 10 caracteres).
     * null indica que el equipo aún no fue asignado a ningún grupo.
     */
    grupo: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { len: { args: [1, 10], msg: 'El grupo debe tener entre 1 y 10 caracteres' } },
      comment: 'Grupo del fixture (ej: A, B, G1, G2)'
    },

    /**
     * Serie o zona a la que pertenece el equipo.
     * Formato numérico o alfanumérico corto: '1', '2', '3' (máx. 10 caracteres).
     * null indica que el equipo aún no fue asignado a ninguna serie.
     */
    serie: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { len: { args: [1, 10], msg: 'La serie debe tener entre 1 y 10 caracteres' } },
      comment: 'Serie o zona del fixture (ej: 1, 2, 3)'
    },

    /**
     * Posición final del equipo al concluir la competencia.
     * Se registra al finalizar el campeonato para el historial y la tabla de posiciones.
     * Valor mínimo: 1 (primer lugar).
     */
    posicion_final: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: { args: [1], msg: 'La posición debe ser al menos 1' } },
      comment: 'Posición final obtenida en la categoría'
    },

    /** Número de jugadores habilitados para jugar en este campeonato. */
    cantidad_jugadores: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: { args: [1], msg: 'Debe haber al menos 1 jugador' } },
      comment: 'Cantidad de jugadores registrados en la nómina'
    },

    /** Notas adicionales sobre la inscripción (representante, documentación, etc.). */
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: { len: { args: [0, 2000], msg: 'Las observaciones no pueden exceder 2000 caracteres' } },
      comment: 'Notas sobre la inscripción'
    },

    /**
     * Soft delete.
     * false = inscripción cancelada (equipo retirado del campeonato).
     */
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      validate: {
        isIn: { args: [[true, false]], msg: 'El estado debe ser verdadero o falso' }
      },
      comment: 'Soft delete: true = activo, false = cancelado'
    },

    /** Fecha en que se realizó la inscripción formal del equipo. */
    fecha_inscripcion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: { isDate: { msg: 'La fecha debe ser válida' } },
      comment: 'Fecha de inscripción del equipo'
    },

    /** Fecha de registro del registro en la base de datos. */
    freg: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha de registro en BD'
    }

  }, {
    sequelize,
    modelName: 'Inscripcion',
    tableName:  'Inscripciones',
    timestamps: true
  });

  return Inscripcion;
};
