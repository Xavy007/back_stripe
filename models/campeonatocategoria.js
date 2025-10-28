'use strict';
const { Model} = require('sequelize');

const FORMATO_VALUES = ['todos_vs_todos','eliminacion_directa','grupos_y_eliminacion','liga'];
module.exports = (sequelize, DataTypes) => {
  class CampeonatoCategoria extends Model {
    static associate(models) {
      CampeonatoCategoria.hasMany(models.Inscripcion, { foreignKey: 'id_cc' });
      CampeonatoCategoria.hasMany(models.Fase, { foreignKey: 'id_cc' });
      CampeonatoCategoria.hasMany(models.Grupo, {foreignKey: 'id_cc' });
      CampeonatoCategoria.belongsTo(models.Campeonato, { as: 'campeonato', foreignKey: 'id_campeonato' });
      CampeonatoCategoria.belongsTo(models.Categoria,   { as: 'categoria',   foreignKey: 'id_categoria' });


    }
  }
  CampeonatoCategoria.init({
    id_cc:{ 
      type:DataTypes.INTEGER,
      allowNull:false,
      unique:true,
      primaryKey:true,
      autoIncrement:true
    },
    id_campeonato: 
    {
      type:DataTypes.INTEGER,
      allowNull:false,
    },
    id_categoria: 
    {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    formato: { type: DataTypes.ENUM(...FORMATO_VALUES), allowNull: false, defaultValue: 'liga' },
    numero_grupos:{
      type:DataTypes.INTEGER,
      allowNull:true
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
    modelName: 'CampeonatoCategoria',
  });
  return CampeonatoCategoria;
};