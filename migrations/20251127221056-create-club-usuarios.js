'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ClubUsuarios', {
      
      id_club_usuario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      id_club: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Clubes',   // Nombre real de la tabla Clubs
          key: 'id_club'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios',  // Nombre real de la tabla Usuarios
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      rol_en_club: {
        type: Sequelize.ENUM(
          'presidenteclub',
          'representante',
        ),
        allowNull: false,
        defaultValue: 'representante'
      },

      // 🔥 Soft-delete lógico
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },

      // 🔥 Fecha de registro (freg)
      freg: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      fecha_inicio: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      fecha_fin: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }

    });

    // 🔧 INDEXES (Recomendado para optimizar)
    await queryInterface.addIndex('ClubUsuarios', ['id_club']);
    await queryInterface.addIndex('ClubUsuarios', ['id_usuario']);
    await queryInterface.addIndex('ClubUsuarios', ['rol_en_club']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ClubUsuarios');
  }
};
