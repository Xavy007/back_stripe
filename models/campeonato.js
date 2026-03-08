/**
 * @file models/campeonato.js
 * @description Modelo Sequelize para la entidad Campeonato.
 *
 * Representa una competencia deportiva (campeonato, liga, copa, etc.) dentro
 * del sistema de gestión de voleibol PuntoSet. Es la entidad raíz de la
 * jerarquía competitiva:
 *
 *   Campeonato
 *     └── CampeonatoCategoria (id_cc)   [una por cada categoría habilitada]
 *           ├── Inscripcion             [equipos participantes]
 *           ├── Grupo / Fase / Jornada  [estructura del fixture]
 *           └── Partido                 [encuentros individuales]
 *
 * Tabla en BD: Campeonatos
 *
 * @module models/Campeonato
 */

'use strict';
const { Model } = require('sequelize');

/**
 * Valores válidos para el campo `tipo`.
 * Restringen el ENUM de la columna y se reutilizan en la validación del servicio.
 * @type {string[]}
 */
const CAMPEONATO_TIPOS = ['campeonato', 'liga', 'copa', 'relampago', 'amistoso', 'torneo'];

/**
 * Valores válidos para el campo `c_estado` (estado competitivo).
 * Se diferencia del campo `estado` (soft delete booleano).
 * @type {string[]}
 */
const C_ESTADOS = ['programado', 'en_curso', 'finalizado', 'suspendido', 'cancelado'];

