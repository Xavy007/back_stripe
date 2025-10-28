'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Jornada extends Model {

    static associate(models) {
 
    }
  }
  Jornada.init({
    id_jornada: {       
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true},
    id_fase: DataTypes.INTEGER,
    id_grupo: DataTypes.INTEGER,
    numero: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    fecha: DataTypes.DATE,
    
  }, {
    sequelize,
    modelName: 'Jornada',
  });
  return Jornada;
};