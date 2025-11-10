const personaService = require('../services/personaService');

// CREATE - Crear una persona
const crearPersona = async (req, res) => {
    try {
        const persona = await personaService.crearPersona(req.body);
        res.status(201).json({
            success: true,
            message: 'Persona creada exitosamente',
            data: persona
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener todas las personas activas
const obtenerPersonas = async (req, res) => {
    try {
        const personas = await personaService.obtenerPersonas();
        res.status(200).json({
            success: true,
            message: 'Personas obtenidas exitosamente',
            data: personas,
            total: personas.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener todas las personas (incluyendo inactivas)
const obtenerTodasLasPersonas = async (req, res) => {
    try {
        const personas = await personaService.obtenerTodasLasPersonas();
        res.status(200).json({
            success: true,
            message: 'Todas las personas obtenidas exitosamente',
            data: personas,
            total: personas.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener una persona por ID
const obtenerPersonaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const persona = await personaService.obtenerPersonaPorId(id);
        res.status(200).json({
            success: true,
            message: 'Persona obtenida exitosamente',
            data: persona
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener persona por ID desde body
const getbyId = async (req, res) => {
    try {
        const { id } = req.body;
        const persona = await personaService.getbyId(id);
        res.status(200).json({
            success: true,
            message: 'Persona obtenida exitosamente',
            data: persona
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener persona por CI
const obtenerPersonaPorCI = async (req, res) => {
    try {
        const { ci } = req.params;
        const persona = await personaService.obtenerPersonaPorCI(ci);
        res.status(200).json({
            success: true,
            message: 'Persona obtenida exitosamente',
            data: persona
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener personas por nacionalidad
const obtenerPersonasPorNacionalidad = async (req, res) => {
    try {
        const { id_nacionalidad } = req.params;
        const personas = await personaService.obtenerPersonasPorNacionalidad(id_nacionalidad);
        res.status(200).json({
            success: true,
            message: 'Personas obtenidas exitosamente',
            data: personas,
            total: personas.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener personas por género
const obtenerPersonasPorGenero = async (req, res) => {
    try {
        const { genero } = req.params;
        const personas = await personaService.obtenerPersonasPorGenero(genero);
        res.status(200).json({
            success: true,
            message: 'Personas obtenidas exitosamente',
            data: personas,
            total: personas.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener personas por rango de edad
const obtenerPersonasPorEdad = async (req, res) => {
    try {
        const { edad_minima, edad_maxima } = req.params;
        const personas = await personaService.obtenerPersonasPorEdad(
            parseInt(edad_minima),
            parseInt(edad_maxima)
        );
        res.status(200).json({
            success: true,
            message: 'Personas obtenidas exitosamente',
            data: personas,
            total: personas.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener personas por nombre (búsqueda)
const obtenerPersonasPorNombre = async (req, res) => {
    try {
        const { nombre } = req.params;
        const personas = await personaService.obtenerPersonasPorNombre(nombre);
        res.status(200).json({
            success: true,
            message: 'Personas obtenidas exitosamente',
            data: personas,
            total: personas.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE - Actualizar una persona
const actualizarPersona = async (req, res) => {
    try {
        const { id } = req.params;
        const persona = await personaService.actualizarPersona(id, req.body);
        res.status(200).json({
            success: true,
            message: 'Persona actualizada exitosamente',
            data: persona
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE - Eliminar (desactivar) una persona
const eliminarPersona = async (req, res) => {
    try {
        const { id } = req.params;
        const persona = await personaService.eliminarPersona(id);
        res.status(200).json({
            success: true,
            message: 'Persona eliminada exitosamente',
            data: persona
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
const getConUsuarios= async(req,res)=>{
    console.log('entro')
    try{
        const personas= await personaService.getPersonasConUsuarios();
        res.json(personas);
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

module.exports = {
    crearPersona,
    obtenerPersonas,
    obtenerTodasLasPersonas,
    obtenerPersonaPorId,
    getbyId,
    obtenerPersonaPorCI,
    obtenerPersonasPorNacionalidad,
    obtenerPersonasPorGenero,
    obtenerPersonasPorEdad,
    obtenerPersonasPorNombre,
    actualizarPersona,
    eliminarPersona,getConUsuarios
};

/*const personaService= require('../services/personaService')
const {createPersonaUsuario} = require('../services/registroService')

const registrar = async (req, res) => {
  try {
    const { persona, usuario } = await createPersonaUsuario(
      req.body.persona,
      req.body.usuario
      
    );
    console.log(req);
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

module.exports = { registrar,getConUsuarios };*/