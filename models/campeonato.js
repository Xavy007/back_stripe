'use strict';
const { Model } = require('sequelize');
const CAMPEONATO_TIPOS = ['campeonato', 'liga', 'copa', 'relampago', 'amistoso', 'torneo'];
const C_ESTADOS = ['programado', 'en_curso', 'finalizado', 'suspendido', 'cancelado'];

module.exports = (sequelize, DataTypes) => {
  class Campeonato extends Model {
    static associate(models) {
      // Campeonato → GestionCampeonato (FK)
      Campeonato.belongsTo(models.GestionCampeonato, {
        foreignKey: 'id_gestion',
        as: 'gestion'
      });

      // Campeonato → Partido (1 a N)
      Campeonato.hasMany(models.Partido, {
        foreignKey: 'id_campeonato',
        as: 'partidos'
      });

      // Campeonato → Grupo (1 a N)
      Campeonato.hasMany(models.Grupo, {
        foreignKey: 'id_campeonato',
        as: 'grupos'
      });

      // Campeonato → CampeonatoCategoria (1 a N)
      Campeonato.hasMany(models.CampeonatoCategoria, {
        foreignKey: 'id_campeonato',
        as: 'campeonatoCategorias'
      });

      // Campeonato → Categoria (M a M a través de CampeonatoCategoria)
      Campeonato.belongsToMany(models.Categoria, {
        through: models.CampeonatoCategoria,
        foreignKey: 'id_campeonato',
        otherKey: 'id_categoria',
        as: 'categorias'
      });

      // Campeonato → Participacion (1 a N)
      Campeonato.hasMany(models.Participacion, {
        foreignKey: 'id_campeonato',
        as: 'participaciones'
      });
    }

    // ===== GETTERS =====
    get estaProgramado() {
      return this.c_estado === 'programado';
    }

    get estaEnCurso() {
      return this.c_estado === 'en_curso';
    }

    get estaFinalizado() {
      return this.c_estado === 'finalizado';
    }

    get estaSuspendido() {
      return this.c_estado === 'suspendido';
    }

    get estaCancelado() {
      return this.c_estado === 'cancelado';
    }

    get estaActivo() {
      return this.estado === true;
    }

    get cEstadoTexto() {
      const estados = {
        'programado': 'Programado',
        'en_curso': 'En Curso',
        'finalizado': 'Finalizado',
        'suspendido': 'Suspendido',
        'cancelado': 'Cancelado'
      };
      return estados[this.c_estado] || this.c_estado;
    }

    get tipoTexto() {
      const tipos = {
        'campeonato': 'Campeonato',
        'liga': 'Liga',
        'copa': 'Copa',
        'relampago': 'Relámpago',
        'amistoso': 'Amistoso',
        'torneo': 'Torneo'
      };
      return tipos[this.tipo] || this.tipo;
    }

    get estaVigente() {
      if (!this.fecha_inicio || !this.fecha_fin) return false;
      const hoy = new Date();
      const inicio = new Date(this.fecha_inicio);
      const fin = new Date(this.fecha_fin);
      return hoy >= inicio && hoy <= fin;
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

    get resumen() {
      if (this.gestion) {
        return `${this.nombre} (${this.gestion.gestion}) - ${this.tipoTexto} - ${this.cEstadoTexto}`;
      }
      return `${this.nombre} - ${this.tipoTexto} - ${this.cEstadoTexto}`;
    }
  }

  Campeonato.init({
    id_campeonato: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },

    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre del campeonato es requerido'
        },
        len: {
          args: [3, 255],
          msg: 'El nombre debe tener entre 3 y 255 caracteres'
        }
      }
    },

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

    id_gestion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'GestionCampeonatos',
        key: 'id_gestion'
      }
    },

    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'La fecha de inicio debe ser una fecha válida'
        }
      }
    },

    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'La fecha de fin debe ser una fecha válida'
        }
      }
    },

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

    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      validate: {
        isIn: {
          args: [[true, false]],
          msg: 'El estado debe ser verdadero o falso'
        }
      }
    },

    freg: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Campeonato',
    tableName: 'Campeonatos',
    timestamps: true
  });

  return Campeonato;
};