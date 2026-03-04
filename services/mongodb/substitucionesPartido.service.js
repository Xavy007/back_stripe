// services/mongodb/substitucionesPartido.service.js
const substitucionesRepo = require('../../repositories/mongodb/substitucionesPartido.repository');
const setsPartidoService = require('./setsPartido.service');
const partidoDigitalService = require('./partidoDigital.service');

class SubstitucionesPartidoService {
  
  async registrarSustitucion(idpartido, numero_set, datosSubstitucion, userId) {
    const { equipo, jugador_sale, jugador_entra, tipo_sustitucion } = datosSubstitucion;

    // Validar límite de sustituciones (máximo 6 por set, excepto libero)
    if (tipo_sustitucion !== 'libero') {
      const conteo = await substitucionesRepo.countByEquipoYSet(
        idpartido, 
        numero_set, 
        equipo
      );

      if (conteo >= 6) {
        throw new Error(`El equipo ${equipo} ya realizó las 6 sustituciones permitidas en este set`);
      }
    }

    // Validar que el jugador que sale esté en cancha
    await this._validarJugadorEnCancha(idpartido, equipo, jugador_sale.dorsal);

    // Validar que el jugador que entra no esté en cancha
    await this._validarJugadorFueraCancha(idpartido, equipo, jugador_entra.dorsal);

    // Obtener marcador actual
    const set = await setsPartidoService.obtenerSetActual(idpartido, numero_set);

    // Obtener número de sustitución
    const sustitucionesAnteriores = await substitucionesRepo.findByEquipo(
      idpartido, 
      numero_set, 
      equipo
    );
    const numeroSustitucion = sustitucionesAnteriores.filter(
      s => s.cuenta_en_limite
    ).length + 1;

    // Crear sustitución
    const sustitucion = await substitucionesRepo.create({
      idpartido,
      numero_set,
      numero_sustitucion: numeroSustitucion,
      equipo,
      jugador_sale,
      jugador_entra,
      tipo_sustitucion,
      marcador: {
        local: set.puntos_local,
        visitante: set.puntos_visitante
      },
      cuenta_en_limite: tipo_sustitucion !== 'libero',
      es_reversible: tipo_sustitucion === 'regular',
      registrado_por: {
        usuario_id: userId,
        usuario_nombre: 'Usuario', // Obtener de BD
        timestamp: new Date()
      }
    });

    return sustitucion;
  }

  async registrarCambioLibero(idpartido, numero_set, equipo, liberoSale, liberoEntra, userId) {
    return await this.registrarSustitucion(
      idpartido,
      numero_set,
      {
        equipo,
        jugador_sale: { dorsal: liberoSale },
        jugador_entra: { dorsal: liberoEntra },
        tipo_sustitucion: 'libero'
      },
      userId
    );
  }

  async obtenerSubstitucionesPartido(idpartido) {
    return await substitucionesRepo.findByPartido(idpartido);
  }

  async obtenerSubstitucionesSet(idpartido, numero_set) {
    return await substitucionesRepo.findByPartidoYSet(idpartido, numero_set);
  }

  async obtenerSubstitucionesEquipo(idpartido, numero_set, equipo) {
    return await substitucionesRepo.findByEquipo(idpartido, numero_set, equipo);
  }

  async obtenerSubstitucionesDisponibles(idpartido, numero_set, equipo) {
    const utilizadas = await substitucionesRepo.countByEquipoYSet(
      idpartido, 
      numero_set, 
      equipo
    );

    return {
      utilizadas,
      disponibles: 6 - utilizadas,
      limite_alcanzado: utilizadas >= 6
    };
  }

  async obtenerHistorialJugador(idpartido, dorsal) {
    return await substitucionesRepo.findByJugador(idpartido, dorsal);
  }

  async _validarJugadorEnCancha(idpartido, equipo, dorsal) {
    // Aquí deberías verificar la formación actual o rotación
    // Para simplificar, asumimos que es válido
    return true;
  }

  async _validarJugadorFueraCancha(idpartido, equipo, dorsal) {
    // Aquí deberías verificar que el jugador no esté en la formación actual
    return true;
  }

  async obtenerResumenSubstituciones(idpartido) {
    const todas = await this.obtenerSubstitucionesPartido(idpartido);

    const porEquipo = {
      local: todas.filter(s => s.equipo === 'local').length,
      visitante: todas.filter(s => s.equipo === 'visitante').length
    };

    const porTipo = {
      regular: todas.filter(s => s.tipo_sustitucion === 'regular').length,
      libero: todas.filter(s => s.tipo_sustitucion === 'libero').length,
      excepcional: todas.filter(s => s.tipo_sustitucion === 'excepcional').length,
      por_lesion: todas.filter(s => s.tipo_sustitucion === 'por_lesion').length
    };

    return { porEquipo, porTipo, total: todas.length };
  }
}

module.exports = new SubstitucionesPartidoService();
