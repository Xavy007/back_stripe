// repositories/departamentoRepository.js
const { Departamento, Nacionalidad } = require('../models');

// Crear departamento
const crearDepartamento = async (data) => {
    return await Departamento.create(data);
};

// Obtener todos (solo activos si tienes estado)
const obtenerDepartamentos = async () => {
    return await Departamento.findAll({
        include: [
            {
                model: Nacionalidad,
                as: 'nacionalidad',
                attributes: ['id_nacionalidad', 'pais']
            }
        ],
        order: [['id_departamento', 'ASC']]
    });
};

// Obtener uno
const obtenerDepartamentoPorId = async (id_departamento) => {
    const dep = await Departamento.findByPk(id_departamento, {
        include: [
            {
                model: Nacionalidad,
                as: 'nacionalidad',
                attributes: ['id_nacionalidad', 'pais']
            }
        ]
    });
    return dep;
};

// Actualizar
const actualizarDepartamento = async (id_departamento, data) => {
    const dep = await Departamento.findByPk(id_departamento);
    if (!dep) return null;
    return await dep.update(data);
};

// Eliminar (soft delete opcional)
const eliminarDepartamento = async (id_departamento) => {
    const dep = await Departamento.findByPk(id_departamento);
    if (!dep) return null;

    // si NO usas "estado", elimina real:
    return await dep.destroy();
};

module.exports = {
    crearDepartamento,
    obtenerDepartamentos,
    obtenerDepartamentoPorId,
    actualizarDepartamento,
    eliminarDepartamento
};
