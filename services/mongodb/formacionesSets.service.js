// services/mongodb/formacionesSets.service.js
const formacionesSetsRepo = require('../../repositories/mongodb/formacionesSets.repository');
const partidoDigitalService = require('./partidoDigital.service');

class FormacionesSetsService {
  
  async obtenerFormacion(idpartido, numero_set) {
    const formacion = await formacionesSetsRepo.findByPartidoYSet(idpartido, numero_set);
    
    if (!formacion) {
      throw new Error(`Formación del set ${numero_set} no encontrada`);
    }
    
    return formacion;
  }

  async registrarFormacion(idpartido, numero_set, formaciones, equipoRecibidor, userId) {
    // Verificar que no exista
    const existe = await formacionesSetsRepo.findByPartidoYSet(idpartido, numero_set);
    if (existe) {
      throw new Error(`Ya existe formación para el set ${numero_set}`);
    }

    // Validar formaciones
    await this._validarFormacion(formaciones.formacion_local);
    await this._validarFormacion(formaciones.formacion_visitante);

    return await formacionesSetsRepo.create({
      idpartido,
      numero_set,
      ...formaciones,
      equipo_recibidor: equipoRecibidor,
      estado: 'pendiente',
      registrado_por: {
        usuario_id: userId,
        timestamp: new Date()
      }
    });
  }

  async confirmarFormacion(idpartido, numero_set, equipo, userId) {
    const formacion = await this.obtenerFormacion(idpartido, numero_set);

    const confirmada = await formacionesSetsRepo.confirmar(
      idpartido, 
      numero_set, 
      equipo, 
      userId
    );

    // Si ambos equipos confirmaron, cambiar estado
    if (confirmada.confirmaciones.local.confirmado && 
        confirmada.confirmaciones.visitante.confirmado) {
      await formacionesSetsRepo.updateEstado(idpartido, numero_set, 'confirmada');
    }

    return confirmada;
  }

  async iniciarJuegoConFormacion(idpartido, numero_set) {
    const formacion = await this.obtenerFormacion(idpartido, numero_set);

    if (formacion.estado !== 'confirmada') {
      throw new Error('Ambos equipos deben confirmar la formación antes de iniciar');
    }

    return await formacionesSetsRepo.updateEstado(idpartido, numero_set, 'en_juego');
  }

  async _validarFormacion(formacion) {
    const { posicion_I, posicion_II, posicion_III, posicion_IV, posicion_V, posicion_VI } = formacion;
    
    const posiciones = [posicion_I, posicion_II, posicion_III, posicion_IV, posicion_V, posicion_VI];
    
    // Verificar que no haya dorsales repetidos
    const dorsalesUnicos = new Set(posiciones);
    if (dorsalesUnicos.size !== 6) {
      throw new Error('No puede haber jugadores repetidos en la formación');
    }

    // Verificar que el orden de rotación coincida
    if (formacion.orden_rotacion.length !== 6) {
      throw new Error('El orden de rotación debe tener 6 jugadores');
    }

    return true;
  }

  async obtenerTodasFormaciones(idpartido) {
    return await formacionesSetsRepo.findByPartido(idpartido);
  }
}

module.exports = new FormacionesSetsService();
