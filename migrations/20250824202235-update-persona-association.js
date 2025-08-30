'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.changeColumn('Personas', 'id_nacionalidad', {
  type: Sequelize.INTEGER,
  allowNull: false,
  references: {
    model: 'Nacionalidades',
    key: 'id_nacionalidad'
  },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL'
});

  },

  async down (queryInterface, Sequelize) {
  await queryInterface.changeColumn('Personas', 'id_nacionalidad', {
    type: Sequelize.INTEGER,
    allowNull: true 
  });

  }
};
