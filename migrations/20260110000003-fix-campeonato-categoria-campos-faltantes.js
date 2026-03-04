'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Agregar campos que están en el modelo pero faltan en la BD

    // Verificar si ida_vuelta ya existe antes de agregarlo
    const tableDescription = await queryInterface.describeTable('CampeonatoCategorias');

    if (!tableDescription.ida_vuelta) {
      await queryInterface.addColumn('CampeonatoCategorias', 'ida_vuelta', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Si el campeonato es ida y vuelta'
      });
    }

    if (!tableDescription.dias_entre_jornadas) {
      await queryInterface.addColumn('CampeonatoCategorias', 'dias_entre_jornadas', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 7,
        comment: 'Días de descanso entre jornadas'
      });
    }

    if (!tableDescription.hora_inicio_partidos) {
      await queryInterface.addColumn('CampeonatoCategorias', 'hora_inicio_partidos', {
        type: Sequelize.TIME,
        allowNull: true,
        comment: 'Hora predeterminada de inicio de partidos'
      });
    }

    // PostgreSQL soporta ARRAY(INTEGER)
    if (!tableDescription.dias_juego) {
      await queryInterface.addColumn('CampeonatoCategorias', 'dias_juego', {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
        defaultValue: [],
        comment: 'Días de la semana para programar partidos (0=Domingo, 6=Sábado)'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('CampeonatoCategorias', 'dias_juego');
    await queryInterface.removeColumn('CampeonatoCategorias', 'hora_inicio_partidos');
    await queryInterface.removeColumn('CampeonatoCategorias', 'dias_entre_jornadas');
    await queryInterface.removeColumn('CampeonatoCategorias', 'ida_vuelta');
  }
};
