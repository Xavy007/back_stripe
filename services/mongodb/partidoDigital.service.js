// services/mongodb/partidoDigital.service.js
const partidoDigitalRepo = require('../../repositories/mongodb/partidoDigital.repository');
const configuracionPuntosService = require('./configuracionPuntos.service');
const { Partido, CampeonatoCategoria } = require('../../models'); // PostgreSQL
const tablaPosicionService = require('../tablaPosicionService');

class PartidoDigitalService {

  // Mapear posiciones del español a valores válidos del enum
  mapearPosicion(posicion) {
    if (!posicion) return null;

    const mapeo = {
      'libero': 'Libero',
      'líbero': 'Libero',
      'armador': 'Armador',
      'armadora': 'Armador',
      'colocador': 'Armador',
      'colocadora': 'Armador',
      'opuesto': 'Opuesto',
      'opuesta': 'Opuesto',
      'central': 'Central',
      'punta': 'Punta',
      'atacante': 'Punta',
      'universal': 'Universal',
      'receptor': 'Punta',
      'receptora': 'Punta'
    };

    const posLower = posicion.toLowerCase().trim();
    return mapeo[posLower] || null;
  }

  async obtenerPorId(idpartido) {
    const partido = await partidoDigitalRepo.findByIdPartido(idpartido);
    
    if (!partido) {
      throw new Error(`Partido ${idpartido} no encontrado`);
    }
    
    return partido;
  }

  async crearDesdePostgreSQL(idpartido) {
    // Obtener datos de PostgreSQL
    const partidoSQL = await Partido.findByPk(idpartido, {
      include: ['equipoLocal', 'equipoVisitante', 'cancha', 'campeonato']
    });

    if (!partidoSQL) {
      throw new Error(`Partido ${idpartido} no existe en PostgreSQL`);
    }

    // Obtener configuración del campeonato
    const config = await configuracionPuntosService.obtenerPorCampeonato(
      partidoSQL.idcampeonato
    );

    // Crear partido digital
    const partidoDigital = await partidoDigitalRepo.create({
      idpartido: partidoSQL.idpartido,
      info_general: {
        idcampeonato: partidoSQL.idcampeonato,
        idcancha: partidoSQL.idcancha,
        fecha_programada: partidoSQL.fecha,
        hora_inicio_programada: partidoSQL.fecha
      },
      equipos: {
        local: {
          idequipo: partidoSQL.idequipolocal,
          nombre: partidoSQL.equipoLocal?.nombre
        },
        visitante: {
          idequipo: partidoSQL.idequipovisitante,
          nombre: partidoSQL.equipoVisitante?.nombre
        }
      },
      configuracion: config.configuracion_sets
    });

    return partidoDigital;
  }

  async iniciarPartido(idpartido, userId) {
    const partido = await this.obtenerPorId(idpartido);

    if (partido.estado_partido.tipo !== 'no_iniciado') {
      throw new Error('El partido ya fue iniciado');
    }

    const actualizado = await partidoDigitalRepo.update(idpartido, {
      'info_general.hora_inicio_real': new Date(),
      'estado_partido.tipo': 'en_calentamiento'
    });

    await partidoDigitalRepo.addModificacion(idpartido, {
      usuario_id: userId,
      accion: 'inicio_partido',
      timestamp: new Date()
    });

    return actualizado;
  }

  async iniciarSet(idpartido, numeroSet, userId) {
    const partido = await this.obtenerPorId(idpartido);

    const actualizado = await partidoDigitalRepo.update(idpartido, {
      'estado_partido.set_actual': numeroSet,
      'estado_partido.tipo': 'en_juego'
    });

    await partidoDigitalRepo.addModificacion(idpartido, {
      usuario_id: userId,
      accion: `inicio_set_${numeroSet}`,
      timestamp: new Date()
    });

    return actualizado;
  }

