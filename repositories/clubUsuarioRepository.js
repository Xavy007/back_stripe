// repositories/clubUsuarioRepository.js
const { ClubUsuario, Usuario, Club, Persona } = require('../models');

/**
 * Crear un nuevo registro en ClubUsuario
 */
async function crear(data, transaction = null) {
  return ClubUsuario.create(data, { transaction });
}

/**
 * Obtener un registro por su PK
 */
async function obtenerPorId(id_club_usuario) {
  return ClubUsuario.findByPk(id_club_usuario, {
    include: [
      {
        model: Usuario,
        as: 'usuario',
        include: [{ model: Persona, as: 'persona' }]
      },
      { model: Club, as: 'club' }
    ]
  });
}

/**
 * Obtener todas las asignaciones de un club
 */
async function obtenerPorClub(id_club, soloActivos = false) {
  const where = { id_club };
  if (soloActivos) where.activo = true;

  return ClubUsuario.findAll({
    where,
    include: [
      {
        model: Usuario,
        as: 'usuario',
        include: [{ model: Persona, as: 'persona' }]
      }
    ],
    order: [['rol_en_club', 'ASC'], ['fecha_inicio', 'DESC']]
  });
}

/**
 * Obtener todas las asignaciones de un usuario
 */
async function obtenerPorUsuario(id_usuario, soloActivos = false) {
  const where = { id_usuario };
  if (soloActivos) where.activo = true;

  return ClubUsuario.findOne({
    where,
    include: [{ model: Club, as: 'club' }],
    order: [['fecha_inicio', 'DESC']]
  });

}

/**
 * Obtener el presidente activo de un club
 */
async function obtenerPresidenteActivo(id_club) {
  return ClubUsuario.findOne({
    where: { id_club, rol_en_club: 'presidente', activo: true },
    include: [
      {
        model: Usuario,
        as: 'usuario',
        include: [{ model: Persona, as: 'persona' }]
      }
    ]
  });
}

/**
 * Actualizar un registro existente
 */
async function actualizar(id_club_usuario, data, transaction = null) {
  const registro = await ClubUsuario.findByPk(id_club_usuario);
  if (!registro) return null;
  return registro.update(data, { transaction });
}

/**
 * Desactivar (soft delete) un registro
 */
async function desactivar(id_club_usuario, transaction = null) {
  const registro = await ClubUsuario.findByPk(id_club_usuario);
  if (!registro) return null;
  return registro.update(
    { activo: false, fecha_fin: new Date() },
    { transaction }
  );
}

// Exportar cada función individualmente
module.exports = {
  crear,
  obtenerPorId,
  obtenerPorClub,
  obtenerPorUsuario,
  obtenerPresidenteActivo,
  actualizar,
  desactivar
};