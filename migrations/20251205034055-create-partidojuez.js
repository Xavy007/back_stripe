'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PartidoJueces', {
      id_partido_juez: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: 'ID único de la asignación'
      },

      id_partido: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Partidos',
          key: 'id_partido'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'FK → Partidos'
      },

      // ===== JUECES (personas físicas que arbitran) =====
      id_arbitro1: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Jueces',
          key: 'id_juez'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'FK → Jueces (Árbitro Principal)'
      },

      id_arbitro2: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Jueces',
          key: 'id_juez'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'FK → Jueces (Árbitro Segundo)'
      },

      id_anotador: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Jueces',
          key: 'id_juez'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'FK → Jueces (Anotador físico)'
      },

      id_cronometrista: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Jueces',
          key: 'id_juez'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'FK → Jueces (Cronometrista)'
      },

      // ===== PLANILLERO (usuario del sistema con rol juez) =====
      id_planillero: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Usuarios',
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'FK → Usuarios (quien registra acciones en la app)'
      },

      confirmado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Si los jueces confirmaron asistencia'
      },

      fecha_asignacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Cuándo se hizo la asignación'
      },

      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Notas sobre la asignación'
      },

      estado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Soft delete'
      },

      freg: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Fecha de registro'
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

    // ===== CONSTRAINT: Un partido solo tiene una asignación =====
    await queryInterface.addConstraint('PartidoJueces', {
      fields: ['id_partido'],
      type: 'unique',
      name: 'uniq_partido_asignacion'
    });

    // ===== ÍNDICES =====
    await queryInterface.addIndex('PartidoJueces', ['id_partido'], { name: 'idx_pj_partido' });
    await queryInterface.addIndex('PartidoJueces', ['id_arbitro1'], { name: 'idx_pj_arbitro1' });
    await queryInterface.addIndex('PartidoJueces', ['id_arbitro2'], { name: 'idx_pj_arbitro2' });
    await queryInterface.addIndex('PartidoJueces', ['id_anotador'], { name: 'idx_pj_anotador' });
    await queryInterface.addIndex('PartidoJueces', ['id_cronometrista'], { name: 'idx_pj_cronometrista' });
    await queryInterface.addIndex('PartidoJueces', ['id_planillero'], { name: 'idx_pj_planillero' });
    await queryInterface.addIndex('PartidoJueces', ['estado'], { name: 'idx_pj_estado' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('PartidoJueces', 'uniq_partido_asignacion');
    await queryInterface.dropTable('PartidoJueces');
  }
};
