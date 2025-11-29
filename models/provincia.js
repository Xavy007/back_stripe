'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Provincia extends Model {
    static associate(models) {
      // Provincia -> Departamento
      Provincia.belongsTo(models.Departamento, {
        foreignKey: 'id_departamento',
        as: 'departamento'
      });

      // Provincia -> Personas (origen)
      Provincia.hasMany(models.Persona, {
        foreignKey: 'id_provincia_origen',
        as: 'personas_origen'
      });
    }
  }

  Provincia.init(
    {
      id_provincia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      id_departamento: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Provincia',
      tableName: 'Provincias',
      timestamps: true
    }
  );

  return Provincia;
};
