'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Juez extends Model {
    static associate(models) {
      // Relación con Persona
      Juez.belongsTo(models.Persona, {
        foreignKey: 'id_persona',
        as: 'persona',
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      });

      // Relaciones con PartidoJueces
      Juez.hasMany(models.PartidoJuez, {
        foreignKey: 'id_arbitro1',
        as: 'partidosComoArbitro1'
      });

      Juez.hasMany(models.PartidoJuez, {
        foreignKey: 'id_arbitro2',
        as: 'partidosComoArbitro2'
      });

      Juez.hasMany(models.PartidoJuez, {
        foreignKey: 'id_anotador',
        as: 'partidosComoAnotador'
      });

      Juez.hasMany(models.PartidoJuez, {
        foreignKey: 'id_cronometrista',
        as: 'partidosComoCronometrista'
      });
    }
  }

  Juez.init({
    id_juez: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID único del juez'
    },
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Personas',
        key: 'id_persona'
      },
      comment: 'Persona que es juez (FK → Personas)'
    },
    certificacion: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Si tiene certificación oficial'
    },
    juez_categoria: {
      type: DataTypes.ENUM('juez', 'juez_linea'),
      allowNull: false,
      comment: 'Tipo: juez (árbitro central) o juez_linea (árbitro de línea)'
    },
    grado: {
      type: DataTypes.ENUM(
        'municipal',
        'departamental',
        'federativo_nacional',
        'federativo_internacional'
      ),
      allowNull: false,
      defaultValue: 'municipal',
      comment: 'Nivel de autoridad'
    },
    estado_juez: {
      type: DataTypes.ENUM('activo', 'suspendido', 'inactivo'),
      allowNull: false,
      defaultValue: 'activo',
      comment: 'activo (puede arbitrar), suspendido (sanción), inactivo (retirado)'
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Cuándo comenzó como juez'
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Cuándo finalizó (si aplica)'
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Notas: sanciones, cambios de grado, etc'
    },
    freg: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha de registro'
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Soft delete'
    }
  }, {
    sequelize,
    modelName: 'Juez',
    tableName: 'Jueces',
    timestamps: true,
    indexes: [
      { name: 'idx_juez_estado_grado', fields: ['estado_juez', 'grado'] },
      { name: 'idx_juez_categoria', fields: ['juez_categoria'] },
      { name: 'idx_juez_estado_juez', fields: ['estado_juez'] },
      { name: 'idx_juez_estado_soft_delete', fields: ['estado'] }
    ]
  });

  return Juez;
};
