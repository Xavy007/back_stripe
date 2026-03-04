'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Partidos', 'id_cancha', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'FK → Canchas (se asigna después de generar el fixture)'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Partidos', 'id_cancha', {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: 'FK → Canchas'
    });
  }
};
