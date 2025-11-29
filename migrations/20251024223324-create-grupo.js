'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Grupos', {
      id_grupo: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: 'ID único del grupo'
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

      clave: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [1, 5],
            msg: 'La clave debe tener entre 1 y 5 caracteres'
          }
        },
        comment: 'Clave del grupo (ej: A, B, C, G1, G2)'
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
        comment: 'Nombre del grupo (ej: Grupo A, Grupo 1)'
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
        comment: 'Descripción adicional del grupo'
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
        comment: 'Orden de visualización del grupo (1, 2, 3, etc)'
      },

      cantidad_equipos_max: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: [2],
            msg: 'Mínimo 2 equipos'
          }
        },
        comment: 'Cantidad máxima de equipos permitidos en el grupo'
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
    await queryInterface.addConstraint('Grupos', {
      fields: ['id_cc', 'clave'],
      type: 'unique',
      name: 'uniq_cc_clave_grupo',
      comment: 'Solo una clave por categoría-campeonato'
    });

    // ===== ÍNDICES =====
    await queryInterface.addIndex('Grupos', ['id_cc'], {
      name: 'idx_grupo_cc',
      comment: 'Grupos de una categoría-campeonato'
    });

    await queryInterface.addIndex('Grupos', ['clave'], {
      name: 'idx_grupo_clave',
      comment: 'Búsqueda rápida por clave'
    });

    await queryInterface.addIndex('Grupos', ['estado'], {
      name: 'idx_grupo_estado',
      comment: 'Soft delete'
    });

    await queryInterface.addIndex('Grupos', ['id_cc', 'estado'], {
      name: 'idx_grupo_cc_estado',
      comment: 'Grupos activos de una categoría-campeonato'
    });

    await queryInterface.addIndex('Grupos', ['orden'], {
      name: 'idx_grupo_orden',
      comment: 'Búsqueda y ordenamiento por orden'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remover índices
    await queryInterface.removeIndex('Grupos', 'idx_grupo_cc');
    await queryInterface.removeIndex('Grupos', 'idx_grupo_clave');
    await queryInterface.removeIndex('Grupos', 'idx_grupo_estado');
    await queryInterface.removeIndex('Grupos', 'idx_grupo_cc_estado');
    await queryInterface.removeIndex('Grupos', 'idx_grupo_orden');

    // Remover constraint
    await queryInterface.removeConstraint('Grupos', 'uniq_cc_clave_grupo');

    // Remover tabla
    await queryInterface.dropTable('Grupos');
  }
};