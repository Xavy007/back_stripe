// services/mongodb/eventosPartido.service.js
const eventosPartidoRepo = require('../../repositories/mongodb/eventosPartido.repository');
const setsPartidoService = require('./setsPartido.service');
const estadisticasService = require('./estadisticasPartido.service');

class EventosPartidoService {
  
  async registrarPunto(idpartido, numero_set, puntoData, userId) {
    // Obtener siguiente secuencia
    const ultimoEvento = await eventosPartidoRepo.findUltimoEvento(idpartido, numero_set);
    const secuencia = ultimoEvento ? ultimoEvento.secuencia + 1 : 1;

    // Obtener marcador actual
    const set = await setsPartidoService.obtenerSetActual(idpartido, numero_set);
    
    // Incrementar punto del equipo que anotó
    const equipoAnota = puntoData.resultado.equipo_anota;
    await setsPartidoService.incrementarPunto(idpartido, numero_set, equipoAnota);

    // Obtener nuevo marcador
    const setActualizado = await setsPartidoService.obtenerSetActual(idpartido, numero_set);

    // Crear evento
    const evento = await eventosPartidoRepo.create({
      idpartido,
      numero_set,
      secuencia,
      tipo_evento: 'punto',
      punto: puntoData,
      marcador: {
        local: setActualizado.puntos_local,
        visitante: setActualizado.puntos_visitante
      },
      registrado_por: {
        usuario_id: userId,
        timestamp: new Date()
      }
    });

    // ⭐ Actualizar estadísticas automáticamente
    await estadisticasService.actualizarEstadisticasDesdeEvento(evento);

    return evento;
  }

  async registrarEvento(idpartido, numero_set, tipo_evento, datos, userId) {
    const ultimoEvento = await eventosPartidoRepo.findUltimoEvento(idpartido, numero_set);
    const secuencia = ultimoEvento ? ultimoEvento.secuencia + 1 : 1;

    return await eventosPartidoRepo.create({
      idpartido,
      numero_set,
      secuencia,
      tipo_evento,
      datos_evento: datos,
      registrado_por: {
        usuario_id: userId,
        timestamp: new Date()
      }
    });
  }

  async obtenerEventosPartido(idpartido) {
    return await eventosPartidoRepo.findByPartido(idpartido);
  }

  async obtenerEventosSet(idpartido, numero_set) {
    return await eventosPartidoRepo.findByPartidoYSet(idpartido, numero_set);
  }

  async obtenerEventosJugador(idpartido, dorsal) {
    return await eventosPartidoRepo.findEventosPorJugador(idpartido, dorsal);
  }

  async obtenerResumenEventos(idpartido) {
    const eventos = await this.obtenerEventosPartido(idpartido);

    const resumen = {
      total_eventos: eventos.length,
      puntos: eventos.filter(e => e.tipo_evento === 'punto').length,
      timeouts: eventos.filter(e => e.tipo_evento === 'timeout').length,
      substituciones: eventos.filter(e => e.tipo_evento === 'sustitucion').length,
      sanciones: eventos.filter(e => e.tipo_evento === 'sancion').length
    };

    return resumen;
  }
}

module.exports = new EventosPartidoService();
