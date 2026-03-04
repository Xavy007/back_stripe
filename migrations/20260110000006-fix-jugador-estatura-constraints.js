'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Actualizar estatura para que NO permita NULL y tenga defaultValue: 0 (alinear con el modelo)
    // Primero actualizar cualquier NULL existente a 0
    await queryInterface.sequelize.query(
      'UPDATE "Jugadores" SET estatura = 0 WHERE estatura IS NULL'
    );

    await queryInterface.changeColumn('Jugadores', 'estatura', {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir a permitir NULL sin defaultValue
    await queryInterface.changeColumn('Jugadores', 'estatura', {
      type: Sequelize.DOUBLE,
      allowNull: true
    });
  }
};
