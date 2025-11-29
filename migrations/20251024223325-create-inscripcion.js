'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Inscripciones', {
      id_inscripcion: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: 'ID único de la inscripción'
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

      grupo: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [1, 10],
            msg: 'El grupo debe tener entre 1 y 10 caracteres'
          }
        },
        comment: 'Grupo (ej: A, B, C)'
      },

      serie: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [1, 10],
            msg: 'La serie debe tener entre 1 y 10 caracteres'
          }
        },
        comment: 'Serie o zona (ej: 1, 2, 3)'
      },

      posicion_final: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: [1],
            msg: 'La posición debe ser al menos 1'
          }
        },
        comment: 'Posición final en la categoría'
      },

      cantidad_jugadores: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: [1],
            msg: 'Debe haber al menos 1 jugador'
          }
        },
        comment: 'Cantidad de jugadores inscritos'
      },

      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true,
        validate: {
          len: {
            args: [0, 2000],
            msg: 'Las observaciones no pueden exceder 2000 caracteres'
          }
        },
        comment: 'Notas sobre la inscripción'
      },

      estado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Soft delete: true = activo, false = eliminado'
      },

      fecha_inscripcion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Cuándo se realizó la inscripción'
      },

      freg: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Fecha de registro en BD'
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
    await queryInterface.addConstraint('Inscripciones', {
      fields: ['id_cc', 'id_equipo'],
      type: 'unique',
      name: 'uniq_cc_equipo',
      comment: 'Un equipo solo se inscribe una vez por categoría-campeonato'
    });

    // ===== ÍNDICES =====
    await queryInterface.addIndex('Inscripciones', ['id_cc'], {
      name: 'idx_inscripcion_cc',
      comment: 'Equipos inscritos en una categoría-campeonato'
    });

    await queryInterface.addIndex('Inscripciones', ['id_equipo'], {
      name: 'idx_inscripcion_equipo',
      comment: 'Inscripciones de un equipo'
    });

    await queryInterface.addIndex('Inscripciones', ['estado'], {
      name: 'idx_inscripcion_estado',
      comment: 'Soft delete'
    });

    await queryInterface.addIndex('Inscripciones', ['id_cc', 'estado'], {
      name: 'idx_inscripcion_cc_estado',
      comment: 'Equipos activos inscritos en una categoría-campeonato'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remover índices
    await queryInterface.removeIndex('Inscripciones', 'idx_inscripcion_cc');
    await queryInterface.removeIndex('Inscripciones', 'idx_inscripcion_equipo');
    await queryInterface.removeIndex('Inscripciones', 'idx_inscripcion_estado');
    await queryInterface.removeIndex('Inscripciones', 'idx_inscripcion_cc_estado');

    // Remover constraint
    await queryInterface.removeConstraint('Inscripciones', 'uniq_cc_equipo');

    // Remover tabla
    await queryInterface.dropTable('Inscripciones');
  }
};