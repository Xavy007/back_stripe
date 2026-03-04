// services/mongodb/reporteService.js
const EstadisticasJugadoresPartido = require('../../models/mongodb/EstadisticasJugadoresPartido');
const EstadisticasEquiposPartido = require('../../models/mongodb/EstadisticasEquiposPartido');
const SancionesPartido = require('../../models/mongodb/SancionesPartido');
const PartidoDigital = require('../../models/mongodb/PartidoDigital');
const SetsPartido = require('../../models/mongodb/SetsPartido');

/**
 * REPORTE 1: Top Goleadores / Anotadores
 * Ranking de jugadores por puntos anotados en un campeonato/categoría
 */
const obtenerTopGoleadores = async (filtros = {}) => {
  const { idcampeonato, idcategoria, limite = 20 } = filtros;

  // Primero obtener los IDs de partidos del campeonato/categoría
  const matchPartidos = {};
  if (idcampeonato) matchPartidos['info_general.idcampeonato'] = parseInt(idcampeonato);
  if (idcategoria) matchPartidos['info_general.idcategoria'] = parseInt(idcategoria);
  matchPartidos['estado_partido.tipo'] = 'finalizado';

  const partidos = await PartidoDigital.find(matchPartidos).select('idpartido');
  const idsPartidos = partidos.map(p => p.idpartido);

  if (idsPartidos.length === 0) {
    return {
      campeonato: idcampeonato,
      categoria: idcategoria,
      total_partidos: 0,
      goleadores: []
    };
  }

  // Agregar estadísticas de jugadores
  const goleadores = await EstadisticasJugadoresPartido.aggregate([
    {
      $match: {
        idpartido: { $in: idsPartidos }
      }
    },
    {
      $group: {
        _id: '$idjugador',
        nombre: { $first: '$nombre_completo' },
        dorsal: { $first: '$dorsal' },
        posicion: { $first: '$posicion' },
        partidos_jugados: { $sum: 1 },
        puntos_totales: { $sum: '$puntos_anotados' },
        puntos_ataque: { $sum: '$puntos_por_concepto.ataque' },
        puntos_bloqueo: { $sum: '$puntos_por_concepto.bloqueo' },
        puntos_saque: { $sum: '$puntos_por_concepto.saque' },
        aces_totales: { $sum: '$saque.aces' },
        bloqueos_totales: { $sum: '$bloqueo.total_puntos' },
        ataques_exitosos: { $sum: '$ataque.exitosos' },
        ataques_intentos: { $sum: '$ataque.intentos' }
      }
    },
    {
      $addFields: {
        promedio_puntos: {
          $cond: [
            { $gt: ['$partidos_jugados', 0] },
            { $round: [{ $divide: ['$puntos_totales', '$partidos_jugados'] }, 2] },
            0
          ]
        },
        efectividad_ataque: {
          $cond: [
            { $gt: ['$ataques_intentos', 0] },
            { $round: [{ $multiply: [{ $divide: ['$ataques_exitosos', '$ataques_intentos'] }, 100] }, 2] },
            0
          ]
        }
      }
    },
    {
      $sort: { puntos_totales: -1 }
    },
    {
      $limit: parseInt(limite)
    },
    {
      $project: {
        _id: 0,
        posicion_ranking: { $literal: 0 }, // Se calculará después
        idjugador: '$_id',
        nombre: 1,
        dorsal: 1,
        posicion: 1,
        partidos_jugados: 1,
        puntos_totales: 1,
        promedio_puntos: 1,
        desglose: {
          ataque: '$puntos_ataque',
          bloqueo: '$puntos_bloqueo',
          saque: '$puntos_saque'
        },
        estadisticas: {
          aces: '$aces_totales',
          bloqueos: '$bloqueos_totales',
          efectividad_ataque: '$efectividad_ataque'
        }
      }
    }
  ]);

  // Agregar posición de ranking
  goleadores.forEach((g, index) => {
    g.posicion_ranking = index + 1;
  });

  return {
    campeonato: idcampeonato,
    categoria: idcategoria,
    total_partidos: idsPartidos.length,
    fecha_generacion: new Date(),
    goleadores
  };
};

