const {Usuario}= require('../models')

const createUsuario = async (data) => {
    const usuario= await Usuario.create(data);
    return usuario;
};
module.exports={createUsuario}