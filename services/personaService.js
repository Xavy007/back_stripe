
const personaRepo= require('../repositories/personaRepository');

exports.getPersonasConUsuarios = async()=>{
    return await personaRepo.findPersonasConUsuarios();
}
