'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Carnets', 'id_categoria', {
      type: Sequelize.INTEGER,
      allowNull: true,              // o false si debe ser obligatorio
      references: {
        model: 'Categorias',        // nombre de la tabla de categorías
        key: 'id_categoria',        // columna referenciada
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',         // o 'SET NULL' / 'CASCADE' según tu regla
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Carnets', 'id_categoria');
  },
};