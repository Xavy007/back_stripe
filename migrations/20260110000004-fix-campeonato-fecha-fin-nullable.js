'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Cambiar fecha_fin para que NO permita NULL (alinear con el modelo)
    await queryInterface.changeColumn('Campeonatos', 'fecha_fin', {
      type: Sequelize.DATE,
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir a permitir NULL
    await queryInterface.changeColumn('Campeonatos', 'fecha_fin', {
      type: Sequelize.DATE,
      allowNull: true
    });
  }
};
