'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('CampeonatoCategorias', 'dias_juego', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true,
      defaultValue: null,
      comment: 'Días de la semana en que se juega (0=Dom, 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sáb). Ej: [1,3,5] = Lun/Mié/Vie'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('CampeonatoCategorias', 'dias_juego');
  }
};