/**
 * REPORTE 2: Estadísticas de Equipos
 * Stats agregadas de todos los equipos en un campeonato/categoría
 */
const obtenerEstadisticasEquipos = async (filtros = {}) => {
  const { idcampeonato, idcategoria } = filtros;

  // Obtener partidos del campeonato
  const matchPartidos = {};
  if (idcampeonato) matchPartidos['info_general.idcampeonato'] = parseInt(idcampeonato);
  if (idcategoria) matchPartidos['info_general.idcategoria'] = parseInt(idcategoria);
  matchPartidos['estado_partido.tipo'] = 'finalizado';

  const partidos = await PartidoDigital.find(matchPartidos).select('idpartido');
  const idsPartidos = partidos.map(p => p.idpartido);

  if (idsPartidos.length === 0) {
    return {
      campeonato: idcampeonato,
      categoria: idcategoria,
      total_partidos: 0,
      equipos: []
    };
  }

  // Agregar estadísticas por equipo
  const equipos = await EstadisticasEquiposPartido.aggregate([
    {
      $match: {
        idpartido: { $in: idsPartidos }
      }
    },
    {
      $group: {
        _id: '$idequipo',
        nombre_equipo: { $first: '$nombre_equipo' },
        partidos_jugados: { $sum: 1 },
        // Generales
        puntos_a_favor: { $sum: '$generales.puntos_totales' },
        sets_ganados: { $sum: '$generales.sets_ganados' },
        sets_perdidos: { $sum: '$generales.sets_perdidos' },
        // Ataque
        ataques_intentos: { $sum: '$ataque.total_intentos' },
        ataques_exitosos: { $sum: '$ataque.exitosos' },
        ataques_bloqueados: { $sum: '$ataque.bloqueados' },
        ataques_errores: { $sum: '$ataque.errores' },
        puntos_ataque: { $sum: '$ataque.puntos_ataque' },
        // Saque
        saques_totales: { $sum: '$saque.total_saques' },
        aces: { $sum: '$saque.aces' },
        errores_saque: { $sum: '$saque.errores' },
        // Bloqueo
        bloqueos_exitosos: { $sum: '$bloqueo.exitosos' },
        puntos_bloqueo: { $sum: '$bloqueo.puntos_bloqueo' },
        // Recepción
        recepciones_totales: { $sum: '$recepcion.total_recepciones' },
        recepciones_perfectas: { $sum: '$recepcion.perfectas' },
        recepciones_buenas: { $sum: '$recepcion.buenas' },
        recepciones_errores: { $sum: '$recepcion.errores' },
        // Errores totales
        errores_totales: { $sum: '$errores.total' },
        // Sanciones
        sanciones_advertencias: { $sum: '$sanciones.advertencias' },
        sanciones_penalties: { $sum: '$sanciones.penalties' },
        sanciones_expulsiones: { $sum: '$sanciones.expulsiones' },
        // Mejor racha
        mejor_racha: { $max: '$rachas.mejor_racha_puntos' }
      }
    },
    {
      $addFields: {
        diferencia_sets: { $subtract: ['$sets_ganados', '$sets_perdidos'] },
        efectividad_ataque: {
          $cond: [
            { $gt: ['$ataques_intentos', 0] },
            { $round: [{ $multiply: [{ $divide: ['$ataques_exitosos', '$ataques_intentos'] }, 100] }, 2] },
            0
          ]
        },
        efectividad_saque: {
          $cond: [
            { $gt: ['$saques_totales', 0] },
            { $round: [{ $multiply: [{ $divide: [{ $subtract: ['$saques_totales', '$errores_saque'] }, '$saques_totales'] }, 100] }, 2] },
            0
          ]
        },
        efectividad_recepcion: {
          $cond: [
            { $gt: ['$recepciones_totales', 0] },
            { $round: [{ $multiply: [{ $divide: [{ $add: ['$recepciones_perfectas', '$recepciones_buenas'] }, '$recepciones_totales'] }, 100] }, 2] },
            0
          ]
        },
        promedio_puntos: {
          $cond: [
            { $gt: ['$partidos_jugados', 0] },
            { $round: [{ $divide: ['$puntos_a_favor', '$partidos_jugados'] }, 2] },
            0
          ]
        },
        promedio_aces: {
          $cond: [
            { $gt: ['$partidos_jugados', 0] },
            { $round: [{ $divide: ['$aces', '$partidos_jugados'] }, 2] },
            0
          ]
        }
      }
    },
    {
      $sort: { puntos_a_favor: -1 }
    },
    {
      $project: {
        _id: 0,
        idequipo: '$_id',
        nombre_equipo: 1,
        partidos_jugados: 1,
        resumen: {
          puntos_a_favor: '$puntos_a_favor',
          promedio_puntos: '$promedio_puntos',
          sets_ganados: '$sets_ganados',
          sets_perdidos: '$sets_perdidos',
          diferencia_sets: '$diferencia_sets'
        },
        ataque: {
          intentos: '$ataques_intentos',
          exitosos: '$ataques_exitosos',
          bloqueados: '$ataques_bloqueados',
          errores: '$ataques_errores',
          efectividad: '$efectividad_ataque',
          puntos: '$puntos_ataque'
        },
        saque: {
          intentos: '$saques_totales',
          aces: '$aces',
          errores: '$errores_saque',
          efectividad: '$efectividad_saque',
          promedio_aces: '$promedio_aces'
        },
        bloqueo: {
          exitosos: '$bloqueos_exitosos',
          puntos: '$puntos_bloqueo'
        },
        recepcion: {
          intentos: '$recepciones_totales',
          perfectas: '$recepciones_perfectas',
          buenas: '$recepciones_buenas',
          errores: '$recepciones_errores',
          efectividad: '$efectividad_recepcion'
        },
        errores_totales: 1,
        sanciones: {
          advertencias: '$sanciones_advertencias',
          penalties: '$sanciones_penalties',
          expulsiones: '$sanciones_expulsiones'
        },
        mejor_racha: 1
      }
    }
  ]);

  return {
    campeonato: idcampeonato,
    categoria: idcategoria,
    total_partidos: idsPartidos.length,
    fecha_generacion: new Date(),
    equipos
  };
};

