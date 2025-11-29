'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GrupoInscripcion extends Model {
    static associate(models) {
      // GrupoInscripcion → Grupo (Muchos a Uno)
      GrupoInscripcion.belongsTo(models.Grupo, {
        foreignKey: 'id_grupo',
        as: 'grupo'
      });

      // GrupoInscripcion → Inscripcion (Muchos a Uno)
      GrupoInscripcion.belongsTo(models.Inscripcion, {
        foreignKey: 'id_inscripcion',
        as: 'inscripcion'
      });
    }

    // ===== GETTERS =====
    get estaActiva() {
      return this.estado === true;
    }

    get bomboTexto() {
      const bombos = {
        1: 'Bombo 1 (Favoritos)',
        2: 'Bombo 2',
        3: 'Bombo 3',
        4: 'Bombo 4 (Revelaciones)'
      };
      return bombos[this.bombo] || `Bombo ${this.bombo}`;
    }

    get posicionTexto() {
      if (!this.slot_grupo) return 'Sin definir';
      
      const sufijo = (n) => {
        if (n === 1) return 'er';
        if (n === 2) return 'do';
        if (n === 3) return 'er';
        return 'to';
      };
      
      return `Posición ${this.slot_grupo}${sufijo(this.slot_grupo)}`;
    }

    get resumen() {
      if (this.grupo && this.inscripcion && this.inscripcion.equipo) {
        return `${this.inscripcion.equipo.nombre} - Grupo ${this.grupo.clave} - ${this.posicionTexto}`;
      }
      return 'Asignación de grupo sin datos';
    }

    get detalleCompleto() {
      return {
        grupo: this.grupo?.nombre,
        clave: this.grupo?.clave,
        equipo: this.inscripcion?.equipo?.nombre,
        bombo: this.bomboTexto,
        posicion: this.posicionTexto,
        slot: this.slot_grupo,
        observaciones: this.observaciones
      };
    }
  }

  GrupoInscripcion.init({
    id_grupo_inscripcion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID único de la inscripción en grupo'
    },

    id_grupo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Grupos',
        key: 'id_grupo'
      },
      validate: {
        notNull: {
          msg: 'El grupo es requerido'
        }
      },
      comment: 'FK → Grupos (en qué grupo)'
    },

    id_inscripcion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Inscripciones',
        key: 'id_inscripcion'
      },
      validate: {
        notNull: {
          msg: 'La inscripción del equipo es requerida'
        }
      },
      comment: 'FK → Inscripciones (qué equipo se inscribió)'
    },

    bombo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: 'El bombo debe ser al menos 1'
        }
      },
      comment: 'Número de bombo (1, 2, 3, 4...) para la asignación'
    },

    slot_grupo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: 'El slot debe ser al menos 1'
        }
      },
      comment: 'Posición/slot del equipo en el grupo (1, 2, 3...)'
    },

    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: 'Las observaciones no pueden exceder 1000 caracteres'
        }
      },
      comment: 'Notas sobre la asignación en el grupo'
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
    modelName: 'GrupoInscripcion',
    tableName: 'GrupoInscripciones',
    timestamps: true
  });

  return GrupoInscripcion;
};