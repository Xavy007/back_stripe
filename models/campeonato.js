'use strict';
const {Model} = require('sequelize');
const CAMPEONATO_TIPOS = ['campeonato','liga', 'copa', 'amistoso', 'torneo'];
const C_ESTADOS = ['programado', 'en_curso', 'finalizado', 'suspendido', 'cancelado'];

module.exports = (sequelize, DataTypes) => {
  class Campeonato extends Model {
     static associate(models) {
      Campeonato.hasMany(models.Partido, { foreignKey: 'id_campeonato' });
      Campeonato.hasMany(models.Grupo, { foreignKey: 'id_campeonato' });
      Campeonato.hasMany(models.CampeonatoCategoria, { foreignKey: 'id_campeonato', as:'categorias'});
      Campeonato.belongsTo(models.GestionCampeonato,{foreignKey:'id_gestion'})
      }
  }
  Campeonato.init({
    id_campeonato: 
    { 
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    nombre:
    {
      type:DataTypes.STRING,
      allowNull:false
    },
    tipo: { type: DataTypes.ENUM(...CAMPEONATO_TIPOS), allowNull: false, defaultValue: 'campeonato' },
    id_gestion: {
      type:DataTypes.INTEGER,
      allowNull:false,
    },
    fecha_inicio: {
      type:DataTypes.DATE,
      allowNull:true
    },
    fecha_fin: {
      type:DataTypes.DATE,
      allowNull:true
    },
    c_estado: { type: DataTypes.ENUM(...C_ESTADOS), allowNull: false, defaultValue: 'programado' },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true},
    freg: {      
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true}
  }, {
    sequelize,
    modelName: 'Campeonato',
    tableName: 'Campeonatos'
  });
  return Campeonato;
};