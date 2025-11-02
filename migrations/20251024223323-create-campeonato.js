'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Campeonatos', {
      id_campeonato: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING
      },
      tipo: {
        type: Sequelize.ENUM('campeonato','liga', 'copa', 'relampago', 'amistoso', 'torneo'),
        allowNull: false
      },
      id_gestion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'GestionCampeonatos',
          key: 'id_gestion'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      fecha_inicio: {
        type: Sequelize.DATE
      },
      fecha_fin: {
        type: Sequelize.DATE
      },
      c_estado: {
        type: Sequelize.ENUM('programado', 'en_curso', 'finalizado', 'suspendido', 'cancelado'),
        allowNull: false,
        defaultValue: 'programado'
      },
      estado: {
        type: Sequelize.BOOLEAN
      },
      freg: {
        type: Sequelize.DATE
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Campeonatos');
  }
};