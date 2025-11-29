'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Equipos', {
      id_equipo: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING
      },
      id_club: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique:true,
        references: {
          model: 'Clubes',
          key: 'id_club'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      id_categoria: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Categorias',
          key:'id_categoria'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.dropTable('Equipos');
  }
};