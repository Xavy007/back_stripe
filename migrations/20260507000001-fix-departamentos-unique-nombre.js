'use strict';

// Elimina el unique constraint en Departamentos.nombre
// ya que múltiples países pueden tener regiones con el mismo nombre (ej: "Santa Cruz").
module.exports = {
  async up(queryInterface) {
    await queryInterface.removeConstraint('Departamentos', 'Departamentos_nombre_key');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Departamentos', {
      fields: ['nombre'],
      type: 'unique',
      name: 'Departamentos_nombre_key'
    });
  }
};
