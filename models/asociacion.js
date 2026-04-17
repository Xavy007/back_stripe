'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Asociacion extends Model {
    static associate(models) {}
  }

  Asociacion.init({
    id_asociacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: 'Asociación de Voleibol'
    },
    acronimo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    departamento: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: { args: true, msg: 'Debe ingresar un correo electrónico válido' }
      }
    },
    sitio_web: {
      type: DataTypes.STRING,
      allowNull: true
    },
    federacion: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Asociacion',
    tableName: 'asociacion',
    timestamps: true
  });

  return Asociacion;
};
