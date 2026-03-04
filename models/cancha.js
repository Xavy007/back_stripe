'use strict';
const {  Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cancha extends Model {
    static associate(models) {
      Cancha.hasMany(models.Partido, {
        foreignKey:'id_cancha',
        as:'cancha'
      })
    }
  }
  Cancha.init({
    id_cancha:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false,
      autoIncrement:true
    } ,
    nombre:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:true,
        len:[3,255]
      }
    },
    descripcion:{
      type:DataTypes.STRING,
      allowNull:true
    } ,
    direccion:{   
      type:DataTypes.STRING,
      allowNull:true},
    ubicacion: {
      type:DataTypes.STRING,
      allowNull:true
    },
    tipo: {
      type:DataTypes.ENUM('coliseo','abierta','otro'),
      allowNull:false,
      defaultValue:'coliseo'

    },
    capacidad:{
      type: DataTypes.INTEGER,
      allowNull:true
    },
    estado: {
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:true
    },
    freg: {      
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true}
  }, {
    sequelize,
    modelName: 'Cancha',
    tableName: 'Canchas'
  });
  return Cancha;
};