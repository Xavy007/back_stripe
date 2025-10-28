'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TablaPosiciones', {

      id_tabla: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_campeonato: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique:true,
        references: {
          model: 'Campeonatos',
          key: 'id_campeonato'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      id_equipo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique:true,
        references: {
          model: 'Equipos',
          key: 'id_equipo'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      puntos: {
        type: Sequelize.INTEGER
      },
      partidos_jugados: {
        type: Sequelize.INTEGER
      },
      ganados: {
        type: Sequelize.INTEGER
      },
      perdidos: {
        type: Sequelize.INTEGER
      },
      wo: {
        type: Sequelize.INTEGER
      },
      sets_ganados: {
        type: Sequelize.INTEGER
      },
      sets_perdidos: {
        type: Sequelize.INTEGER
      },
      diferencia_sets: {
        type: Sequelize.INTEGER
      },
      puntos_favor: {
        type: Sequelize.INTEGER
      },
      puntos_contra: {
        type: Sequelize.INTEGER
      },
      diferencia_puntos: {
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
    await queryInterface.dropTable('TablaPosicions');
  }
};