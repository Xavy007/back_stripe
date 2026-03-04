// services/mongodb/setsPartido.service.js
const setsPartidoRepo = require('../../repositories/mongodb/setsPartido.repository');
const partidoDigitalService = require('./partidoDigital.service');



class SetsPartidoService {
  
  async obtenerPorPartido(idpartido) {
    return await setsPartidoRepo.findByPartido(idpartido);
  }

  async obtenerSetActual(idpartido, numero_set) {
    const set = await setsPartidoRepo.findByPartidoYSet(idpartido, numero_set);
    
    if (!set) {
      throw new Error(`Set ${numero_set} del partido ${idpartido} no encontrado`);
    }
    
    return set;
  }

  async iniciarSet(idpartido, numero_set, equipoRecibidor) {
    // Verificar que el set no exista
    const existe = await setsPartidoRepo.findByPartidoYSet(idpartido, numero_set);
    if (existe) {
      throw new Error(`El set ${numero_set} ya fue iniciado`);
    }

    // Obtener configuración del partido
    const partido = await partidoDigitalService.obtenerPorId(idpartido);
    const config = partido.configuracion;

    // Determinar si es set decisivo
    const esSetDecisivo = numero_set === config.sets_maximos;
    const puntosNecesarios = esSetDecisivo 
      ? config.puntos_set_decisivo 
      : config.puntos_set_normal;

    return await setsPartidoRepo.create({
      idpartido,
      numero_set,
      es_set_decisivo: esSetDecisivo,
      puntos_necesarios_ganar: puntosNecesarios,
      equipo_recibidor_inicial: equipoRecibidor,
      estado: 'en_juego',
      'duracion.hora_inicio': new Date()
    });
  }

  async actualizarMarcador(idpartido, numero_set, puntos_local, puntos_visitante) {
    const set = await this.obtenerSetActual(idpartido, numero_set);

    // Actualizar marcador
    const actualizado = await setsPartidoRepo.updateMarcador(
      idpartido, 
      numero_set, 
      puntos_local, 
      puntos_visitante
    );

    // Verificar si el set terminó
    const puntosNecesarios = set.puntos_necesarios_ganar;
    const diferencia = Math.abs(puntos_local - puntos_visitante);

    if (
      (puntos_local >= puntosNecesarios || puntos_visitante >= puntosNecesarios) &&
      diferencia >= 2
    ) {
      const ganador = puntos_local > puntos_visitante ? 'local' : 'visitante';
      await this.finalizarSet(idpartido, numero_set, ganador);
    }

    return actualizado;
  }

  async finalizarSet(idpartido, numero_set, ganador) {
    const set = await setsPartidoRepo.finalizarSet(idpartido, numero_set, ganador);

    // Calcular duración
    const duracion = Math.floor(
      (new Date() - new Date(set.duracion.hora_inicio)) / 60000
    );

    await setsPartidoRepo.update(idpartido, numero_set, {
      'duracion.duracion_minutos': duracion
    });

    // Notificar al servicio de partido
    await partidoDigitalService.finalizarSet(idpartido, numero_set, ganador, 1);

    return set;
  }

  async incrementarPunto(idpartido, numero_set, equipo) {
    const set = await this.obtenerSetActual(idpartido, numero_set);

    const nuevoPuntosLocal = equipo === 'local' 
      ? set.puntos_local + 1 
      : set.puntos_local;
      
    const nuevoPuntosVisitante = equipo === 'visitante' 
      ? set.puntos_visitante + 1 
      : set.puntos_visitante;

    return await this.actualizarMarcador(
      idpartido, 
      numero_set, 
      nuevoPuntosLocal, 
      nuevoPuntosVisitante
    );
  }
}

module.exports = new SetsPartidoService();
