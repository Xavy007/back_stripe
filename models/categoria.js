'use strict';
const {  Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
     static associate(models) {
      Categoria.hasMany(models.Equipo, { foreignKey: 'id_categoria'});
      Categoria.belongsToMany(models.Campeonato, { through: models.CampeonatoCategoria, foreignKey: 'id_categoria', otherKey: 'id_campeonato', as:'campeonatos'});
   }
  }
  Categoria.init({
    id_categoria: {
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
    },
    nombre:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    descripcion: {
      type:DataTypes.STRING,
      allowNull:true,
    },
    edad_inicio:{
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        min:{
          args:[4],
          msg:'La edad debe ser mayor a 3 años'
        }
      }
    },
    edad_limite: {
      type:DataTypes.INTEGER,
      allowNull:true
    },
    genero:{                                                  
      type: DataTypes.ENUM('masculino', 'femenino', 'mixto'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['masculino', 'femenino', 'mixto']],
          msg: 'Debe ingresar un genero valido'
        }
      }
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    freg: {
      type:DataTypes.DATE,
      allowNull:false,
      defaultValue:DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Categoria',
    tableName:'Categorias'
  });
  return Categoria;
};