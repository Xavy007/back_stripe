'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class Nacionalidad extends Model {
     static associate(models) {
      Nacionalidad.hasMany(models.Persona,{
        foreignKey:'id_nacionalidad',
        as:'Personas'
      })
    }
  }
  Nacionalidad.init({
    id_nacionalidad: {
      type:DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false,
      autoIncrement:true
    },
    pais: {
      type:DataTypes.STRING,
      allowNull:true,
      validate:{
        len:{
          args:[3,255],
          msg:'pais no existente'
        }
      }
    },
    estado: {
      type:DataTypes.BOOLEAN,
      defaultValue:true,
      allowNull:true,
      
    },
    f_reg: {
      type:DataTypes.DATE,
      allowNull:true,
      defaultValue:DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Nacionalidad',
    tableName:'Nacionalidades',
    timestamps:true
  });
  return Nacionalidad;
};