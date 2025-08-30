const nacionalidadRepository= require('../repositories/nacionalidadRepository')

const createNacionalidad= async (data)=>{
    console.log(data)
    try{
        await nacionalidadRepository.createNacionalidad(data)
    }catch(err){
        console.log(err)
    }
}
module.exports={createNacionalidad};