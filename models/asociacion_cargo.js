'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AsociacionCargo extends Model {
    static associate(models) {
      AsociacionCargo.belongsTo(models.Usuario, {
        foreignKey: 'id_usuario',
        as: 'usuario'
      });
      AsociacionCargo.belongsTo(models.GestionCampeonato, {
        foreignKey: 'id_gestion',
        as: 'gestion'
      });
    }
  }

  AsociacionCargo.init({
    id_cargo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Usuarios', key: 'id_usuario' }
    },
    id_gestion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'GestionCampeonatos', key: 'id_gestion' }
    },
    cargo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: {
          args: [['presidente', 'secretario', 'tesorero', 'vocal', 'fiscal']],
          msg: 'Cargo no válido'
        }
      }
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    fecha_fin: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'AsociacionCargo',
    tableName: 'asociacion_cargo',
    timestamps: true
  });

  return AsociacionCargo;
};
