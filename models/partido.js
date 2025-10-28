'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Partido extends Model {
    static associate(models) {
      Partido.belongsTo(models.Jornada, { foreignKey: 'id_jornada' });
      Partido.belongsToMany(models.Juez, { through: models.JuezPartido, foreignKey: 'id_partido', otherKey: 'id_juez' });
      
    }
  }
  Partido.init({
    id_partido: {       
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true},
    id_campeonato: DataTypes.INTEGER,
    id_cancha: DataTypes.INTEGER,
    equipo_local: DataTypes.INTEGER,
    equipo_visitante: DataTypes.INTEGER,
   // p_estado: DataTypes.ENUM,
    resultado_local: DataTypes.INTEGER,
    resultado_visitante: DataTypes.INTEGER,
   estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true},
    freg: {      
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true},
    id_fase: DataTypes.INTEGER,
    id_jornada: DataTypes.INTEGER,
    id_grupo: DataTypes.INTEGER,
    fecha_hora: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Partido',
  });
  return Partido;
};