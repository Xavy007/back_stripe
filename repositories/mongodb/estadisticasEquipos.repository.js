// repositories/mongodb/estadisticasEquipos.repository.js
const EstadisticasEquiposPartido = require('../../models/mongodb/EstadisticasEquiposPartido');

class EstadisticasEquiposRepository {
  
  async findByPartido(idpartido) {
    return await EstadisticasEquiposPartido.find({ idpartido });
  }

  async findByPartidoYEquipo(idpartido, equipo) {
    return await EstadisticasEquiposPartido.findOne({ idpartido, equipo });
  }

  async create(data) {
    const stats = new EstadisticasEquiposPartido(data);
    return await stats.save();
  }

  async update(idpartido, equipo, data) {
    return await EstadisticasEquiposPartido.findOneAndUpdate(
      { idpartido, equipo },
      data,
      { new: true, runValidators: true }
    );
  }

  async incrementar(idpartido, equipo, campo, valor = 1) {
    return await EstadisticasEquiposPartido.findOneAndUpdate(
      { idpartido, equipo },
      { $inc: { [campo]: valor } },
      { new: true }
    );
  }
}

module.exports = new EstadisticasEquiposRepository();
