'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JuezPartido extends Model {

    static associate(models) {

    }
  }
  JuezPartido.init({
    id_juez_partido: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    id_juez: DataTypes.INTEGER,
    id_partido: DataTypes.INTEGER,
    rol: DataTypes.STRING,
    freg: {      
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true}
  }, {
    sequelize,
    modelName: 'JuezPartido',
  });
  return JuezPartido;
};