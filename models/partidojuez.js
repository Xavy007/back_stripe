'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PartidoJuez extends Model {
    static associate(models) {
      // FK → Partidos (1:1)
      PartidoJuez.belongsTo(models.Partido, {
        foreignKey: 'id_partido',
        as: 'partido'
      });

      // FK → Jueces (4 roles diferentes)
      PartidoJuez.belongsTo(models.Juez, {
        foreignKey: 'id_arbitro1',
        as: 'arbitro1'
      });

      PartidoJuez.belongsTo(models.Juez, {
        foreignKey: 'id_arbitro2',
        as: 'arbitro2'
      });

      PartidoJuez.belongsTo(models.Juez, {
        foreignKey: 'id_anotador',
        as: 'anotador'
      });

      PartidoJuez.belongsTo(models.Juez, {
        foreignKey: 'id_cronometrista',
        as: 'cronometrista'
      });

      // FK → Usuarios (planillero)
      PartidoJuez.belongsTo(models.Usuario, {
        foreignKey: 'id_planillero',
        as: 'planillero'
      });
    }
  }

  PartidoJuez.init({
    id_partido_juez: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID único de la asignación'
    },
    id_partido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      comment: 'FK → Partidos'
    },
    id_arbitro1: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'FK → Jueces (Árbitro Principal)'
    },
    id_arbitro2: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'FK → Jueces (Árbitro Segundo)'
    },
    id_anotador: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'FK → Jueces (Anotador físico)'
    },
    id_cronometrista: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'FK → Jueces (Cronometrista)'
    },
    id_planillero: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'FK → Usuarios (quien registra acciones en la app)'
    },
    confirmado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Si los jueces confirmaron asistencia'
    },
    fecha_asignacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Cuándo se hizo la asignación'
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Notas sobre la asignación'
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Soft delete'
    },
    freg: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha de registro'
    }
  }, {
    sequelize,
    modelName: 'PartidoJuez',
    tableName: 'PartidoJueces',
    timestamps: true,
    indexes: [
      { name: 'idx_pj_partido', fields: ['id_partido'] },
      { name: 'idx_pj_arbitro1', fields: ['id_arbitro1'] },
      { name: 'idx_pj_arbitro2', fields: ['id_arbitro2'] },
      { name: 'idx_pj_anotador', fields: ['id_anotador'] },
      { name: 'idx_pj_cronometrista', fields: ['id_cronometrista'] },
      { name: 'idx_pj_planillero', fields: ['id_planillero'] },
      { name: 'idx_pj_estado', fields: ['estado'] }
    ]
  });

  return PartidoJuez;
};
