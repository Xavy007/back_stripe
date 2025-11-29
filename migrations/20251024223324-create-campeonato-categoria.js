'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CampeonatoCategorias', {
      id_cc: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: 'ID único de la relación campeonato-categoría'
      },

      id_campeonato: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Campeonatos',
          key: 'id_campeonato'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'FK → Campeonatos'
      },

      id_categoria: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Categorias',
          key: 'id_categoria'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'FK → Categorias'
      },

      formato: {
        type: Sequelize.ENUM('todos_vs_todos', 'eliminacion_directa', 'grupos_y_eliminacion', 'liga'),
        allowNull: false,
        defaultValue: 'todos_vs_todos',
        comment: 'Formato de competición'
      },

      numero_grupos: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Número de grupos (solo si formato es "grupos_y_eliminacion")'
      },

      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Notas específicas para esta categoría en este campeonato'
      },

      estado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Soft delete: true = activo, false = eliminado'
      },

      freg: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Fecha de registro'
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

    // ===== CONSTRAINT ÚNICO =====
    await queryInterface.addConstraint('CampeonatoCategorias', {
      fields: ['id_campeonato', 'id_categoria'],
      type: 'unique',
      name: 'uniq_campeonato_categoria',
      comment: 'Solo 1 registro por campeonato-categoría'
    });

    // ===== ÍNDICES =====
    await queryInterface.addIndex('CampeonatoCategorias', ['id_campeonato'], {
      name: 'idx_cc_campeonato',
      comment: 'Buscar todas las categorías de un campeonato'
    });

    await queryInterface.addIndex('CampeonatoCategorias', ['id_categoria'], {
      name: 'idx_cc_categoria',
      comment: 'Buscar todos los campeonatos de una categoría'
    });

    await queryInterface.addIndex('CampeonatoCategorias', ['formato'], {
      name: 'idx_cc_formato',
      comment: 'Buscar por formato'
    });

    await queryInterface.addIndex('CampeonatoCategorias', ['estado'], {
      name: 'idx_cc_estado',
      comment: 'Soft delete: categorías no eliminadas'
    });

    await queryInterface.addIndex('CampeonatoCategorias', ['id_campeonato', 'estado'], {
      name: 'idx_cc_campeonato_estado',
      comment: 'Categorías activas de un campeonato'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remover índices
    await queryInterface.removeIndex('CampeonatoCategorias', 'idx_cc_campeonato');
    await queryInterface.removeIndex('CampeonatoCategorias', 'idx_cc_categoria');
    await queryInterface.removeIndex('CampeonatoCategorias', 'idx_cc_formato');
    await queryInterface.removeIndex('CampeonatoCategorias', 'idx_cc_estado');
    await queryInterface.removeIndex('CampeonatoCategorias', 'idx_cc_campeonato_estado');
    
    // Remover constraint
    await queryInterface.removeConstraint('CampeonatoCategorias', 'uniq_campeonato_categoria');
    
    // Remover tabla
    await queryInterface.dropTable('CampeonatoCategorias');
  }
};