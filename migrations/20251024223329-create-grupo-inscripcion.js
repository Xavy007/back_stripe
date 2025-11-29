'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GrupoInscripciones', {
      id_grupo_inscripcion: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: 'ID único de la inscripción en grupo'
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

      id_inscripcion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Inscripciones',
          key: 'id_inscripcion'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'FK → Inscripciones (qué equipo se inscribió)'
      },

      bombo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: 'El bombo debe ser al menos 1'
          }
        },
        comment: 'Número de bombo (1, 2, 3, 4...) para la asignación'
      },

      slot_grupo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: 'El slot debe ser al menos 1'
          }
        },
        comment: 'Posición/slot del equipo en el grupo (1, 2, 3...)'
      },

      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true,
        validate: {
          len: {
            args: [0, 1000],
            msg: 'Las observaciones no pueden exceder 1000 caracteres'
          }
        },
        comment: 'Notas sobre la asignación en el grupo'
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
    await queryInterface.addConstraint('GrupoInscripciones', {
      fields: ['id_grupo', 'id_inscripcion'],
      type: 'unique',
      name: 'uniq_grupo_inscripcion',
      comment: 'Un equipo solo una vez por grupo'
    });

    // ===== ÍNDICES =====
    await queryInterface.addIndex('GrupoInscripciones', ['id_grupo'], {
      name: 'idx_grupo_inscripcion_grupo',
      comment: 'Equipos inscritos en un grupo'
    });

    await queryInterface.addIndex('GrupoInscripciones', ['id_inscripcion'], {
      name: 'idx_grupo_inscripcion_inscripcion',
      comment: 'Grupos donde se inscribió el equipo'
    });

    await queryInterface.addIndex('GrupoInscripciones', ['estado'], {
      name: 'idx_grupo_inscripcion_estado',
      comment: 'Soft delete'
    });

    await queryInterface.addIndex('GrupoInscripciones', ['bombo'], {
      name: 'idx_grupo_inscripcion_bombo',
      comment: 'Búsqueda por bombo'
    });

    await queryInterface.addIndex('GrupoInscripciones', ['slot_grupo'], {
      name: 'idx_grupo_inscripcion_slot',
      comment: 'Búsqueda por slot en grupo'
    });

    await queryInterface.addIndex('GrupoInscripciones', ['id_grupo', 'slot_grupo'], {
      name: 'idx_grupo_inscripcion_grupo_slot',
      comment: 'Búsqueda por grupo y posición'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remover índices
    await queryInterface.removeIndex('GrupoInscripciones', 'idx_grupo_inscripcion_grupo');
    await queryInterface.removeIndex('GrupoInscripciones', 'idx_grupo_inscripcion_inscripcion');
    await queryInterface.removeIndex('GrupoInscripciones', 'idx_grupo_inscripcion_estado');
    await queryInterface.removeIndex('GrupoInscripciones', 'idx_grupo_inscripcion_bombo');
    await queryInterface.removeIndex('GrupoInscripciones', 'idx_grupo_inscripcion_slot');
    await queryInterface.removeIndex('GrupoInscripciones', 'idx_grupo_inscripcion_grupo_slot');

    // Remover constraint
    await queryInterface.removeConstraint('GrupoInscripciones', 'uniq_grupo_inscripcion');

    // Remover tabla
    await queryInterface.dropTable('GrupoInscripciones');
  }
};