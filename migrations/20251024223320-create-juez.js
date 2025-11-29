'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Jueces', {
      id_juez: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: 'ID único del juez'
      },

      id_persona: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Personas',
          key: 'id_persona'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Persona que es juez (FK → Personas)'
      },

      certificacion: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Si tiene certificación oficial'
      },

      juez_categoria: {
        type: Sequelize.ENUM('juez', 'juez_linea'),
        allowNull: false,
        comment: 'Tipo: juez (árbitro central) o juez_linea (árbitro de línea)'
      },

      grado: {
        type: Sequelize.ENUM(
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
        type: Sequelize.ENUM('activo', 'suspendido', 'inactivo'),
        allowNull: false,
        defaultValue: 'activo',
        comment: 'activo (puede arbitrar), suspendido (sanción), inactivo (retirado)'
      },

      fecha_inicio: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Cuándo comenzó como juez'
      },

      fecha_fin: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Cuándo finalizó (si aplica)'
      },

      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Notas: sanciones, cambios de grado, etc'
      },

      freg: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Fecha de registro'
      },

      estado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Soft delete: true = activo, false = eliminado lógicamente'
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // ===== ÍNDICES (CORREGIDOS) =====
    await queryInterface.addIndex('Jueces',
      ['estado_juez', 'grado'],
      {
        name: 'idx_juez_estado_grado',
        comment: 'Listar jueces disponibles por estado y grado'
      }
    );

    await queryInterface.addIndex('Jueces',
      ['juez_categoria'],
      {
        name: 'idx_juez_categoria',
        comment: 'Jueces centrales vs jueces de línea'
      }
    );

    await queryInterface.addIndex('Jueces',
      ['estado_juez'],
      {
        name: 'idx_juez_estado_juez',
        comment: 'Jueces por estado laboral'
      }
    );

    await queryInterface.addIndex('Jueces',
      ['estado'],
      {
        name: 'idx_juez_estado_soft_delete',
        comment: 'Soft delete: jueces no eliminados'
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Jueces');
  }
};