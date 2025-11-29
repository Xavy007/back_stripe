// migrations/XXXX-create-participacion.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Participaciones', {
      id_participacion: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: 'ID único de la participación'
      },

      // ===== REFERENCIAS OBLIGATORIAS =====
      
      id_jugador: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Jugadores',
          key: 'id_jugador'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Jugador: DEBE tener registro previo en BD (Personas + Jugadores)'
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
        comment: 'Equipo en el que participa'
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
        comment: 'Campeonato: CRUCIAL - agrupa todas las participaciones'
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
        comment: 'Categoría: U14, U16, Adulto, etc - permite jugador en múltiples equipos'
      },

      // ===== DATOS DEL JUGADOR EN ESTE EQUIPO/CATEGORÍA =====

      dorsal: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 99
        },
        comment: 'Dorsal: DIFERENTE por categoría (ej: 10 en infantil, 15 en juvenil)'
      },

      posicion: {
        type: Sequelize.ENUM(
          'Armador',
          'Opuesto',
          'Central',
          'Libero',
          'Punta',
          'Entrenador',
          'Otro'
        ),
        allowNull: true,
        comment: 'Posición en el equipo (voleibol)'
      },

      // ===== ESTADO =====

      estado: {
        type: Sequelize.ENUM('activo', 'suspendido', 'baja', 'vetado'),
        allowNull: false,
        defaultValue: 'activo',
        comment: 'Estado: activo (puede jugar), suspendido (sanción), baja (se fue), vetado (prohibido)'
      },

      // ===== FECHAS DE CONTROL =====

      fecha_inscripcion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Cuándo se registró en este equipo/categoría'
      },

      fecha_baja: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Cuándo se retiró del equipo'
      },

      razon_baja: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'Motivo: lesión, retiro voluntario, sanción, cambio, etc'
      },

      // ===== ESTADÍSTICAS POR PARTICIPACIÓN =====
      // Importante: cada participación tiene stats independientes

      cantidad_partidos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Partidos jugados EN ESTE EQUIPO/CATEGORÍA'
      },

      cantidad_goles: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Puntos anotados EN ESTE EQUIPO/CATEGORÍA'
      },

      cantidad_tarjetas_amarillas: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Tarjetas amarillas EN ESTE EQUIPO'
      },

      cantidad_tarjetas_rojas: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Tarjetas rojas EN ESTE EQUIPO'
      },

      // ===== AUDITORÍA =====

      freg: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Fecha de registro en BD'
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

    // ===== ÍNDICES =====

    // 🔑 ÍNDICE ÚNICO PRINCIPAL
    // Un jugador NO puede estar 2 veces en el mismo equipo+categoría
    await queryInterface.addIndex('Participaciones', 
      ['id_jugador', 'id_equipo', 'id_categoria'],
      { 
        unique: true,
        name: 'unique_jugador_equipo_categoria',
        comment: 'Evita: 1 jugador 1 vez por equipo+categoría'
      }
    );

    // 🔍 BÚSQUEDA: Todos los equipos donde está un jugador
    await queryInterface.addIndex('Participaciones',
      ['id_jugador', 'id_campeonato'],
      { 
        name: 'idx_jugador_campeonato',
        comment: 'Ver en qué equipos/categorías juega un jugador'
      }
    );

    // 🔍 BÚSQUEDA: Jugadores de un equipo
    await queryInterface.addIndex('Participaciones',
      ['id_equipo', 'id_categoria'],
      { 
        name: 'idx_equipo_categoria',
        comment: 'Listar jugadores de un equipo específico'
      }
    );

    // 🔍 BÚSQUEDA: Por categoría
    await queryInterface.addIndex('Participaciones',
      ['id_categoria', 'id_campeonato'],
      { 
        name: 'idx_categoria_campeonato',
        comment: 'Listar jugadores por categoría'
      }
    );

    // 🔍 BÚSQUEDA: Por campeonato
    await queryInterface.addIndex('Participaciones',
      ['id_campeonato'],
      { 
        name: 'idx_campeonato'
      }
    );

  
    // 🔍 BÚSQUEDA: Verificación en cancha (activos)
    await queryInterface.addIndex('Participaciones',
      ['id_equipo', 'id_categoria', 'estado'],
      { 
        name: 'idx_equipo_categoria_estado',
        comment: 'Jugadores activos en un equipo/categoría'
      }
    );

    // 🔍 BÚSQUEDA: Estadísticas por jugador-categoría
    await queryInterface.addIndex('Participaciones',
      ['id_jugador', 'id_categoria'],
      { 
        name: 'idx_jugador_categoria'
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Participaciones');
  }
};