  async finalizarSet(idpartido, numeroSet, ganador, userId) {
    const partido = await this.obtenerPorId(idpartido);

    // Actualizar sets ganados
    const campoSets = ganador === 'local' ? 'sets_local' : 'sets_visitante';
    
    const actualizado = await partidoDigitalRepo.update(idpartido, {
      [`resultado.${campoSets}`]: partido.resultado[campoSets] + 1,
      'estado_partido.tipo': 'entre_sets'
    });

    // Verificar si el partido terminó
    const setsParaGanar = partido.configuracion.sets_para_ganar;
    if (actualizado.resultado[campoSets] >= setsParaGanar) {
      await this.finalizarPartido(idpartido, ganador, userId);
    }

    return actualizado;
  }

  async finalizarPartido(idpartido, ganador, userId) {
    const actualizado = await partidoDigitalRepo.update(idpartido, {
      'estado_partido.tipo': 'finalizado',
      'estado_partido.ganador': ganador,
      'estado_partido.motivo_finalizacion': 'normal',
      'info_general.hora_finalizacion': new Date()
    });

    // Calcular duración
    const duracion = Math.floor(
      (new Date() - new Date(actualizado.info_general.hora_inicio_real)) / 60000
    );

    await partidoDigitalRepo.update(idpartido, {
      'info_general.duracion_total_minutos': duracion
    });

    await partidoDigitalRepo.addModificacion(idpartido, {
      usuario_id: userId,
      accion: 'fin_partido',
      timestamp: new Date(),
      datos: { ganador, duracion }
    });

    return actualizado;
  }

  async registrarPlantel(idpartido, equipo, jugadores, cuerpoTecnico) {
    const campo = equipo === 'local' ? 'planteles.local' : 'planteles.visitante';

    return await partidoDigitalRepo.update(idpartido, {
      [`${campo}.jugadores`]: jugadores,
      [`${campo}.cuerpo_tecnico`]: cuerpoTecnico
    });
  }

  async registrarArbitraje(idpartido, arbitros) {
    return await partidoDigitalRepo.update(idpartido, {
      arbitraje: arbitros
    });
  }

  async cerrarPlanilla(idpartido, aprobaciones, userId) {
    return await partidoDigitalRepo.cerrarPlanilla(idpartido, {
      aprobaciones,
      'aprobaciones.cerrada_por.usuario_id': userId,
      'aprobaciones.cerrada_por.nombre': 'Usuario' // Obtener de BD
    });
  }

  async obtenerPartidosEnVivo() {
    return await partidoDigitalRepo.findEnVivo();
  }

  async obtenerPorCampeonato(idcampeonato) {
    return await partidoDigitalRepo.findByCampeonato(idcampeonato);
  }

  async sincronizarConPostgreSQL(idpartido) {
    const partidoMongo = await this.obtenerPorId(idpartido);

    // Actualizar PostgreSQL
    const resultadoLocal = partidoMongo.resultado.sets_local;
    const resultadoVisitante = partidoMongo.resultado.sets_visitante;

    await Partido.update(
      {
        resultado_local: resultadoLocal,
        resultado_visitante: resultadoVisitante,
        p_estado: 'finalizado'
      },
      { where: { id_partido: idpartido } }
    );

    await partidoDigitalRepo.update(idpartido, {
      sincronizado_postgresql: true,
      ultima_sincronizacion: new Date()
    });
  }

