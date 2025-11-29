'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EqTecnicos', {
      id_eqtecnico: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: 'ID único del equipo técnico'
      },

      // ===== REFERENCIAS =====
      id_persona: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Personas',
          key: 'id_persona'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Persona que forma parte del equipo técnico'
      },

      // ❌ ELIMINADO: id_categoria (El equipo técnico es del CLUB, no de la categoría)
      // id_categoria: { ... } → REMOVIDO

      id_club: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Clubes',
          key: 'id_club'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Club al que pertenece el equipo técnico'
      },

      // ✅ NUEVO: Campo ROL (CRUCIAL)
      rol: {
        type: Sequelize.ENUM('DT', 'EA', 'AC', 'M', 'F'),
        allowNull: false,
        comment: 'DT=Director Técnico, EA=Entrenador Asistente, AC=Ayudante Campo, M=Médico, F=Fisioterapeuta'
      },

      // ✅ MODIFICADO: estado (BOOLEAN → ENUM)
      estado: {
        type: Sequelize.ENUM('activo', 'suspendido', 'inactivo'),
        allowNull: false,
        defaultValue: 'activo',
        comment: 'activo=trabaja, suspendido=sanción, inactivo=retirado'
      },

      // ✅ RENOMBRADO: desde → fecha_inicio
      fecha_inicio: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Cuándo inició en el equipo técnico del club'
      },

      // ✅ RENOMBRADO: hasta → fecha_fin
      fecha_fin: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Cuándo finalizó en el equipo técnico'
      },

      // ✅ NUEVO: Campo de observaciones
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Notas adicionales sobre el técnico'
      },

      // ✅ MANTENIDO: f_reg (Fecha de registro)
      freg: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Fecha de registro en BD'
      },
      estado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    // 🔍 Búsqueda: Técnicos de un club por estado
    await queryInterface.addIndex('EqTecnicos',
      ['id_club', 'estado'],
      {
        name: 'idx_club_estado',
        comment: 'Listar técnicos del club por estado'
      }
    );

    // 🔍 Búsqueda: Por rol en un club
    await queryInterface.addIndex('EqTecnicos',
      ['id_club', 'rol'],
      {
        name: 'idx_club_rol',
        comment: 'Listar técnicos por rol (puede haber múltiples)'
      }
    );

    // 🔍 Búsqueda: Por rol y estado
    await queryInterface.addIndex('EqTecnicos',
      ['id_club', 'rol', 'estado'],
      {
        name: 'idx_club_rol_estado',
        comment: 'Listar técnicos por rol activos'
      }
    );

    // 🔍 Búsqueda: Técnicos activos de una persona
    await queryInterface.addIndex('EqTecnicos',
      ['id_persona', 'estado'],
      {
        name: 'idx_persona_estado',
        comment: 'Roles de una persona'
      }
    );

    // 🔍 Búsqueda: Por estado
    await queryInterface.addIndex('EqTecnicos',
      ['estado'],
      {
        name: 'idx_estado',
        comment: 'Listar por estado'
      }
    );

    // 🔍 Búsqueda: En rango de fechas
    await queryInterface.addIndex('EqTecnicos',
      ['fecha_inicio', 'fecha_fin'],
      {
        name: 'idx_fechas',
        comment: 'Búsquedas por rango temporal'
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('EqTecnicos');
  }
};