// services/mongodb/estadisticasPartido.service.js
const EventosPartido = require('../../models/mongodb/EventosPartido');
const estadisticasJugadoresService = require('./estadisticasJugadores.service');
const estadisticasEquiposService = require('./estadisticasEquipos.service');

class EstadisticasPartidoService {
  
  /**
   * Actualiza todas las estadísticas cuando se registra un evento
   */
  async actualizarEstadisticasDesdeEvento(evento) {
    if (evento.tipo_evento !== 'punto' || !evento.punto) return;

    const { punto } = evento;
    const { equipo_saca, jugador_saca, resultado } = punto;
    const { equipo_anota, tipo_punto, jugador_anota, jugador_asiste } = resultado;

    // SAQUE
    if (jugador_saca) {
      const equipoGano = equipo_anota === equipo_saca;
      
      if (tipo_punto === 'ace') {
        await estadisticasJugadoresService.incrementarSaque(
          evento.idpartido,
          equipo_saca,
          jugador_saca,
          'ace'
        );
      } else if (!equipoGano && tipo_punto.includes('error_saque')) {
        await estadisticasJugadoresService.incrementarSaque(
          evento.idpartido,
          equipo_saca,
          jugador_saca,
          'error'
        );
      } else {
        await estadisticasJugadoresService.incrementarSaque(
          evento.idpartido,
          equipo_saca,
          jugador_saca,
          'neutral'
        );
      }
    }

    // ATAQUE
    if (jugador_anota && tipo_punto === 'ataque_exitoso') {
      await estadisticasJugadoresService.incrementarAtaque(
        evento.idpartido,
        equipo_anota,
        jugador_anota,
        'exitoso'
      );
    }

    // BLOQUEO
    if (jugador_anota && tipo_punto === 'bloqueo_exitoso') {
      await estadisticasJugadoresService.incrementarBloqueo(
        evento.idpartido,
        equipo_anota,
        jugador_anota,
        'solo'
      );
    }

    // ASISTENCIAS
    if (jugador_asiste && tipo_punto === 'ataque_exitoso') {
      await estadisticasJugadoresService.incrementarArmado(
        evento.idpartido,
        equipo_anota,
        jugador_asiste,
        'asistencia'
      );
    }

    // Recalcular efectividades
    await estadisticasJugadoresService.recalcularEfectividades(evento.idpartido);
  }

  /**
   * Genera todas las estadísticas al finalizar el partido
   */
  async generarEstadisticasFinales(idpartido) {
    // 1. Recalcular efectividades de jugadores
    await estadisticasJugadoresService.recalcularEfectividades(idpartido);

    // 2. Calcular MVP y reconocimientos
    await estadisticasJugadoresService.calcularMVP(idpartido);

    // 3. Consolidar estadísticas de equipos
    await estadisticasEquiposService.actualizarDesdeJugadores(idpartido);

    // 4. Sincronizar con PostgreSQL
    await this.sincronizarConPostgreSQL(idpartido);
  }

  /**
   * Sincroniza estadísticas con PostgreSQL
   */
  async sincronizarConPostgreSQL(idpartido) {
    const { Participaciones } = require('../../models');
    const stats = await estadisticasJugadoresService.obtenerEstadisticasPartido(idpartido);

    for (const stat of stats) {
      if (!stat.idparticipacion) continue;

      await Participaciones.increment(
        {
          cantidadpartidos: 1,
          cantidadgoles: stat.puntos_anotados,
          tarjetas: stat.sanciones.amarillas + stat.sanciones.rojas
        },
        { where: { idparticipacion: stat.idparticipacion } }
      );
    }
  }
}

module.exports = new EstadisticasPartidoService();
