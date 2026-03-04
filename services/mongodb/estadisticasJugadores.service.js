// services/mongodb/estadisticasJugadores.service.js
const estadisticasRepo = require('../../repositories/mongodb/estadisticasJugadores.repository');
const partidoDigitalService = require('./partidoDigital.service');

class EstadisticasJugadoresService {
  
  async obtenerOCrear(idpartido, equipo, dorsal) {
    let stats = await estadisticasRepo.findByDorsal(idpartido, equipo, dorsal);

    if (!stats) {
      // Obtener info del jugador desde PartidoDigital
      const partido = await partidoDigitalService.obtenerPorId(idpartido);
      
      const jugador = partido.planteles[equipo].jugadores.find(
        j => j.numero_dorsal === dorsal
      );

      if (!jugador) {
        throw new Error(`Jugador con dorsal ${dorsal} no encontrado en ${equipo}`);
      }

      stats = await estadisticasRepo.create({
        idpartido,
        equipo,
        dorsal,
        idjugador: jugador.idjugador,
        idparticipacion: jugador.idparticipacion,
        nombre_completo: jugador.nombre_completo,
        posicion: jugador.posicion
      });
    }

    return stats;
  }

  async incrementarAtaque(idpartido, equipo, dorsal, tipo) {
    const stats = await this.obtenerOCrear(idpartido, equipo, dorsal);

    stats.ataque.intentos += 1;

    switch (tipo) {
      case 'exitoso':
        stats.ataque.exitosos += 1;
        stats.puntos_anotados += 1;
        stats.puntos_por_concepto.ataque += 1;
        break;
      case 'bloqueado':
        stats.ataque.bloqueados += 1;
        break;
      case 'error':
        stats.ataque.errores += 1;
        break;
    }

    return await stats.save();
  }

  async incrementarSaque(idpartido, equipo, dorsal, tipo) {
    const stats = await this.obtenerOCrear(idpartido, equipo, dorsal);

    stats.saque.intentos += 1;

    if (tipo === 'ace') {
      stats.saque.aces += 1;
      stats.saque.puntos_directos += 1;
      stats.puntos_anotados += 1;
      stats.puntos_por_concepto.saque += 1;
    } else if (tipo === 'error') {
      stats.saque.errores += 1;
    }

    return await stats.save();
  }

  async incrementarBloqueo(idpartido, equipo, dorsal, tipo) {
    const stats = await this.obtenerOCrear(idpartido, equipo, dorsal);

    if (tipo === 'solo') {
      stats.bloqueo.solos += 1;
      stats.bloqueo.total_puntos += 1;
      stats.puntos_anotados += 1;
      stats.puntos_por_concepto.bloqueo += 1;
    } else if (tipo === 'asistido') {
      stats.bloqueo.asistidos += 1;
      stats.bloqueo.total_puntos += 1;
      stats.puntos_anotados += 1;
      stats.puntos_por_concepto.bloqueo += 1;
    } else if (tipo === 'toque') {
      stats.bloqueo.toques += 1;
    } else if (tipo === 'error') {
      stats.bloqueo.errores += 1;
    }

    return await stats.save();
  }

  async incrementarRecepcion(idpartido, equipo, dorsal, calidad) {
    const stats = await this.obtenerOCrear(idpartido, equipo, dorsal);

    stats.recepcion.intentos += 1;

    switch (calidad) {
      case 3: // Perfecta
        stats.recepcion.perfectas += 1;
        break;
      case 2: // Buena
        stats.recepcion.buenas += 1;
        break;
      case 1: // Mala
        stats.recepcion.malas += 1;
        break;
      case 0: // Error
        stats.recepcion.errores += 1;
        break;
    }

    return await stats.save();
  }

  async incrementarDefensa(idpartido, equipo, dorsal, exitosa) {
    const stats = await this.obtenerOCrear(idpartido, equipo, dorsal);

    stats.defensa.intentos += 1;

    if (exitosa) {
      stats.defensa.exitosas += 1;
    } else {
      stats.defensa.errores += 1;
    }

    return await stats.save();
  }

  async incrementarArmado(idpartido, equipo, dorsal, tipo) {
    const stats = await this.obtenerOCrear(idpartido, equipo, dorsal);

    stats.armado.sets_armados += 1;

    if (tipo === 'asistencia') {
      stats.armado.asistencias += 1;
    } else if (tipo === 'error') {
      stats.armado.errores += 1;
    }

    return await stats.save();
  }

  async registrarSancion(idpartido, equipo, dorsal, tipo_sancion) {
    const stats = await this.obtenerOCrear(idpartido, equipo, dorsal);

    switch (tipo_sancion) {
      case 'advertencia':
        stats.sanciones.advertencias += 1;
        break;
      case 'penalty':
        stats.sanciones.amarillas += 1;
        break;
      case 'expulsion':
      case 'descalificacion':
        stats.sanciones.rojas += 1;
        break;
    }

    return await stats.save();
  }

  async recalcularEfectividades(idpartido) {
    const todasLasStats = await estadisticasRepo.findByPartido(idpartido);

    for (const stat of todasLasStats) {
      await stat.calcularEfectividades();
    }
  }

  async calcularMVP(idpartido) {
    const stats = await estadisticasRepo.findByPartido(idpartido);

    if (stats.length === 0) return;

    // MVP: Jugador con más puntos
    const mvp = stats[0];
    mvp.reconocimientos.es_mvp = true;
    await mvp.save();

    // Mejor atacante
    const mejorAtacante = [...stats].sort(
      (a, b) => b.ataque.exitosos - a.ataque.exitosos
    )[0];
    mejorAtacante.reconocimientos.mejor_atacante = true;
    await mejorAtacante.save();

    // Mejor bloqueador
    const mejorBloqueador = [...stats].sort(
      (a, b) => b.bloqueo.total_puntos - a.bloqueo.total_puntos
    )[0];
    mejorBloqueador.reconocimientos.mejor_bloqueador = true;
    await mejorBloqueador.save();

    // Mejor sacador
    const mejorSacador = [...stats].sort(
      (a, b) => b.saque.aces - a.saque.aces
    )[0];
    mejorSacador.reconocimientos.mejor_sacador = true;
    await mejorSacador.save();

    // Mejor defensor
    const mejorDefensor = [...stats].sort(
      (a, b) => b.defensa.exitosas - a.defensa.exitosas
    )[0];
    mejorDefensor.reconocimientos.mejor_defensor = true;
    await mejorDefensor.save();
  }

  async obtenerEstadisticasPartido(idpartido) {
    return await estadisticasRepo.findByPartido(idpartido);
  }

  async obtenerEstadisticasEquipo(idpartido, equipo) {
    return await estadisticasRepo.findByPartidoYEquipo(idpartido, equipo);
  }

  async obtenerEstadisticasJugador(idpartido, idjugador) {
    return await estadisticasRepo.findByPartidoYJugador(idpartido, idjugador);
  }

  async obtenerTopScorers(idpartido, limit = 5) {
    return await estadisticasRepo.findTopScorers(idpartido, limit);
  }
}

module.exports = new EstadisticasJugadoresService();
