'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
    static associate(models) {
      Categoria.hasMany(models.Equipo, { 
        foreignKey: 'id_categoria'
      });
      Categoria.hasMany(models.Carnet, { 
        foreignKey: 'id_categoria' 
      });
      Categoria.belongsToMany(models.Campeonato, { 
        through: models.CampeonatoCategoria, 
        foreignKey: 'id_categoria', 
        otherKey: 'id_campeonato', 
        as: 'campeonatos'
      });
    }
  }
  
  Categoria.init({
    id_categoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'El nombre no puede estar vacío'
        },
        len: {
          args: [3, 100],
          msg: 'El nombre debe tener entre 3 y 100 caracteres'
        }
      }
    },
    descripcion: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: 'La descripción no puede exceder 500 caracteres'
        }
      }
    },
    edad_inicio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [4],
          msg: 'La edad debe ser mayor a 3 años'
        },
        isInt: {
          msg: 'La edad debe ser un número entero'
        }
      }
    },
    edad_limite: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: 'La edad límite no puede ser negativa'
        },
        isInt: {
          msg: 'La edad límite debe ser un número entero'
        }
      }
    },
    genero: {
      type: DataTypes.ENUM('masculino', 'femenino', 'mixto'),
      allowNull: false,
      defaultValue: 'mixto',
      validate: {
        isIn: {
          args: [['masculino', 'femenino', 'mixto']],
          msg: 'Debe ingresar un género válido: masculino, femenino o mixto'
        }
      }
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: '#3B82F6',
      validate: {
        isHexColor: {
          msg: 'El color debe ser un código HEX válido (ej: #FF6B6B)'
        }
      },
      comment: 'Color HEX para los carnets de esta categoría'
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      validate: {
        isBoolean: {
          msg: 'El estado debe ser verdadero o falso'
        }
      }
    },
    freg: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Categoria',
    tableName: 'Categorias',
    timestamps: true,
    underscored: false
  });

  return Categoria;
};