'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('asociacion_cargo', {
      id_cargo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Usuarios', key: 'id_usuario' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      id_gestion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'GestionCampeonatos', key: 'id_gestion' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      cargo: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      fecha_inicio: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      fecha_fin: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      estado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Un usuario solo puede ocupar un cargo por gestión
    await queryInterface.addIndex('asociacion_cargo', ['id_usuario', 'id_gestion'], {
      unique: true,
      name: 'unique_usuario_gestion_cargo'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('asociacion_cargo');
  }
};
