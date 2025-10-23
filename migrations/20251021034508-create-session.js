'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sessions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      token: {
        type: Sequelize.STRING(128),
        allowNull: false,
        unique: true
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      ip: {
        type: Sequelize.STRING(45),
        allowNull: true
      },
      user_agent: {
        type: Sequelize.STRING(1024),
        allowNull: true
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });

    await queryInterface.addIndex('sessions', ['id_usuario']);
    await queryInterface.addIndex('sessions', ['token'], { unique: true });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sessions');
  }
};