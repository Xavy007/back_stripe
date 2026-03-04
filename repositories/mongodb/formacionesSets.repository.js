// repositories/mongodb/formacionesSets.repository.js
const FormacionesSets = require('../../models/mongodb/FormacionesSets');

class FormacionesSetsRepository {
  
  async findByPartidoYSet(idpartido, numero_set) {
    return await FormacionesSets.findOne({ idpartido, numero_set });
  }

  async findByPartido(idpartido) {
    return await FormacionesSets.find({ idpartido }).sort({ numero_set: 1 });
  }

  async create(data) {
    const formacion = new FormacionesSets(data);
    return await formacion.save();
  }

  async update(idpartido, numero_set, data) {
    return await FormacionesSets.findOneAndUpdate(
      { idpartido, numero_set },
      data,
      { new: true, runValidators: true }
    );
  }

  async confirmar(idpartido, numero_set, equipo, userId) {
    const campo = equipo === 'local' 
      ? 'confirmaciones.local' 
      : 'confirmaciones.visitante';

    return await FormacionesSets.findOneAndUpdate(
      { idpartido, numero_set },
      {
        [`${campo}.confirmado`]: true,
        [`${campo}.timestamp`]: new Date(),
        [`${campo}.usuario_id`]: userId
      },
      { new: true }
    );
  }

  async updateEstado(idpartido, numero_set, nuevoEstado) {
    return await FormacionesSets.findOneAndUpdate(
      { idpartido, numero_set },
      { estado: nuevoEstado },
      { new: true }
    );
  }
}

module.exports = new FormacionesSetsRepository();
