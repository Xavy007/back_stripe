'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('JuezPartidos', {
       id_juez_partido: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_juez: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Jueces',
          key:'id_juez'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      id_partido: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Partidos',
          key:'id_partido'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      rol: {
        type: Sequelize.ENUM('primer arbitro', 'segundo arbitro', 'juez de linea'),
        allowNull: false
      },
      freg: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('JuezPartidos');
 
  }
};