/**
 * REPORTE 3: Estadísticas de un Jugador Específico
 * Detalle completo de un jugador en un campeonato
 */
const obtenerEstadisticasJugador = async (idjugador, filtros = {}) => {
  const { idcampeonato, idcategoria } = filtros;

  // Obtener partidos del campeonato
  const matchPartidos = {};
  if (idcampeonato) matchPartidos['info_general.idcampeonato'] = parseInt(idcampeonato);
  if (idcategoria) matchPartidos['info_general.idcategoria'] = parseInt(idcategoria);
  matchPartidos['estado_partido.tipo'] = 'finalizado';

  const partidos = await PartidoDigital.find(matchPartidos).select('idpartido info_general equipos');
  const idsPartidos = partidos.map(p => p.idpartido);

  if (idsPartidos.length === 0) {
    return {
      idjugador: parseInt(idjugador),
      campeonato: idcampeonato,
      categoria: idcategoria,
      mensaje: 'No se encontraron partidos finalizados'
    };
  }

  // Obtener estadísticas del jugador
  const statsJugador = await EstadisticasJugadoresPartido.find({
    idpartido: { $in: idsPartidos },
    idjugador: parseInt(idjugador)
  }).sort({ createdAt: 1 });

  if (statsJugador.length === 0) {
    return {
      idjugador: parseInt(idjugador),
      campeonato: idcampeonato,
      categoria: idcategoria,
      mensaje: 'El jugador no participó en partidos de este campeonato'
    };
  }

  // Calcular totales
  const totales = {
    partidos_jugados: statsJugador.length,
    puntos_totales: 0,
    ataque: { intentos: 0, exitosos: 0, bloqueados: 0, errores: 0 },
    saque: { intentos: 0, aces: 0, errores: 0 },
    bloqueo: { solos: 0, asistidos: 0, total: 0 },
    recepcion: { intentos: 0, perfectas: 0, buenas: 0, malas: 0, errores: 0 },
    defensa: { intentos: 0, exitosas: 0, errores: 0 },
    sanciones: { advertencias: 0, amarillas: 0, rojas: 0 },
    mvp_count: 0
  };

  const historialPartidos = [];

  statsJugador.forEach(stat => {
    totales.puntos_totales += stat.puntos_anotados || 0;

    // Ataque
    totales.ataque.intentos += stat.ataque?.intentos || 0;
    totales.ataque.exitosos += stat.ataque?.exitosos || 0;
    totales.ataque.bloqueados += stat.ataque?.bloqueados || 0;
    totales.ataque.errores += stat.ataque?.errores || 0;

    // Saque
    totales.saque.intentos += stat.saque?.intentos || 0;
    totales.saque.aces += stat.saque?.aces || 0;
    totales.saque.errores += stat.saque?.errores || 0;

    // Bloqueo
    totales.bloqueo.solos += stat.bloqueo?.solos || 0;
    totales.bloqueo.asistidos += stat.bloqueo?.asistidos || 0;
    totales.bloqueo.total += stat.bloqueo?.total_puntos || 0;

    // Recepción
    totales.recepcion.intentos += stat.recepcion?.intentos || 0;
    totales.recepcion.perfectas += stat.recepcion?.perfectas || 0;
    totales.recepcion.buenas += stat.recepcion?.buenas || 0;
    totales.recepcion.malas += stat.recepcion?.malas || 0;
    totales.recepcion.errores += stat.recepcion?.errores || 0;

    // Defensa
    totales.defensa.intentos += stat.defensa?.intentos || 0;
    totales.defensa.exitosas += stat.defensa?.exitosas || 0;
    totales.defensa.errores += stat.defensa?.errores || 0;

    // Sanciones
    totales.sanciones.advertencias += stat.sanciones?.advertencias || 0;
    totales.sanciones.amarillas += stat.sanciones?.amarillas || 0;
    totales.sanciones.rojas += stat.sanciones?.rojas || 0;

    // MVP
    if (stat.reconocimientos?.es_mvp) totales.mvp_count++;

    // Historial por partido
    historialPartidos.push({
      idpartido: stat.idpartido,
      puntos: stat.puntos_anotados || 0,
      aces: stat.saque?.aces || 0,
      bloqueos: stat.bloqueo?.total_puntos || 0,
      efectividad_ataque: stat.ataque?.efectividad || 0,
      rating: stat.rating || 0,
      es_mvp: stat.reconocimientos?.es_mvp || false
    });
  });

  // Calcular efectividades
  const efectividades = {
    ataque: totales.ataque.intentos > 0
      ? ((totales.ataque.exitosos / totales.ataque.intentos) * 100).toFixed(2)
      : 0,
    saque: totales.saque.intentos > 0
      ? (((totales.saque.intentos - totales.saque.errores) / totales.saque.intentos) * 100).toFixed(2)
      : 0,
    recepcion: totales.recepcion.intentos > 0
      ? (((totales.recepcion.perfectas + totales.recepcion.buenas) / totales.recepcion.intentos) * 100).toFixed(2)
      : 0,
    defensa: totales.defensa.intentos > 0
      ? ((totales.defensa.exitosas / totales.defensa.intentos) * 100).toFixed(2)
      : 0
  };

  // Promedios por partido
  const promedios = {
    puntos: (totales.puntos_totales / totales.partidos_jugados).toFixed(2),
    aces: (totales.saque.aces / totales.partidos_jugados).toFixed(2),
    bloqueos: (totales.bloqueo.total / totales.partidos_jugados).toFixed(2)
  };

  return {
    jugador: {
      idjugador: parseInt(idjugador),
      nombre: statsJugador[0].nombre_completo,
      dorsal: statsJugador[0].dorsal,
      posicion: statsJugador[0].posicion
    },
    campeonato: idcampeonato,
    categoria: idcategoria,
    fecha_generacion: new Date(),
    resumen: {
      partidos_jugados: totales.partidos_jugados,
      puntos_totales: totales.puntos_totales,
      promedio_puntos: parseFloat(promedios.puntos),
      mvp_count: totales.mvp_count
    },
    estadisticas: {
      ataque: {
        ...totales.ataque,
        efectividad: parseFloat(efectividades.ataque)
      },
      saque: {
        ...totales.saque,
        efectividad: parseFloat(efectividades.saque),
        promedio_aces: parseFloat(promedios.aces)
      },
      bloqueo: {
        ...totales.bloqueo,
        promedio: parseFloat(promedios.bloqueos)
      },
      recepcion: {
        ...totales.recepcion,
        efectividad: parseFloat(efectividades.recepcion)
      },
      defensa: {
        ...totales.defensa,
        efectividad: parseFloat(efectividades.defensa)
      }
    },
    sanciones: totales.sanciones,
    historial_partidos: historialPartidos
  };
};