  // ✅ NUEVO: Guardar partido completo desde la app móvil
  async guardarPartidoCompletoDesdeApp(idpartido, datosPartido) {
    console.log('🔧 guardarPartidoCompletoDesdeApp - Inicio');
    console.log('🆔 ID Partido:', idpartido);
    console.log('📊 Datos recibidos:', JSON.stringify(datosPartido, null, 2));

    try {
      // Verificar si el partido ya existe en MongoDB
      let partidoExistente;
      console.log('🔍 Verificando si el partido existe en MongoDB...');
      try {
        partidoExistente = await this.obtenerPorId(idpartido);
        console.log('✅ Partido encontrado en MongoDB');
      } catch (error) {
        // No existe, lo creamos
        console.log('ℹ️ Partido no existe en MongoDB, se creará nuevo');
        partidoExistente = null;
      }

      const {
        equipoLocal,
        equipoVisitante,
        jugadoresLocal,
        jugadoresVisitante,
        arbitraje,
        capitanes,
        sets,
        duracion,
        historial,
        matchFormat,
        setsLocal,
        setsVisitante,
        ganador,
        fecha_inicio,
        fecha_fin
      } = datosPartido;

      // Debug: mostrar qué datos llegaron
      console.log('📥 Datos extraídos:');
      console.log('  - jugadoresLocal:', jugadoresLocal?.length || 0, 'jugadores');
      console.log('  - jugadoresVisitante:', jugadoresVisitante?.length || 0, 'jugadores');
      console.log('  - historial:', historial?.length || 0, 'eventos');
      console.log('  - sets:', sets?.length || 0, 'sets');
      console.log('  - arbitraje:', arbitraje ? JSON.stringify(arbitraje) : 'No definido');
      console.log('  - capitanes:', capitanes ? JSON.stringify(capitanes) : 'No definido');

      // Calcular puntos totales
      const puntosTotalesLocal = sets.reduce((sum, set) => sum + (set.scoreA || 0), 0);
      const puntosTotalesVisitante = sets.reduce((sum, set) => sum + (set.scoreB || 0), 0);

      const datosCompletos = {
        idpartido,

        info_general: {
          hora_inicio_real: new Date(fecha_inicio),
          hora_finalizacion: new Date(fecha_fin),
          duracion_total_minutos: Math.floor(duracion / 60)
        },

        equipos: {
          local: {
            idequipo: equipoLocal.id,
            nombre: equipoLocal.nombre
          },
          visitante: {
            idequipo: equipoVisitante.id,
            nombre: equipoVisitante.nombre
          }
        },

        // Guardar planteles (jugadores) - mapear al formato del modelo MongoDB
        // Si no tienen dorsal, asignar números consecutivos (1, 2, 3...)
        // Posición es opcional, no se incluye para evitar errores de validación
        planteles: {
          local: {
            jugadores: (jugadoresLocal || []).map((j, index) => ({
              idjugador: j.id_jugador,
              numero_dorsal: (j.dorsal && parseInt(j.dorsal) > 0) ? parseInt(j.dorsal) : (index + 1),
              nombre_completo: `${j.nombre || ''} ${j.ap || ''} ${j.am || ''}`.trim()
            })),
            cuerpo_tecnico: []
          },
          visitante: {
            jugadores: (jugadoresVisitante || []).map((j, index) => ({
              idjugador: j.id_jugador,
              numero_dorsal: (j.dorsal && parseInt(j.dorsal) > 0) ? parseInt(j.dorsal) : (index + 1),
              nombre_completo: `${j.nombre || ''} ${j.ap || ''} ${j.am || ''}`.trim()
            })),
            cuerpo_tecnico: []
          }
        },

        configuracion: {
          formato_partido: matchFormat === 3 ? 'mejor_de_3' : 'mejor_de_5',
          sets_maximos: matchFormat,
          sets_para_ganar: matchFormat === 3 ? 2 : 3,
          sistema_puntuacion: 'rally_point',
          puntos_set_normal: 25,
          puntos_set_decisivo: 15,
          diferencia_minima: 2
        },

        estado_partido: {
          tipo: 'finalizado',
          set_actual: sets.length,
          ganador: ganador === 'local' ? 'local' : 'visitante',
          motivo_finalizacion: 'normal'
        },

        resultado: {
          sets_local: setsLocal,
          sets_visitante: setsVisitante,
          puntos_totales_local: puntosTotalesLocal,
          puntos_totales_visitante: puntosTotalesVisitante
        },

        // Cuerpo arbitral
        arbitraje: arbitraje ? {
          primer_arbitro: arbitraje.primer_arbitro ? { nombre: arbitraje.primer_arbitro } : null,
          segundo_arbitro: arbitraje.segundo_arbitro ? { nombre: arbitraje.segundo_arbitro } : null,
          anotador: arbitraje.anotador ? { nombre: arbitraje.anotador } : null
        } : null,

        // Capitanes de cada equipo
        capitanes: capitanes ? {
          local: capitanes.local ? {
            id_jugador: capitanes.local.id_jugador,
            nombre: capitanes.local.nombre,
            dorsal: capitanes.local.dorsal
          } : null,
          visitante: capitanes.visitante ? {
            id_jugador: capitanes.visitante.id_jugador,
            nombre: capitanes.visitante.nombre,
            dorsal: capitanes.visitante.dorsal
          } : null
        } : null
      };

      let partido;
      if (partidoExistente) {
        // Actualizar partido existente
        console.log('🔄 Actualizando partido existente...');
        partido = await partidoDigitalRepo.update(idpartido, datosCompletos);
        console.log('✅ Partido actualizado en MongoDB');
      } else {
        // Crear nuevo partido
        console.log('➕ Creando nuevo partido...');
        partido = await partidoDigitalRepo.create(datosCompletos);
        console.log('✅ Partido creado en MongoDB');
      }

      // ✅ Guardar sets del partido en la colección SetsPartido
      if (sets && Array.isArray(sets) && sets.length > 0) {
        console.log(`📊 Guardando ${sets.length} sets del partido...`);
        const SetsPartido = require('../../models/mongodb/SetsPartido');

        // Limpiar sets anteriores del partido (para evitar duplicados)
        await SetsPartido.deleteMany({ idpartido });
        console.log('🗑️ Sets anteriores eliminados');

        // Guardar cada set
        for (let i = 0; i < sets.length; i++) {
          const set = sets[i];
          const setData = {
            idpartido,
            numero_set: i + 1,
            puntos_local: set.scoreA || 0,
            puntos_visitante: set.scoreB || 0,
            ganador: (set.scoreA || 0) > (set.scoreB || 0) ? 'local' : 'visitante',
            estado: 'finalizado',
            es_set_decisivo: i === matchFormat - 1, // Último set posible
            puntos_necesarios_ganar: i === matchFormat - 1 ? 15 : 25
          };

          const nuevoSet = new SetsPartido(setData);
          await nuevoSet.save();
          console.log(`  ✅ Set ${i + 1} guardado: ${setData.puntos_local} - ${setData.puntos_visitante}`);
        }
        console.log(`✅ ${sets.length} sets guardados en MongoDB`);
      } else {
        console.log('⚠️ No hay sets para guardar');
      }

      // ✅ NUEVO: Guardar eventos del historial
      if (historial && Array.isArray(historial) && historial.length > 0) {
        console.log(`📊 Guardando ${historial.length} eventos del historial...`);
        const eventosRepo = require('../../repositories/mongodb/eventosPartido.repository');

        // Limpiar eventos anteriores del partido (para evitar duplicados)
        const EventosPartido = require('../../models/mongodb/EventosPartido');
        await EventosPartido.deleteMany({ idpartido });
        console.log('🗑️ Eventos anteriores eliminados');

        // Guardar cada evento del historial
        let secuencia = 1;
        for (const evento of historial) {
          const eventoData = {
            idpartido,
            numero_set: evento.setNumber || 1,
            secuencia: secuencia++,
            tipo_evento: evento.type === 'substitution' ? 'sustitucion' : 'punto',
            timestamp: new Date(evento.realTime || evento.timestamp),
            tiempo_juego_segundos: evento.gameTime || evento.timestamp || 0,

            // Para puntos
            marcador: evento.score ? {
              local: evento.team === 'A' ? evento.score : (evento.score - 1 >= 0 ? evento.score - 1 : 0),
              visitante: evento.team === 'B' ? evento.score : (evento.score - 1 >= 0 ? evento.score - 1 : 0)
            } : undefined,

            punto: evento.type !== 'substitution' ? {
              equipo_anota: evento.team === 'A' ? 'local' : 'visitante',
              tipo_punto: evento.type || 'punto',
              jugador_anota: {
                nombre: evento.playerName,
                dorsal: evento.playerNumber ? parseInt(evento.playerNumber) : null
              }
            } : undefined,

            // Para sustituciones
            sustitucion: evento.type === 'substitution' ? {
              equipo: evento.team === 'A' ? 'local' : 'visitante',
              jugador_entra: evento.playerIn,
              jugador_sale: evento.playerOut
            } : undefined
          };

          await eventosRepo.create(eventoData);
        }
        console.log(`✅ ${historial.length} eventos guardados en MongoDB`);
      } else {
        console.log('⚠️ No hay historial de eventos para guardar');
      }

      // ✅ Guardar estadísticas de jugadores y equipos
      try {
        const EstadisticasJugador = require('../../models/mongodb/EstadisticasJugadoresPartido');
        const EstadisticasEquipo = require('../../models/mongodb/EstadisticasEquiposPartido');

        // Limpiar estadísticas anteriores del partido
        await EstadisticasJugador.deleteMany({ idpartido });
        await EstadisticasEquipo.deleteMany({ idpartido });

        // Solo eventos de puntos (excluir set_end y substitution)
        const eventosPunto = (historial || []).filter(e =>
          e.type !== 'substitution' && e.type !== 'set_end'
        );

        // ── ESTADÍSTICAS POR JUGADOR ─────────────────────────────────
        const statsJugadores = {};
        for (const evento of eventosPunto) {
          if (!evento.playerNumber) continue;

          const equipoStr = evento.team === 'A' ? 'local' : 'visitante';
          const clave = `${equipoStr}__${evento.playerNumber}`;

          if (!statsJugadores[clave]) {
            const plantel = evento.team === 'A' ? (jugadoresLocal || []) : (jugadoresVisitante || []);
            const jugadorData = plantel.find(j =>
              String(j.dorsal) === String(evento.playerNumber) || j.nombre === evento.playerName
            );
            statsJugadores[clave] = {
              idpartido,
              equipo: equipoStr,
              idjugador: jugadorData?.id_jugador || 0,
              dorsal: parseInt(evento.playerNumber) || 0,
              nombre_completo: evento.playerName || '',
              puntos_anotados: 0,
              puntos_por_concepto: { ataque: 0, bloqueo: 0, saque: 0 },
              saque: { intentos: 0, aces: 0, errores: 0, efectividad: 0, puntos_directos: 0 },
              ataque: { intentos: 0, exitosos: 0, bloqueados: 0, errores: 0, efectividad: 0 },
              bloqueo: { solos: 0, asistidos: 0, total_puntos: 0, toques: 0, errores: 0 }
            };
          }

          statsJugadores[clave].puntos_anotados++;
          if (evento.type === 'ataque') {
            statsJugadores[clave].puntos_por_concepto.ataque++;
            statsJugadores[clave].ataque.exitosos++;
            statsJugadores[clave].ataque.intentos++;
          } else if (evento.type === 'saque') {
            statsJugadores[clave].puntos_por_concepto.saque++;
            statsJugadores[clave].saque.aces++;
            statsJugadores[clave].saque.intentos++;
            statsJugadores[clave].saque.puntos_directos++;
          } else if (evento.type === 'bloqueo') {
            statsJugadores[clave].puntos_por_concepto.bloqueo++;
            statsJugadores[clave].bloqueo.solos++;
            statsJugadores[clave].bloqueo.total_puntos++;
          }
        }

        for (const stats of Object.values(statsJugadores)) {
          if (stats.ataque.intentos > 0) {
            stats.ataque.efectividad = parseFloat(((stats.ataque.exitosos / stats.ataque.intentos) * 100).toFixed(2));
          }
          if (stats.saque.intentos > 0) {
            stats.saque.efectividad = parseFloat(((stats.saque.aces / stats.saque.intentos) * 100).toFixed(2));
          }
          await EstadisticasJugador.create(stats);
        }
        console.log(`✅ Estadísticas de ${Object.keys(statsJugadores).length} jugadores guardadas`);

        // ── ESTADÍSTICAS POR EQUIPO ──────────────────────────────────
        const equiposStats = [
          { equipoStr: 'local',     team: 'A', idequipo: equipoLocal.id,     nombre: equipoLocal.nombre,     setsG: setsLocal,     setsP: setsVisitante, puntosT: puntosTotalesLocal,  puntosRival: puntosTotalesVisitante },
          { equipoStr: 'visitante', team: 'B', idequipo: equipoVisitante.id, nombre: equipoVisitante.nombre, setsG: setsVisitante, setsP: setsLocal,     puntosT: puntosTotalesVisitante, puntosRival: puntosTotalesLocal }
        ];

        for (const eq of equiposStats) {
          const eventosEq = eventosPunto.filter(e => e.team === eq.team);
          const puntosAtaque  = eventosEq.filter(e => e.type === 'ataque').length;
          const puntosSaque   = eventosEq.filter(e => e.type === 'saque').length;
          const puntosBloqueo = eventosEq.filter(e => e.type === 'bloqueo').length;
          const total         = eventosEq.length;

          const porSet = (sets || []).map((set, i) => ({
            numero_set: i + 1,
            puntos:  eq.team === 'A' ? (set.scoreA || 0) : (set.scoreB || 0),
            ganado:  eq.team === 'A' ? (set.scoreA > set.scoreB) : (set.scoreB > set.scoreA),
            aces:    eventosEq.filter(e => e.setNumber === i + 1 && e.type === 'saque').length,
            bloqueos:eventosEq.filter(e => e.setNumber === i + 1 && e.type === 'bloqueo').length,
            errores: 0
          }));

          await EstadisticasEquipo.create({
            idpartido,
            equipo:       eq.equipoStr,
            idequipo:     eq.idequipo,
            nombre_equipo:eq.nombre,
            generales: {
              puntos_totales:    eq.puntosT,
              sets_ganados:      eq.setsG,
              sets_perdidos:     eq.setsP,
              diferencia_puntos: eq.puntosT - eq.puntosRival
            },
            por_set: porSet,
            ataque: {
              total_intentos: puntosAtaque,
              exitosos:       puntosAtaque,
              bloqueados:     0,
              errores:        0,
              efectividad:    total > 0 ? parseFloat(((puntosAtaque / total) * 100).toFixed(2)) : 0,
              puntos_ataque:  puntosAtaque
            },
            saque: {
              total_saques: puntosSaque,
              aces:         puntosSaque,
              errores:      0,
              efectividad:  puntosSaque > 0 ? 100 : 0
            },
            bloqueo: {
              exitosos:      puntosBloqueo,
              toques:        puntosBloqueo,
              errores:       0,
              puntos_bloqueo:puntosBloqueo
            }
          });
        }
        console.log('✅ Estadísticas de equipos guardadas');
      } catch (statsError) {
        console.error('⚠️ Error guardando estadísticas (no crítico):', statsError.message);
      }

      // Sincronizar con PostgreSQL
      console.log('🔄 Sincronizando con PostgreSQL...');
      await this.sincronizarConPostgreSQL(idpartido);
      console.log('✅ PostgreSQL sincronizado');

      // ✅ NUEVO: Actualizar tabla de posiciones
      try {
        console.log('📊 Actualizando tabla de posiciones...');

        // Obtener datos del partido desde PostgreSQL para tener id_campeonato e id_categoria
        const partidoPostgres = await Partido.findByPk(idpartido, {
          include: [{
            model: CampeonatoCategoria,
            as: 'campeonatoCategoria'
          }]
        });

        if (partidoPostgres && partidoPostgres.campeonatoCategoria) {
          // Calcular puntos totales de cada equipo sumando los puntos de cada set
          const puntosTotalesLocal = sets.reduce((sum, set) => sum + (set.scoreA || 0), 0);
          const puntosTotalesVisitante = sets.reduce((sum, set) => sum + (set.scoreB || 0), 0);

          const datosParaTabla = {
            id_campeonato: partidoPostgres.id_campeonato,
            id_categoria: partidoPostgres.campeonatoCategoria.id_categoria,
            equipo_local: partidoPostgres.equipo_local,
            equipo_visitante: partidoPostgres.equipo_visitante,
            sets_local: setsLocal,
            sets_visitante: setsVisitante,
            puntos_local: puntosTotalesLocal,
            puntos_visitante: puntosTotalesVisitante,
            es_wo: false
          };

          const resultadoTabla = await tablaPosicionService.actualizarTablaTrasPartido(datosParaTabla);
          console.log('✅ Tabla de posiciones actualizada:', resultadoTabla.message);
        } else {
          console.log('⚠️ No se pudo obtener campeonatoCategoria para actualizar tabla');
        }
      } catch (tablaError) {
        // No bloquear el flujo si falla la actualización de la tabla
        console.error('⚠️ Error actualizando tabla de posiciones (no crítico):', tablaError.message);
      }

      return partido;
    } catch (error) {
      console.error('❌ Error en guardarPartidoCompletoDesdeApp:', error);
      console.error('Stack:', error.stack);
      throw error;
    }
  }
}

module.exports = new PartidoDigitalService();
