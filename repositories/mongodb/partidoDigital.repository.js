// repositories/mongodb/partidoDigital.repository.js
const PartidoDigital = require('../../models/mongodb/PartidoDigital');
const normalizarObservaciones = require('../../utils/normalizarObservaciones')

class PartidoDigitalRepository {
  
  async findByIdPartido(idpartido) {
    //return await PartidoDigital.findOne({ idpartido });
      const partido = await PartidoDigital.findOne({ idpartido }).lean(false); // que venga como documento Mongoose
  if (!partido) {
    throw new Error('Partido no encontrado');
  }

  normalizarObservaciones(partido);

  return partido;
  }

  async create(data) {
    const partido = new PartidoDigital(data);
    return await partido.save();
  }

  async update(idpartido, data) {
    return await PartidoDigital.findOneAndUpdate(
      { idpartido },
      data,
      { new: true, runValidators: true }
    );
  }

  async updateEstado(idpartido, nuevoEstado) {
    return await PartidoDigital.findOneAndUpdate(
      { idpartido },
      { 'estado_partido.tipo': nuevoEstado },
      { new: true }
    );
  }

  async updateResultado(idpartido, resultado) {
    return await PartidoDigital.findOneAndUpdate(
      { idpartido },
      { resultado },
      { new: true }
    );
  }

  async findByCampeonato(idcampeonato) {
    return await PartidoDigital.find({ 
      'info_general.idcampeonato': idcampeonato 
    }).sort({ 'info_general.fecha_programada': -1 });
  }

  async findEnVivo() {
    return await PartidoDigital.find({ 
      'estado_partido.tipo': { $in: ['en_juego', 'timeout', 'entre_sets'] }
    });
  }

  async cerrarPlanilla(idpartido, datosAprobacion) {
    return await PartidoDigital.findOneAndUpdate(
      { idpartido },
      {
        'aprobaciones.planilla_cerrada': true,
        'aprobaciones.fecha_cierre': new Date(),
        ...datosAprobacion
      },
      { new: true }
    );
  }

  async addModificacion(idpartido, modificacion) {
    return await PartidoDigital.findOneAndUpdate(
      { idpartido },
      { 
        $push: { modificaciones: modificacion },
        $inc: { version: 1 }
      },
      { new: true }
    );
  }
}

module.exports = new PartidoDigitalRepository();
