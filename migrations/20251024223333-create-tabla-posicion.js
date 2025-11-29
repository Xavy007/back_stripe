'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TablaPosiciones', {
      id_tabla: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: 'ID único de la posición'
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

      posicion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: 'La posición debe ser al menos 1'
          }
        },
        comment: 'Posición en la tabla (1, 2, 3...)'
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
        comment: 'Puntos acumulados en la tabla'
      },

      partidos_jugados: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: 'Los partidos no pueden ser negativos'
          }
        },
        comment: 'Partidos jugados'
      },

      ganados: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: 'Los partidos ganados no pueden ser negativos'
          }
        },
        comment: 'Partidos ganados'
      },

      perdidos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: 'Los partidos perdidos no pueden ser negativos'
          }
        },
        comment: 'Partidos perdidos'
      },

      wo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: 'Los walkover no pueden ser negativos'
          }
        },
        comment: 'Walkover (victorias por no presentación)'
      },

      sets_ganados: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: 'Los sets ganados no pueden ser negativos'
          }
        },
        comment: 'Sets ganados'
      },

      sets_perdidos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: 'Los sets perdidos no pueden ser negativos'
          }
        },
        comment: 'Sets perdidos'
      },

      diferencia_sets: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Diferencia de sets (sets_ganados - sets_perdidos)'
      },

      puntos_favor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: 'Los puntos a favor no pueden ser negativos'
          }
        },
        comment: 'Puntos a favor en los sets'
      },

      puntos_contra: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: 'Los puntos en contra no pueden ser negativos'
          }
        },
        comment: 'Puntos en contra en los sets'
      },

      diferencia_puntos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Diferencia de puntos (puntos_favor - puntos_contra)'
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
    await queryInterface.addConstraint('TablaPosiciones', {
      fields: ['id_campeonato', 'id_categoria', 'id_equipo'],
      type: 'unique',
      name: 'uniq_tabla_campeonato_categoria_equipo',
      comment: 'Un equipo solo una posición por campeonato-categoría'
    });

    // ===== ÍNDICES =====
    await queryInterface.addIndex('TablaPosiciones', ['id_campeonato'], {
      name: 'idx_tabla_campeonato',
      comment: 'Posiciones de un campeonato'
    });

    await queryInterface.addIndex('TablaPosiciones', ['id_categoria'], {
      name: 'idx_tabla_categoria',
      comment: 'Posiciones de una categoría'
    });

    await queryInterface.addIndex('TablaPosiciones', ['id_equipo'], {
      name: 'idx_tabla_equipo',
      comment: 'Posiciones de un equipo'
    });

    await queryInterface.addIndex('TablaPosiciones', ['posicion'], {
      name: 'idx_tabla_posicion',
      comment: 'Búsqueda por posición'
    });

    await queryInterface.addIndex('TablaPosiciones', ['estado'], {
      name: 'idx_tabla_estado',
      comment: 'Soft delete'
    });

    await queryInterface.addIndex('TablaPosiciones', ['id_campeonato', 'posicion'], {
      name: 'idx_tabla_campeonato_posicion',
      comment: 'Posiciones ordenadas de un campeonato'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remover índices
    await queryInterface.removeIndex('TablaPosiciones', 'idx_tabla_campeonato');
    await queryInterface.removeIndex('TablaPosiciones', 'idx_tabla_categoria');
    await queryInterface.removeIndex('TablaPosiciones', 'idx_tabla_equipo');
    await queryInterface.removeIndex('TablaPosiciones', 'idx_tabla_posicion');
    await queryInterface.removeIndex('TablaPosiciones', 'idx_tabla_estado');
    await queryInterface.removeIndex('TablaPosiciones', 'idx_tabla_campeonato_posicion');

    // Remover constraint
    await queryInterface.removeConstraint('TablaPosiciones', 'uniq_tabla_campeonato_categoria_equipo');

    // Remover tabla
    await queryInterface.dropTable('TablaPosiciones');
  }
};