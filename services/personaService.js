const PersonaRepository = require('../repositories/personaRepository');
const { Nacionalidad, Provincia } = require('../models');

// Función para calcular edad
const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const fecha = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
        edad--;
    }
    return edad;
};

// CREATE - Crear una persona
const crearPersona = async (data,transaction) => {
    console.log('🧩 Datos que llegan al personaService:', data);

    const { ci, nombre, ap, am, fnac, id_nacionalidad, genero } = data;

    if (!data.ci || data.ci.trim() === '') {
        throw new Error('El CI es obligatorio');
    }
    
    if (data.ci.length < 7 || data.ci.length > 15) {
        throw new Error('El CI debe tener entre 7 y 15 caracteres');
    }
    
    if (!data.nombre || data.nombre.trim() === '') {
        throw new Error('El nombre es obligatorio');
    }
    
    if (data.nombre.length < 3) {
        throw new Error('El nombre debe tener al menos 3 caracteres');
    }
    
    if (!data.fnac) {
        throw new Error('La fecha de nacimiento es obligatoria');
    }
    
    // Validar que la fecha no sea futura
    const hoy = new Date();
    const fechaNac = new Date(data.fnac);
    if (fechaNac > hoy) {
        throw new Error('La fecha de nacimiento no puede ser futura');
    }
    
    // Validar edad máxima (90 años)
    const edad = calcularEdad(data.fnac);
    if (edad > 90) {
        throw new Error('La edad no puede ser mayor de 90 años');
    }
    
    if (!data.id_nacionalidad || !Number.isInteger(data.id_nacionalidad)) {
        throw new Error('La nacionalidad es obligatoria y debe ser un número válido');
    }
    
    if (!data.genero) {
        throw new Error('El género es obligatorio');
    }
    
    const generosValidos = ['masculino', 'femenino', 'otro'];
    if (!generosValidos.includes(data.genero.toLowerCase())) {
        throw new Error('El género debe ser masculino, femenino u otro');
    }
    
    // Validar que no exista una persona con el mismo CI
    const personaExistente = await PersonaRepository.obtenerPersonaPorCI(data.ci);
    if (personaExistente) {
        throw new Error('Ya existe una persona con este CI');
    }
    
    // Validar que la nacionalidad existe
    const nacionalidad = await Nacionalidad.findByPk(data.id_nacionalidad);
    if (!nacionalidad) {
        throw new Error('La nacionalidad especificada no existe');
    }
    
    // Validar que los apellidos tengan al menos 3 caracteres si se proporcionan
    if (data.ap && data.ap.trim().length > 0 && data.ap.length < 3) {
        throw new Error('El primer apellido debe tener al menos 3 caracteres');
    }
    
    if (data.am && data.am.trim().length > 0 && data.am.length < 3) {
        throw new Error('El segundo apellido debe tener al menos 3 caracteres');
    }
    // 🔹 Validar provincia SOLO si viene
    if (data.id_provincia_origen) {
        const provincia = await Provincia.findByPk(data.id_provincia_origen);
        if (!provincia) {
            throw new Error('La provincia especificada no existe');
        }
    }
    try {
        const nuevaPersona = await PersonaRepository.crearPersona({
            ...data,
            genero: data.genero.toLowerCase(),
            estado: true,
            id_provincia_origen: data.id_provincia_origen ?? null
        });
        return nuevaPersona;
    } catch (error) {
        throw new Error(`Error al crear persona: ${error.message}`);
    }
};

// READ - Obtener todas las personas activas
const obtenerPersonas = async () => {
    try {
        const personas = await PersonaRepository.obtenerPersonas();
        
        if (!personas) {
            return [];
        }
        
        // Agregar edad calculada a cada persona
        return personas.map(persona => ({
            ...persona.toJSON(),
            edad: calcularEdad(persona.fnac)
        }));
    } catch (error) {
        throw new Error(`Error al obtener personas: ${error.message}`);
    }
};

// READ - Obtener TODAS las personas (incluyendo inactivas)
const obtenerTodasLasPersonas = async () => {
    try {
        const personas = await PersonaRepository.obtenerTodasLasPersonas();
        
        if (!personas) {
            return [];
        }
        
        return personas.map(persona => ({
            ...persona.toJSON(),
            edad: calcularEdad(persona.fnac)
        }));
    } catch (error) {
        throw new Error(`Error al obtener todas las personas: ${error.message}`);
    }
};

