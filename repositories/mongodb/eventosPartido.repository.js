// repositories/mongodb/eventosPartido.repository.js
const EventosPartido = require('../../models/mongodb/EventosPartido');

class EventosPartidoRepository {
  
  async findByPartido(idpartido) {
    return await EventosPartido.find({ idpartido })
      .sort({ numero_set: 1, secuencia: 1 });
  }

  async findByPartidoYSet(idpartido, numero_set) {
    return await EventosPartido.find({ idpartido, numero_set })
      .sort({ secuencia: 1 });
  }

  async findUltimoEvento(idpartido, numero_set) {
    return await EventosPartido.findOne({ idpartido, numero_set })
      .sort({ secuencia: -1 });
  }

  async create(data) {
    const evento = new EventosPartido(data);
    return await evento.save();
  }

  async countByPartidoYSet(idpartido, numero_set) {
    return await EventosPartido.countDocuments({ idpartido, numero_set });
  }

  async findEventosPorJugador(idpartido, dorsal) {
    return await EventosPartido.find({
      idpartido,
      $or: [
        { 'punto.jugador_saca': dorsal },
        { 'punto.resultado.jugador_anota': dorsal },
        { 'punto.resultado.jugador_asiste': dorsal }
      ]
    });
  }

  async findEventosPorTipo(idpartido, tipo_evento) {
    return await EventosPartido.find({ idpartido, tipo_evento });
  }
}

module.exports = new EventosPartidoRepository();
