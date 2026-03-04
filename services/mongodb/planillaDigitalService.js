// services/mongodb/planillaDigitalService.js
const PartidoDigital = require('../../models/mongodb/PartidoDigital');
const SetsPartido = require('../../models/mongodb/SetsPartido');
const FormacionesSets = require('../../models/mongodb/FormacionesSets');
const SubstitucionesPartido = require('../../models/mongodb/SubstitucionesPartido');
const SancionesPartido = require('../../models/mongodb/SancionesPartido');
const EventosPartido = require('../../models/mongodb/EventosPartido');
const TimeoutsPartido = require('../../models/mongodb/TimeoutsPartido');
const EstadisticasJugadoresPartido = require('../../models/mongodb/EstadisticasJugadoresPartido');

/**
 * Obtiene todos los datos completos del partido para la planilla oficial
 */
const obtenerPlanillaCompleta = async (idpartido) => {
  try {
    // 1. Obtener datos principales del partido
    const partido = await PartidoDigital.findOne({ idpartido });

    if (!partido) {
      throw new Error('Partido no encontrado');
    }

    // 2. Obtener información de los sets
    const sets = await SetsPartido.find({ idpartido })
      .sort({ numero_set: 1 })
      .lean();

    // 3. Obtener formaciones de cada set
    const formaciones = await FormacionesSets.find({ idpartido })
      .sort({ numero_set: 1 })
      .lean();

    // 4. Obtener sustituciones
    const sustituciones = await SubstitucionesPartido.find({ idpartido })
      .sort({ numero_set: 1, timestamp: 1 })
      .lean();

    // 5. Obtener sanciones
    const sanciones = await SancionesPartido.find({ idpartido })
      .sort({ timestamp: 1 })
      .lean();

    // 6. Obtener eventos (para saques y puntos detallados)
    const eventos = await EventosPartido.find({ idpartido })
      .sort({ numero_set: 1, timestamp: 1 })
      .lean();

    // 7. Obtener timeouts
    const timeouts = await TimeoutsPartido.find({ idpartido })
      .sort({ numero_set: 1, timestamp: 1 })
      .lean();

    // 8. Obtener estadísticas de jugadores
    const estadisticas = await EstadisticasJugadoresPartido.find({ idpartido })
      .lean();

    // 9. Procesar datos por set para la planilla
    const setsDetallados = [];

    for (let i = 1; i <= partido.configuracion.sets_maximos; i++) {
      const set = sets.find(s => s.numero_set === i);
      const formacion = formaciones.find(f => f.numero_set === i);
      const sustitucionesSet = sustituciones.filter(s => s.numero_set === i);
      const eventosSet = eventos.filter(e => e.numero_set === i);
      const timeoutsSet = timeouts.filter(t => t.numero_set === i);

      if (set) {
        setsDetallados.push({
          numero_set: i,
          puntos_local: set.puntos_local,
          puntos_visitante: set.puntos_visitante,
          ganador: set.ganador,
          duracion: set.duracion,
          estado: set.estado,
          formacion_inicial: formacion,
          sustituciones: sustitucionesSet,
          timeouts: timeoutsSet,
          eventos: eventosSet,
          secuencia_puntos: procesarSecuenciaPuntos(eventosSet)
        });
      }
    }

    // 10. Construir respuesta completa
    return {
      partido: {
        id: partido.idpartido,
        numero_partido: partido.info_general.numero_partido,
        fecha: partido.info_general.fecha_programada,
        hora_inicio: partido.info_general.hora_inicio_real,
        hora_fin: partido.info_general.hora_finalizacion,
        duracion_total: partido.info_general.duracion_total_minutos,
        campeonato: partido.info_general.idcampeonato,
        categoria: partido.info_general.idcategoria,
        fase: partido.info_general.idfase,
        cancha: partido.info_general.idcancha
      },
      equipos: {
        local: {
          ...partido.equipos.local,
          plantilla: partido.planteles.local.jugadores,
          cuerpo_tecnico: partido.planteles.local.cuerpo_tecnico
        },
        visitante: {
          ...partido.equipos.visitante,
          plantilla: partido.planteles.visitante.jugadores,
          cuerpo_tecnico: partido.planteles.visitante.cuerpo_tecnico
        }
      },
      arbitraje: partido.arbitraje,
      configuracion: partido.configuracion,
      resultado: {
        ...partido.resultado,
        ganador: partido.estado_partido.ganador
      },
      sets: setsDetallados,
      sanciones: sanciones,
      aprobaciones: partido.aprobaciones,
      observaciones: partido.observaciones,
      estado: partido.estado_partido.tipo
    };

  } catch (error) {
    console.error('❌ Error obteniendo planilla completa:', error);
    throw error;
  }
};

