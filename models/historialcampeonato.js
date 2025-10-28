'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HistorialCampeonato extends Model {
    static associate(models) {
      HistorialCampeonato.belongsTo(models.Campeonato, { foreignKey: 'id_campeonato' });
      HistorialCampeonato.belongsTo(models.Equipo, { foreignKey: 'id_equipo' });

    }
  }
  HistorialCampeonato.init({
    id_historial: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    id_campeonato: {
      type:DataTypes.INTEGER,
      allowNull:true
    },
    id_equipo: {
      type:DataTypes.INTEGER,
      allowNull:true
    },
    posicion_final: DataTypes.INTEGER,
    puntos: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'HistorialCampeonato',
  });
  return HistorialCampeonato;
};