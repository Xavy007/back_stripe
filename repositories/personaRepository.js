const {Persona,Usuario} = require('../models');


const findPersonasConUsuarios= async() => {
    return await Persona.findAll({
        include:{
            model:Usuario,
            as:'usuario',
            required:true,
        }
    });
};
const createPersona= async(data) =>{
    const persona = await Persona.create(data);
    return persona;
}
const actualizarPersona= async(id_persona, data)=>{
    const person= await Persona.findbyPk(id_persona);
    if(!person){
        return new Error('No se encuentra la persona')
    }
    try {
        
        await person.update(data);
        
    } catch (error) {
        new Error 
    }

}
/*
const createPersonaUsuario=async(personaData,usuarioData)=>{
    const nuevapersona=await Persona.createPersona(personaData)
    const nuevoUsuario=await Usuario.create({
        ...usuarioData,
        id_persona:nuevapersona.id_persona
    });
    return {persona:nuevapersona, usuario:nuevoUsuario}
}
const createPersona = async(data) =>{
    return await Persona.create(data);
}
*/
module.exports={findPersonasConUsuarios, createPersona};