'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Eliminar el índice único antiguo
    await queryInterface.removeIndex('Participaciones', 'unique_jugador_equipo_categoria');

    // 2. Crear el nuevo índice único que incluye id_campeonato
    await queryInterface.addIndex('Participaciones',
      ['id_jugador', 'id_equipo', 'id_categoria', 'id_campeonato'],
      {
        unique: true,
        name: 'unique_jugador_equipo_categoria_campeonato',
        comment: 'Un jugador solo puede estar UNA VEZ por equipo+categoría+campeonato'
      }
    );
  },

  async down(queryInterface, Sequelize) {
    // Revertir: eliminar el nuevo índice y restaurar el antiguo
    await queryInterface.removeIndex('Participaciones', 'unique_jugador_equipo_categoria_campeonato');

    await queryInterface.addIndex('Participaciones',
      ['id_jugador', 'id_equipo', 'id_categoria'],
      {
        unique: true,
        name: 'unique_jugador_equipo_categoria',
        comment: 'Evita: 1 jugador 1 vez por equipo+categoría'
      }
    );
  }
};
