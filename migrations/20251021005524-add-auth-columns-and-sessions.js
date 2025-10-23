'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Agregar columnas a usuarios
    await queryInterface.addColumn('Usuarios', 'failed_attempts', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('Usuarios', 'locked_until', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // Crear tabla sessions
    await queryInterface.createTable('sessions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Usuarios', key: 'id_usuario' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      ip: { type: Sequelize.STRING },
      user_agent: { type: Sequelize.STRING },
      expires_at: { type: Sequelize.DATE },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') }
    });
  },

  async down(queryInterface /* , Sequelize */) {
    await queryInterface.dropTable('sessions');
    await queryInterface.removeColumn('Usuarios', 'locked_until');
    await queryInterface.removeColumn('Usuarios', 'failed_attempts');
  }
};