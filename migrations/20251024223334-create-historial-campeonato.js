'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HistorialCampeonatos', {
      id_historial: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: 'ID único del historial'
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

      id_equipo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Equipos',
          key: 'id_equipo'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'FK → Equipos'
      },

      posicion_final: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: 'La posición debe ser al menos 1'
          }
        },
        comment: 'Posición final del equipo en el campeonato'
      },

      puntos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: 'Los puntos no pueden ser negativos'
          }
        },
        comment: 'Puntos finales acumulados'
      },

      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
        validate: {
          len: {
            args: [0, 1000],
            msg: 'La descripción no puede exceder 1000 caracteres'
          }
        },
        comment: 'Notas adicionales sobre el desempeño'
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
    await queryInterface.addConstraint('HistorialCampeonatos', {
      fields: ['id_campeonato', 'id_categoria', 'id_equipo'],
      type: 'unique',
      name: 'uniq_historial_campeonato_categoria_equipo',
      comment: 'Un equipo solo una entrada por campeonato-categoría'
    });

    // ===== ÍNDICES =====
    await queryInterface.addIndex('HistorialCampeonatos', ['id_campeonato'], {
      name: 'idx_historial_campeonato',
      comment: 'Historial de un campeonato'
    });

    await queryInterface.addIndex('HistorialCampeonatos', ['id_categoria'], {
      name: 'idx_historial_categoria',
      comment: 'Historial de una categoría'
    });

    await queryInterface.addIndex('HistorialCampeonatos', ['id_equipo'], {
      name: 'idx_historial_equipo',
      comment: 'Historial de un equipo'
    });

    await queryInterface.addIndex('HistorialCampeonatos', ['posicion_final'], {
      name: 'idx_historial_posicion',
      comment: 'Búsqueda por posición final'
    });

    await queryInterface.addIndex('HistorialCampeonatos', ['estado'], {
      name: 'idx_historial_estado',
      comment: 'Soft delete'
    });

    await queryInterface.addIndex('HistorialCampeonatos', ['id_campeonato', 'posicion_final'], {
      name: 'idx_historial_campeonato_posicion',
      comment: 'Historial ordenado de un campeonato'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remover índices
    await queryInterface.removeIndex('HistorialCampeonatos', 'idx_historial_campeonato');
    await queryInterface.removeIndex('HistorialCampeonatos', 'idx_historial_categoria');
    await queryInterface.removeIndex('HistorialCampeonatos', 'idx_historial_equipo');
    await queryInterface.removeIndex('HistorialCampeonatos', 'idx_historial_posicion');
    await queryInterface.removeIndex('HistorialCampeonatos', 'idx_historial_estado');
    await queryInterface.removeIndex('HistorialCampeonatos', 'idx_historial_campeonato_posicion');

    // Remover constraint
    await queryInterface.removeConstraint('HistorialCampeonatos', 'uniq_historial_campeonato_categoria_equipo');

    // Remover tabla
    await queryInterface.dropTable('HistorialCampeonatos');
  }
};