// repositories/mongodb/configuracionPuntos.repository.js
const ConfiguracionPuntos = require('../../models/mongodb/ConfiguracionPuntos');

class ConfiguracionPuntosRepository {
  
  async findByCampeonato(idcampeonato) {
    return await ConfiguracionPuntos.findOne({ 
      idcampeonato, 
      activo: true 
    }).lean();
  }

  async create(data) {
    const config = new ConfiguracionPuntos(data);
    return await config.save();
  }

  async update(idcampeonato, data) {
    return await ConfiguracionPuntos.findOneAndUpdate(
      { idcampeonato, activo: true },
      { 
        ...data,
        'modificado_por.timestamp': new Date()
      },
      { new: true, runValidators: true }
    );
  }

  async delete(idcampeonato) {
    return await ConfiguracionPuntos.findOneAndUpdate(
      { idcampeonato },
      { activo: false },
      { new: true }
    );
  }

  async findAll(filters = {}) {
    return await ConfiguracionPuntos.find({ 
      activo: true,
      ...filters 
    }).lean();
  }

  async setDefault(idcampeonato) {
    return await this.create({
      idcampeonato,
      puntos_victoria: 2,
      puntos_derrota: 1,
      puntos_wo_favor: 2,
      puntos_wo_contra: 0,
      configuracion_sets: {
        formato_partido: 'mejor_de_5',
        sets_maximos: 5,
        sets_para_ganar: 3,
        puntos_set_normal: 25,
        puntos_set_decisivo: 15,
        diferencia_minima: 2
      }
    });
  }
}

module.exports = new ConfiguracionPuntosRepository();
