'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Partidos', {

      id_partido: {
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
      id_cancha: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique:true,
        references: {
          model: 'Canchas',
          key: 'id_cancha'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      equipo_local: {
        type: Sequelize.INTEGER
      },
      equipo_visitante: {
        type: Sequelize.INTEGER
      },
      p_estado: {
        type: Sequelize.ENUM('programado', 'en_juego', 'finalizado', 'suspendido', 'wo'),
        allowNull: false,
        defaultValue: 'programado'
      },
      resultado_local: {
        type: Sequelize.INTEGER
      },
      resultado_visitante: {
        type: Sequelize.INTEGER
      },
      estado: {
        type: Sequelize.BOOLEAN
      },
      freg: {
        type: Sequelize.DATE
      },
      id_fase: {
        type: Sequelize.INTEGER
      },
      id_jornada: {
        type: Sequelize.INTEGER
      },
      id_grupo: {
        type: Sequelize.INTEGER
      },
      fecha_hora: {
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
    await queryInterface.dropTable('Partidos');
  }
};