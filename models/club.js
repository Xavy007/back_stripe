'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Club extends Model {
    
    static associate(models) {
      // Club -> Equipo, EqTecnico, Jugador
      Club.hasMany(models.Equipo, { foreignKey: 'id_club' });
      Club.hasMany(models.EqTecnico, { foreignKey: 'id_club' });
      Club.hasMany(models.Jugador, { foreignKey: 'id_club' });
      
    }
  }
  Club.init({
    id_club: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    nombre: {
      type:DataTypes.STRING,
      allowNull:false,
    },
    acronimo: {
      type:DataTypes.STRING,
      allowNull:true,
    },
    direccion: {
      type:DataTypes.STRING,
      allowNull:true
    },
    logo: {
      type:DataTypes.STRING,
      allowNull:true
    },
    telefono: {
      type:DataTypes.STRING,
      allowNull:true
    },
    email: {
      type:DataTypes.STRING,
      allowNull:true,
      validate:{
        isEmail:{
          args:true,
          msg:'Debe ingresar un correo electronico valido'
        }       
      },
    },
    redes_sociales: {
      type:DataTypes.STRING,
      allowNull:true,
    },
    personeria: {
      type:DataTypes.BOOLEAN,
      defaultValue:false
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
    modelName: 'Club',
  });
  return Club;
};