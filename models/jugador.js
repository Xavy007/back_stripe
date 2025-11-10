'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Jugador extends Model {
    static associate(models) {
      Jugador.belongsTo(models.Persona, { foreignKey: 'id_persona' });
      Jugador.belongsTo(models.Club, { foreignKey: 'id_club' });
    }
  }
  Jugador.init({
    id_jugador: {       
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    id_persona: {
      type:DataTypes.INTEGER,
      allowNull:false,
      unique:true,
      references:{
        model:'Personas',
        key:'id_persona'
      }
    },
    estatura:{
      type:DataTypes.DOUBLE,
      allowNull:false,
      defaultValue:0
    },
    id_club: {
      type:DataTypes.INTEGER,
      allowNull:false,
      unique:true,
      references:{
        model:'Clubes',
        key:'id_club'
      }
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
    modelName: 'Jugador',
    tableName:'Jugadores'
  });
  return Jugador;
};