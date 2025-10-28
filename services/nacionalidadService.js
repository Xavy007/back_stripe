const nacionalidadRepository= require('../repositories/nacionalidadRepository')
const Nacionalidad= require('../models/nacionalidad')
const createNacionalidad= async (data)=>{
    console.log(data)
    try{
        await nacionalidadRepository.createNacionalidad(data)
    }catch(err){
        console.log(err)
    }
}

const findById= async(data)=>{
    try {
        const nac = nacionalidadRepository.findById(data);
        return nac;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
const getAll=async()=>{
    try {
        const nac= nacionalidadRepository.findAll();
        return nac;
    } catch (error) {
        console.log(error);
        throw error;
        
    }
}
const updateNacionalidad= async(id_nacionalidad, data)=>{
    try{
        await nacionalidadRepository.updateNacionalidad(id_nacionalidad, data);
    }
    catch (error) {
        throw error;
    }
}
const deleteNacionalidad= async(id_nacionalidad)=>{
    try {
        await nacionalidadRepository.eliminarNacionalidad(id_nacionalidad);
    } catch (error) {
        throw error;
    }
}

module.exports={createNacionalidad, findById,getAll, updateNacionalidad, deleteNacionalidad};