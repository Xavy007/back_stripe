'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fase extends Model {
    static associate(models) {
      Fase.hasMany(models.Jornada, { foreignKey: 'id_fase' });
      Fase.hasMany(models.Partido, { foreignKey: 'id_fase' });
      Fase.belongsTo(models.CampeonatoCategoria,{foreignKey:'id_cc'});
    }
  }
  Fase.init({
    id_fase: {       
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true},
    id_cc: { 
      type:DataTypes.INTEGER,
      allowNull:false
    },
    tipo: {
      type: DataTypes.ENUM('grupos', 'liga', 'eliminatoria', 'final_four'),
      allowNull: false,
      defaultValue: 'liga',
      validate: {
        isIn: {
          args: [['grupos', 'liga', 'eliminatoria', 'final_four']],
          msg: 'El tipo debe ser uno de: grupos, liga, eliminatoria, final_four'
        }
      }
    },
    nombre: {
      type:DataTypes.STRING,
      allowNull:true
    },
    orden: {
      type:DataTypes.INTEGER,
      allowNull:true,
      defaultValue:0
    },
    ida_vuelta: {
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:true
    },
    f_estado: {
      type: DataTypes.ENUM('planificada', 'en_curso', 'finalizada'),
      allowNull: false,
      defaultValue: 'planificada',
      validate: {
        isIn: {
          args: [['planificada', 'en_curso', 'finalizada']],
          msg: 'El estado debe ser planificada, en_curso o finalizada'
        }
      }
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
    modelName: 'Fase',
  });
  return Fase;
};