// READ - Obtener una persona por ID
const obtenerPersonaPorId = async (id_persona) => {
    if (!id_persona || !Number.isInteger(parseInt(id_persona))) {
        throw new Error('El ID de la persona debe ser un número válido');
    }
    
    try {
        const persona = await PersonaRepository.obtenerPersonaPorId(id_persona);
        
        if (!persona) {
            throw new Error('La persona no existe');
        }
        
        return {
            ...persona.toJSON(),
            edad: calcularEdad(persona.fnac)
        };
    } catch (error) {
        throw new Error(`Error al obtener persona: ${error.message}`);
    }
};

// READ - Obtener persona por ID (desde body)
const getbyId = async (id_persona) => {
    if (!id_persona || !Number.isInteger(parseInt(id_persona))) {
        throw new Error('El ID de la persona debe ser un número válido');
    }
    
    try {
        const persona = await PersonaRepository.obtenerPersonaPorId(id_persona);
        
        if (!persona) {
            throw new Error('La persona no existe');
        }
        
        return {
            ...persona.toJSON(),
            edad: calcularEdad(persona.fnac)
        };
    } catch (error) {
        throw new Error(`Error al obtener persona: ${error.message}`);
    }
};

// READ - Obtener persona por CI
const obtenerPersonaPorCI = async (ci) => {
    if (!ci || ci.trim() === '') {
        throw new Error('El CI es obligatorio');
    }
    
    try {
        const persona = await PersonaRepository.obtenerPersonaPorCI(ci);
        
        if (!persona) {
            throw new Error('La persona no existe');
        }
        
        return {
            ...persona.toJSON(),
            edad: calcularEdad(persona.fnac)
        };
    } catch (error) {
        throw new Error(`Error al obtener persona: ${error.message}`);
    }
};

// READ - Obtener personas por nacionalidad
const obtenerPersonasPorNacionalidad = async (id_nacionalidad) => {
    if (!id_nacionalidad || !Number.isInteger(parseInt(id_nacionalidad))) {
        throw new Error('El ID de la nacionalidad debe ser un número válido');
    }
    
    try {
        const personas = await PersonaRepository.obtenerPersonasPorNacionalidad(id_nacionalidad);
        
        if (!personas) {
            return [];
        }
        
        return personas.map(persona => ({
            ...persona.toJSON(),
            edad: calcularEdad(persona.fnac)
        }));
    } catch (error) {
        throw new Error(`Error al obtener personas: ${error.message}`);
    }
};

// READ - Obtener personas por género
const obtenerPersonasPorGenero = async (genero) => {
    if (!genero || !['masculino', 'femenino', 'otro'].includes(genero.toLowerCase())) {
        throw new Error('El género debe ser masculino, femenino u otro');
    }
    
    try {
        const personas = await PersonaRepository.obtenerPersonasPorGenero(genero.toLowerCase());
        
        if (!personas) {
            return [];
        }
        
        return personas.map(persona => ({
            ...persona.toJSON(),
            edad: calcularEdad(persona.fnac)
        }));
    } catch (error) {
        throw new Error(`Error al obtener personas: ${error.message}`);
    }
};

// READ - Obtener personas por rango de edad
const obtenerPersonasPorEdad = async (edad_minima, edad_maxima) => {
    if (!Number.isInteger(edad_minima) || !Number.isInteger(edad_maxima)) {
        throw new Error('Las edades deben ser números enteros válidos');
    }
    
    if (edad_minima < 0 || edad_maxima < 0) {
        throw new Error('Las edades no pueden ser negativas');
    }
    
    if (edad_minima > edad_maxima) {
        throw new Error('La edad mínima no puede ser mayor a la edad máxima');
    }
    
    try {
        const personas = await PersonaRepository.obtenerPersonasPorEdad(edad_minima, edad_maxima);
        
        if (!personas) {
            return [];
        }
        
        return personas.map(persona => ({
            ...persona.toJSON(),
            edad: calcularEdad(persona.fnac)
        }));
    } catch (error) {
        throw new Error(`Error al obtener personas: ${error.message}`);
    }
};

