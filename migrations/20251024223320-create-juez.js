'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Jueces', {
      id_juez: {
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
      certificacion: {
        type: Sequelize.BOOLEAN
      },
      juez_categoria: {
        type: Sequelize.ENUM('juez', 'juez de linea'),
        allowNull: false,
      },
      grado: {
         type: Sequelize.ENUM('municipal', 'departamental', 'federativo nacional', 'federativo internacional'),
         allowNull: false,
         defaultValue:'municipal'
      },
      freg: {
        type: Sequelize.DATE
      },
      estado: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Juezs');
  }
};