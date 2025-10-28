'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GrupoInscripciones', {

      id_grupo_inscripcion: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_grupo: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Grupos',
          key:'id_grupo'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      id_inscripcion: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Inscripciones',
          key:'id_inscripcion'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      bombo: {
        type: Sequelize.INTEGER
      },
      slot_grupo: {
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
    await queryInterface.dropTable('GrupoInscripcions');
  }
};