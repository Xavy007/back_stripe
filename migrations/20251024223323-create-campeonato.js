'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Campeonatos', {
      id_campeonato: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: 'ID único del campeonato'
      },

      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Nombre del campeonato'
      },

      tipo: {
        type: Sequelize.ENUM('campeonato', 'liga', 'copa', 'relampago', 'amistoso', 'torneo'),
        allowNull: false,
        comment: 'Tipo de competición'
      },

      id_gestion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'GestionCampeonatos',
          key: 'id_gestion'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'FK → GestionCampeonatos'
      },

      fecha_inicio: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'Fecha de inicio del campeonato'
      },

      fecha_fin: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Fecha de finalización del campeonato'
      },

      c_estado: {
        type: Sequelize.ENUM('programado', 'en_curso', 'finalizado', 'suspendido', 'cancelado'),
        allowNull: false,
        defaultValue: 'programado',
        comment: 'Estado: programado, en_curso, finalizado, suspendido, cancelado'
      },

      estado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Soft delete: true = activo, false = eliminado'
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

    // ===== ÍNDICES =====
    await queryInterface.addIndex('Campeonatos',
      ['id_gestion'],
      {
        name: 'idx_campeonato_gestion',
        comment: 'Buscar campeonatos de una gestión'
      }
    );

    await queryInterface.addIndex('Campeonatos',
      ['tipo'],
      {
        name: 'idx_campeonato_tipo',
        comment: 'Buscar por tipo de campeonato'
      }
    );

    await queryInterface.addIndex('Campeonatos',
      ['c_estado'],
      {
        name: 'idx_campeonato_estado',
        comment: 'Buscar por estado del campeonato'
      }
    );

    await queryInterface.addIndex('Campeonatos',
      ['estado'],
      {
        name: 'idx_campeonato_soft_delete',
        comment: 'Soft delete: campeonatos no eliminados'
      }
    );

    await queryInterface.addIndex('Campeonatos',
      ['id_gestion', 'c_estado'],
      {
        name: 'idx_campeonato_gestion_estado',
        comment: 'Buscar campeonatos de una gestión por estado'
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Campeonatos');
  }
};