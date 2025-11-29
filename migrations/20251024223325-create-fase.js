'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Fases', {
      id_fase: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: 'ID único de la fase'
      },

      id_cc: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'CampeonatoCategorias',
          key: 'id_cc'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'FK → CampeonatoCategorias'
      },

      tipo: {
        type: Sequelize.ENUM('grupos', 'liga', 'eliminatoria', 'final_four'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['grupos', 'liga', 'eliminatoria', 'final_four']],
            msg: 'El tipo debe ser: grupos, liga, eliminatoria o final_four'
          }
        },
        comment: 'Tipo de fase'
      },

      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 100],
            msg: 'El nombre debe tener entre 3 y 100 caracteres'
          }
        },
        comment: 'Nombre de la fase (ej: Grupos, Cuartos de Final)'
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
        comment: 'Descripción adicional de la fase'
      },

      orden: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: {
            args: [1],
            msg: 'El orden debe ser al menos 1'
          }
        },
        comment: 'Orden de ejecución de la fase (1, 2, 3...)'
      },

      ida_vuelta: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Si se juega ida y vuelta'
      },

      fecha_inicio: {
        type: Sequelize.DATE,
        allowNull: true,
        validate: {
          isDate: {
            msg: 'La fecha de inicio debe ser válida'
          }
        },
        comment: 'Cuándo inicia la fase'
      },

      fecha_fin: {
        type: Sequelize.DATE,
        allowNull: true,
        validate: {
          isDate: {
            msg: 'La fecha de fin debe ser válida'
          }
        },
        comment: 'Cuándo termina la fase'
      },

      f_estado: {
        type: Sequelize.ENUM('planificada', 'en_curso', 'finalizada'),
        allowNull: false,
        defaultValue: 'planificada',
        validate: {
          isIn: {
            args: [['planificada', 'en_curso', 'finalizada']],
            msg: 'El estado debe ser: planificada, en_curso o finalizada'
          }
        },
        comment: 'Estado de la fase'
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

    // ===== ÍNDICES =====
    await queryInterface.addIndex('Fases', ['id_cc'], {
      name: 'idx_fase_cc',
      comment: 'Fases de una categoría-campeonato'
    });

    await queryInterface.addIndex('Fases', ['tipo'], {
      name: 'idx_fase_tipo',
      comment: 'Búsqueda por tipo de fase'
    });

    await queryInterface.addIndex('Fases', ['f_estado'], {
      name: 'idx_fase_f_estado',
      comment: 'Fases por estado'
    });

    await queryInterface.addIndex('Fases', ['estado'], {
      name: 'idx_fase_estado',
      comment: 'Soft delete'
    });

    await queryInterface.addIndex('Fases', ['orden'], {
      name: 'idx_fase_orden',
      comment: 'Búsqueda y ordenamiento por orden'
    });

    await queryInterface.addIndex('Fases', ['id_cc', 'orden'], {
      name: 'idx_fase_cc_orden',
      comment: 'Fases de una categoría ordenadas'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remover índices
    await queryInterface.removeIndex('Fases', 'idx_fase_cc');
    await queryInterface.removeIndex('Fases', 'idx_fase_tipo');
    await queryInterface.removeIndex('Fases', 'idx_fase_f_estado');
    await queryInterface.removeIndex('Fases', 'idx_fase_estado');
    await queryInterface.removeIndex('Fases', 'idx_fase_orden');
    await queryInterface.removeIndex('Fases', 'idx_fase_cc_orden');

    // Remover tabla
    await queryInterface.dropTable('Fases');
  }
};