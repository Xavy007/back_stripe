const nacionalidadService=require('../services/nacionalidadService')
const registrar= async(req,res)=>{

    try {
        const nac= await nacionalidadService.createNacionalidad(req.body);
        res.status(201).json(nac)
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

const getbyId= async(req,res)=>{
    try {
        const nac= await nacionalidadService.findById(req.body);
        res.status(201).json(nac);
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}
const getbyIdParam=async(req,res)=>{
    try {
        const id = parseInt(req.params.id);
        const data = { id };
        const nac= await nacionalidadService.findById(data);
        console.log(nac)
        res.status(201).json(nac);
    } catch (error) {
        res.status(500).json({error:err.message});
    }
}
const getAll = async (req, res) => {
  try {
    const nacionalidades = await nacionalidadService.getAll();
    console.log('getAll result count:', Array.isArray(nacionalidades) ? nacionalidades.length : 0);
    return res.status(200).json(nacionalidades);
  } catch (err) {
    console.error('getAll error:', err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports= {registrar,getbyId,getbyIdParam,getAll}