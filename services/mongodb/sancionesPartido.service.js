// services/mongodb/sancionesPartido.service.js
const sancionesRepo = require('../../repositories/mongodb/sancionesPartido.repository');
const setsPartidoService = require('./setsPartido.service');
const estadisticasService = require('./estadisticasPartido.service');

class SancionesPartidoService {
  
  async registrarSancion(idpartido, numero_set, datosSancion, userId) {
    const { equipo, tipo_sancion, sancionado, motivo, descripcion } = datosSancion;

    // Obtener marcador actual
    const set = await setsPartidoService.obtenerSetActual(idpartido, numero_set);

    // Validar escalada de sanciones (amarilla -> roja -> expulsión)
    if (sancionado.tipo_persona === 'jugador' && sancionado.idjugador) {
      await this._validarEscaladaSanciones(
        idpartido, 
        numero_set, 
        sancionado.idjugador, 
        tipo_sancion
      );
    }

    // Determinar consecuencias
    const consecuencia = this._determinarConsecuencia(tipo_sancion);

    // Crear sanción
    const sancion = await sancionesRepo.create({
      idpartido,
      numero_set,
      timestamp: new Date(),
      equipo,
      tipo_sancion,
      sancionado,
      motivo,
      descripcion,
      consecuencia,
      marcador: {
        local: set.puntos_local,
        visitante: set.puntos_visitante
      },
      registrado_por: {
        usuario_id: userId,
        usuario_nombre: 'Usuario',
        timestamp: new Date()
      }
    });

    // Actualizar estadísticas del jugador
    if (sancionado.tipo_persona === 'jugador' && sancionado.dorsal) {
      await estadisticasService.actualizarSanciones(
        idpartido,
        equipo,
        sancionado.dorsal,
        tipo_sancion
      );
    }

    return sancion;
  }

  async registrarAdvertencia(idpartido, numero_set, equipo, sancionado, motivo, userId) {
    return await this.registrarSancion(
      idpartido,
      numero_set,
      {
        equipo,
        tipo_sancion: 'advertencia',
        sancionado,
        motivo,
        descripcion: 'Advertencia verbal'
      },
      userId
    );
  }

  async registrarPenalty(idpartido, numero_set, equipo, sancionado, motivo, userId) {
    return await this.registrarSancion(
      idpartido,
      numero_set,
      {
        equipo,
        tipo_sancion: 'penalty',
        sancionado,
        motivo,
        descripcion: 'Tarjeta amarilla - Penalty'
      },
      userId
    );
  }

  async registrarExpulsion(idpartido, numero_set, equipo, sancionado, motivo, userId) {
    return await this.registrarSancion(
      idpartido,
      numero_set,
      {
        equipo,
        tipo_sancion: 'expulsion',
        sancionado,
        motivo,
        descripcion: 'Tarjeta roja - Expulsión del set'
      },
      userId
    );
  }

  async registrarDescalificacion(idpartido, numero_set, equipo, sancionado, motivo, userId) {
    return await this.registrarSancion(
      idpartido,
      numero_set,
      {
        equipo,
        tipo_sancion: 'descalificacion',
        sancionado,
        motivo,
        descripcion: 'Tarjetas amarilla + roja - Descalificación del partido'
      },
      userId
    );
  }

  async obtenerSancionesPartido(idpartido) {
    return await sancionesRepo.findByPartido(idpartido);
  }

  async obtenerSancionesSet(idpartido, numero_set) {
    return await sancionesRepo.findByPartidoYSet(idpartido, numero_set);
  }

  async obtenerSancionesEquipo(idpartido, equipo) {
    return await sancionesRepo.findByEquipo(idpartido, equipo);
  }

  async obtenerSancionesJugador(idpartido, idjugador) {
    return await sancionesRepo.findByJugador(idpartido, idjugador);
  }

  async _validarEscaladaSanciones(idpartido, numero_set, idjugador, nuevaSancion) {
    const sanciones = await sancionesRepo.findSancionesJugadorEnSet(
      idpartido, 
      numero_set, 
      idjugador
    );

    // Si ya tiene una amarilla y recibe otra, debe ser expulsión
    const tieneAmarilla = sanciones.some(s => s.tipo_sancion === 'penalty');
    
    if (tieneAmarilla && nuevaSancion === 'penalty') {
      throw new Error('El jugador ya tiene una tarjeta amarilla. La siguiente sanción debe ser expulsión.');
    }

    // Si ya fue expulsado, no puede recibir más sanciones en este set
    const fueExpulsado = sanciones.some(
      s => s.tipo_sancion === 'expulsion' || s.tipo_sancion === 'descalificacion'
    );

    if (fueExpulsado) {
      throw new Error('El jugador ya fue expulsado/descalificado en este set.');
    }
  }

  _determinarConsecuencia(tipo_sancion) {
    switch (tipo_sancion) {
      case 'advertencia':
        return {
          punto_rival: false,
          saque_rival: false,
          expulsado_set: false,
          expulsado_partido: false
        };

      case 'penalty':
        return {
          punto_rival: true,
          saque_rival: true,
          expulsado_set: false,
          expulsado_partido: false
        };

      case 'expulsion':
        return {
          punto_rival: true,
          saque_rival: true,
          expulsado_set: true,
          expulsado_partido: false
        };

      case 'descalificacion':
        return {
          punto_rival: true,
          saque_rival: true,
          expulsado_set: true,
          expulsado_partido: true
        };

      default:
        return {};
    }
  }

  async obtenerResumenSanciones(idpartido) {
    const todas = await this.obtenerSancionesPartido(idpartido);

    const porTipo = {
      advertencias: todas.filter(s => s.tipo_sancion === 'advertencia').length,
      penalties: todas.filter(s => s.tipo_sancion === 'penalty').length,
      expulsiones: todas.filter(s => s.tipo_sancion === 'expulsion').length,
      descalificaciones: todas.filter(s => s.tipo_sancion === 'descalificacion').length
    };

    const porEquipo = {
      local: todas.filter(s => s.equipo === 'local').length,
      visitante: todas.filter(s => s.equipo === 'visitante').length
    };

    return { 
      porTipo, 
      porEquipo, 
      total: todas.length 
    };
  }
}

module.exports = new SancionesPartidoService();
