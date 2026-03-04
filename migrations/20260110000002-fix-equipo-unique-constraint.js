'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Eliminar la restricción única de id_club
    await queryInterface.removeConstraint('Equipos', 'Equipos_id_club_key');

    // 2. Crear índice único compuesto para id_club + id_categoria
    // Esto permite múltiples equipos por club, pero solo uno por categoría
    await queryInterface.addConstraint('Equipos', {
      fields: ['id_club', 'id_categoria'],
      type: 'unique',
      name: 'unique_club_categoria'
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir: eliminar el índice compuesto
    await queryInterface.removeConstraint('Equipos', 'unique_club_categoria');

    // Restaurar la restricción única original en id_club
    await queryInterface.addConstraint('Equipos', {
      fields: ['id_club'],
      type: 'unique',
      name: 'Equipos_id_club_key'
    });
  }
};
