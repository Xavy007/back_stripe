const { Asociacion } = require('../models');

// Siempre existe un único registro — lo crea si no hay ninguno
const obtener = async () => {
  let asociacion = await Asociacion.findOne();
  if (!asociacion) {
    asociacion = await Asociacion.create({ nombre: 'Asociación de Voleibol' });
  }
  return asociacion;
};

const actualizar = async (datos) => {
  let asociacion = await Asociacion.findOne();
  if (!asociacion) {
    asociacion = await Asociacion.create({ nombre: 'Asociación de Voleibol' });
  }
  await asociacion.update(datos);
  return asociacion.reload();
};

module.exports = { obtener, actualizar };
