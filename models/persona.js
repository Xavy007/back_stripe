'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Persona extends Model {
    static associate(models) {
      Persona.belongsTo(models.Nacionalidad,{
        foreignKey:'id_nacionalidad',
        as: 'nacionalidad'
      });
      Persona.hasOne(models.Usuario,{
        foreignKey:'id_persona',
        as:'usuario'
      });
    }
  }
  Persona.init({
    id_persona: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ci: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: {
          args:[7,15],
          msg:'El ci es invalido'
        }
      }
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: {
          args: [3, 255],
          msg: 'el nombre debe tener al menos 3 caracteres'
        }
      }
    },
    ap: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3, 255],
          msg: 'el apellido debe tener al menos 3 caracteres'
        }
      }
    },
    am: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3, 255],
          msg: 'el apellido debe tener al menos 3 caracteres'
        }
      }
    },
    fnac: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isNotFuture(value) {
          const today = new Date();
          const date = new Date(value);
          if (date > today) {
            throw new Error('La echa de nacimento no puede ser Futura');
          }
        },
        isMaxAge(value) {
          const today = new Date();
          const date = new Date(value);
          const age = today.getFullYear() - date.getFullYear();
          const birt = new Date(today.getFullYear(), date.getMonth(), date.getDate());
          if (today < birt) {
            age--;
          }
          if (age > 90) {
            throw new Error('la edad no puede ser mayor de 90 años')
          }
        }
      }
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    id_nacionalidad: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'Personas',
        key:'id_persona'
      },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL' 
    },
    genero: {
      type: DataTypes.ENUM('masculino', 'femenino', 'otro'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['masculino', 'femenino', 'otro']],
          msg: 'El genero ingresado debe ser masculino, femenino u otro'
        }
      }

    },
    freg: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true
    }
  },
    {
      sequelize,
      modelName: 'Persona',
      timestamps:true
    });
  return Persona;
};