'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TablaPosicion extends Model {
    static associate(models) {
      
      TablaPosicion.belongsTo(models.Campeonato, { foreignKey: 'id_campeonato' });
      TablaPosicion.belongsTo(models.Equipo, { foreignKey: 'id_equipo' });
      
      
    }
  }
  TablaPosicion.init({
    id_tabla: DataTypes.INTEGER,
    id_campeonato: DataTypes.INTEGER,
    id_equipo: DataTypes.INTEGER,
    puntos: DataTypes.INTEGER,
    partidos_jugados: DataTypes.INTEGER,
    ganados: DataTypes.INTEGER,
    perdidos: DataTypes.INTEGER,
    wo: DataTypes.INTEGER,
    sets_ganados: DataTypes.INTEGER,
    sets_perdidos: DataTypes.INTEGER,
    diferencia_sets: DataTypes.INTEGER,
    puntos_favor: DataTypes.INTEGER,
    puntos_contra: DataTypes.INTEGER,
    diferencia_puntos: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TablaPosicion',
  });
  return TablaPosicion;
};