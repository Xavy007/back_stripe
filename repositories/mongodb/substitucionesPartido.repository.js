// repositories/mongodb/substitucionesPartido.repository.js
const SubstitucionesPartido = require('../../models/mongodb/SubstitucionesPartido');

class SubstitucionesPartidoRepository {
  
  async findByPartido(idpartido) {
    return await SubstitucionesPartido.find({ idpartido })
      .sort({ numero_set: 1, timestamp: 1 });
  }

  async findByPartidoYSet(idpartido, numero_set) {
    return await SubstitucionesPartido.find({ idpartido, numero_set })
      .sort({ timestamp: 1 });
  }

  async findByEquipo(idpartido, numero_set, equipo) {
    return await SubstitucionesPartido.find({ 
      idpartido, 
      numero_set, 
      equipo 
    }).sort({ timestamp: 1 });
  }

  async countByEquipoYSet(idpartido, numero_set, equipo) {
    return await SubstitucionesPartido.countDocuments({ 
      idpartido, 
      numero_set, 
      equipo,
      cuenta_en_limite: true 
    });
  }

  async create(data) {
    const sustitucion = new SubstitucionesPartido(data);
    return await sustitucion.save();
  }

  async findByJugador(idpartido, dorsal) {
    return await SubstitucionesPartido.find({
      idpartido,
      $or: [
        { 'jugador_sale.dorsal': dorsal },
        { 'jugador_entra.dorsal': dorsal }
      ]
    });
  }

  async findUltimaSustitucion(idpartido, numero_set, equipo) {
    return await SubstitucionesPartido.findOne({ 
      idpartido, 
      numero_set, 
      equipo 
    }).sort({ timestamp: -1 });
  }
}

module.exports = new SubstitucionesPartidoRepository();