module.exports = (sequelize, DataTypes) => {

  /**
   * Clase Campeonato.
   * Extiende Model de Sequelize con getters calculados para facilitar
   * la presentación de datos sin lógica adicional en controladores.
   */
  class Campeonato extends Model {

    /**
     * Define las asociaciones ORM con otros modelos.
     * Llamado automáticamente por Sequelize al inicializar todos los modelos.
     *
     * @param {object} models - Mapa de todos los modelos registrados.
     */
    static associate(models) {
      // Campeonato → GestionCampeonato (N:1)
      // Un campeonato pertenece a una gestión/año deportivo.
      Campeonato.belongsTo(models.GestionCampeonato, {
        foreignKey: 'id_gestion',
        as: 'gestion'
      });

      // Campeonato → Partido (1:N)
      // Todos los partidos del campeonato, independientemente de la categoría.
      Campeonato.hasMany(models.Partido, {
        foreignKey: 'id_campeonato',
        as: 'partidos'
      });

      // Campeonato → Grupo (1:N)
      // Grupos de fase de grupos del campeonato.
      Campeonato.hasMany(models.Grupo, {
        foreignKey: 'id_campeonato',
        as: 'grupos'
      });

      // Campeonato → CampeonatoCategoria (1:N)
      // Cada entrada representa una categoría habilitada en este campeonato.
      Campeonato.hasMany(models.CampeonatoCategoria, {
        foreignKey: 'id_campeonato',
        as: 'campeonatoCategorias'
      });

      // Campeonato → Categoria (N:M a través de CampeonatoCategoria)
      // Acceso directo a las categorías sin pasar por el modelo pivote.
      Campeonato.belongsToMany(models.Categoria, {
        through: models.CampeonatoCategoria,
        foreignKey: 'id_campeonato',
        otherKey: 'id_categoria',
        as: 'categorias'
      });

      // Campeonato → Participacion (1:N)
      // Registro de participación de jugadores en el campeonato.
      Campeonato.hasMany(models.Participacion, {
        foreignKey: 'id_campeonato',
        as: 'participaciones'
      });
    }

    /* ─────────────────────────────────────────────────
     * Getters calculados
     * Permiten acceder a representaciones derivadas del estado
     * sin lógica adicional en controladores o servicios.
     * ───────────────────────────────────────────────── */

    /** @returns {boolean} true si el campeonato aún no ha comenzado. */
    get estaProgramado() { return this.c_estado === 'programado'; }

    /** @returns {boolean} true si el campeonato está en desarrollo activo. */
    get estaEnCurso()    { return this.c_estado === 'en_curso'; }

    /** @returns {boolean} true si el campeonato ha concluido. */
    get estaFinalizado() { return this.c_estado === 'finalizado'; }

    /** @returns {boolean} true si el campeonato fue suspendido temporalmente. */
    get estaSuspendido() { return this.c_estado === 'suspendido'; }

    /** @returns {boolean} true si el campeonato fue cancelado definitivamente. */
    get estaCancelado()  { return this.c_estado === 'cancelado'; }

    /** @returns {boolean} true si el registro está activo (no eliminado). */
    get estaActivo()     { return this.estado === true; }

    /**
     * Representación legible del estado competitivo en español.
     * @returns {string} Etiqueta del estado (p. ej., 'En Curso').
     */
    get cEstadoTexto() {
      const estados = {
        programado:  'Programado',
        en_curso:    'En Curso',
        finalizado:  'Finalizado',
        suspendido:  'Suspendido',
        cancelado:   'Cancelado'
      };
      return estados[this.c_estado] || this.c_estado;
    }

    /**
     * Representación legible del tipo de competencia.
     * @returns {string} Etiqueta del tipo (p. ej., 'Liga').
     */
    get tipoTexto() {
      const tipos = {
        campeonato: 'Campeonato',
        liga:       'Liga',
        copa:       'Copa',
        relampago:  'Relámpago',
        amistoso:   'Amistoso',
        torneo:     'Torneo'
      };
      return tipos[this.tipo] || this.tipo;
    }

    /**
     * Indica si el campeonato se encuentra dentro de su rango de fechas activo.
     * @returns {boolean} true si hoy está entre fecha_inicio y fecha_fin.
     */
    get estaVigente() {
      if (!this.fecha_inicio || !this.fecha_fin) return false;
      const hoy   = new Date();
      const inicio = new Date(this.fecha_inicio);
      const fin    = new Date(this.fecha_fin);
      return hoy >= inicio && hoy <= fin;
    }

    /**
     * Días que faltan para el inicio del campeonato.
     * @returns {number|null} Días (negativo si ya inició), o null si no hay fecha.
     */
    get diasFaltanParaInicio() {
      if (!this.fecha_inicio) return null;
      const diff = new Date(this.fecha_inicio) - new Date();
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    /**
     * Días que faltan para el cierre del campeonato.
     * @returns {number|null} Días restantes, o null si no hay fecha de fin.
     */
    get diasFaltanParaFin() {
      if (!this.fecha_fin) return null;
      const diff = new Date(this.fecha_fin) - new Date();
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    /**
     * Duración total del campeonato en días.
     * @returns {number|null} Total de días entre inicio y fin, o null si faltan fechas.
     */
    get duracionDias() {
      if (!this.fecha_inicio || !this.fecha_fin) return null;
      const diff = new Date(this.fecha_fin) - new Date(this.fecha_inicio);
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    /**
     * Cadena de texto descriptiva para logs y reportes.
     * Incluye gestión si está cargada mediante eager loading.
     * @returns {string} Resumen del campeonato.
     */
    get resumen() {
      if (this.gestion) {
        return `${this.nombre} (${this.gestion.gestion}) - ${this.tipoTexto} - ${this.cEstadoTexto}`;
      }
      return `${this.nombre} - ${this.tipoTexto} - ${this.cEstadoTexto}`;
    }
  }

  /* ─────────────────────────────────────────────────
   * Definición de columnas y validaciones
   * ───────────────────────────────────────────────── */
  Campeonato.init({

    /** Clave primaria autoincremental. */
    id_campeonato: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },

    /**
     * Nombre identificador de la competencia.
     * Longitud mínima de 3 caracteres para evitar abreviaciones no descriptivas.
     */
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre del campeonato es requerido' },
        len: { args: [3, 255], msg: 'El nombre debe tener entre 3 y 255 caracteres' }
      }
    },

    /**
     * Modalidad de la competencia.
     * ENUM restringido a CAMPEONATO_TIPOS para integridad de datos.
     */
    tipo: {
      type: DataTypes.ENUM(...CAMPEONATO_TIPOS),
      allowNull: false,
      defaultValue: 'campeonato',
      validate: {
        isIn: {
          args: [CAMPEONATO_TIPOS],
          msg: `El tipo debe ser uno de: ${CAMPEONATO_TIPOS.join(', ')}`
        }
      }
    },

    /**
     * FK hacia GestionCampeonatos.
     * Asocia el campeonato con el año/temporada deportiva correspondiente.
     */
    id_gestion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'GestionCampeonatos', key: 'id_gestion' }
    },

    /** Fecha de inicio de la competencia. */
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: { isDate: { msg: 'La fecha de inicio debe ser una fecha válida' } }
    },

    /** Fecha de cierre de la competencia. Debe ser posterior a fecha_inicio. */
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: { isDate: { msg: 'La fecha de fin debe ser una fecha válida' } }
    },

    /**
     * Estado competitivo de la competencia.
     * Distinto del campo `estado` (soft delete). Este campo refleja el
     * ciclo de vida de la competencia: programado → en_curso → finalizado.
     */
    c_estado: {
      type: DataTypes.ENUM(...C_ESTADOS),
      allowNull: false,
      defaultValue: 'programado',
      validate: {
        isIn: {
          args: [C_ESTADOS],
          msg: `El estado debe ser uno de: ${C_ESTADOS.join(', ')}`
        }
      }
    },

    /**
     * Indicador de registro activo (soft delete).
     * false = eliminado lógicamente, no aparece en consultas estándar.
     */
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      validate: {
        isIn: { args: [[true, false]], msg: 'El estado debe ser verdadero o falso' }
      }
    },

    /** Fecha y hora de registro del campeonato en la base de datos. */
    freg: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }

  }, {
    sequelize,
    modelName: 'Campeonato',
    tableName:  'Campeonatos',
    timestamps: true  // Agrega automáticamente createdAt y updatedAt
  });

  return Campeonato;
};
