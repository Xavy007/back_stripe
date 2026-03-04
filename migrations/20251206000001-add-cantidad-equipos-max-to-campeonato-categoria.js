'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('CampeonatoCategorias', 'cantidad_equipos_max', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Cantidad máxima de equipos permitidos',
      after: 'numero_grupos'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('CampeonatoCategorias', 'cantidad_equipos_max');
  }
};
