'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Participacion extends Model {
    static associate(models) {
     Participacion.belongsTo(models.Equipo, { foreignKey: 'id_equipo' });
      
    }
  }
  Participacion.init({
    id_participacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true},
    id_jugador: DataTypes.INTEGER,
    id_equipo: DataTypes.INTEGER,
    dorsal: DataTypes.INTEGER,
       estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true},
    freg: {      
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true}
  }, {
    sequelize,
    modelName: 'Participacion',
  });
  return Participacion;
};