'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Departamento extends Model {
    static associate(models) {
      // Departamento -> Nacionalidad (opcional)
      Departamento.belongsTo(models.Nacionalidad, {
        foreignKey: 'id_nacionalidad',
        as: 'nacionalidad'
      });

      // Departamento -> Provincias
      Departamento.hasMany(models.Provincia, {
        foreignKey: 'id_departamento',
        as: 'provincias'
      });
    }
  }

  Departamento.init(
    {
      id_departamento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      id_nacionalidad: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Departamento',
      tableName: 'Departamentos',
      timestamps: true
    }
  );

  return Departamento;
};
