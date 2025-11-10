'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const personas = [
      {
        ci: '7111111',
        nombre: 'Admin',
        ap: 'Prueba',
        am: 'Sistema',
        fnac: '1990-05-15',
        id_nacionalidad: 1,
        genero: 'masculino',
        foto: 'https://example.com/foto1.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ci: '7150693',
        nombre: 'Javier Alejandro',
        ap: 'Alcoba',
        am: 'Gutierrez',
        fnac: '1988-10-20',
        id_nacionalidad: 1,
        genero: 'masculino',
        foto: 'https://example.com/foto2.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ci: '11223344',
        nombre: 'Carlos',
        ap: 'Ramírez',
        am: 'Torres',
        fnac: '1995-03-10',
        id_nacionalidad: 1,
        genero: 'masculino',
        foto: 'https://example.com/foto3.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Personas', personas, {});

    const [results] = await queryInterface.sequelize.query(
      `SELECT id_persona, ci FROM "Personas" WHERE ci IN ('7111111', '7150693', '11223344');`
    );

    const usuarios = [
      {
        email: 'admin@dotset.com',
        password: 'Contrasena123456',
        rol: 'presidente',
        id_persona: results.find(p => p.ci === '7111111').id_persona,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'javier@dotset.com',
        password: 'Contrasena654321',
        rol: 'admin',
        id_persona: results.find(p => p.ci === '7150693').id_persona,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'carlos@dotset.com',
        password: 'Contrasena112233',
        rol: 'secretario',
        id_persona: results.find(p => p.ci === '11223344').id_persona,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Usuarios', usuarios, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Usuarios', {
      email: ['admin@dotset.com', 'javier@dotset.com', 'carlos@dotset.com']
    }, {});
    await queryInterface.bulkDelete('Personas', {
      ci: ['7111111', '7150693', '11223344']
    }, {});
  }
};