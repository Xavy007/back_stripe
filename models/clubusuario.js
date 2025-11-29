'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class ClubUsuario extends Model {
    static associate(models) {

      // 🔗 Relación con Club
      ClubUsuario.belongsTo(models.Club, {
        foreignKey: 'id_club',
        as: 'club'
      });

      // 🔗 Relación con Usuario
      ClubUsuario.belongsTo(models.Usuario, {
        foreignKey: 'id_usuario',
        as: 'usuario'
      });
    }
  }

  ClubUsuario.init({
    id_club_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    id_club: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    rol_en_club: {
      type: DataTypes.ENUM('presidente', 'representante', 'delegado', 'vocal', 'otro'),
      allowNull: false,
      defaultValue: 'otro'
    },

    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },

    freg: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },

    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    fecha_fin: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }

  }, {
    sequelize,
    modelName: 'ClubUsuario',
    tableName: 'ClubUsuarios'
  });

  return ClubUsuario;
};
