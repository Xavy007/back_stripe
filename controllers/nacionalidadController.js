const nacionalidadService=require('../services/nacionalidadService')
const registrar= async(req,res)=>{

    try {
        const nac= await nacionalidadService.createNacionalidad(req.body);
        res.status(201).json(nac)
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}
module.exports= {registrar}