'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Partido extends Model {
    static associate(models) {
      // FK → Campeonatos
      Partido.belongsTo(models.Campeonato, {
        foreignKey: 'id_campeonato',
        as: 'campeonato'
      });

      // FK → CampeonatoCategorias
      Partido.belongsTo(models.CampeonatoCategoria, {
        foreignKey: 'id_cc',
        as: 'campeonatoCategoria'
      });

      // FK → Canchas
      Partido.belongsTo(models.Cancha, {
        foreignKey: 'id_cancha',
        as: 'cancha'
      });

      // FK → Equipos (local y visitante)
      Partido.belongsTo(models.Equipo, {
        foreignKey: 'equipo_local',
        as: 'equipoLocal'
      });

      Partido.belongsTo(models.Equipo, {
        foreignKey: 'equipo_visitante',
        as: 'equipoVisitante'
      });

      // FK → Fases, Jornadas, Grupos
      Partido.belongsTo(models.Fase, {
        foreignKey: 'id_fase',
        as: 'fase'
      });

      Partido.belongsTo(models.Jornada, {
        foreignKey: 'id_jornada',
        as: 'jornada'
      });

      Partido.belongsTo(models.Grupo, {
        foreignKey: 'id_grupo',
        as: 'grupo'
      });

      // Relación con PartidoJueces (1:1)
      Partido.hasOne(models.PartidoJuez, {
        foreignKey: 'id_partido',
        as: 'asignacionJueces'
      });
    }
  }

  Partido.init({
    id_partido: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID único del partido'
    },
    id_campeonato: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'FK → Campeonatos'
    },
    id_cc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'FK → CampeonatoCategorias'
    },
    id_cancha: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'FK → Canchas'
    },
    equipo_local: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'FK → Equipos (local)'
    },
    equipo_visitante: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'FK → Equipos (visitante)'
    },
    p_estado: {
      type: DataTypes.ENUM('programado', 'en_juego', 'finalizado', 'suspendido', 'wo'),
      allowNull: false,
      defaultValue: 'programado',
      comment: 'Estado del partido'
    },
    resultado_local: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 0, max: 3 },
      comment: 'Sets ganados por equipo local'
    },
    resultado_visitante: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 0, max: 3 },
      comment: 'Sets ganados por equipo visitante'
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: { len: [0, 2000] },
      comment: 'Notas sobre el partido'
    },
    acta_url: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'URL del acta del partido'
    },
    id_fase: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'FK → Fases'
    },
    id_jornada: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'FK → Jornadas'
    },
    id_grupo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'FK → Grupos'
    },
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Cuándo se juega el partido'
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
    modelName: 'Partido',
    tableName: 'Partidos',
    timestamps: true,
    indexes: [
      { name: 'idx_partido_campeonato', fields: ['id_campeonato'] },
      { name: 'idx_partido_cc', fields: ['id_cc'] },
      { name: 'idx_partido_cancha', fields: ['id_cancha'] },
      { name: 'idx_partido_equipo_local', fields: ['equipo_local'] },
      { name: 'idx_partido_equipo_visitante', fields: ['equipo_visitante'] },
      { name: 'idx_partido_p_estado', fields: ['p_estado'] },
      { name: 'idx_partido_fecha_hora', fields: ['fecha_hora'] },
      { name: 'idx_partido_estado', fields: ['estado'] },
      { name: 'idx_partido_cc_p_estado', fields: ['id_cc', 'p_estado'] }
    ]
  });

  return Partido;
};