/**
 * REPORTE 4: Reporte de Sanciones
 * Listado de sancionados en un campeonato/categoría
 */
const obtenerReporteSanciones = async (filtros = {}) => {
  const { idcampeonato, idcategoria, tipo_sancion } = filtros;

  // Obtener partidos del campeonato
  const matchPartidos = {};
  if (idcampeonato) matchPartidos['info_general.idcampeonato'] = parseInt(idcampeonato);
  if (idcategoria) matchPartidos['info_general.idcategoria'] = parseInt(idcategoria);

  const partidos = await PartidoDigital.find(matchPartidos).select('idpartido');
  const idsPartidos = partidos.map(p => p.idpartido);

  if (idsPartidos.length === 0) {
    return {
      campeonato: idcampeonato,
      categoria: idcategoria,
      total_sanciones: 0,
      sancionados: [],
      resumen_por_tipo: {}
    };
  }

  // Filtro para sanciones
  const matchSanciones = { idpartido: { $in: idsPartidos } };
  if (tipo_sancion) matchSanciones.tipo_sancion = tipo_sancion;

  // Obtener todas las sanciones
  const sanciones = await SancionesPartido.find(matchSanciones)
    .sort({ timestamp: -1 });

  // Agrupar por sancionado
  const sancionadosMap = new Map();
  const resumenPorTipo = {
    advertencia: 0,
    penalty: 0,
    expulsion: 0,
    descalificacion: 0,
    penalty_acumulado: 0
  };

  sanciones.forEach(s => {
    resumenPorTipo[s.tipo_sancion] = (resumenPorTipo[s.tipo_sancion] || 0) + 1;

    const key = s.sancionado.idjugador || s.sancionado.idpersona || `equipo_${s.idpartido}_${s.equipo}`;

    if (!sancionadosMap.has(key)) {
      sancionadosMap.set(key, {
        tipo_persona: s.sancionado.tipo_persona,
        idjugador: s.sancionado.idjugador,
        idpersona: s.sancionado.idpersona,
        dorsal: s.sancionado.dorsal,
        nombre: s.sancionado.nombre,
        sanciones: [],
        totales: {
          advertencias: 0,
          penalties: 0,
          expulsiones: 0,
          descalificaciones: 0
        }
      });
    }

    const sancionado = sancionadosMap.get(key);
    sancionado.sanciones.push({
      idpartido: s.idpartido,
      numero_set: s.numero_set,
      tipo_sancion: s.tipo_sancion,
      motivo: s.motivo,
      descripcion: s.descripcion,
      timestamp: s.timestamp
    });

    // Contadores
    switch (s.tipo_sancion) {
      case 'advertencia': sancionado.totales.advertencias++; break;
      case 'penalty':
      case 'penalty_acumulado': sancionado.totales.penalties++; break;
      case 'expulsion': sancionado.totales.expulsiones++; break;
      case 'descalificacion': sancionado.totales.descalificaciones++; break;
    }
  });

  // Convertir a array y ordenar por total de sanciones graves
  const sancionados = Array.from(sancionadosMap.values())
    .map(s => ({
      ...s,
      puntos_sancion: s.totales.descalificaciones * 10 +
                      s.totales.expulsiones * 5 +
                      s.totales.penalties * 2 +
                      s.totales.advertencias
    }))
    .sort((a, b) => b.puntos_sancion - a.puntos_sancion);

  return {
    campeonato: idcampeonato,
    categoria: idcategoria,
    fecha_generacion: new Date(),
    total_sanciones: sanciones.length,
    resumen_por_tipo: resumenPorTipo,
    sancionados
  };
};

