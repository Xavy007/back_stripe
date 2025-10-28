'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EqTecnico extends Model {
    static associate(models) {
      EqTecnico.belongsTo(models.Categoria,{foreignKey:'id_categoria' });
      EqTecnico.belongsTo(models.Persona,{foreignKey:'id_persona'});
      EqTecnico.belongsTo(models.Club,{foreignKey:'id_club'});
    }
  }
  EqTecnico.init({
    id_eqtecnico: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    id_persona: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    id_categoria: 
    {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    id_club: 
    {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    freg: {      
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true},
    desde: {
      type:DataTypes.DATE,
      allowNull:true
    },
    hasta: {
      type:DataTypes.DATE,
      allowNull:true}
  }, {
    sequelize,
    modelName: 'EqTecnico',
  });
  return EqTecnico;
};