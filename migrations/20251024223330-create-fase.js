'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Fases', {

      id_fase: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_cc: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique:true,
        references: {
          model: 'CampeonatoCategorias',
          key: 'id_cc'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      tipo: {
        type: Sequelize.ENUM('grupos', 'liga', 'eliminatoria', 'final_four'),
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING
      },
      orden: {
        type: Sequelize.INTEGER
      },
      ida_vuelta: {
        type: Sequelize.BOOLEAN
      },
      f_estado: {
          type: Sequelize.ENUM('planificada', 'en_curso', 'finalizada'),
          allowNull: false,
          defaultValue: 'planificada'
      },
      estado: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Fases');
  }
};