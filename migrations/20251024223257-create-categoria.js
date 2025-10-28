'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Categorias', {
      id_categoria: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING
      },
      descripcion: {
        type: Sequelize.STRING
      },
      edad_inicio: {
        type: Sequelize.INTEGER
      },
      edad_limite: {
        type: Sequelize.INTEGER
      },
      genero: {
        type: Sequelize.ENUM('masculino','femenino','mixto'),
        allowNull:false     
       },
      estado: {
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:true
      },
      freg: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.NOW
        
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Categoria');
  }
};