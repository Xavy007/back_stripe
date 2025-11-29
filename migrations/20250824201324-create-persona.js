'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Personas', {
      id_persona: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ci: {
        type: Sequelize.STRING
      },
      nombre: {
        type: Sequelize.STRING
      },
      ap: {
        type: Sequelize.STRING
      },
      am: {
        type: Sequelize.STRING
      },
      fnac: {
        type: Sequelize.DATE
      },
      genero: {
        type: Sequelize.ENUM('masculino','femenino','otro'),
        allowNull:false
      },
      estado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      freg: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      id_nacionalidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Nacionalidades',
            key: 'id_nacionalidad'
          },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Personas');
  }
};