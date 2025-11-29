"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Provincias", [
      // === La Paz (1)
      { nombre: "Murillo", id_departamento: 1, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Omasuyos", id_departamento: 1, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Pacajes", id_departamento: 1, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Camacho", id_departamento: 1, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Ingavi", id_departamento: 1, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Aroma", id_departamento: 1, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Loayza", id_departamento: 1, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Muñecas", id_departamento: 1, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Larecaja", id_departamento: 1, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Franz Tamayo", id_departamento: 1, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Bautista Saavedra", id_departamento: 1, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Manco Kapac", id_departamento: 1, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Abel Iturralde", id_departamento: 1, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Caranavi", id_departamento: 1, createdAt: new Date(), updatedAt: new Date() },

      // === Cochabamba (2)
      { nombre: "Cercado", id_departamento: 2, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Arani", id_departamento: 2, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Arque", id_departamento: 2, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Ayopaya", id_departamento: 2, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Capinota", id_departamento: 2, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Carrasco", id_departamento: 2, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Chapare", id_departamento: 2, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Esteban Arce", id_departamento: 2, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "German Jordán", id_departamento: 2, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Mizque", id_departamento: 2, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Punata", id_departamento: 2, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Quillacollo", id_departamento: 2, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Tapacarí", id_departamento: 2, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Tiraque", id_departamento: 2, createdAt: new Date(), updatedAt: new Date() },

      // === Santa Cruz (3)
      { nombre: "Andrés Ibáñez", id_departamento: 3, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Warnes", id_departamento: 3, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Ichilo", id_departamento: 3, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Sara", id_departamento: 3, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Obispo Santistevan", id_departamento: 3, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Ñuflo de Chávez", id_departamento: 3, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Velasco", id_departamento: 3, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Chiquitos", id_departamento: 3, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Ángel Sandoval", id_departamento: 3, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Germán Busch", id_departamento: 3, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Guarayos", id_departamento: 3, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Florida", id_departamento: 3, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Manuel María Caballero", id_departamento: 3, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Vallegrande", id_departamento: 3, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Cordillera", id_departamento: 3, createdAt: new Date(), updatedAt: new Date() },

      // === Oruro (4)
      { nombre: "Cercado", id_departamento: 4, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Sajama", id_departamento: 4, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "San Pedro de Totora", id_departamento: 4, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Sebastián Pagador", id_departamento: 4, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Carangas", id_departamento: 4, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Mejillones", id_departamento: 4, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Nor Carangas", id_departamento: 4, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Ladislao Cabrera", id_departamento: 4, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Pantaleón Dalence", id_departamento: 4, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Poopó", id_departamento: 4, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Saucari", id_departamento: 4, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Sur Carangas", id_departamento: 4, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Tomás Barrón", id_departamento: 4, createdAt: new Date(), updatedAt: new Date() },

      // === Potosí (5)
      { nombre: "Tomás Frías", id_departamento: 5, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Rafael Bustillo", id_departamento: 5, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Chayanta", id_departamento: 5, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Charcas", id_departamento: 5, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Nor Chichas", id_departamento: 5, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Sud Chichas", id_departamento: 5, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Nor Lípez", id_departamento: 5, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Sud Lípez", id_departamento: 5, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Modesto Omiste", id_departamento: 5, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Antonio Quijarro", id_departamento: 5, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Daniel Campos", id_departamento: 5, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Enrique Baldivieso", id_departamento: 5, createdAt: new Date(), updatedAt: new Date() },

      // === Chuquisaca (6)
      { nombre: "Oropeza", id_departamento: 6, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Azurduy", id_departamento: 6, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Zudañez", id_departamento: 6, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Tomina", id_departamento: 6, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Hernando Siles", id_departamento: 6, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Yamparáez", id_departamento: 6, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Luis Calvo", id_departamento: 6, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Belisario Boeto", id_departamento: 6, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Nor Cinti", id_departamento: 6, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Sud Cinti", id_departamento: 6, createdAt: new Date(), updatedAt: new Date() },

      // === Tarija (7)
      { nombre: "Cercado", id_departamento: 7, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Arce", id_departamento: 7, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Gran Chaco", id_departamento: 7, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Burnet O’Connor", id_departamento: 7, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Méndez", id_departamento: 7, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Avilés", id_departamento: 7, createdAt: new Date(), updatedAt: new Date() },

      // === Beni (8)
      { nombre: "Cercado", id_departamento: 8, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Yacuma", id_departamento: 8, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Ballivián", id_departamento: 8, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Vaca Díez", id_departamento: 8, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Moxos", id_departamento: 8, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Marbán", id_departamento: 8, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Iténez", id_departamento: 8, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Mamore", id_departamento: 8, createdAt: new Date(), updatedAt: new Date() },

      // === Pando (9)
      { nombre: "Nicolás Suárez", id_departamento: 9, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Manuripi", id_departamento: 9, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Madre de Dios", id_departamento: 9, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Abuná", id_departamento: 9, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Federico Román", id_departamento: 9, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Provincias", null, {});
  }
};
