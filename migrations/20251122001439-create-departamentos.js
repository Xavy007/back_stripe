// migration: create-departamentos.js
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Departamentos', {
      id_departamento: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      id_nacionalidad: {   // opcional, si quieres ligarlo a Bolivia
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Nacionalidades',
          key: 'id_nacionalidad'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Departamentos');
  }
};
