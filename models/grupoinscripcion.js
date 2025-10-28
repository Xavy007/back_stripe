'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GrupoInscripcion extends Model {
    static associate(models) {
      GrupoInscripcion.belongsTo(models.Grupo,{foreignKey:'id_grupo'});
      GrupoInscripcion.belongsTo(models.Inscripcion,{foreignKey:'id_inscripcion'});
    }
  }
  GrupoInscripcion.init({
    id_grupo_inscripcion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    id_grupo:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    id_inscripcion: 
    {
      type:DataTypes.INTEGER,
      allowNull:true
    },

    bombo: DataTypes.INTEGER,
    slot_grupo: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'GrupoInscripcion',
  });
  return GrupoInscripcion;
};