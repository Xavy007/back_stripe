'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CampeonatoCategorias', {
      id_cc: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_campeonato: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Campeonatos',
          key:'id_campeonato'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      id_categoria: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Categorias',
          key:'id_categoria'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      formato: {
        type: Sequelize.ENUM('grupos', 'liga', 'eliminatoria', 'mixto'),
          allowNull: false
      },
      numero_grupos: {
        type: Sequelize.INTEGER
      },
      estado: {
        type: Sequelize.BOOLEAN
      },
      freg: {
        type: Sequelize.DATE
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
   // 🔒 Evita duplicar la misma categoría dentro del mismo campeonato
    await queryInterface.addConstraint('CampeonatoCategorias', {
      fields: ['id_campeonato', 'id_categoria'],
      type: 'unique',
      name: 'uniq_campeonato_categoria'
    });

    // (Opcional) índices para acelerar búsquedas
    await queryInterface.addIndex('CampeonatoCategorias', ['id_campeonato'], {
      name: 'idx_cc_id_campeonato'
    });
    await queryInterface.addIndex('CampeonatoCategorias', ['id_categoria'], {
      name: 'idx_cc_id_categoria'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('CampeonatoCategorias', 'idx_cc_id_campeonato');
    await queryInterface.removeIndex('CampeonatoCategorias', 'idx_cc_id_categoria');
    await queryInterface.removeConstraint('CampeonatoCategorias', 'uniq_campeonato_categoria');
    await queryInterface.dropTable('CampeonatoCategorias');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_CampeonatoCategoria_formato";');

  }
};