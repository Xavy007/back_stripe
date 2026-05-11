'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Usuarios"
        ADD COLUMN IF NOT EXISTS "token_activacion" VARCHAR(255),
        ADD COLUMN IF NOT EXISTS "token_expira" TIMESTAMP WITH TIME ZONE;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Usuarios"
        DROP COLUMN IF EXISTS "token_activacion",
        DROP COLUMN IF EXISTS "token_expira";
    `);
  }
};
