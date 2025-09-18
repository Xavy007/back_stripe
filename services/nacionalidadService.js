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

module.exports={createNacionalidad, findById};