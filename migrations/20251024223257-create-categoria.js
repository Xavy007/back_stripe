'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Categorias', {
      id_categoria: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      descripcion: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      edad_inicio: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: { min: 0 }
      },
      edad_limite: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: { min: 0 }
      },
      genero: {
        type: Sequelize.ENUM('masculino', 'femenino', 'mixto'),
        allowNull: false,
        defaultValue: 'mixto'
      },
      color: {
        type: Sequelize.STRING(7),
        allowNull: false,
        defaultValue: '#3B82F6',
        comment: 'Color HEX para el carnet (ej: #FF6B6B)'
      },
      estado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      freg: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Crear índices para mejor rendimiento
    await queryInterface.addIndex('Categorias', ['nombre']);
    await queryInterface.addIndex('Categorias', ['estado']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Categorias');
  }
};