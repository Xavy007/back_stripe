// sockets/partido.socket.js

/**
 * Socket handler para partidos en vivo
 * Maneja la transmisión en tiempo real de partidos de volleyball
 */

module.exports = (io) => {
  // Namespace específico para partidos
  const partidoNamespace = io.of('/partidos');

  // Almacenamiento en memoria de partidos activos
  const partidosActivos = new Map();

  partidoNamespace.on('connection', (socket) => {
    console.log(`✅ Cliente conectado al namespace de partidos: ${socket.id}`);

    /**
     * Crear un nuevo partido
     * Recibe: { matchId, equipoLocal, equipoVisitante, categoria, campeonato, ... }
     */
    socket.on('create-match', (matchData) => {
      try {
        const { matchId } = matchData;

        // Inicializar datos del partido
        const partido = {
          matchId,
          ...matchData,
          createdAt: new Date(),
          estado: 'preparacion', // preparacion, en_juego, finalizado
          espectadores: 0,
          sets: [],
          puntosLocal: 0,
          puntosVisitante: 0,
          setActual: 1
        };

        partidosActivos.set(matchId, partido);

        // El creador se une automáticamente a la sala
        socket.join(matchId);

        console.log(`🏐 Partido creado: ${matchId}`);

        socket.emit('match-created', {
          success: true,
          matchId,
          data: partido
        });

        // Notificar a todos que hay un nuevo partido disponible
        partidoNamespace.emit('new-match-available', {
          matchId,
          equipoLocal: matchData.equipoLocal,
          equipoVisitante: matchData.equipoVisitante,
          categoria: matchData.categoria
        });

      } catch (error) {
        console.error('❌ Error creando partido:', error);
        socket.emit('match-error', {
          message: 'Error al crear el partido',
          error: error.message
        });
      }
    });

    /**
     * Unirse a un partido existente como espectador
     * Recibe: matchId (código corto como "A5")
     */
    socket.on('join-match', (matchId) => {
      try {
        const fullMatchId = matchId.startsWith('match_') ? matchId : `match_${matchId}`;
        const partido = partidosActivos.get(fullMatchId);

        if (!partido) {
          socket.emit('match-error', {
            message: 'Partido no encontrado',
            matchId
          });
          return;
        }

        // Unirse a la sala del partido
        socket.join(fullMatchId);
        partido.espectadores++;

        console.log(`👁️ Espectador unido al partido ${fullMatchId} (${partido.espectadores} espectadores)`);

        // Enviar datos actuales del partido al nuevo espectador
        socket.emit('match-data', partido);

        // Notificar a todos en la sala que hay un nuevo espectador
        partidoNamespace.to(fullMatchId).emit('spectator-joined', {
          espectadores: partido.espectadores
        });

      } catch (error) {
        console.error('❌ Error uniéndose al partido:', error);
        socket.emit('match-error', {
          message: 'Error al unirse al partido',
          error: error.message
        });
      }
    });

    /**
     * Actualizar datos del partido en tiempo real
     * Recibe: { matchId, data: { puntosLocal, puntosVisitante, setActual, ... } }
     */
    socket.on('update-match', ({ matchId, data }) => {
      try {
        const fullMatchId = matchId.startsWith('match_') ? matchId : `match_${matchId}`;
        const partido = partidosActivos.get(fullMatchId);

        if (!partido) {
          socket.emit('match-error', {
            message: 'Partido no encontrado',
            matchId
          });
          return;
        }

        // Actualizar datos del partido
        Object.assign(partido, data, {
          updatedAt: new Date()
        });

        console.log(`📊 Partido actualizado: ${fullMatchId}`, data);

        // Broadcast a todos los espectadores de este partido
        partidoNamespace.to(fullMatchId).emit('match-updated', {
          matchId: fullMatchId,
          data: partido
        });

      } catch (error) {
        console.error('❌ Error actualizando partido:', error);
        socket.emit('match-error', {
          message: 'Error al actualizar el partido',
          error: error.message
        });
      }
    });

    /**
     * Actualizar puntaje (evento específico para mejor UX)
     */
    socket.on('update-score', ({ matchId, puntosLocal, puntosVisitante, setActual }) => {
      try {
        const fullMatchId = matchId.startsWith('match_') ? matchId : `match_${matchId}`;
        const partido = partidosActivos.get(fullMatchId);

        if (!partido) return;

        partido.puntosLocal = puntosLocal;
        partido.puntosVisitante = puntosVisitante;
        partido.setActual = setActual;
        partido.updatedAt = new Date();

        // Broadcast actualización de puntaje
        partidoNamespace.to(fullMatchId).emit('score-updated', {
          puntosLocal,
          puntosVisitante,
          setActual
        });

      } catch (error) {
        console.error('❌ Error actualizando puntaje:', error);
      }
    });

    /**
     * Finalizar un partido
     * Recibe: matchId
     */
    socket.on('end-match', (matchId) => {
      try {
        const fullMatchId = matchId.startsWith('match_') ? matchId : `match_${matchId}`;
        const partido = partidosActivos.get(fullMatchId);

        if (!partido) return;

        partido.estado = 'finalizado';
        partido.finalizadoAt = new Date();

        console.log(`🏁 Partido finalizado: ${fullMatchId}`);

        // Notificar a todos que el partido finalizó
        partidoNamespace.to(fullMatchId).emit('match-ended', {
          matchId: fullMatchId,
          resultado: {
            equipoLocal: partido.equipoLocal,
            equipoVisitante: partido.equipoVisitante,
            puntosLocal: partido.puntosLocal,
            puntosVisitante: partido.puntosVisitante
          }
        });

        // Eliminar partido de memoria después de 5 minutos
        setTimeout(() => {
          partidosActivos.delete(fullMatchId);
          console.log(`🗑️ Partido eliminado de memoria: ${fullMatchId}`);
        }, 60000 * 5); // 5 minutos

      } catch (error) {
        console.error('❌ Error finalizando partido:', error);
      }
    });

    /**
     * Obtener lista de partidos disponibles
     */
    socket.on('get-matches', () => {
      try {
        const partidos = Array.from(partidosActivos.values())
          .filter(p => p.estado !== 'finalizado')
          .map(p => ({
          matchId: p.matchId,
          // Campos esperados por el frontend
          teamA: p.teamA || p.equipoLocal || '',
          teamB: p.teamB || p.equipoVisitante || '',
          scoreA: p.scoreA || p.puntosLocal || 0,
          scoreB: p.scoreB || p.puntosVisitante || 0,
          setsA: p.setsA || 0,
          setsB: p.setsB || 0,
          currentSet: p.currentSet || p.setActual || 1,
          seconds: p.seconds || 0,
          isRunning: p.isRunning || false,
          // Campos adicionales
          categoria: p.categoria,
          estado: p.estado,
          espectadores: p.espectadores,
          matchHistory: p.matchHistory || [],
          setScores: p.setScores || []
        }));

        console.log(`📋 Enviando ${partidos.length} partidos disponibles`);
        socket.emit('matches-list', partidos);
      } catch (error) {
        console.error('❌ Error obteniendo partidos:', error);
        socket.emit('match-error', {
          message: 'Error al obtener partidos',
          error: error.message
        });
      }
    });

    /**
     * Salir de un partido
     */
    socket.on('leave-match', (matchId) => {
      try {
        const fullMatchId = matchId.startsWith('match_') ? matchId : `match_${matchId}`;
        const partido = partidosActivos.get(fullMatchId);

        if (partido) {
          partido.espectadores = Math.max(0, partido.espectadores - 1);
          socket.leave(fullMatchId);

          partidoNamespace.to(fullMatchId).emit('spectator-left', {
            espectadores: partido.espectadores
          });

          console.log(`👋 Espectador salió del partido ${fullMatchId}`);
        }
      } catch (error) {
        console.error('❌ Error saliendo del partido:', error);
      }
    });

    /**
     * Evento de jugada (punto, sustitución, time-out, etc.)
     */
    socket.on('match-event', ({ matchId, evento }) => {
      try {
        const fullMatchId = matchId.startsWith('match_') ? matchId : `match_${matchId}`;
        const partido = partidosActivos.get(fullMatchId);

        if (!partido) return;

        // Agregar evento al historial
        if (!partido.eventos) partido.eventos = [];
        partido.eventos.push({
          ...evento,
          timestamp: new Date()
        });

        // Broadcast evento a todos
        partidoNamespace.to(fullMatchId).emit('match-event', {
          matchId: fullMatchId,
          evento: {
            ...evento,
            timestamp: new Date()
          }
        });

      } catch (error) {
        console.error('❌ Error procesando evento:', error);
      }
    });

    /**
     * Desconexión del cliente
     */
    socket.on('disconnect', () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`);

      // Decrementar espectadores de todos los partidos donde estaba
      partidosActivos.forEach((partido, matchId) => {
        if (socket.rooms.has(matchId)) {
          partido.espectadores = Math.max(0, partido.espectadores - 1);
          partidoNamespace.to(matchId).emit('spectator-left', {
            espectadores: partido.espectadores
          });
        }
      });
    });
  });

  return partidoNamespace;
};
