// services/mongodb/configuracionPuntos.service.js
const configuracionPuntosRepo = require('../../repositories/mongodb/configuracionPuntos.repository');

class ConfiguracionPuntosService {
  
  async obtenerPorCampeonato(idcampeonato) {
    const config = await configuracionPuntosRepo.findByCampeonato(idcampeonato);
    
    if (!config) {
      throw new Error(`No existe configuración de puntos para el campeonato ${idcampeonato}`);
    }
    
    return config;
  }

  async crear(idcampeonato, configuracion, userId) {
    // Verificar que no exista
    const existe = await configuracionPuntosRepo.findByCampeonato(idcampeonato);
    if (existe) {
      throw new Error(`Ya existe configuración para el campeonato ${idcampeonato}`);
    }

    return await configuracionPuntosRepo.create({
      idcampeonato,
      ...configuracion,
      modificado_por: {
        usuario_id: userId,
        timestamp: new Date()
      }
    });
  }

  async actualizar(idcampeonato, cambios, userId) {
    const actualizado = await configuracionPuntosRepo.update(idcampeonato, {
      ...cambios,
      modificado_por: {
        usuario_id: userId,
        timestamp: new Date()
      }
    });

    if (!actualizado) {
      throw new Error(`No se encontró configuración para el campeonato ${idcampeonato}`);
    }

    return actualizado;
  }

  async eliminar(idcampeonato) {
    return await configuracionPuntosRepo.delete(idcampeonato);
  }

  async crearPorDefecto(idcampeonato) {
    return await configuracionPuntosRepo.setDefault(idcampeonato);
  }

  async validarConfiguracion(configuracion) {
    const { formato_partido, sets_maximos, sets_para_ganar } = configuracion.configuracion_sets;

    if (formato_partido === 'mejor_de_3' && (sets_maximos !== 3 || sets_para_ganar !== 2)) {
      throw new Error('Configuración inválida: mejor_de_3 requiere sets_maximos=3 y sets_para_ganar=2');
    }

    if (formato_partido === 'mejor_de_5' && (sets_maximos !== 5 || sets_para_ganar !== 3)) {
      throw new Error('Configuración inválida: mejor_de_5 requiere sets_maximos=5 y sets_para_ganar=3');
    }

    return true;
  }
}

module.exports = new ConfiguracionPuntosService();
