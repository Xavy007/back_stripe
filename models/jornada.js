'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Jornada extends Model {
    static associate(models) {
      // Jornada → Fase (Muchos a Uno)
      Jornada.belongsTo(models.Fase, {
        foreignKey: 'id_fase',
        as: 'fase'
      });

      // Jornada → Grupo (Muchos a Uno)
      Jornada.belongsTo(models.Grupo, {
        foreignKey: 'id_grupo',
        as: 'grupo'
      });

      // Jornada → Partido (1 a N)
      Jornada.hasMany(models.Partido, {
        foreignKey: 'id_jornada',
        as: 'partidos'
      });
    }

    // ===== GETTERS =====
    get estaActiva() {
      return this.estado === true;
    }

    get estaPlanificada() {
      return this.j_estado === 'planificada';
    }

    get estaEnCurso() {
      return this.j_estado === 'en_curso';
    }

    get estaFinalizada() {
      return this.j_estado === 'finalizada';
    }

    get jEstadoTexto() {
      const estados = {
        'planificada': 'Planificada',
        'en_curso': 'En Curso',
        'finalizada': 'Finalizada'
      };
      return estados[this.j_estado] || this.j_estado;
    }

    get numeroFormato() {
      return `Jornada ${this.numero}`;
    }

    get diasFaltanParaFecha() {
      if (!this.fecha) return null;
      const hoy = new Date();
      const jornada = new Date(this.fecha);
      const diff = jornada - hoy;
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    get yaEmpezo() {
      if (!this.fecha) return false;
      const hoy = new Date();
      const jornada = new Date(this.fecha);
      return hoy >= jornada;
    }

    get estaProxima() {
      const dias = this.diasFaltanParaFecha;
      return dias !== null && dias >= 0 && dias <= 7;
    }

    get fechaFormato() {
      if (!this.fecha) return 'Sin definir';
      const opciones = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return new Date(this.fecha).toLocaleDateString('es-ES', opciones);
    }

    get horaFormato() {
      if (!this.fecha) return '';
      const horas = new Date(this.fecha).getHours().toString().padStart(2, '0');
      const minutos = new Date(this.fecha).getMinutes().toString().padStart(2, '0');
      return `${horas}:${minutos}`;
    }

    get fechaHoraFormato() {
      if (!this.fecha) return 'Sin definir';
      return `${this.fechaFormato} - ${this.horaFormato}`;
    }

    get resumen() {
      let res = `${this.numeroFormato} - ${this.nombre}`;
      if (this.grupo) {
        res += ` (${this.grupo.nombre})`;
      }
      if (this.fecha) {
        res += ` - ${this.fechaFormato}`;
      }
      res += ` [${this.jEstadoTexto}]`;
      return res;
    }

    get detalleCompleto() {
      return {
        numero: this.numero,
        nombre: this.nombre,
        grupo: this.grupo?.nombre,
        fase: this.fase?.nombre,
        fecha: this.fechaFormato,
        hora: this.horaFormato,
        estado: this.jEstadoTexto,
        descripcion: this.descripcion,
        diasFaltantes: this.diasFaltanParaFecha
      };
    }
  }

  Jornada.init({
    id_jornada: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID único de la jornada'
    },

    id_fase: {
      type: DataTypes.INTEGER,
      allowNull: true,  // Opcional para fixtures simples
      references: {
        model: 'Fases',
        key: 'id_fase'
      },
      comment: 'FK → Fases (opcional para fixtures simples)'
    },

    id_grupo: {
      type: DataTypes.INTEGER,
      allowNull: true,  // Opcional para fixtures simples
      references: {
        model: 'Grupos',
        key: 'id_grupo'
      },
      comment: 'FK → Grupos (opcional para fixtures simples)'
    },

    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: 'El número de jornada debe ser al menos 1'
        }
      },
      comment: 'Número de la jornada (1, 2, 3...)'
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
      comment: 'Nombre de la jornada (ej: Jornada 1, Fecha 1)'
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
      comment: 'Descripción adicional de la jornada'
    },

    fecha: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'La fecha debe ser válida'
        }
      },
      comment: 'Fecha de la jornada'
    },

    j_estado: {
      type: DataTypes.ENUM('planificada', 'en_curso', 'finalizada'),
      allowNull: false,
      defaultValue: 'planificada',
      validate: {
        isIn: {
          args: [['planificada', 'en_curso', 'finalizada']],
          msg: 'El estado debe ser válido'
        }
      },
      comment: 'Estado de la jornada'
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
    modelName: 'Jornada',
    tableName: 'Jornadas',
    timestamps: true
  });

  return Jornada;
};