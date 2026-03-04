// repositories/mongodb/estadisticasJugadores.repository.js
const EstadisticasJugadoresPartido = require('../../models/mongodb/EstadisticasJugadoresPartido');

class EstadisticasJugadoresRepository {
  
  async findByPartido(idpartido) {
    return await EstadisticasJugadoresPartido.find({ idpartido })
      .sort({ puntos_anotados: -1 });
  }

  async findByPartidoYEquipo(idpartido, equipo) {
    return await EstadisticasJugadoresPartido.find({ idpartido, equipo })
      .sort({ puntos_anotados: -1 });
  }

  async findByPartidoYJugador(idpartido, idjugador) {
    return await EstadisticasJugadoresPartido.findOne({ idpartido, idjugador });
  }

  async findByDorsal(idpartido, equipo, dorsal) {
    return await EstadisticasJugadoresPartido.findOne({ 
      idpartido, 
      equipo, 
      dorsal 
    });
  }

  async create(data) {
    const stats = new EstadisticasJugadoresPartido(data);
    return await stats.save();
  }

  async update(idpartido, idjugador, data) {
    return await EstadisticasJugadoresPartido.findOneAndUpdate(
      { idpartido, idjugador },
      data,
      { new: true, runValidators: true }
    );
  }

  async incrementar(idpartido, idjugador, campo, valor = 1) {
    return await EstadisticasJugadoresPartido.findOneAndUpdate(
      { idpartido, idjugador },
      { $inc: { [campo]: valor } },
      { new: true }
    );
  }

  async findMVP(idpartido) {
    return await EstadisticasJugadoresPartido.findOne({ 
      idpartido, 
      'reconocimientos.es_mvp': true 
    });
  }

  async findTopScorers(idpartido, limit = 5) {
    return await EstadisticasJugadoresPartido.find({ idpartido })
      .sort({ puntos_anotados: -1 })
      .limit(limit);
  }

  async findTopAtacantes(idpartido, limit = 5) {
    return await EstadisticasJugadoresPartido.find({ idpartido })
      .sort({ 'ataque.exitosos': -1 })
      .limit(limit);
  }

  async findTopBloqueadores(idpartido, limit = 5) {
    return await EstadisticasJugadoresPartido.find({ idpartido })
      .sort({ 'bloqueo.total_puntos': -1 })
      .limit(limit);
  }
}

module.exports = new EstadisticasJugadoresRepository();