/**
 * REPORTE 5: Resumen de Jornada
 * Todos los resultados de una jornada específica
 */
const obtenerResumenJornada = async (idjornada) => {
  // Obtener partidos de la jornada
  const partidos = await PartidoDigital.find({
    'info_general.idjornada': parseInt(idjornada)
  }).sort({ 'info_general.fecha_programada': 1 });

  if (partidos.length === 0) {
    return {
      idjornada: parseInt(idjornada),
      mensaje: 'No se encontraron partidos para esta jornada',
      partidos: []
    };
  }

  // Obtener sets de cada partido
  const idsPartidos = partidos.map(p => p.idpartido);
  const todosLosSets = await SetsPartido.find({
    idpartido: { $in: idsPartidos }
  }).sort({ numero_set: 1 });

  // Mapear sets por partido
  const setsMap = new Map();
  todosLosSets.forEach(set => {
    if (!setsMap.has(set.idpartido)) {
      setsMap.set(set.idpartido, []);
    }
    setsMap.get(set.idpartido).push({
      numero: set.numero_set,
      local: set.puntos_local,
      visitante: set.puntos_visitante,
      ganador: set.ganador
    });
  });

  // Construir resumen
  const resultados = partidos.map(p => {
    const sets = setsMap.get(p.idpartido) || [];
    const setsLocal = sets.filter(s => s.ganador === 'local').length;
    const setsVisitante = sets.filter(s => s.ganador === 'visitante').length;

    return {
      idpartido: p.idpartido,
      numero_partido: p.info_general?.numero_partido,
      fecha: p.info_general?.fecha_programada,
      hora: p.info_general?.hora_inicio_real,
      estado: p.estado_partido?.tipo || 'pendiente',
      local: {
        idequipo: p.equipos?.local?.idequipo,
        nombre: p.equipos?.local?.nombre,
        club: p.equipos?.local?.club,
        sets: setsLocal
      },
      visitante: {
        idequipo: p.equipos?.visitante?.idequipo,
        nombre: p.equipos?.visitante?.nombre,
        club: p.equipos?.visitante?.club,
        sets: setsVisitante
      },
      resultado: `${setsLocal} - ${setsVisitante}`,
      ganador: p.estado_partido?.ganador || null,
      sets_detalle: sets.map(s => `${s.local}-${s.visitante}`).join(', '),
      duracion_minutos: p.info_general?.duracion_total_minutos
    };
  });

  // Estadísticas de la jornada
  const estadisticas = {
    total_partidos: resultados.length,
    finalizados: resultados.filter(r => r.estado === 'finalizado').length,
    pendientes: resultados.filter(r => r.estado === 'pendiente').length,
    en_curso: resultados.filter(r => r.estado === 'en_curso').length,
    victorias_locales: resultados.filter(r => r.ganador === 'local').length,
    victorias_visitantes: resultados.filter(r => r.ganador === 'visitante').length
  };

  return {
    idjornada: parseInt(idjornada),
    fecha_generacion: new Date(),
    estadisticas,
    resultados
  };
};

