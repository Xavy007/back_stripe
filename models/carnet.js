'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Carnet extends Model {
    static associate(models) {
      // Un carnet pertenece a un Jugador
      Carnet.belongsTo(models.Jugador, {
        foreignKey: 'id_jugador',
        as: 'jugador'
      });
      
      // Un carnet pertenece a una GestionCampeonato
      Carnet.belongsTo(models.GestionCampeonato, {
        foreignKey: 'id_gestion',
        as: 'gestion'
      });

        // 👉 NUEVO: relación con Categoria
      Carnet.belongsTo(models.Categoria, {
        foreignKey: 'id_categoria',
        as: 'categoria'
      });
    }
  }

  Carnet.init({
    id_carnet: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    id_jugador: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Jugadores',
        key: 'id_jugador'
      }
    },
    id_gestion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'GestionCampeonatos',
        key: 'id_gestion'
      }
    },
    numero_carnet: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: true,               // o false si quieres obligar categoría
      references: {
        model: 'Categorias',         // nombre de la tabla en la BD
        key: 'id_categoria',         // PK de la tabla Categoria
      }
    },
    numero_dorsal: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Número de dorsal del jugador para este carnet'
    },
    posicion: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Posición del jugador en el campo'
    },
    foto_carnet: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Ruta de la foto del carnet'
    },
    fecha_solicitud: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    fecha_vencimiento: {
      type: DataTypes.DATE,
      allowNull: false
    },
    duracion_dias: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 365,
      comment: 'Duración del carnet en días'
    },
    estado_carnet: {
      type: DataTypes.ENUM('pendiente', 'activo', 'vencido', 'cancelado'),
      defaultValue: 'pendiente',
      allowNull: false
    },
    solicitado_por: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'ID del usuario que solicita el carnet'
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
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
    modelName: 'Carnet',
    tableName: 'Carnets'
  });

  return Carnet;
};