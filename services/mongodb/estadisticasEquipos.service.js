// services/mongodb/estadisticasEquipos.service.js
const estadisticasEquiposRepo = require('../../repositories/mongodb/estadisticasEquipos.repository');
const partidoDigitalService = require('./partidoDigital.service');

class EstadisticasEquiposService {
  
  async obtenerOCrear(idpartido, equipo) {
    let stats = await estadisticasEquiposRepo.findByPartidoYEquipo(idpartido, equipo);

    if (!stats) {
      const partido = await partidoDigitalService.obtenerPorId(idpartido);
      
      const infoEquipo = partido.equipos[equipo];

      stats = await estadisticasEquiposRepo.create({
        idpartido,
        equipo,
        idequipo: infoEquipo.idequipo,
        nombre_equipo: infoEquipo.nombre
      });
    }

    return stats;
  }

  async actualizarDesdeJugadores(idpartido) {
    const EstadisticasJugadoresService = require('./estadisticasJugadores.service');

    for (const equipo of ['local', 'visitante']) {
      const statsEquipo = await this.obtenerOCrear(idpartido, equipo);
      const statsJugadores = await EstadisticasJugadoresService.obtenerEstadisticasEquipo(
        idpartido, 
        equipo
      );

      // Sumar estadísticas de todos los jugadores
      let totalAtaqueIntentos = 0;
      let totalAtaqueExitosos = 0;
      let totalAtaqueBloqueados = 0;
      let totalAtaqueErrores = 0;

      let totalSaques = 0;
      let totalAces = 0;
      let totalErroresSaque = 0;

      let totalBloqueosExitosos = 0;
      let totalBloqueosToques = 0;
      let totalBloqueosErrores = 0;

      let totalRecepcionIntentos = 0;
      let totalRecepcionPerfectas = 0;
      let totalRecepcionBuenas = 0;
      let totalRecepcionMalas = 0;
      let totalRecepcionErrores = 0;

      for (const jugador of statsJugadores) {
        totalAtaqueIntentos += jugador.ataque.intentos;
        totalAtaqueExitosos += jugador.ataque.exitosos;
        totalAtaqueBloqueados += jugador.ataque.bloqueados;
        totalAtaqueErrores += jugador.ataque.errores;

        totalSaques += jugador.saque.intentos;
        totalAces += jugador.saque.aces;
        totalErroresSaque += jugador.saque.errores;

        totalBloqueosExitosos += jugador.bloqueo.total_puntos;
        totalBloqueosToques += jugador.bloqueo.toques;
        totalBloqueosErrores += jugador.bloqueo.errores;

        totalRecepcionIntentos += jugador.recepcion.intentos;
        totalRecepcionPerfectas += jugador.recepcion.perfectas;
        totalRecepcionBuenas += jugador.recepcion.buenas;
        totalRecepcionMalas += jugador.recepcion.malas;
        totalRecepcionErrores += jugador.recepcion.errores;
      }

      // Actualizar estadísticas del equipo
      await estadisticasEquiposRepo.update(idpartido, equipo, {
        'ataque.total_intentos': totalAtaqueIntentos,
        'ataque.exitosos': totalAtaqueExitosos,
        'ataque.bloqueados': totalAtaqueBloqueados,
        'ataque.errores': totalAtaqueErrores,
        'ataque.puntos_ataque': totalAtaqueExitosos,

        'saque.total_saques': totalSaques,
        'saque.aces': totalAces,
        'saque.errores': totalErroresSaque,

        'bloqueo.exitosos': totalBloqueosExitosos,
        'bloqueo.toques': totalBloqueosToques,
        'bloqueo.errores': totalBloqueosErrores,
        'bloqueo.puntos_bloqueo': totalBloqueosExitosos,

        'recepcion.total_recepciones': totalRecepcionIntentos,
        'recepcion.perfectas': totalRecepcionPerfectas,
        'recepcion.buenas': totalRecepcionBuenas,
        'recepcion.malas': totalRecepcionMalas,
        'recepcion.errores': totalRecepcionErrores,

        'errores.saque': totalErroresSaque,
        'errores.ataque': totalAtaqueErrores,
        'errores.bloqueo': totalBloqueosErrores,
        'errores.recepcion': totalRecepcionErrores
      });

      // Calcular efectividades
      await statsEquipo.calcularEfectividades();
    }
  }

  async obtenerEstadisticasEquipo(idpartido, equipo) {
    return await estadisticasEquiposRepo.findByPartidoYEquipo(idpartido, equipo);
  }

  async obtenerComparativa(idpartido) {
    const statsLocal = await this.obtenerEstadisticasEquipo(idpartido, 'local');
    const statsVisitante = await this.obtenerEstadisticasEquipo(idpartido, 'visitante');

    return {
      local: statsLocal,
      visitante: statsVisitante,
      comparativa: {
        diferencia_puntos: statsLocal.generales.puntos_totales - statsVisitante.generales.puntos_totales,
        diferencia_aces: statsLocal.saque.aces - statsVisitante.saque.aces,
        diferencia_bloqueos: statsLocal.bloqueo.exitosos - statsVisitante.bloqueo.exitosos,
        diferencia_errores: statsLocal.errores.total - statsVisitante.errores.total
      }
    };
  }
}

module.exports = new EstadisticasEquiposService();
