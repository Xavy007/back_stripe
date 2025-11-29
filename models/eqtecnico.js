'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EqTecnico extends Model {
    static associate(models) {
      // EqTecnico → Persona (Muchos a Uno)
      EqTecnico.belongsTo(models.Persona, {
        foreignKey: 'id_persona',
        as: 'persona'
      });

      // EqTecnico → Club (Muchos a Uno)
      EqTecnico.belongsTo(models.Club, {
        foreignKey: 'id_club',
        as: 'club'
      });
    }

    // ===== GETTERS =====
    get estaActivo() {
      return this.estado === 'activo';
    }

    get estaSuspendido() {
      return this.estado === 'suspendido';
    }

    get estaInactivo() {
      return this.estado === 'inactivo';
    }

    get rolTexto() {
      const roles = {
        'DT': 'Director Técnico',
        'EA': 'Entrenador Asistente',
        'AC': 'Ayudante de Campo',
        'M': 'Médico',
        'F': 'Fisioterapeuta'
      };
      return roles[this.rol] || this.rol;
    }

    get estadoTexto() {
      const estados = {
        'activo': 'Activo (Trabajando)',
        'suspendido': 'Suspendido (Sanción)',
        'inactivo': 'Inactivo (Retirado)'
      };
      return estados[this.estado] || this.estado;
    }

    get diasEnCargo() {
      if (!this.fecha_inicio) return 0;
      
      const hoy = new Date();
      const inicio = new Date(this.fecha_inicio);
      const diff = hoy - inicio;
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    get tiempoEnCargo() {
      const dias = this.diasEnCargo;
      
      if (dias < 1) return 'Hoy';
      if (dias === 1) return '1 día';
      if (dias < 30) return `${dias} días`;
      
      const meses = Math.floor(dias / 30);
      if (meses === 1) return '1 mes';
      if (meses < 12) return `${meses} meses`;
      
      const años = Math.floor(meses / 12);
      const mesesRestantes = meses % 12;
      
      if (años === 1 && mesesRestantes === 0) return '1 año';
      if (mesesRestantes === 0) return `${años} años`;
      
      return `${años} año${años > 1 ? 's' : ''} y ${mesesRestantes} mes${mesesRestantes > 1 ? 'es' : ''}`;
    }

    get sigue_vigente() {
      return this.estaActivo || this.estaSuspendido;
    }

    get resumen() {
      if (this.persona) {
        return `${this.persona.nombre} ${this.persona.ap || ''} - ${this.rolTexto}`;
      }
      return `${this.rolTexto}`;
    }
  }

  EqTecnico.init({
    id_eqtecnico: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Personas',
        key: 'id_persona'
      }
    },

    id_club: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Clubes',
        key: 'id_club'
      }
    },

    rol: {
      type: DataTypes.ENUM('DT', 'EA', 'AC', 'M', 'F'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['DT', 'EA', 'AC', 'M', 'F']],
          msg: 'El rol debe ser: DT (Director Técnico), EA (Entrenador Asistente), AC (Ayudante Campo), M (Médico) o F (Fisioterapeuta)'
        }
      }
    },

    estado: {
      type: DataTypes.ENUM('activo', 'suspendido', 'inactivo'),
      allowNull: false,
      defaultValue: 'activo',
      validate: {
        isIn: {
          args: [['activo', 'suspendido', 'inactivo']],
          msg: 'El estado debe ser: activo, suspendido o inactivo'
        }
      }
    },

    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: {
          msg: 'La fecha de inicio debe ser una fecha válida'
        }
      }
    },

    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'La fecha de fin debe ser una fecha válida'
        }
      }
    },

    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 2000],
          msg: 'Las observaciones no pueden exceder 2000 caracteres'
        }
      }
    },

    freg: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'EqTecnico',
    tableName: 'EqTecnicos',
    timestamps: true
  });

  return EqTecnico;
};