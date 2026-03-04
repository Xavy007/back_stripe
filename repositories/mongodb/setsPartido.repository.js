// repositories/mongodb/setsPartido.repository.js
const SetsPartido = require('../../models/mongodb/SetsPartido');

class SetsPartidoRepository {
  
  async findByPartido(idpartido) {
    return await SetsPartido.find({ idpartido }).sort({ numero_set: 1 });
  }

  async findByPartidoYSet(idpartido, numero_set) {
    return await SetsPartido.findOne({ idpartido, numero_set });
  }

  async create(data) {
    const set = new SetsPartido(data);
    return await set.save();
  }

  async update(idpartido, numero_set, data) {
    return await SetsPartido.findOneAndUpdate(
      { idpartido, numero_set },
      data,
      { new: true, runValidators: true }
    );
  }

  async updateMarcador(idpartido, numero_set, puntos_local, puntos_visitante) {
    return await SetsPartido.findOneAndUpdate(
      { idpartido, numero_set },
      { puntos_local, puntos_visitante },
      { new: true }
    );
  }

  async finalizarSet(idpartido, numero_set, ganador) {
    return await SetsPartido.findOneAndUpdate(
      { idpartido, numero_set },
      {
        ganador,
        estado: 'finalizado',
        'duracion.hora_fin': new Date()
      },
      { new: true }
    );
  }
}

module.exports = new SetsPartidoRepository();
