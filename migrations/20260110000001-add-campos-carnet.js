'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Carnets', 'numero_dorsal', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Número de dorsal del jugador para este carnet'
    });

    await queryInterface.addColumn('Carnets', 'posicion', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Posición del jugador en el campo'
    });

    await queryInterface.addColumn('Carnets', 'foto_carnet', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Ruta de la foto del carnet'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Carnets', 'numero_dorsal');
    await queryInterface.removeColumn('Carnets', 'posicion');
    await queryInterface.removeColumn('Carnets', 'foto_carnet');
  }
};
