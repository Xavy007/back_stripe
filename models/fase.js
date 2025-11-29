'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Fase extends Model {
    static associate(models) {
      // Fase → CampeonatoCategoria (Muchos a Uno)
      Fase.belongsTo(models.CampeonatoCategoria, {
        foreignKey: 'id_cc',
        as: 'campeonatoCategoria'
      });

      // Fase → Jornada (1 a N)
      Fase.hasMany(models.Jornada, {
        foreignKey: 'id_fase',
        as: 'jornadas'
      });

      // Fase → Partido (1 a N)
      Fase.hasMany(models.Partido, {
        foreignKey: 'id_fase',
        as: 'partidos'
      });
    }

    // ===== GETTERS =====
    get estaActiva() {
      return this.estado === true;
    }

    get estaPlanificada() {
      return this.f_estado === 'planificada';
    }

    get estaEnCurso() {
      return this.f_estado === 'en_curso';
    }

    get estaFinalizada() {
      return this.f_estado === 'finalizada';
    }

    get fEstadoTexto() {
      const estados = {
        'planificada': 'Planificada',
        'en_curso': 'En Curso',
        'finalizada': 'Finalizada'
      };
      return estados[this.f_estado] || this.f_estado;
    }

    get tipoTexto() {
      const tipos = {
        'grupos': 'Grupos',
        'liga': 'Liga',
        'eliminatoria': 'Eliminatoria',
        'final_four': 'Final Four'
      };
      return tipos[this.tipo] || this.tipo;
    }

    get requiereGrupos() {
      return this.tipo === 'grupos';
    }

    get esEliminatoria() {
      return this.tipo === 'eliminatoria';
    }

    get idaYVueltaTexto() {
      return this.ida_vuelta ? 'Ida y Vuelta' : 'Partida Única';
    }

    get diasFaltanParaInicio() {
      if (!this.fecha_inicio) return null;
      const hoy = new Date();
      const inicio = new Date(this.fecha_inicio);
      const diff = inicio - hoy;
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    get diasFaltanParaFin() {
      if (!this.fecha_fin) return null;
      const hoy = new Date();
      const fin = new Date(this.fecha_fin);
      const diff = fin - hoy;
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    get duracionDias() {
      if (!this.fecha_inicio || !this.fecha_fin) return null;
      const inicio = new Date(this.fecha_inicio);
      const fin = new Date(this.fecha_fin);
      const diff = fin - inicio;
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    get estaVigente() {
      if (!this.fecha_inicio || !this.fecha_fin) return false;
      const hoy = new Date();
      const inicio = new Date(this.fecha_inicio);
      const fin = new Date(this.fecha_fin);
      return hoy >= inicio && hoy <= fin;
    }

    get resumen() {
      let res = `${this.nombre} - ${this.tipoTexto} (${this.fEstadoTexto})`;
      if (this.ida_vuelta) {
        res += ` - Ida y Vuelta`;
      }
      return res;
    }

    get detalleCompleto() {
      return {
        nombre: this.nombre,
        tipo: this.tipoTexto,
        estado: this.fEstadoTexto,
        orden: this.orden,
        idaVuelta: this.idaYVueltaTexto,
        fechaInicio: this.fecha_inicio?.toLocaleDateString('es-ES'),
        fechaFin: this.fecha_fin?.toLocaleDateString('es-ES'),
        duracion: this.duracionDias,
        descripcion: this.descripcion
      };
    }
  }

  Fase.init({
    id_fase: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID único de la fase'
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

    tipo: {
      type: DataTypes.ENUM('grupos', 'liga', 'eliminatoria', 'final_four'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['grupos', 'liga', 'eliminatoria', 'final_four']],
          msg: 'El tipo debe ser válido'
        }
      },
      comment: 'Tipo de fase'
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
      comment: 'Nombre de la fase (ej: Grupos, Cuartos de Final)'
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
      comment: 'Descripción adicional de la fase'
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
      comment: 'Orden de ejecución de la fase (1, 2, 3...)'
    },

    ida_vuelta: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        isIn: {
          args: [[true, false]],
          msg: 'Debe ser verdadero o falso'
        }
      },
      comment: 'Si se juega ida y vuelta'
    },

    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'La fecha de inicio debe ser válida'
        }
      },
      comment: 'Cuándo inicia la fase'
    },

    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'La fecha de fin debe ser válida'
        }
      },
      comment: 'Cuándo termina la fase'
    },

    f_estado: {
      type: DataTypes.ENUM('planificada', 'en_curso', 'finalizada'),
      allowNull: false,
      defaultValue: 'planificada',
      validate: {
        isIn: {
          args: [['planificada', 'en_curso', 'finalizada']],
          msg: 'El estado debe ser válido'
        }
      },
      comment: 'Estado de la fase'
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
    modelName: 'Fase',
    tableName: 'Fases',
    timestamps: true
  });

  return Fase;
};