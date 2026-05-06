'use strict';

/**
 * Seeder: Categorías deportivas del sistema DotSet.
 * Datos extraídos de la base de datos de producción.
 *
 * Ejecutar: npx sequelize-cli db:seed --seed 20260423000003-seed-categorias.js
 * Deshacer:  npx sequelize-cli db:seed:undo --seed 20260423000003-seed-categorias.js
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('Categorias', [
      {
        id_categoria: 1,
        nombre:       'MOSQUITOS Mixto',
        descripcion:  'HASTA NIÑOS DE 10 AÑOS',
        edad_inicio:  4,
        edad_limite:  10,
        genero:       'mixto',
        color:        '#10B981',
        estado:       true,
        freg:         now,
        createdAt:    now,
        updatedAt:    now
      },
      {
        id_categoria: 2,
        nombre:       'PIBES Masculino',
        descripcion:  'HASTA LOS 13 AÑOS',
        edad_inicio:  10,
        edad_limite:  13,
        genero:       'masculino',
        color:        '#8B5CF6',
        estado:       true,
        freg:         now,
        createdAt:    now,
        updatedAt:    now
      },
      {
        id_categoria: 3,
        nombre:       'PIBES Femenino',
        descripcion:  'HASTA LOS 13 AÑOS',
        edad_inicio:  10,
        edad_limite:  13,
        genero:       'femenino',
        color:        '#8B5CF6',
        estado:       true,
        freg:         now,
        createdAt:    now,
        updatedAt:    now
      },
      {
        id_categoria: 4,
        nombre:       'INFANTILES Masculino',
        descripcion:  'HASTA LOS 15 AÑOS',
        edad_inicio:  13,
        edad_limite:  15,
        genero:       'masculino',
        color:        '#EF4444',
        estado:       true,
        freg:         now,
        createdAt:    now,
        updatedAt:    now
      },
      {
        id_categoria: 5,
        nombre:       'INFANTILES Femenino',
        descripcion:  'HASTA LOS 15 AÑOS',
        edad_inicio:  13,
        edad_limite:  15,
        genero:       'femenino',
        color:        '#EF4444',
        estado:       true,
        freg:         now,
        createdAt:    now,
        updatedAt:    now
      },
      {
        id_categoria: 6,
        nombre:       'MENORES Masculino',
        descripcion:  'HASTA LOS 17 AÑOS',
        edad_inicio:  15,
        edad_limite:  17,
        genero:       'masculino',
        color:        '#F59E0B',
        estado:       true,
        freg:         now,
        createdAt:    now,
        updatedAt:    now
      },
      {
        id_categoria: 7,
        nombre:       'MENORES Femenino',
        descripcion:  'HASTA LOS 17 AÑOS',
        edad_inicio:  15,
        edad_limite:  17,
        genero:       'femenino',
        color:        '#10B981',
        estado:       true,
        freg:         now,
        createdAt:    now,
        updatedAt:    now
      },
      {
        id_categoria: 8,
        nombre:       'JUVENIL Masculino',
        descripcion:  'HASTA LOS 19 AÑOS',
        edad_inicio:  17,
        edad_limite:  19,
        genero:       'masculino',
        color:        '#EAB308',
        estado:       true,
        freg:         now,
        createdAt:    now,
        updatedAt:    now
      },
      {
        id_categoria: 9,
        nombre:       'JUVENIL Femenino',
        descripcion:  'HASTA LOS 19 AÑOS',
        edad_inicio:  17,
        edad_limite:  19,
        genero:       'femenino',
        color:        '#EAB308',
        estado:       true,
        freg:         now,
        createdAt:    now,
        updatedAt:    now
      },
      {
        id_categoria: 10,
        nombre:       'PRIMERA DE HONOR Masculino',
        descripcion:  'SIN LIMTE DE EDAD SUPERIOR',
        edad_inicio:  17,
        edad_limite:  null,
        genero:       'masculino',
        color:        '#06B6D4',
        estado:       true,
        freg:         now,
        createdAt:    now,
        updatedAt:    now
      },
      {
        id_categoria: 11,
        nombre:       'PRIMERA DE HONOR Femenino',
        descripcion:  'SIN LIMTE DE EDAD SUPERIOR',
        edad_inicio:  17,
        edad_limite:  null,
        genero:       'femenino',
        color:        '#06B6D4',
        estado:       true,
        freg:         now,
        createdAt:    now,
        updatedAt:    now
      },
      {
        id_categoria: 12,
        nombre:       'Maxi Masculino',
        descripcion:  'Maxi',
        edad_inicio:  40,
        edad_limite:  null,
        genero:       'masculino',
        color:        '#0400ff',
        estado:       true,
        freg:         now,
        createdAt:    now,
        updatedAt:    now
      },
      {
        id_categoria: 13,
        nombre:       'Maxi Femenino',
        descripcion:  'Maxi',
        edad_inicio:  40,
        edad_limite:  null,
        genero:       'femenino',
        color:        '#0400ff',
        estado:       true,
        freg:         now,
        createdAt:    now,
        updatedAt:    now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categorias', {
      id_categoria: { [Sequelize.Op.between]: [1, 13] }
    }, {});
  }
};
