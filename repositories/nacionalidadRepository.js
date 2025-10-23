const {Nacionalidad} = require('../models');


const createNacionalidad = async(data)=> {
     return await Nacionalidad.create(data);
}
const findAll= async() =>{
    return await Nacionalidad.findAll();
}
const findById= (data)=> data?.id ? Nacionalidad.findByPk(data.id):(() => { throw new Error('Id incorrecto o no existe')});


module.exports={createNacionalidad, findAll,findById}