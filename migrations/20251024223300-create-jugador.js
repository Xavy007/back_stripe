'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Jugadores', {
      id_jugador: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_persona: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique:true,
        references: {
          model: 'Personas',
          key: 'id_persona'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      estatura: {
        type: Sequelize.DOUBLE
      },
      foto_jugador:{
      type: Sequelize.STRING,
      allowNull: true,
      },
      dorsal:{
      type: Sequelize.INTEGER,
      allowNull: true,
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
      },      id_club: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Clubes',
          key: 'id_club'
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
    await queryInterface.dropTable('Jugadores');
  }
};