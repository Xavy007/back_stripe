'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inscripcion extends Model {

    static associate(models) {

    }
  }
  Inscripcion.init({
    id_inscripcion: {    
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true},
    id_cc: DataTypes.INTEGER,
    id_equipo: DataTypes.INTEGER,
    grupo: DataTypes.STRING,
    serie: DataTypes.STRING,
   estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true},
    freg: {      
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true}
  }, {
    sequelize,
    modelName: 'Inscripcion',
  });
  return Inscripcion;
};