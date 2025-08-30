const personaService= require('../services/personaService')
const {createPersonaUsuario} = require('../services/registroService')

const registrar = async (req, res) => {
  try {
    const { persona, usuario } = await createPersonaUsuario(
      req.body.persona,
      req.body.usuario
    );
    res.status(201).json({ persona, usuario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



const getConUsuarios= async(req,res)=>{
    try{
        const personas= await personaService.getPersonasConUsuarios();
        res.json(personas);
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

module.exports = { registrar,getConUsuarios };