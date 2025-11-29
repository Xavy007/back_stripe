// services/departamentoService.js
const repo = require('../repositories/departamentoRepository');

const listarDepartamentos = async () => {
    return await repo.obtenerDepartamentos();
};

const obtenerDepartamento = async (id) => {
    const dep = await repo.obtenerDepartamentoPorId(id);
    if (!dep) throw new Error('Departamento no encontrado');
    return dep;
};

const crearDepartamento = async (data) => {
    if (!data.nombre) throw new Error('El nombre es obligatorio');
    if (!data.id_nacionalidad) throw new Error('La nacionalidad es obligatoria');

    return await repo.crearDepartamento(data);
};

const actualizarDepartamento = async (id, data) => {
    const actualizado = await repo.actualizarDepartamento(id, data);
    if (!actualizado) throw new Error('Departamento no encontrado');
    return actualizado;
};

const eliminarDepartamento = async (id) => {
    const eliminado = await repo.eliminarDepartamento(id);
    if (!eliminado) throw new Error('Departamento no encontrado');
    return true;
};

module.exports = {
    listarDepartamentos,
    obtenerDepartamento,
    crearDepartamento,
    actualizarDepartamento,
    eliminarDepartamento
};
