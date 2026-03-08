/**
 * @file models/campeonatoCategoria.js
 * @description Modelo Sequelize para la entidad CampeonatoCategoria (tabla pivote).
 *
 * Actúa como nodo central de la arquitectura del sistema: cada registro
 * representa la habilitación de una categoría deportiva dentro de un
 * campeonato específico, identificada por su clave primaria `id_cc`.
 *
 * La mayoría de las entidades operativas del sistema (inscripciones, grupos,
 * fases, jornadas, partidos) referencian `id_cc` en lugar del `id_campeonato`,
 * lo que permite gestionar configuraciones independientes por categoría dentro
 * de un mismo campeonato.
 *
 * Jerarquía de dependencias de id_cc:
 *   CampeonatoCategoria (id_cc)
 *     ├── Inscripcion      → equipos participantes en esta categoría
 *     ├── Grupo            → grupos de la fase de grupos
 *     ├── Fase             → fases eliminatorias
 *     ├── Partido          → todos los partidos de la categoría
 *     └── Participacion    → jugadores que participaron
 *
 * Configuración del fixture almacenada en este modelo:
 *   - formato          : tipo de competencia (round-robin, grupos+eliminación, etc.)
 *   - numero_grupos    : cantidad de grupos (si aplica)
 *   - ida_vuelta       : si se juegan partidos de vuelta
 *   - dias_entre_jornadas, hora_inicio_partidos, dias_juego: calendarios
 *
 * Tabla en BD: CampeonatoCategorias
 *
 * @module models/CampeonatoCategoria
 */

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  /**
   * Clase CampeonatoCategoria.
   * Modelo pivote enriquecido con getters para determinar el tipo de fixture
   * requerido según el formato configurado.
   */
  class CampeonatoCategoria extends Model {

    /**
     * Define las asociaciones ORM con otros modelos.
     * @param {object} models - Mapa de todos los modelos registrados.
     */
    static associate(models) {
      // CampeonatoCategoria → Campeonato (N:1)
      CampeonatoCategoria.belongsTo(models.Campeonato, {
        foreignKey: 'id_campeonato',
        as: 'campeonato'
      });

      // CampeonatoCategoria → Categoria (N:1)
      CampeonatoCategoria.belongsTo(models.Categoria, {
        foreignKey: 'id_categoria',
        as: 'categoria'
      });

      // CampeonatoCategoria → Grupo (1:N)
      // Grupos de la fase inicial; cada grupo contiene equipos inscritos.
      CampeonatoCategoria.hasMany(models.Grupo, {
        foreignKey: 'id_cc',
        as: 'grupos'
      });

      // CampeonatoCategoria → Fase (1:N)
      // Fases eliminatorias (cuartos, semis, final) dentro de la categoría.
      CampeonatoCategoria.hasMany(models.Fase, {
        foreignKey: 'id_cc',
        as: 'fases'
      });

      // CampeonatoCategoria → Partido (1:N)
      // Todos los partidos de esta categoría, en cualquier jornada o fase.
      CampeonatoCategoria.hasMany(models.Partido, {
        foreignKey: 'id_cc',
        as: 'partidos'
      });

      // CampeonatoCategoria → Participacion (1:N)
      // Historial de jugadores que participaron en la categoría.
      CampeonatoCategoria.hasMany(models.Participacion, {
        foreignKey: 'id_cc',
        as: 'participaciones'
      });
    }

    /* ─────────────────────────────────────────────────
     * Getters calculados para el formato del fixture
     * ───────────────────────────────────────────────── */

    /** @returns {boolean} true si el registro está activo (no eliminado). */
    get estaActiva() { return this.estado === true; }

    /**
     * Representación legible del formato competitivo.
     * @returns {string} Etiqueta del formato (p. ej., 'Grupos y Eliminación').
     */
    get formatoTexto() {
      const formatos = {
        todos_vs_todos:       'Todos vs Todos',
        eliminacion_directa:  'Eliminación Directa',
        grupos_y_eliminacion: 'Grupos y Eliminación',
        liga:                 'Liga'
      };
      return formatos[this.formato] || this.formato;
    }

    /**
     * Indica si la configuración requiere crear grupos antes del fixture.
     * @returns {boolean} true para el formato 'grupos_y_eliminacion'.
     */
    get requiereGrupos() {
      return this.formato === 'grupos_y_eliminacion';
    }

    /**
     * Indica si la configuración incluye rondas eliminatorias.
     * @returns {boolean} true para formatos con eliminación directa o por grupos.
     */
    get tieneEliminacion() {
      return this.formato === 'eliminacion_directa' || this.formato === 'grupos_y_eliminacion';
    }

    /**
     * Cadena descriptiva para logs y reportes.
     * @returns {string} Resumen de la relación campeonato-categoría.
     */
    get resumen() {
      if (this.categoria && this.campeonato) {
        return `${this.campeonato.nombre} - ${this.categoria.nombre} (${this.formatoTexto})`;
      }
      return `${this.formatoTexto}`;
    }
  }

  /* ─────────────────────────────────────────────────
   * Definición de columnas y validaciones
   * ───────────────────────────────────────────────── */
  CampeonatoCategoria.init({

    /** Clave primaria autoincremental. Usado como FK en la mayoría del sistema. */
    id_cc: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID único de campeonato-categoría (usado como FK en toda la app)'
    },

    /** FK → Campeonatos. Campeonato al que pertenece esta configuración. */
    id_campeonato: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Campeonatos', key: 'id_campeonato' },
      validate: { notNull: { msg: 'El campeonato es requerido' } },
      comment: 'FK → Campeonatos'
    },

    /** FK → Categorias. Categoría habilitada (Sub-12, Sub-14, Mayor, etc.). */
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Categorias', key: 'id_categoria' },
      validate: { notNull: { msg: 'La categoría es requerida' } },
      comment: 'FK → Categorias'
    },

    /**
     * Formato de competencia de esta categoría en este campeonato.
     * Determina el algoritmo de generación del fixture:
     *   - todos_vs_todos       : round-robin (cada equipo juega contra todos).
     *   - eliminacion_directa  : bracket eliminatorio desde el inicio.
     *   - grupos_y_eliminacion : fase de grupos + eliminatorias cruzadas.
     *   - liga                 : sistema de puntos acumulativos a lo largo de la temporada.
     */
    formato: {
      type: DataTypes.ENUM('todos_vs_todos', 'eliminacion_directa', 'grupos_y_eliminacion', 'liga'),
      allowNull: false,
      defaultValue: 'todos_vs_todos',
      validate: {
        isIn: {
          args: [['todos_vs_todos', 'eliminacion_directa', 'grupos_y_eliminacion', 'liga']],
          msg: 'El formato debe ser válido'
        }
      },
      comment: 'Algoritmo de generación del fixture'
    },

    /**
     * Número de grupos a crear (solo relevante para 'grupos_y_eliminacion').
     * Rango permitido: 1–10 grupos.
     */
    numero_grupos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: { args: [1],  msg: 'Mínimo 1 grupo' },
        max: { args: [10], msg: 'Máximo 10 grupos' }
      },
      comment: 'Número de grupos (solo si formato es grupos_y_eliminacion)'
    },

    /** Capacidad máxima de equipos en esta categoría. */
    cantidad_equipos_max: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: { args: [2],   msg: 'Mínimo 2 equipos' },
        max: { args: [999], msg: 'Máximo 999 equipos' }
      },
      comment: 'Cantidad máxima de equipos permitidos'
    },

    /**
     * Si true, el fixture incluye partidos de vuelta (local↔visitante invertidos).
     * Duplica la cantidad de partidos generados.
     */
    ida_vuelta: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Si incluye partidos de ida y vuelta'
    },

    /**
     * Días de separación entre jornadas consecutivas.
     * Usado por el generador de fixture para espaciar las fechas de los partidos.
     * Rango: 1–365 días.
     */
    dias_entre_jornadas: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 7,
      validate: {
        min: { args: [1],   msg: 'Mínimo 1 día entre jornadas' },
        max: { args: [365], msg: 'Máximo 365 días entre jornadas' }
      },
      comment: 'Días de separación entre jornadas'
    },

    /** Hora de inicio predeterminada para los partidos de esta categoría. */
    hora_inicio_partidos: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: '18:00:00',
      comment: 'Hora predeterminada de inicio de partidos'
    },

    /**
     * Días de la semana en que se programan partidos.
     * Array de enteros: 0=Domingo, 1=Lunes, ..., 6=Sábado.
     * Ejemplo: [1, 3, 5] → Lunes, Miércoles y Viernes.
     */
    dias_juego: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: null,
      comment: 'Días de la semana: 0=Dom,1=Lun,...,6=Sáb. Ej: [1,3,5]=Lun/Mié/Vie'
    },

    /** Notas adicionales sobre la configuración de esta categoría. */
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: { len: { args: [0, 2000], msg: 'Las observaciones no pueden exceder 2000 caracteres' } },
      comment: 'Notas específicas para esta categoría en este campeonato'
    },

    /**
     * Soft delete: true = activo, false = eliminado lógicamente.
     * Los registros inactivos son excluidos de las consultas estándar.
     */
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      validate: {
        isIn: { args: [[true, false]], msg: 'El estado debe ser verdadero o falso' }
      },
      comment: 'Soft delete: true = activo, false = eliminado'
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
    modelName: 'CampeonatoCategoria',
    tableName:  'CampeonatoCategorias',
    timestamps: true
  });

  return CampeonatoCategoria;
};
