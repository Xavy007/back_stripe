'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Grupo extends Model {
    static associate(models) {
      Grupo.hasMany(models.GrupoInscripcion, { foreignKey: 'id_grupo' });
      Grupo.hasMany(models.Jornada, { foreignKey: 'id_grupo' });
      Grupo.hasMany(models.Partido, { foreignKey: 'id_grupo' });
      Grupo.belongsTo(models.CampeonatoCategoria, {  foreignKey: 'id_cc'});

    }
  }
  Grupo.init({
    id_grupo: {       
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true},
    id_cc: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    clave: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: true
    }

  }, {
    sequelize,
    modelName: 'Grupo',
  });
  return Grupo;
};