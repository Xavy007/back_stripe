'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Personas', {
      id_persona: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ci: {

        type: Sequelize.STRING
      },
      nombre: {
        type: Sequelize.STRING
      },
      ap: {
        type: Sequelize.STRING
      },
      am: {
        type: Sequelize.STRING
      },
      fnac: {
        type: Sequelize.DATE
      },
      estado: {
        type: Sequelize.BOOLEAN
      },
      genero: {
        type: Sequelize.ENUM('masculino','femenino','otro'),
        allowNull:false
      },
      freg: {
        type: Sequelize.DATE
      },
      id_nacionalidad: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Personas');
  }
};