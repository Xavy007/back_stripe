


const { Persona, Nacionalidad } = require('../models');

// CREATE - Crear una persona
const crearPersona = async (data) => {
    return await Persona.create(data);
};

// READ - Obtener todas las personas activas
const obtenerPersonas = async () => {
    return await Persona.findAll({ 
        where: { estado: true },
        include: [
            {
                model: Nacionalidad,
                as: 'nacionalidad'
            }
        ]
    });
};

// READ - Obtener TODAS las personas (incluyendo inactivas)
const obtenerTodasLasPersonas = async () => {
    return await Persona.findAll({
        include: [
            {
                model: Nacionalidad,
                as: 'nacionalidad'
            }
        ]
    });
};

// READ - Obtener una persona por ID
const obtenerPersonaPorId = async (id_persona) => {
    return await Persona.findByPk(id_persona, {
        include: [
            {
                model: Nacionalidad,
                as: 'nacionalidad'
            }
        ]
    });
};

// READ - Obtener persona por CI
const obtenerPersonaPorCI = async (ci) => {
    return await Persona.findOne({
        where: { ci: ci },
        include: [
            {
                model: Nacionalidad,
                as: 'nacionalidad'
            }
        ]
    });
};

// READ - Obtener personas por nacionalidad
const obtenerPersonasPorNacionalidad = async (id_nacionalidad) => {
    return await Persona.findAll({
        where: { 
            id_nacionalidad: id_nacionalidad,
            estado: true 
        },
        include: [
            {
                model: Nacionalidad,
                as: 'nacionalidad'
            }
        ]
    });
};

// READ - Obtener personas por género
const obtenerPersonasPorGenero = async (genero) => {
    return await Persona.findAll({
        where: { 
            genero: genero,
            estado: true 
        },
        include: [
            {
                model: Nacionalidad,
                as: 'nacionalidad'
            }
        ]
    });
};

// READ - Obtener personas por rango de edad
const obtenerPersonasPorEdad = async (edad_minima, edad_maxima) => {
    const hoy = new Date();
    const fechaMaxima = new Date(hoy.getFullYear() - edad_minima, hoy.getMonth(), hoy.getDate());
    const fechaMinima = new Date(hoy.getFullYear() - edad_maxima, hoy.getMonth(), hoy.getDate());
    
    return await Persona.findAll({
        where: { 
            fnac: {
                [require('sequelize').Op.between]: [fechaMinima, fechaMaxima]
            },
            estado: true 
        },
        include: [
            {
                model: Nacionalidad,
                as: 'nacionalidad'
            }
        ]
    });
};

// READ - Obtener personas por nombre
const obtenerPersonasPorNombre = async (nombre) => {
    return await Persona.findAll({
        where: { 
            nombre: {
                [require('sequelize').Op.iLike]: `%${nombre}%`
            },
            estado: true 
        },
        include: [
            {
                model: Nacionalidad,
                as: 'nacionalidad'
            }
        ]
    });
};

// UPDATE
const actualizarPersona = async (id_persona, data) => {
    const persona = await Persona.findByPk(id_persona);
    if (!persona) {
        return null;
    }
    return await persona.update(data);
};

// DELETE (soft delete - cambiar estado a false)
const eliminarPersona = async (id_persona) => {
    const persona = await Persona.findByPk(id_persona);
    if (!persona) {
        return null;
    }
    
    return await persona.update({ estado: false });
};
const obtenerPersonasConUsuarios= async() => {
    return await Persona.findAll({
        include:{
            model:Usuario,
            as:'usuario',
            required:true,
        }
    });
};

module.exports = {
    crearPersona,
    obtenerPersonas,
    obtenerTodasLasPersonas,
    obtenerPersonaPorId,
    obtenerPersonaPorCI,
    obtenerPersonasPorNacionalidad,
    obtenerPersonasPorGenero,
    obtenerPersonasPorEdad,
    obtenerPersonasPorNombre,
    actualizarPersona,
    eliminarPersona, obtenerPersonasConUsuarios
};












/*const {Persona,Usuario} = require('../models');


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
module.exports={findPersonasConUsuarios, createPersona};
*/
