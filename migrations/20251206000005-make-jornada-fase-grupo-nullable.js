'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Jornadas', 'id_fase', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Fases', key: 'id_fase' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'FK → Fases (opcional para fixtures simples)'
    });

    await queryInterface.changeColumn('Jornadas', 'id_grupo', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Grupos', key: 'id_grupo' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'FK → Grupos (opcional para fixtures simples)'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Jornadas', 'id_fase', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'Fases', key: 'id_fase' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      comment: 'FK → Fases (en qué fase)'
    });

    await queryInterface.changeColumn('Jornadas', 'id_grupo', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'Grupos', key: 'id_grupo' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      comment: 'FK → Grupos (en qué grupo)'
    });
  }
};
