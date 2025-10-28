'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Grupos', {

      id_grupo: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_cc: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'CampeonatoCategorias',
          key:'id_cc'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      clave: {
        type: Sequelize.STRING
      },
      nombre: {
        type: Sequelize.STRING
      },
      orden: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Grupos');
  }
};