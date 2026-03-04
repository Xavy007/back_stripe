// repositories/mongodb/sancionesPartido.repository.js
const SancionesPartido = require('../../models/mongodb/SancionesPartido');

class SancionesPartidoRepository {
  
  async findByPartido(idpartido) {
    return await SancionesPartido.find({ idpartido })
      .sort({ numero_set: 1, timestamp: 1 });
  }

  async findByPartidoYSet(idpartido, numero_set) {
    return await SancionesPartido.find({ idpartido, numero_set })
      .sort({ timestamp: 1 });
  }

  async findByEquipo(idpartido, equipo) {
    return await SancionesPartido.find({ idpartido, equipo })
      .sort({ timestamp: 1 });
  }

  async findByJugador(idpartido, idjugador) {
    return await SancionesPartido.find({ 
      idpartido, 
      'sancionado.idjugador': idjugador 
    });
  }

  async countByTipo(idpartido, tipo_sancion) {
    return await SancionesPartido.countDocuments({ 
      idpartido, 
      tipo_sancion 
    });
  }

  async create(data) {
    const sancion = new SancionesPartido(data);
    return await sancion.save();
  }

  async findSancionesJugadorEnSet(idpartido, numero_set, idjugador) {
    return await SancionesPartido.find({
      idpartido,
      numero_set,
      'sancionado.idjugador': idjugador
    });
  }

  async countAmariIlasJugador(idpartido, idjugador) {
    return await SancionesPartido.countDocuments({
      idpartido,
      'sancionado.idjugador': idjugador,
      tipo_sancion: 'penalty'
    });
  }
}

module.exports = new SancionesPartidoRepository();
