'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Equipo extends Model {
    static associate(models) {
      Equipo.belongsTo(models.Club, { foreignKey: 'id_club' });
      Equipo.belongsTo(models.Categoria, { foreignKey: 'id_categoria' });
      Equipo.hasMany(models.Participacion, { foreignKey: 'id_equipo' });
      Equipo.hasMany(models.TablaPosiciones, { foreignKey: 'id_equipo' });
      Equipo.hasMany(models.HistorialCampeonatos, { foreignKey: 'id_equipo' });
    }
  }

  Equipo.init({
    id_equipo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre del equipo no puede estar vacío'
        },
        len: {
          args: [3, 150],
          msg: 'El nombre debe tener entre 3 y 150 caracteres'
        }
      }
    },
    id_club: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Debe seleccionar un club'
        },
        isInt: {
          msg: 'El club debe ser un ID válido'
        }
      }
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Debe seleccionar una categoría'
        },
        isInt: {
          msg: 'La categoría debe ser un ID válido'
        }
      }
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      validate: {
        isIn: {
          args: [[true, false]],
          msg: 'El estado debe ser verdadero o falso'
        }
      }
    },
    f_reg: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: {
          msg: 'f_reg debe ser una fecha válida'
        }
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Equipo',
    tableName: 'Equipos',
    validate: {
      validarIdsUnicos() {
        if (!this.id_club || !this.id_categoria) {
          throw new Error('Club y Categoría son requeridos');
        }
      }
    }
  });

  return Equipo;
};