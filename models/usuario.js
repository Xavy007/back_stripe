'use strict';
const {  Model} = require('sequelize');
const { Sequelize } = require('.');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {

    static associate(models) {
      Usuario.belongsTo(models.Persona, {
        foreignKey: 'id_persona',
        as: 'persona'
      })
    }
  }
  Usuario.init({
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    freg: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [8, 255],
          msg: 'La contraseña debe tener al menos8 caracteres'
        }
      }
    },
    rol: {
      type: DataTypes.ENUM('admin', 'presidente', 'secretario', 'presidenteclub', 'representante'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['admin', 'presidente', 'secretario', 'presidenteclub', 'representante']],
          msg: 'el rol no existe'
        }

      }

    },
    verificado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'Personas',
        key: 'id_persona'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'

    }
  }, {
    sequelize,
    modelName: 'Usuario',
    hooks:{
      beforeCreate:async(usuario)=>{
        if(usuario.password){
          usuario.password=await bcrypt.hash(usuario.password,10);
        }
      },
      beforeUpdate:async(usuario)=>{
        if(usuario.changed('password')){
          usuario.password= await bcrypt.hash(usuario.password,10);
        }
      }
    }
  });
  return Usuario;
};