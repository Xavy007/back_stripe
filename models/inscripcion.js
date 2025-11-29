'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Inscripcion extends Model {
    static associate(models) {
      // Inscripcion → CampeonatoCategoria (Muchos a Uno)
      Inscripcion.belongsTo(models.CampeonatoCategoria, {
        foreignKey: 'id_cc',
        as: 'campeonatoCategoria'
      });

      // Inscripcion → Equipo (Muchos a Uno)
      Inscripcion.belongsTo(models.Equipo, {
        foreignKey: 'id_equipo',
        as: 'equipo'
      });

      // Inscripcion → GrupoInscripcion (1 a N)
      Inscripcion.hasMany(models.GrupoInscripcion, {
        foreignKey: 'id_inscripcion',
        as: 'grupoInscripciones'
      });

      // Inscripcion → Participacion (1 a N) - Los jugadores participan en equipos inscritos
      // NO directo, va a través de Equipo
    }

    // ===== GETTERS =====
    get estaActiva() {
      return this.estado === true;
    }

    get tieneGrupo() {
      return this.grupo !== null && this.grupo !== undefined;
    }

    get tieneSerie() {
      return this.serie !== null && this.serie !== undefined;
    }

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

    get jugoCompleto() {
      return this.cantidad_jugadores && this.cantidad_jugadores > 0;
    }

    get resumen() {
      if (this.equipo && this.campeonatoCategoria) {
        let grupo = this.grupo ? ` - Grupo ${this.grupo}` : '';
        let posicion = this.posicion_final ? ` - ${this.posicionFinalTexto}` : '';
        return `${this.equipo.nombre}${grupo}${posicion}`;
      }
      return 'Inscripción sin datos';
    }
  }

  Inscripcion.init({
    id_inscripcion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID único de la inscripción'
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
      comment: 'FK → CampeonatoCategorias'
    },

    id_equipo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Equipos',
        key: 'id_equipo'
      },
      validate: {
        notNull: {
          msg: 'El equipo es requerido'
        }
      },
      comment: 'FK → Equipos'
    },

    grupo: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [1, 10],
          msg: 'El grupo debe tener entre 1 y 10 caracteres'
        }
      },
      comment: 'Grupo (ej: A, B, C, G1, G2)'
    },

    serie: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [1, 10],
          msg: 'La serie debe tener entre 1 y 10 caracteres'
        }
      },
      comment: 'Serie o zona (ej: 1, 2, 3)'
    },

    posicion_final: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [1],
          msg: 'La posición debe ser al menos 1'
        }
      },
      comment: 'Posición final en la categoría'
    },

    cantidad_jugadores: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [1],
          msg: 'Debe haber al menos 1 jugador'
        }
      },
      comment: 'Cantidad de jugadores inscritos'
    },

    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 2000],
          msg: 'Las observaciones no pueden exceder 2000 caracteres'
        }
      },
      comment: 'Notas sobre la inscripción'
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

    fecha_inscripcion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: {
          msg: 'La fecha debe ser válida'
        }
      },
      comment: 'Cuándo se realizó la inscripción'
    },

    freg: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha de registro en BD'
    }
  }, {
    sequelize,
    modelName: 'Inscripcion',
    tableName: 'Inscripciones',
    timestamps: true
  });

  return Inscripcion;
};