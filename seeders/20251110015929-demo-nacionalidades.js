'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const nacionalidades = [
      'Bolivia', 'Argentina', 'Brasil', 'Chile', 'Perú', 'Paraguay',
      'Uruguay', 'Colombia', 'Ecuador', 'Venezuela', 'México', 'España', 'Estados Unidos'
    ].map(pais => ({
      pais,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('Nacionalidades', nacionalidades, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Nacionalidades', {
      pais: [
        'Bolivia', 'Argentina', 'Brasil', 'Chile', 'Perú', 'Paraguay',
        'Uruguay', 'Colombia', 'Ecuador', 'Venezuela', 'México', 'España', 'Estados Unidos'
      ]
    }, {});
  }
};