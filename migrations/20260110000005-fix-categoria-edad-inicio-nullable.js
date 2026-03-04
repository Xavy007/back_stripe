'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Cambiar edad_inicio para que NO permita NULL (alinear con el modelo)
    // Primero actualizar cualquier NULL existente a un valor por defecto
    await queryInterface.sequelize.query(
      'UPDATE "Categorias" SET edad_inicio = 0 WHERE edad_inicio IS NULL'
    );

    await queryInterface.changeColumn('Categorias', 'edad_inicio', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir a permitir NULL
    await queryInterface.changeColumn('Categorias', 'edad_inicio', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};
