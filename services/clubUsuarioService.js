// services/clubUsuarioService.js
const ClubUsuarioRepository = require('../repositories/clubUsuarioRepository');
const { sequelize } = require('../models');

/**
 * Crear asignación de usuario a club con control de ingreso
 */
async function crearAsignacion(data, usuarioAccion) {
  const transaction = await sequelize.transaction();
  try {
    // Validación de negocio: evitar dos presidentes activos
    if (data.rol_en_club === 'presidente') {
      const presidenteActivo = await ClubUsuarioRepository.obtenerPresidenteActivo(data.id_club);
      if (presidenteActivo) {
        throw new Error('Ya existe un presidente activo en este club');
      }
    }

    // Crear registro
    const nuevoRegistro = await ClubUsuarioRepository.crear(data, transaction);

    // Auditoría simple
    console.log(`[AUDITORÍA] Usuario ${usuarioAccion} creó asignación:`, nuevoRegistro.toJSON());

    await transaction.commit();
    return nuevoRegistro;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

/**
 * Actualizar asignación con control
 */
async function actualizarAsignacion(id_club_usuario, data, usuarioAccion) {
  const transaction = await sequelize.transaction();
  try {
    const actualizado = await ClubUsuarioRepository.actualizar(id_club_usuario, data, transaction);
    if (!actualizado) throw new Error('Registro no encontrado');

    console.log(`[AUDITORÍA] Usuario ${usuarioAccion} actualizó asignación ${id_club_usuario}`);
    await transaction.commit();
    return actualizado;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

/**
 * Desactivar asignación con control
 */
async function desactivarAsignacion(id_club_usuario, usuarioAccion) {
  const transaction = await sequelize.transaction();
  try {
    const desactivado = await ClubUsuarioRepository.desactivar(id_club_usuario, transaction);
    if (!desactivado) throw new Error('Registro no encontrado');

    console.log(`[AUDITORÍA] Usuario ${usuarioAccion} desactivó asignación ${id_club_usuario}`);
    await transaction.commit();
    return desactivado;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}



async function obtenerPorUsuario(id_usuario){
      
  try {
    const club=await ClubUsuarioRepository.obtenerPorUsuario(id_usuario);
    
    return club;        

  } catch (error) {
     throw error;     
   }

}

// Exportar cada función individualmente
module.exports = {
  crearAsignacion,
  actualizarAsignacion,
  desactivarAsignacion,
  obtenerPorUsuario
};