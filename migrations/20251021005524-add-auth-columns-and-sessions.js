'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Agregar columnas a usuarios (IF NOT EXISTS evita error si ya existen)
    await queryInterface.sequelize.query(`
      ALTER TABLE "Usuarios"
        ADD COLUMN IF NOT EXISTS "failed_attempts" INTEGER NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "locked_until" TIMESTAMP WITH TIME ZONE;
    `);

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