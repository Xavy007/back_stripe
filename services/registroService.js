const persona = require('../models/persona');
const {createPersona} = require('../repositories/personaRepository');
const { createUsuario} = require('../repositories/usuarioRepository');

const createPersonaUsuario = async (pdata,udata) => {
    const nuevapersona= await createPersona(pdata);
    const nuevousuario= await createUsuario({
        ...udata,
        id_persona:nuevapersona.id_persona
    });
    return {persona:nuevapersona, usuario:nuevousuario};

}
module.exports= {createPersonaUsuario};