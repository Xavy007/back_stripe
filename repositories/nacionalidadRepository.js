const {Nacionalidad} = require('../models');


const createNacionalidad = async(data)=> {
     return await Nacionalidad.create(data);
}
const findall= async() =>{
    return await Nacionalidad.findall();
}
const findById= (data)=> data?.id ? Nacionalidad.findByPk(data.id):(() => { throw new Error('Id incorrecto o no existe')});


module.exports={createNacionalidad, findall,findById}