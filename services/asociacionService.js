const repo = require('../repositories/asociacionRepository');

const obtener = async () => {
  const data = await repo.obtener();
  return { success: true, data };
};

const actualizar = async (datos, archivo) => {
  const campos = { ...datos };
  if (archivo) {
    campos.logo = `/uploads/asociacion/${archivo.filename}`;
  }
  const data = await repo.actualizar(campos);
  return { success: true, message: 'Datos actualizados correctamente', data };
};

module.exports = { obtener, actualizar };
