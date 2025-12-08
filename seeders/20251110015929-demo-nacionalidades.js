'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const ahora = new Date();

    const nacionalidades = [
      'Bolivia', 'Argentina', 'Brasil', 'Chile', 'Perú', 'Paraguay',
      'Uruguay', 'Colombia', 'Ecuador', 'Venezuela', 'México', 'España', 'Estados Unidos'
    ].map(pais => ({
      pais,
      estado: true,     // opcional pero recomendado, para ser consistente
      f_reg: ahora,     // 👈 aquí ya nunca será null
      createdAt: ahora,
      updatedAt: ahora
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