/**
 * Procesa los eventos para obtener la secuencia de puntos (para marcar en la planilla)
 */
const procesarSecuenciaPuntos = (eventos) => {
  const secuencia = {
    local: [],
    visitante: []
  };

  eventos.forEach(evento => {
    if (evento.tipo_evento === 'punto') {
      const punto = {
        numero: evento.punto_actual_local + evento.punto_actual_visitante,
        equipo_anota: evento.equipo_anota,
        servidor: evento.jugador_servidor,
        timestamp: evento.timestamp
      };

      if (evento.equipo_anota === 'local') {
        secuencia.local.push(punto);
      } else {
        secuencia.visitante.push(punto);
      }
    }
  });

  return secuencia;
};

/**
 * Obtiene solo el resumen rápido del partido (para listados)
 */
const obtenerResumenPartido = async (idpartido) => {
  try {
    const partido = await PartidoDigital.findOne({ idpartido })
      .select('idpartido info_general equipos resultado estado_partido')
      .lean();

    if (!partido) {
      return null;
    }

    return {
      id: partido.idpartido,
      equipo_local: partido.equipos.local.nombre,
      equipo_visitante: partido.equipos.visitante.nombre,
      resultado: `${partido.resultado.sets_local} - ${partido.resultado.sets_visitante}`,
      estado: partido.estado_partido.tipo,
      fecha: partido.info_general.fecha_programada
    };

  } catch (error) {
    console.error('❌ Error obteniendo resumen:', error);
    throw error;
  }
};

/**
 * Lista todos los partidos finalizados disponibles para ver planilla
 */
const listarPartidosFinalizados = async (filtros = {}) => {
  try {
    const query = {
      'estado_partido.tipo': 'finalizado'
    };

    if (filtros.idcampeonato) {
      query['info_general.idcampeonato'] = filtros.idcampeonato;
    }

    if (filtros.idcategoria) {
      query['info_general.idcategoria'] = filtros.idcategoria;
    }

    if (filtros.fecha_desde) {
      query['info_general.fecha_programada'] = {
        $gte: new Date(filtros.fecha_desde)
      };
    }

    const partidos = await PartidoDigital.find(query)
      .select('idpartido info_general equipos resultado estado_partido')
      .sort({ 'info_general.fecha_programada': -1 })
      .limit(filtros.limite || 100)
      .lean();

    return partidos.map(p => ({
      id: p.idpartido,
      numero: p.info_general.numero_partido,
      equipo_local: p.equipos.local.nombre,
      equipo_visitante: p.equipos.visitante.nombre,
      resultado: `${p.resultado.sets_local} - ${p.resultado.sets_visitante}`,
      fecha: p.info_general.fecha_programada,
      ganador: p.estado_partido.ganador
    }));

  } catch (error) {
    console.error('❌ Error listando partidos:', error);
    throw error;
  }
};

/**
 * Verifica si un partido está listo para imprimir planilla
 */
const verificarPartidoListo = async (idpartido) => {
  try {
    const partido = await PartidoDigital.findOne({ idpartido });

    if (!partido) {
      return { listo: false, razon: 'Partido no encontrado' };
    }

    if (partido.estado_partido.tipo !== 'finalizado') {
      return { listo: false, razon: 'Partido no finalizado' };
    }

    if (!partido.aprobaciones.planilla_cerrada) {
      return {
        listo: true,
        advertencia: 'Planilla no cerrada oficialmente. Puede haber cambios.'
      };
    }

    return { listo: true };

  } catch (error) {
    console.error('❌ Error verificando partido:', error);
    throw error;
  }
};

module.exports = {
  obtenerPlanillaCompleta,
  obtenerResumenPartido,
  listarPartidosFinalizados,
  verificarPartidoListo
};
