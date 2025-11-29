'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Partidos', {
      id_partido: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: 'ID único del partido'
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

      id_cc: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'CampeonatoCategorias',
          key: 'id_cc'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'FK → CampeonatoCategorias (categoría específica)'
      },

      id_cancha: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Canchas',
          key: 'id_cancha'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'FK → Canchas'
      },

      equipo_local: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Equipos',
          key: 'id_equipo'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'FK → Equipos (equipo que juega de local)'
      },

      equipo_visitante: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Equipos',
          key: 'id_equipo'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'FK → Equipos (equipo que juega de visitante)'
      },

      // ===== 4 ÁRBITROS DE VOLEIBOL =====
      id_arbitro1: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Jueces',
          key: 'id_juez'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'FK → Jueces (Árbitro Principal o Árbitro 1)'
      },

      id_arbitro2: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Jueces',
          key: 'id_juez'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'FK → Jueces (Árbitro Segundo o Árbitro 2)'
      },

      id_anotador: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Jueces',
          key: 'id_juez'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'FK → Jueces (Anotador/Secretario)'
      },

      id_cronometrista: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Jueces',
          key: 'id_juez'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'FK → Jueces (Cronometrista)'
      },

      p_estado: {
        type: Sequelize.ENUM('programado', 'en_juego', 'finalizado', 'suspendido', 'wo'),
        allowNull: false,
        defaultValue: 'programado',
        validate: {
          isIn: {
            args: [['programado', 'en_juego', 'finalizado', 'suspendido', 'wo']],
            msg: 'El estado debe ser: programado, en_juego, finalizado, suspendido o wo'
          }
        },
        comment: 'Estado del partido (wo = walkover)'
      },

      resultado_local: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: [0],
            msg: 'El resultado no puede ser negativo'
          },
          max: {
            args: [3],
            msg: 'En voleibol máximo 3 sets'
          }
        },
        comment: 'Sets ganados por equipo local'
      },

      resultado_visitante: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: [0],
            msg: 'El resultado no puede ser negativo'
          },
          max: {
            args: [3],
            msg: 'En voleibol máximo 3 sets'
          }
        },
        comment: 'Sets ganados por equipo visitante'
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
        comment: 'Notas sobre el partido'
      },

      acta_url: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'URL del acta del partido'
      },

      id_fase: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Fases',
          key: 'id_fase'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'FK → Fases (ej: grupos, cuartos, semis, final)'
      },

      id_jornada: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Jornadas',
          key: 'id_jornada'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'FK → Jornadas (qué jornada es)'
      },

      id_grupo: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Grupos',
          key: 'id_grupo'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'FK → Grupos (en qué grupo)'
      },

      fecha_hora: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          isDate: {
            msg: 'La fecha y hora debe ser válida'
          }
        },
        comment: 'Cuándo se juega el partido'
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
    await queryInterface.addConstraint('Partidos', {
      fields: ['id_cc', 'equipo_local', 'equipo_visitante', 'fecha_hora'],
      type: 'unique',
      name: 'uniq_partido_equipos_fecha',
      comment: 'No permite el mismo partido (equipos + hora) en una categoría'
    });

    // ===== ÍNDICES =====
    await queryInterface.addIndex('Partidos', ['id_campeonato'], {
      name: 'idx_partido_campeonato',
      comment: 'Partidos de un campeonato'
    });

    await queryInterface.addIndex('Partidos', ['id_cc'], {
      name: 'idx_partido_cc',
      comment: 'Partidos de una categoría-campeonato'
    });

    await queryInterface.addIndex('Partidos', ['id_cancha'], {
      name: 'idx_partido_cancha',
      comment: 'Partidos en una cancha'
    });

    await queryInterface.addIndex('Partidos', ['equipo_local'], {
      name: 'idx_partido_equipo_local',
      comment: 'Partidos donde juega equipo como local'
    });

    await queryInterface.addIndex('Partidos', ['equipo_visitante'], {
      name: 'idx_partido_equipo_visitante',
      comment: 'Partidos donde juega equipo como visitante'
    });

    await queryInterface.addIndex('Partidos', ['p_estado'], {
      name: 'idx_partido_p_estado',
      comment: 'Partidos por estado'
    });

    await queryInterface.addIndex('Partidos', ['fecha_hora'], {
      name: 'idx_partido_fecha_hora',
      comment: 'Partidos por fecha y hora'
    });

    await queryInterface.addIndex('Partidos', ['estado'], {
      name: 'idx_partido_estado',
      comment: 'Soft delete'
    });

    // Índices para árbitros
    await queryInterface.addIndex('Partidos', ['id_arbitro1'], {
      name: 'idx_partido_arbitro1',
      comment: 'Partidos arbitrados por Árbitro 1'
    });

    await queryInterface.addIndex('Partidos', ['id_arbitro2'], {
      name: 'idx_partido_arbitro2',
      comment: 'Partidos arbitrados por Árbitro 2'
    });

    await queryInterface.addIndex('Partidos', ['id_anotador'], {
      name: 'idx_partido_anotador',
      comment: 'Partidos anotados por este anotador'
    });

    await queryInterface.addIndex('Partidos', ['id_cronometrista'], {
      name: 'idx_partido_cronometrista',
      comment: 'Partidos cronometrados por este cronometrista'
    });

    await queryInterface.addIndex('Partidos', ['id_cc', 'p_estado'], {
      name: 'idx_partido_cc_p_estado',
      comment: 'Partidos de una categoría por estado'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remover índices
    await queryInterface.removeIndex('Partidos', 'idx_partido_campeonato');
    await queryInterface.removeIndex('Partidos', 'idx_partido_cc');
    await queryInterface.removeIndex('Partidos', 'idx_partido_cancha');
    await queryInterface.removeIndex('Partidos', 'idx_partido_equipo_local');
    await queryInterface.removeIndex('Partidos', 'idx_partido_equipo_visitante');
    await queryInterface.removeIndex('Partidos', 'idx_partido_p_estado');
    await queryInterface.removeIndex('Partidos', 'idx_partido_fecha_hora');
    await queryInterface.removeIndex('Partidos', 'idx_partido_estado');
    await queryInterface.removeIndex('Partidos', 'idx_partido_arbitro1');
    await queryInterface.removeIndex('Partidos', 'idx_partido_arbitro2');
    await queryInterface.removeIndex('Partidos', 'idx_partido_anotador');
    await queryInterface.removeIndex('Partidos', 'idx_partido_cronometrista');
    await queryInterface.removeIndex('Partidos', 'idx_partido_cc_p_estado');

    // Remover constraint
    await queryInterface.removeConstraint('Partidos', 'uniq_partido_equipos_fecha');

    // Remover tabla
    await queryInterface.dropTable('Partidos');
  }
};