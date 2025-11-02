const { Cancha } = require('../models');

const crearCancha = async (data) => {
    return await Cancha.create(data);
}
const obtenerCanchas = async () => {
    return await Cancha.findAll({ where: { estado: true } });
}
const obtenerCanchaPorId = async (id_cancha) => {
    try {
        return await Cancha.findByPk(id_cancha);

    } catch (error) {
        throw new Error('No exixste la cancha');
    }

}
const actualizarCancha = async (id_cancha, data) => {
    const cancha = await Cancha.findByPk(id_cancha);
    if (!cancha) {
        return null;
    }
    return await cancha.update(data);
}
const eliminarCancha = async (id_cancha) => {
    const cancha = await Cancha.findByPk(id_cancha);
    if (!cancha){return null;} 
    return await cancha.update(
            { estado: false },
            {
                where: {
                    id_cancha: id_cancha
                }
            }

        );

}

module.exports = { crearCancha, obtenerCanchaPorId, obtenerCanchas, actualizarCancha, eliminarCancha }