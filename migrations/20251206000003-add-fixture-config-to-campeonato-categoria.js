'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('CampeonatoCategorias', 'ida_vuelta', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Si incluye partidos de ida y vuelta'
    });

    await queryInterface.addColumn('CampeonatoCategorias', 'dias_entre_jornadas', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 7,
      comment: 'Días de separación entre jornadas'
    });

    await queryInterface.addColumn('CampeonatoCategorias', 'hora_inicio_partidos', {
      type: Sequelize.TIME,
      allowNull: true,
      defaultValue: '18:00:00',
      comment: 'Hora predeterminada de inicio de partidos'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('CampeonatoCategorias', 'ida_vuelta');
    await queryInterface.removeColumn('CampeonatoCategorias', 'dias_entre_jornadas');
    await queryInterface.removeColumn('CampeonatoCategorias', 'hora_inicio_partidos');
  }
};
