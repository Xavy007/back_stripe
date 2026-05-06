const { AsociacionCargo, Usuario, GestionCampeonato, Persona } = require('../models');

const INCLUDE = [
  {
    model: Usuario,
    as: 'usuario',
    attributes: ['id_usuario', 'email', 'rol'],
    include: [{ model: Persona, as: 'persona', attributes: ['nombre', 'ap', 'am'] }]
  },
  {
    model: GestionCampeonato,
    as: 'gestion',
    attributes: ['id_gestion', 'nombre', 'gestion']
  }
];

const listar = () =>
  AsociacionCargo.findAll({ include: INCLUDE, order: [['id_gestion', 'DESC'], ['cargo', 'ASC']] });

const listarPorGestion = (id_gestion) =>
  AsociacionCargo.findAll({ where: { id_gestion }, include: INCLUDE, order: [['cargo', 'ASC']] });

const obtener = (id_cargo) =>
  AsociacionCargo.findByPk(id_cargo, { include: INCLUDE });

const crear = (datos) =>
  AsociacionCargo.create(datos);

const actualizar = async (id_cargo, datos) => {
  const registro = await AsociacionCargo.findByPk(id_cargo);
  if (!registro) throw new Error('Cargo no encontrado');
  await registro.update(datos);
  return obtener(id_cargo);
};

const eliminar = async (id_cargo) => {
  const registro = await AsociacionCargo.findByPk(id_cargo);
  if (!registro) throw new Error('Cargo no encontrado');
  await registro.destroy();
};

module.exports = { listar, listarPorGestion, obtener, crear, actualizar, eliminar };
