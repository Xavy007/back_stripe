const {Nacionalidad} = require('../models');


const createNacionalidad = async(data)=> {
     return await Nacionalidad.create(data);
}
const findAll= async() =>{
    return await Nacionalidad.findAll({where:{estado:true}});
}
const findById= (data)=> data?.id ? Nacionalidad.findByPk(data.id):(() => { throw new Error('Id incorrecto o no existe')});

const updateNacionalidad = async(id_nacionalidad, data)=>{
    const nacionalidad= await Nacionalidad.findByPk(id_nacionalidad);
    if(!nacionalidad){
        return new Error('No se encuentra la nacionalidad');
    }
    console.log(id_nacionalidad);
    console.log(data);
    try {
        await nacionalidad.update(data);
        return nacionalidad;    
    } catch (error) {
        throw new Error('Error al actualizar la nacionalidad: ' + error.message);
    }
}

const eliminarNacionalidad = async(id_nacionalidad)=>{
    const nacionalidad= await Nacionalidad.findByPk(id_nacionalidad);
    if(!nacionalidad){
        return new Error('No se encuentra la nacionalidad');
    }
    try {
        await nacionalidad.update(
            {estado:false },
            {
            where:{
                    id_nacionalidad:id_nacionalidad,
            },
            }
            

        );
        return nacionalidad;    
    } catch (error) {
        throw new Error('Error al eliminar la nacionalidad: ' + error.message);  
    }

}

module.exports={createNacionalidad, findAll,findById, updateNacionalidad,eliminarNacionalidad}