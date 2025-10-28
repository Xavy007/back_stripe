'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Juez extends Model {
    static associate(models) {
      Juez.belongsToMany(models.Partido, { through: models.JuezPartido, foreignKey: 'id_juez', otherKey: 'id_partido' });

    }
  }
  Juez.init({
    id_juez: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    id_persona: DataTypes.INTEGER,
    certificacion: DataTypes.BOOLEAN,
    /*juez_categoria: DataTypes.ENUM,
    grado: DataTypes.ENUM,*/
   estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true},
    freg: {      
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true}
  }, {
    sequelize,
    modelName: 'Juez',
  });
  return Juez;
};