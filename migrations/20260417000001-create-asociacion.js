'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('asociacion', {
      id_asociacion: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING(200),
        allowNull: false,
        defaultValue: 'Asociación de Voleibol'
      },
      acronimo: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      logo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ciudad: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      departamento: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      direccion: {
        type: Sequelize.STRING,
        allowNull: true
      },
      telefono: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      sitio_web: {
        type: Sequelize.STRING,
        allowNull: true
      },
      federacion: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('asociacion');
  }
};
