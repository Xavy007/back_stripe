'use strict';
const { Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Equipo extends Model {
    static associate(models) {
      Equipo.hasMany(models.Participacion, { foreignKey: 'id_equipo' });
      Equipo.hasMany(models.TablaPosicion, { foreignKey: 'id_equipo' });
      Equipo.hasMany(models.HistorialCampeonato, { foreignKey: 'id_equipo' });
    }
  }
  Equipo.init({
    id_equipo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id_club: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    freg: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Equipo',
  });
  return Equipo;
};