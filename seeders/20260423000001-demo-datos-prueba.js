'use strict';

/**
 * Seeder de datos de prueba — Sistema DotSet
 *
 * IMPORTANTE: bulkInsert omite los hooks beforeCreate del modelo Sequelize,
 * por eso el hash de la contraseña se hace manualmente aquí con bcrypt.hash().
 * La contraseña de todos los usuarios demo es: Admin123456!
 *
 * Ejecutar: npx sequelize-cli db:seed --seed 20260423000001-demo-datos-prueba.js
 * Deshacer:  npx sequelize-cli db:seed:undo --seed 20260423000001-demo-datos-prueba.js
 */

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const SALT_ROUNDS = 10;

    const PASSWORD_DEMO = 'Admin123456!';
    const passwordHash = await bcrypt.hash(PASSWORD_DEMO, SALT_ROUNDS);

    // Obtener id de la provincia Cercado del departamento Tarija
    const [provResult] = await queryInterface.sequelize.query(
      `SELECT p.id_provincia FROM "Provincias" p
       JOIN "Departamentos" d ON p.id_departamento = d.id_departamento
       WHERE d.nombre = 'Tarija' AND p.nombre = 'Cercado'
       LIMIT 1`
    );
    const id_prov_tarija = provResult[0]?.id_provincia || null;

    // =========================================================================
    // 1. PERSONAS
    // =========================================================================
    await queryInterface.bulkInsert('Personas', [
      // Administrador
      {
        ci: '1234567',
        nombre: 'Carlos',
        ap: 'Mendoza',
        am: 'Rojas',
        fnac: new Date('1985-03-15'),
        genero: 'masculino',
        id_nacionalidad: 1,
        id_provincia_origen: id_prov_tarija,
        freg: now, createdAt: now, updatedAt: now
      },
      // Presidente de asociación
      {
        ci: '2345678',
        nombre: 'María',
        ap: 'Gutierrez',
        am: 'Vargas',
        fnac: new Date('1978-07-22'),
        genero: 'femenino',
        id_nacionalidad: 1,
        id_provincia_origen: id_prov_tarija,
        freg: now, createdAt: now, updatedAt: now
      },
      // Secretario
      {
        ci: '3456789',
        nombre: 'Luis',
        ap: 'Quispe',
        am: 'Mamani',
        fnac: new Date('1990-11-05'),
        genero: 'masculino',
        id_nacionalidad: 1,
        id_provincia_origen: id_prov_tarija,
        freg: now, createdAt: now, updatedAt: now
      },
      // Presidente de club
      {
        ci: '4567890',
        nombre: 'Ana',
        ap: 'Flores',
        am: 'Condori',
        fnac: new Date('1982-04-10'),
        genero: 'femenino',
        id_nacionalidad: 1,
        id_provincia_origen: id_prov_tarija,
        freg: now, createdAt: now, updatedAt: now
      },
      // Juez árbitro
      {
        ci: '5678901',
        nombre: 'Roberto',
        ap: 'Pardo',
        am: 'Salinas',
        fnac: new Date('1988-09-30'),
        genero: 'masculino',
        id_nacionalidad: 1,
        id_provincia_origen: id_prov_tarija,
        freg: now, createdAt: now, updatedAt: now
      },
      // Jugadora 1
      {
        ci: '6789012',
        nombre: 'Sofía',
        ap: 'Torrez',
        am: 'Herrera',
        fnac: new Date('2002-01-18'),
        genero: 'femenino',
        id_nacionalidad: 1,
        id_provincia_origen: id_prov_tarija,
        freg: now, createdAt: now, updatedAt: now
      },
      // Jugadora 2
      {
        ci: '7890123',
        nombre: 'Valeria',
        ap: 'Chávez',
        am: 'Núñez',
        fnac: new Date('2001-06-25'),
        genero: 'femenino',
        id_nacionalidad: 1,
        id_provincia_origen: id_prov_tarija,
        freg: now, createdAt: now, updatedAt: now
      },
      // Jugador 3
      {
        ci: '8901234',
        nombre: 'Diego',
        ap: 'Ramos',
        am: 'Vilca',
        fnac: new Date('2000-12-03'),
        genero: 'masculino',
        id_nacionalidad: 1,
        id_provincia_origen: id_prov_tarija,
        freg: now, createdAt: now, updatedAt: now
      },
      // Jugador 4
      {
        ci: '9012345',
        nombre: 'Miguel',
        ap: 'Cabrera',
        am: 'Loza',
        fnac: new Date('1999-08-14'),
        genero: 'masculino',
        id_nacionalidad: 1,
        id_provincia_origen: id_prov_tarija,
        freg: now, createdAt: now, updatedAt: now
      },
      // Entrenador
      {
        ci: '9123456',
        nombre: 'Jorge',
        ap: 'Mamani',
        am: 'Apaza',
        fnac: new Date('1975-02-28'),
        genero: 'masculino',
        id_nacionalidad: 1,
        id_provincia_origen: id_prov_tarija,
        freg: now, createdAt: now, updatedAt: now
      }
    ], {});

    // Obtener IDs de personas insertadas
    const [personas] = await queryInterface.sequelize.query(
      `SELECT id_persona, ci FROM "Personas" WHERE ci IN
       ('1234567','2345678','3456789','4567890','5678901',
        '6789012','7890123','8901234','9012345','9123456')
       ORDER BY ci ASC`
    );
    const byCI = {};
    personas.forEach(p => { byCI[p.ci] = p.id_persona; });

    // =========================================================================
    // 2. USUARIOS
    // CLAVE: hash manual porque bulkInsert no ejecuta hooks del modelo
    // =========================================================================
    await queryInterface.bulkInsert('Usuarios', [
      {
        email: 'admin@dotset.bo',
        password: passwordHash,
        rol: 'admin',
        verificado: true,
        estado: true,
        failed_attempts: 0,
        id_persona: byCI['1234567'],
        createdAt: now, updatedAt: now
      },
      {
        email: 'presidente@dotset.bo',
        password: passwordHash,
        rol: 'presidente',
        verificado: true,
        estado: true,
        failed_attempts: 0,
        id_persona: byCI['2345678'],
        createdAt: now, updatedAt: now
      },
      {
        email: 'secretario@dotset.bo',
        password: passwordHash,
        rol: 'secretario',
        verificado: true,
        estado: true,
        failed_attempts: 0,
        id_persona: byCI['3456789'],
        createdAt: now, updatedAt: now
      },
      {
        email: 'presidenteclub@dotset.bo',
        password: passwordHash,
        rol: 'presidenteclub',
        verificado: true,
        estado: true,
        failed_attempts: 0,
        id_persona: byCI['4567890'],
        createdAt: now, updatedAt: now
      },
      {
        email: 'juez@dotset.bo',
        password: passwordHash,
        rol: 'juez',
        verificado: true,
        estado: true,
        failed_attempts: 0,
        id_persona: byCI['5678901'],
        createdAt: now, updatedAt: now
      }
    ], {});

    // =========================================================================
    // 3. CLUBS (ambos de Tarija)
    // =========================================================================
    await queryInterface.bulkInsert('Clubes', [
      {
        nombre: 'Club Tarija Voleibol',
        acronimo: 'CTV',
        direccion: 'Av. Víctor Paz Estenssoro Nº 123, Tarija',
        telefono: '46451234',
        email: 'ctv@voleibol.bo',
        personeria: true,
        estado: true,
        freg: now, createdAt: now, updatedAt: now
      },
      {
        nombre: 'Club Cercado Tarija',
        acronimo: 'CCT',
        direccion: 'Calle Colón Nº 456, Tarija',
        telefono: '46452345',
        email: 'cct@voleibol.bo',
        personeria: true,
        estado: true,
        freg: now, createdAt: now, updatedAt: now
      }
    ], {});

    const [clubs] = await queryInterface.sequelize.query(
      `SELECT id_club, acronimo FROM "Clubes" WHERE acronimo IN ('CTV','CCT')`
    );
    const byAcronimo = {};
    clubs.forEach(c => { byAcronimo[c.acronimo] = c.id_club; });

    // Asociar presidente de club al Club CTV
    const [usuarios] = await queryInterface.sequelize.query(
      `SELECT id_usuario, email FROM "Usuarios"
       WHERE email IN ('presidenteclub@dotset.bo','juez@dotset.bo')`
    );
    const byEmail = {};
    usuarios.forEach(u => { byEmail[u.email] = u.id_usuario; });

    await queryInterface.bulkInsert('ClubUsuarios', [
      {
        id_club: byAcronimo['CTV'],
        id_usuario: byEmail['presidenteclub@dotset.bo'],
        createdAt: now, updatedAt: now
      }
    ], {});

    // =========================================================================
    // 4. JUGADORES
    // =========================================================================
    await queryInterface.bulkInsert('Jugadores', [
      {
        id_persona: byCI['6789012'],
        id_club: byAcronimo['CTV'],
        dorsal: 3,
        estatura: 1.75,
        estado: true,
        freg: now, createdAt: now, updatedAt: now
      },
      {
        id_persona: byCI['7890123'],
        id_club: byAcronimo['CTV'],
        dorsal: 11,
        estatura: 1.68,
        estado: true,
        freg: now, createdAt: now, updatedAt: now
      },
      {
        id_persona: byCI['8901234'],
        id_club: byAcronimo['CCT'],
        dorsal: 7,
        estatura: 1.82,
        estado: true,
        freg: now, createdAt: now, updatedAt: now
      },
      {
        id_persona: byCI['9012345'],
        id_club: byAcronimo['CCT'],
        dorsal: 9,
        estatura: 1.79,
        estado: true,
        freg: now, createdAt: now, updatedAt: now
      }
    ], {});

    // =========================================================================
    // 5. JUEZ
    // =========================================================================
    await queryInterface.bulkInsert('Jueces', [
      {
        id_persona: byCI['5678901'],
        juez_categoria: 'juez',
        grado: 'departamental',
        certificacion: true,
        estado_juez: 'activo',
        estado: true,
        freg: now, createdAt: now, updatedAt: now
      }
    ], {});

    // =========================================================================
    // 6. CUERPO TÉCNICO (entrenador)
    // =========================================================================
    await queryInterface.bulkInsert('EqTecnicos', [
      {
        id_persona: byCI['9123456'],
        id_club: byAcronimo['CTV'],
        rol: 'DT',
        estado: true,
        freg: now, createdAt: now, updatedAt: now
      }
    ], {});

    // =========================================================================
    // 7. CANCHAS (Tarija)
    // =========================================================================
    await queryInterface.bulkInsert('Canchas', [
      {
        nombre: 'Coliseo Beni Yolanda',
        tipo: 'coliseo',
        direccion: 'Av. Las Américas Nº 500, Tarija',
        capacidad: 500,
        estado: true,
        freg: now, createdAt: now, updatedAt: now
      },
      {
        nombre: 'Cancha Municipal Tarija',
        tipo: 'abierta',
        direccion: 'Parque Bolívar, Tarija',
        capacidad: 200,
        estado: true,
        freg: now, createdAt: now, updatedAt: now
      }
    ], {});

    console.log('\n✅ Seeders de datos de prueba insertados correctamente.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Contraseña de todos los usuarios: Admin123456!');
    console.log('  admin@dotset.bo         → rol: admin');
    console.log('  presidente@dotset.bo    → rol: presidente');
    console.log('  secretario@dotset.bo    → rol: secretario');
    console.log('  presidenteclub@dotset.bo→ rol: presidenteclub');
    console.log('  juez@dotset.bo          → rol: juez');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  },

  async down(queryInterface, Sequelize) {
    // Eliminar en orden inverso para respetar FK
    await queryInterface.bulkDelete('Canchas',      { nombre: { [Sequelize.Op.in]: ['Coliseo Beni Yolanda', 'Cancha Municipal Tarija'] } }, {});
    await queryInterface.bulkDelete('EqTecnicos',   {}, {});
    await queryInterface.bulkDelete('Jueces',        {}, {});
    await queryInterface.bulkDelete('Jugadores',     {}, {});
    await queryInterface.bulkDelete('ClubUsuarios',  {}, {});
    await queryInterface.bulkDelete('Clubes',        { acronimo: { [Sequelize.Op.in]: ['CTV', 'CCT'] } }, {});
    await queryInterface.bulkDelete('Usuarios',      { email: { [Sequelize.Op.in]: [
      'admin@dotset.bo', 'presidente@dotset.bo', 'secretario@dotset.bo',
      'presidenteclub@dotset.bo', 'juez@dotset.bo'
    ] } }, {});
    await queryInterface.bulkDelete('Personas',      { ci: { [Sequelize.Op.in]: [
      '1234567','2345678','3456789','4567890','5678901',
      '6789012','7890123','8901234','9012345','9123456'
    ] } }, {});
  }
};
