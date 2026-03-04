// repositories/mongodb/timeoutsPartido.repository.js
const TimeoutsPartido = require('../../models/mongodb/TimeoutsPartido');

class TimeoutsPartidoRepository {
  
  async findByPartido(idpartido) {
    return await TimeoutsPartido.find({ idpartido })
      .sort({ numero_set: 1, timestamp_inicio: 1 });
  }

  async findByPartidoYSet(idpartido, numero_set) {
    return await TimeoutsPartido.find({ idpartido, numero_set })
      .sort({ timestamp_inicio: 1 });
  }

  async findByEquipo(idpartido, numero_set, equipo) {
    return await TimeoutsPartido.find({ 
      idpartido, 
      numero_set, 
      equipo,
      es_timeout_tecnico: false 
    }).sort({ timestamp_inicio: 1 });
  }

  async countByEquipoYSet(idpartido, numero_set, equipo) {
    return await TimeoutsPartido.countDocuments({ 
      idpartido, 
      numero_set, 
      equipo,
      es_timeout_tecnico: false 
    });
  }

  async create(data) {
    const timeout = new TimeoutsPartido(data);
    return await timeout.save();
  }

  async finalizarTimeout(idpartido, numero_set, numero_timeout, equipo) {
    return await TimeoutsPartido.findOneAndUpdate(
      { 
        idpartido, 
        numero_set, 
        numero_timeout, 
        equipo 
      },
      { 
        timestamp_fin: new Date() 
      },
      { new: true }
    );
  }

  async findTimeoutActivo(idpartido, numero_set) {
    return await TimeoutsPartido.findOne({
      idpartido,
      numero_set,
      timestamp_fin: null
    });
  }
}

module.exports = new TimeoutsPartidoRepository();
