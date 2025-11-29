// migration: add-id_provincia_origen-to-personas.js
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Personas', 'id_provincia_origen', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Provincias',
        key: 'id_provincia'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Personas', 'id_provincia_origen');
  }
};
