const {Nacionalidad} = require('../models');


const createNacionalidad = async(data)=> {
    console.log("llegue a repo" , Nacionalidad)
    return await Nacionalidad.create(data);
}

module.exports={createNacionalidad}