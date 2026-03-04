'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CampeonatoCategoria extends Model {
    static associate(models) {
      // CampeonatoCategoria → Campeonato (Muchos a Uno)
      CampeonatoCategoria.belongsTo(models.Campeonato, {
        foreignKey: 'id_campeonato',
        as: 'campeonato'
      });

      // CampeonatoCategoria → Categoria (Muchos a Uno)
      CampeonatoCategoria.belongsTo(models.Categoria, {
        foreignKey: 'id_categoria',
        as: 'categoria'
      });

      // CampeonatoCategoria → Grupo (1 a N)
      CampeonatoCategoria.hasMany(models.Grupo, {
        foreignKey: 'id_cc',
        as: 'grupos'
      });

      // CampeonatoCategoria → Fase (1 a N)
      CampeonatoCategoria.hasMany(models.Fase, {
        foreignKey: 'id_cc',
        as: 'fases'
      });

      // CampeonatoCategoria → Partido (1 a N)
      CampeonatoCategoria.hasMany(models.Partido, {
        foreignKey: 'id_cc',
        as: 'partidos'
      });

      // CampeonatoCategoria → Participacion (1 a N)
      CampeonatoCategoria.hasMany(models.Participacion, {
        foreignKey: 'id_cc',
        as: 'participaciones'
      });

      // CampeonatoCategoria → Inscripcion (1 a N) - NO, Inscripcion está vinculada a Equipo+CC
      // Los equipos se inscriben en una categoría-campeonato
    }

    // ===== GETTERS =====
    get estaActiva() {
      return this.estado === true;
    }

    get formatoTexto() {
      const formatos = {
        'todos_vs_todos': 'Todos vs Todos',
        'eliminacion_directa': 'Eliminación Directa',
        'grupos_y_eliminacion': 'Grupos y Eliminación',
        'liga': 'Liga'
      };
      return formatos[this.formato] || this.formato;
    }

    get requiereGrupos() {
      return this.formato === 'grupos_y_eliminacion';
    }

    get tieneEliminacion() {
      return this.formato === 'eliminacion_directa' || this.formato === 'grupos_y_eliminacion';
    }

    get resumen() {
      if (this.categoria && this.campeonato) {
        return `${this.campeonato.nombre} - ${this.categoria.nombre} (${this.formatoTexto})`;
      }
      return `${this.formatoTexto}`;
    }
  }

  CampeonatoCategoria.init({
    id_cc: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID único de campeonato-categoría'
    },

    id_campeonato: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Campeonatos',
        key: 'id_campeonato'
      },
      validate: {
        notNull: {
          msg: 'El campeonato es requerido'
        }
      },
      comment: 'FK → Campeonatos'
    },

    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categorias',
        key: 'id_categoria'
      },
      validate: {
        notNull: {
          msg: 'La categoría es requerida'
        }
      },
      comment: 'FK → Categorias'
    },

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
      comment: 'Formato de competición'
    },

    numero_grupos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [1],
          msg: 'Mínimo 1 grupo'
        },
        max: {
          args: [10],
          msg: 'Máximo 10 grupos'
        }
      },
      comment: 'Número de grupos (solo si formato es "grupos_y_eliminacion")'
    },

    cantidad_equipos_max: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [2],
          msg: 'Mínimo 2 equipos'
        },
        max: {
          args: [999],
          msg: 'Máximo 999 equipos'
        }
      },
      comment: 'Cantidad máxima de equipos permitidos'
    },

    // ===== CONFIGURACIÓN DEL FIXTURE =====
    // La fecha_inicio se toma del Campeonato.fecha_inicio
    // El formato se define en CampeonatoCategoria.formato

    ida_vuelta: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Si incluye partidos de ida y vuelta'
    },

    dias_entre_jornadas: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 7,
      validate: {
        min: {
          args: [1],
          msg: 'Mínimo 1 día entre jornadas'
        },
        max: {
          args: [365],
          msg: 'Máximo 365 días entre jornadas'
        }
      },
      comment: 'Días de separación entre jornadas'
    },

    hora_inicio_partidos: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: '18:00:00',
      comment: 'Hora predeterminada de inicio de partidos'
    },

    dias_juego: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: null,
      comment: 'Días de la semana en que se juega (0=Dom, 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sáb). Ej: [1,3,5] = Lun/Mié/Vie'
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
      comment: 'Notas específicas para esta categoría en este campeonato'
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
    modelName: 'CampeonatoCategoria',
    tableName: 'CampeonatoCategorias',
    timestamps: true
  });

  return CampeonatoCategoria;
};