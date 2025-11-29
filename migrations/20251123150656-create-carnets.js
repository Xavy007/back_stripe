'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear tabla Carnets
    await queryInterface.createTable('Carnets', {
      id_carnet: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: 'ID único del carnet'
      },
      id_jugador: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Jugadores',
          key: 'id_jugador'
        },
        onDelete: 'CASCADE',
        comment: 'Referencia al jugador'
      },
      id_gestion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'GestionCampeonatos',
          key: 'id_gestion'
        },
        onDelete: 'RESTRICT',
        comment: 'Referencia a la gestión del campeonato'
      },
      numero_carnet: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Número único del carnet (ej: 2024-1234-A1B2)'
      },
      fecha_solicitud: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Fecha en que se solicitó el carnet'
      },
      fecha_vencimiento: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'Fecha en que vence el carnet'
      },
      duracion_dias: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 365,
        comment: 'Duración del carnet en días'
      },
      estado_carnet: {
        type: Sequelize.ENUM('pendiente', 'activo', 'vencido', 'cancelado'),
        allowNull: false,
        defaultValue: 'pendiente',
        comment: 'Estado del carnet'
      },
      solicitado_por: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'ID del usuario que solicita el carnet'
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Observaciones o notas sobre el carnet'
      },
      estado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Estado general del registro (activo/inactivo)'
      },
      freg: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
        comment: 'Fecha de registro'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Crear índices para optimizar búsquedas
    await queryInterface.addIndex('Carnets', ['id_jugador']);
    await queryInterface.addIndex('Carnets', ['id_gestion']);
    await queryInterface.addIndex('Carnets', ['estado_carnet']);
    await queryInterface.addIndex('Carnets', ['fecha_vencimiento']);
    await queryInterface.addIndex('Carnets', ['numero_carnet']);
    await queryInterface.addIndex('Carnets', ['id_jugador', 'id_gestion']); // Índice compuesto
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar tabla en caso de rollback
    await queryInterface.dropTable('Carnets');
  }
};