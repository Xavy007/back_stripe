'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Jornadas"
      ALTER COLUMN "id_fase" DROP NOT NULL;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "Jornadas"
      ALTER COLUMN "id_grupo" DROP NOT NULL;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Jornadas"
      ALTER COLUMN "id_fase" SET NOT NULL;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "Jornadas"
      ALTER COLUMN "id_grupo" SET NOT NULL;
    `);
  }
};
