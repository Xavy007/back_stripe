"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Departamentos", [
      { id_departamento: 1, nombre: "La Paz",        id_nacionalidad: 1, createdAt: new Date(), updatedAt: new Date() },
      { id_departamento: 2, nombre: "Cochabamba",   id_nacionalidad: 1, createdAt: new Date(), updatedAt: new Date() },
      { id_departamento: 3, nombre: "Santa Cruz",   id_nacionalidad: 1, createdAt: new Date(), updatedAt: new Date() },
      { id_departamento: 4, nombre: "Oruro",        id_nacionalidad: 1, createdAt: new Date(), updatedAt: new Date() },
      { id_departamento: 5, nombre: "Potosí",       id_nacionalidad: 1, createdAt: new Date(), updatedAt: new Date() },
      { id_departamento: 6, nombre: "Chuquisaca",   id_nacionalidad: 1, createdAt: new Date(), updatedAt: new Date() },
      { id_departamento: 7, nombre: "Tarija",       id_nacionalidad: 1, createdAt: new Date(), updatedAt: new Date() },
      { id_departamento: 8, nombre: "Beni",         id_nacionalidad: 1, createdAt: new Date(), updatedAt: new Date() },
      { id_departamento: 9, nombre: "Pando",        id_nacionalidad: 1, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Departamentos", null, {});
  }
};
