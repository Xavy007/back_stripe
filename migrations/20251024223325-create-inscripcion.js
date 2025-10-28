'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Inscripciones', {
      id_inscripcion: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_cc: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique:true,
        references: {
          model: 'CampeonatoCategorias',
          key: 'id_cc'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      id_equipo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique:true,
        references: {
          model: 'Equipos',
          key: 'id_equipo'
          },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      grupo: {
        type: Sequelize.STRING
      },
      serie: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Inscripcions');
  }
};