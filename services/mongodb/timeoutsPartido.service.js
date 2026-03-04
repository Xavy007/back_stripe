
// services/mongodb/timeoutsPartido.service.js
const timeoutsRepo = require('../../repositories/mongodb/timeoutsPartido.repository');
const setsPartidoService = require('./setsPartido.service');

class TimeoutsPartidoService {
  
  async solicitarTimeout(idpartido, numero_set, equipo, solicitadoPor, userId) {
    // Validar que no haya timeout activo
    const timeoutActivo = await timeoutsRepo.findTimeoutActivo(idpartido, numero_set);
    if (timeoutActivo) {
      throw new Error('Ya hay un timeout en curso');
    }

    // Validar límite de timeouts (máximo 2 por set por equipo)
    const conteo = await timeoutsRepo.countByEquipoYSet(
      idpartido, 
      numero_set, 
      equipo
    );

    if (conteo >= 2) {
      throw new Error(`El equipo ${equipo} ya utilizó sus 2 timeouts en este set`);
    }

    // Obtener marcador actual
    const set = await setsPartidoService.obtenerSetActual(idpartido, numero_set);

    // Crear timeout
    const timeout = await timeoutsRepo.create({
      idpartido,
      numero_set,
      numero_timeout: conteo + 1,
      equipo,
      timestamp_inicio: new Date(),
      marcador: {
        local: set.puntos_local,
        visitante: set.puntos_visitante
      },
      solicitado_por: solicitadoPor,
      es_timeout_tecnico: false,
      registrado_por: {
        usuario_id: userId,
        usuario_nombre: 'Usuario',
        timestamp: new Date()
      }
    });

    return timeout;
  }

  async finalizarTimeout(idpartido, numero_set, numero_timeout, equipo) {
    const timeout = await timeoutsRepo.finalizarTimeout(
      idpartido, 
      numero_set, 
      numero_timeout, 
      equipo
    );

    if (!timeout) {
      throw new Error('Timeout no encontrado');
    }

    // Calcular duración real
    const duracionSegundos = Math.floor(
      (new Date(timeout.timestamp_fin) - new Date(timeout.timestamp_inicio)) / 1000
    );

    await TimeoutsPartido.findByIdAndUpdate(
      timeout._id,
      { duracion_segundos: duracionSegundos }
    );

    return timeout;
  }

  async registrarTimeoutTecnico(idpartido, numero_set, equipoSolicita, marcadorPuntos, userId) {
    // Timeout técnico automático (ej: a los 8 y 16 puntos en algunos torneos)
    const set = await setsPartidoService.obtenerSetActual(idpartido, numero_set);

    const timeout = await timeoutsRepo.create({
      idpartido,
      numero_set,
      numero_timeout: 0, // Los técnicos no cuentan en la numeración
      equipo: equipoSolicita,
      timestamp_inicio: new Date(),
      marcador: {
        local: set.puntos_local,
        visitante: set.puntos_visitante
      },
      solicitado_por: {
        tipo: 'arbitro',
        nombre: 'Timeout Técnico'
      },
      es_timeout_tecnico: true,
      duracion_segundos: 60, // Generalmente 60 segundos
      registrado_por: {
        usuario_id: userId,
        timestamp: new Date()
      }
    });

    // Finalizar automáticamente después de 60 segundos
    setTimeout(async () => {
      await timeoutsRepo.finalizarTimeout(idpartido, numero_set, 0, equipoSolicita);
    }, 60000);

    return timeout;
  }

  async obtenerTimeoutsPartido(idpartido) {
    return await timeoutsRepo.findByPartido(idpartido);
  }

  async obtenerTimeoutsSet(idpartido, numero_set) {
    return await timeoutsRepo.findByPartidoYSet(idpartido, numero_set);
  }

  async obtenerTimeoutsEquipo(idpartido, numero_set, equipo) {
    return await timeoutsRepo.findByEquipo(idpartido, numero_set, equipo);
  }

  async obtenerTimeoutsDisponibles(idpartido, numero_set, equipo) {
    const utilizados = await timeoutsRepo.countByEquipoYSet(
      idpartido, 
      numero_set, 
      equipo
    );

    return {
      utilizados,
      disponibles: 2 - utilizados,
      limite_alcanzado: utilizados >= 2
    };
  }

  async obtenerResumenTimeouts(idpartido) {
    const todos = await this.obtenerTimeoutsPartido(idpartido);

    const porEquipo = {
      local: todos.filter(t => t.equipo === 'local' && !t.es_timeout_tecnico).length,
      visitante: todos.filter(t => t.equipo === 'visitante' && !t.es_timeout_tecnico).length
    };

    const tecnicos = todos.filter(t => t.es_timeout_tecnico).length;

    return { 
      porEquipo, 
      tecnicos, 
      total: todos.length 
    };
  }
}

module.exports = new TimeoutsPartidoService();
