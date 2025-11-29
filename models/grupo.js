'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Grupo extends Model {
    static associate(models) {
      // Grupo → CampeonatoCategoria (Muchos a Uno)
      Grupo.belongsTo(models.CampeonatoCategoria, {
        foreignKey: 'id_cc',
        as: 'campeonatoCategoria'
      });

      // Grupo → GrupoInscripcion (1 a N)
      Grupo.hasMany(models.GrupoInscripcion, {
        foreignKey: 'id_grupo',
        as: 'grupoInscripciones'
      });

      // Grupo → Partido (1 a N)
      Grupo.hasMany(models.Partido, {
        foreignKey: 'id_grupo',
        as: 'partidos'
      });

      // Grupo → Jornada (1 a N)
      Grupo.hasMany(models.Jornada, {
        foreignKey: 'id_grupo',
        as: 'jornadas'
      });
    }

    // ===== GETTERS =====
    get estaActivo() {
      return this.estado === true;
    }

    get nombreCompleto() {
      return `${this.nombre} (${this.clave})`;
    }

    get estaLleno() {
      // Esto requeriría contar grupoInscripciones, mejor implementar en método async
      return false; // placeholder
    }

    get tieneDescripcion() {
      return this.descripcion !== null && this.descripcion !== undefined && this.descripcion.trim().length > 0;
    }

    get posicionesDisponibles() {
      if (!this.cantidad_equipos_max) return null;
      // Esto requeriría contar grupoInscripciones
      return null; // placeholder
    }

    get resumen() {
      if (this.campeonatoCategoria) {
        return `${this.nombre} - ${this.campeonatoCategoria.categoria?.nombre || 'Categoría'} (Orden: ${this.orden})`;
      }
      return `${this.nombreCompleto} (Orden: ${this.orden})`;
    }

    get claveCompleta() {
      if (this.campeonatoCategoria?.campeonato) {
        return `${this.campeonatoCategoria.campeonato.nombre}_${this.clave}`;
      }
      return this.clave;
    }
  }

  Grupo.init({
    id_grupo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID único del grupo'
    },

    id_cc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'CampeonatoCategorias',
        key: 'id_cc'
      },
      validate: {
        notNull: {
          msg: 'La categoría-campeonato es requerida'
        }
      },
      comment: 'FK → CampeonatoCategorias (en qué categoría-campeonato)'
    },

    clave: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La clave es requerida'
        },
        len: {
          args: [1, 5],
          msg: 'La clave debe tener entre 1 y 5 caracteres'
        }
      },
      comment: 'Clave del grupo (ej: A, B, C, G1, G2)'
    },

    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre es requerido'
        },
        len: {
          args: [3, 100],
          msg: 'El nombre debe tener entre 3 y 100 caracteres'
        }
      },
      comment: 'Nombre del grupo (ej: Grupo A, Grupo 1)'
    },

    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: 'La descripción no puede exceder 1000 caracteres'
        }
      },
      comment: 'Descripción adicional del grupo'
    },

    orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: {
          args: [1],
          msg: 'El orden debe ser al menos 1'
        }
      },
      comment: 'Orden de visualización del grupo (1, 2, 3, etc)'
    },

    cantidad_equipos_max: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [2],
          msg: 'Mínimo 2 equipos'
        }
      },
      comment: 'Cantidad máxima de equipos permitidos en el grupo'
    },

    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      validate: {
        isIn: {
          args: [[true, false]],
          msg: 'El estado debe ser verdadero o falso'
        }
      },
      comment: 'Soft delete: true = activo, false = eliminado'
    },

    freg: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha de registro'
    }
  }, {
    sequelize,
    modelName: 'Grupo',
    tableName: 'Grupos',
    timestamps: true
  });

  return Grupo;
};