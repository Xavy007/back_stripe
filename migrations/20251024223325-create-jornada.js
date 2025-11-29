'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Jornadas', {
      id_jornada: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: 'ID único de la jornada'
      },

      id_fase: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Fases',
          key: 'id_fase'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'FK → Fases (en qué fase)'
      },

      id_grupo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Grupos',
          key: 'id_grupo'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'FK → Grupos (en qué grupo)'
      },

      numero: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: 'El número de jornada debe ser al menos 1'
          }
        },
        comment: 'Número de la jornada (1, 2, 3...)'
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
        comment: 'Nombre de la jornada (ej: Jornada 1, Fecha 1)'
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
        comment: 'Descripción adicional de la jornada'
      },

      fecha: {
        type: Sequelize.DATE,
        allowNull: true,
        validate: {
          isDate: {
            msg: 'La fecha debe ser válida'
          }
        },
        comment: 'Fecha de la jornada'
      },

      j_estado: {
        type: Sequelize.ENUM('planificada', 'en_curso', 'finalizada'),
        allowNull: false,
        defaultValue: 'planificada',
        validate: {
          isIn: {
            args: [['planificada', 'en_curso', 'finalizada']],
            msg: 'El estado debe ser: planificada, en_curso o finalizada'
          }
        },
        comment: 'Estado de la jornada'
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
    await queryInterface.addConstraint('Jornadas', {
      fields: ['id_fase', 'id_grupo', 'numero'],
      type: 'unique',
      name: 'uniq_fase_grupo_numero',
      comment: 'Solo una jornada con ese número por fase-grupo'
    });

    // ===== ÍNDICES =====
    await queryInterface.addIndex('Jornadas', ['id_fase'], {
      name: 'idx_jornada_fase',
      comment: 'Jornadas de una fase'
    });

    await queryInterface.addIndex('Jornadas', ['id_grupo'], {
      name: 'idx_jornada_grupo',
      comment: 'Jornadas de un grupo'
    });

    await queryInterface.addIndex('Jornadas', ['numero'], {
      name: 'idx_jornada_numero',
      comment: 'Búsqueda por número de jornada'
    });

    await queryInterface.addIndex('Jornadas', ['j_estado'], {
      name: 'idx_jornada_j_estado',
      comment: 'Jornadas por estado'
    });

    await queryInterface.addIndex('Jornadas', ['estado'], {
      name: 'idx_jornada_estado',
      comment: 'Soft delete'
    });

    await queryInterface.addIndex('Jornadas', ['id_fase', 'numero'], {
      name: 'idx_jornada_fase_numero',
      comment: 'Búsqueda por fase y número'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remover índices
    await queryInterface.removeIndex('Jornadas', 'idx_jornada_fase');
    await queryInterface.removeIndex('Jornadas', 'idx_jornada_grupo');
    await queryInterface.removeIndex('Jornadas', 'idx_jornada_numero');
    await queryInterface.removeIndex('Jornadas', 'idx_jornada_j_estado');
    await queryInterface.removeIndex('Jornadas', 'idx_jornada_estado');
    await queryInterface.removeIndex('Jornadas', 'idx_jornada_fase_numero');

    // Remover constraint
    await queryInterface.removeConstraint('Jornadas', 'uniq_fase_grupo_numero');

    // Remover tabla
    await queryInterface.dropTable('Jornadas');
  }
};