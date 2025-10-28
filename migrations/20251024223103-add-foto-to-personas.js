'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Personas', 'foto', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'URL o ruta de la foto del registro Persona'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Personas', 'foto');
  }
};