// READ - Obtener personas por nombre (búsqueda)
const obtenerPersonasPorNombre = async (nombre) => {
    if (!nombre || nombre.trim() === '') {
        throw new Error('El nombre es obligatorio para la búsqueda');
    }
    
    try {
        const personas = await PersonaRepository.obtenerPersonasPorNombre(nombre);
        
        if (!personas) {
            return [];
        }
        
        return personas.map(persona => ({
            ...persona.toJSON(),
            edad: calcularEdad(persona.fnac)
        }));
    } catch (error) {
        throw new Error(`Error al obtener personas: ${error.message}`);
    }
};

// UPDATE
const actualizarPersona = async (id_persona, data) => {
    if (!id_persona || !Number.isInteger(parseInt(id_persona))) {
        throw new Error('El ID de la persona debe ser un número válido');
    }
    
    if (!data || Object.keys(data).length === 0) {
        throw new Error('Debes proporcionar datos para actualizar');
    }
    
    // Validar campos si se proporcionan
    if (data.nombre !== undefined && data.nombre.trim() === '') {
        throw new Error('El nombre no puede estar vacío');
    }
    
    if (data.nombre !== undefined && data.nombre.length < 3) {
        throw new Error('El nombre debe tener al menos 3 caracteres');
    }
    
    if (data.ci !== undefined) {
        if (data.ci.length < 7 || data.ci.length > 15) {
            throw new Error('El CI debe tener entre 7 y 15 caracteres');
        }
        
        const personaExistente = await PersonaRepository.obtenerPersonaPorCI(data.ci);
        if (personaExistente && personaExistente.id_persona !== parseInt(id_persona)) {
            throw new Error('Ya existe otra persona con este CI');
        }
    }
    
    if (data.fnac !== undefined) {
        const hoy = new Date();
        const fechaNac = new Date(data.fnac);
        if (fechaNac > hoy) {
            throw new Error('La fecha de nacimiento no puede ser futura');
        }
        
        const edad = calcularEdad(data.fnac);
        if (edad > 90) {
            throw new Error('La edad no puede ser mayor de 90 años');
        }
    }
    
    if (data.genero !== undefined) {
        const generosValidos = ['masculino', 'femenino', 'otro'];
        if (!generosValidos.includes(data.genero.toLowerCase())) {
            throw new Error('El género debe ser masculino, femenino u otro');
        }
        data.genero = data.genero.toLowerCase();
    }
    
    if (data.ap !== undefined && data.ap.trim().length > 0 && data.ap.length < 3) {
        throw new Error('El primer apellido debe tener al menos 3 caracteres');
    }
    
    if (data.am !== undefined && data.am.trim().length > 0 && data.am.length < 3) {
        throw new Error('El segundo apellido debe tener al menos 3 caracteres');
    }
    
    // No permitir cambiar estado o fecha de registro desde aquí
    delete data.estado;
    delete data.freg;
    
    try {
        const persona = await PersonaRepository.actualizarPersona(id_persona, data);
        
        if (!persona) {
            throw new Error('La persona no existe');
        }
        
        return {
            ...persona.toJSON(),
            edad: calcularEdad(persona.fnac)
        };
    } catch (error) {
        throw new Error(`Error al actualizar persona: ${error.message}`);
    }
};

// DELETE (soft delete)
const eliminarPersona = async (id_persona) => {
    if (!id_persona || !Number.isInteger(parseInt(id_persona))) {
        throw new Error('El ID de la persona debe ser un número válido');
    }
    
    try {
        const persona = await PersonaRepository.obtenerPersonaPorId(id_persona);
        if (!persona) {
            throw new Error('La persona no existe');
        }
        
        if (!persona.estado) {
            throw new Error('La persona ya está eliminada');
        }
        
        const personaEliminada = await PersonaRepository.eliminarPersona(id_persona);
        
        return personaEliminada;
    } catch (error) {
        throw new Error(`Error al eliminar persona: ${error.message}`);
    }
};



const obtenerPersonasUsuarios = async () => {
    
    try {
        const personas = await PersonaRepository.obtenerPersonasConUsuarios();
        
        if (!personas) {
            return [];
        }
        
        return personas.map(persona => ({
            ...persona.toJSON(),
        }));
    } catch (error) {
        throw new Error(`Error al obtener personas: ${error.message}`);
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
    eliminarPersona,
    obtenerPersonasUsuarios
};

/*const personaRepo= require('../repositories/personaRepository');

exports.getPersonasConUsuarios = async()=>{
    return await personaRepo.findPersonasConUsuarios();
}*/

