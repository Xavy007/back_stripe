'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GestionCampeonato extends Model {
 
    static associate(models) {
      GestionCampeonato.hasMany(models.Campeonato,{
        foreignKey:'id_gestion'
      });
      
    }
  }
  GestionCampeonato.init({
    id_gestion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    nombre: {
      type:DataTypes.STRING,
      allowNull:false
    },
    gestion: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        isValidYear(value){
          const currentYear= new Date().getFullYear();
          const minYear= currentYear-2;
          const maxYear= currentYear+1;
          if(value < minYear || value > maxYear ){
            throw new Error('Lagestion debe ser ${minYear} y ${maxYear} o mas reciente');
          }
        }
      }
    },
    descripcion: {
      type:DataTypes.STRING,
      allowNull:true
    },
   estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true},
    freg: {      
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true}
  }, {
    sequelize,
    modelName: 'GestionCampeonato',
  });
  return GestionCampeonato;
};