/**
 * REPORTE EXTRA: Comparativa entre dos equipos (Historial de enfrentamientos)
 */
const obtenerComparativaEquipos = async (idequipo1, idequipo2, filtros = {}) => {
  const { idcampeonato } = filtros;

  // Buscar partidos donde se hayan enfrentado
  const matchPartidos = {
    $or: [
      { 'equipos.local.idequipo': parseInt(idequipo1), 'equipos.visitante.idequipo': parseInt(idequipo2) },
      { 'equipos.local.idequipo': parseInt(idequipo2), 'equipos.visitante.idequipo': parseInt(idequipo1) }
    ],
    'estado_partido.tipo': 'finalizado'
  };

  if (idcampeonato) {
    matchPartidos['info_general.idcampeonato'] = parseInt(idcampeonato);
  }

  const partidos = await PartidoDigital.find(matchPartidos)
    .sort({ 'info_general.fecha_programada': -1 });

  if (partidos.length === 0) {
    return {
      equipo1: parseInt(idequipo1),
      equipo2: parseInt(idequipo2),
      mensaje: 'No se encontraron enfrentamientos entre estos equipos',
      enfrentamientos: []
    };
  }

  // Obtener sets de cada partido
  const idsPartidos = partidos.map(p => p.idpartido);
  const todosLosSets = await SetsPartido.find({
    idpartido: { $in: idsPartidos }
  });

  const setsMap = new Map();
  todosLosSets.forEach(set => {
    if (!setsMap.has(set.idpartido)) {
      setsMap.set(set.idpartido, []);
    }
    setsMap.get(set.idpartido).push(set);
  });

  // Construir historial
  let victorias1 = 0, victorias2 = 0;
  let setsGanados1 = 0, setsGanados2 = 0;
  let puntosAFavor1 = 0, puntosAFavor2 = 0;

  const enfrentamientos = partidos.map(p => {
    const esLocal1 = p.equipos.local.idequipo === parseInt(idequipo1);
    const sets = setsMap.get(p.idpartido) || [];

    let sets1 = 0, sets2 = 0;
    let puntos1 = 0, puntos2 = 0;

    sets.forEach(s => {
      if (esLocal1) {
        if (s.ganador === 'local') sets1++; else sets2++;
        puntos1 += s.puntos_local || 0;
        puntos2 += s.puntos_visitante || 0;
      } else {
        if (s.ganador === 'visitante') sets1++; else sets2++;
        puntos1 += s.puntos_visitante || 0;
        puntos2 += s.puntos_local || 0;
      }
    });

    const ganador = sets1 > sets2 ? idequipo1 : idequipo2;
    if (ganador == idequipo1) victorias1++; else victorias2++;
    setsGanados1 += sets1;
    setsGanados2 += sets2;
    puntosAFavor1 += puntos1;
    puntosAFavor2 += puntos2;

    return {
      idpartido: p.idpartido,
      fecha: p.info_general?.fecha_programada,
      campeonato: p.info_general?.idcampeonato,
      resultado: {
        equipo1_sets: sets1,
        equipo2_sets: sets2,
        ganador: parseInt(ganador)
      },
      sets_detalle: sets.map(s => ({
        numero: s.numero_set,
        equipo1: esLocal1 ? s.puntos_local : s.puntos_visitante,
        equipo2: esLocal1 ? s.puntos_visitante : s.puntos_local
      }))
    };
  });

  return {
    equipo1: {
      idequipo: parseInt(idequipo1),
      nombre: partidos[0].equipos.local.idequipo === parseInt(idequipo1)
        ? partidos[0].equipos.local.nombre
        : partidos[0].equipos.visitante.nombre
    },
    equipo2: {
      idequipo: parseInt(idequipo2),
      nombre: partidos[0].equipos.local.idequipo === parseInt(idequipo2)
        ? partidos[0].equipos.local.nombre
        : partidos[0].equipos.visitante.nombre
    },
    fecha_generacion: new Date(),
    resumen: {
      total_enfrentamientos: partidos.length,
      victorias_equipo1: victorias1,
      victorias_equipo2: victorias2,
      sets_equipo1: setsGanados1,
      sets_equipo2: setsGanados2,
      puntos_equipo1: puntosAFavor1,
      puntos_equipo2: puntosAFavor2
    },
    enfrentamientos
  };
};

module.exports = {
  obtenerTopGoleadores,
  obtenerEstadisticasEquipos,
  obtenerEstadisticasJugador,
  obtenerReporteSanciones,
  obtenerResumenJornada,
  obtenerComparativaEquipos
};
