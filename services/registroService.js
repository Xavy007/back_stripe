/*const persona = require('../models/persona');
const {createPersona} = require('../repositories/personaRepository');
const { createUsuario} = require('../repositories/usuarioRepository');

const createPersonaUsuario = async (pdata,udata) => {
    const nuevapersona= await createPersona(pdata);
    const nuevousuario= await createUsuario({
        ...udata,
        id_persona:nuevapersona.id_persona
    });
    return {persona:nuevapersona, usuario:nuevousuario};

}
module.exports= {createPersonaUsuario};*/
/**
 * Servicio de Registro
 * Crea una Persona y un Usuario en una transacción
 */

const { sequelize, Persona, Usuario } = require('../models');

const registroService = {
    /**
     * Registrar nueva persona con usuario
     * 
     * @param {Object} datosPersona - Datos de la persona
     * @param {Object} datosUsuario - Datos del usuario
     * @returns {Object} { persona, usuario }
     */
    registroCompleto: async (datosPersona, datosUsuario) => {
        // Iniciar transacción
        const transaction = await sequelize.transaction();

        try {
            // PASO 1: Crear la persona
            const persona = await Persona.create(datosPersona, { transaction });
            console.log('✅ Persona creada:', persona.id_persona);

            // PASO 2: Crear el usuario con el id_persona de la persona creada
            const usuarioData = {
                ...datosUsuario,
                id_persona: persona.id_persona // Vincular a la persona
            };

            const usuario = await Usuario.create(usuarioData, { transaction });
            console.log('✅ Usuario creado:', usuario.id_usuario);

            // PASO 3: Confirmar transacción
            await transaction.commit();

            return {
                success: true,
                message: 'Registro exitoso',
                data: {
                    persona,
                    usuario
                }
            };
        } catch (error) {
            // Si algo falla, revertir todo
            await transaction.rollback();
            console.error('❌ Error en registro:', error.message);
            throw new Error(`Error en el registro: ${error.message}`);
        }
    },

    /**
     * Validar datos de persona
     */
    validarPersona: (data) => {
        const errores = [];

        if (!data.ci || data.ci.trim() === '') {
            errores.push('El CI es obligatorio');
        } else if (data.ci.length < 7 || data.ci.length > 15) {
            errores.push('El CI debe tener entre 7 y 15 caracteres');
        }

        if (!data.nombre || data.nombre.trim() === '') {
            errores.push('El nombre es obligatorio');
        } else if (data.nombre.length < 3) {
            errores.push('El nombre debe tener al menos 3 caracteres');
        }

        if (!data.fnac) {
            errores.push('La fecha de nacimiento es obligatoria');
        } else {
            const hoy = new Date();
            const fechaNac = new Date(data.fnac);
            if (fechaNac > hoy) {
                errores.push('La fecha de nacimiento no puede ser futura');
            }
        }

        if (!data.id_nacionalidad) {
            errores.push('La nacionalidad es obligatoria');
        }

        if (!data.genero) {
            errores.push('El género es obligatorio');
        } else if (!['masculino', 'femenino', 'otro'].includes(data.genero.toLowerCase())) {
            errores.push('El género debe ser masculino, femenino u otro');
        }

        return errores;
    },

    /**
     * Validar datos de usuario
     */
    validarUsuario: (data) => {
        const errores = [];

        if (!data.email || data.email.trim() === '') {
            errores.push('El email es obligatorio');
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                errores.push('El email no es válido');
            }
        }

        if (!data.password || data.password.trim() === '') {
            errores.push('La contraseña es obligatoria');
        } else if (data.password.length < 12) {
            errores.push('La contraseña debe tener al menos 12 caracteres');
        }

        if (!data.rol) {
            errores.push('El rol es obligatorio');
        } else {
            const rolesValidos = ['admin', 'presidente', 'secretario', 'presidenteclub', 'representante','juez'];
            if (!rolesValidos.includes(data.rol.toLowerCase())) {
                errores.push(`El rol debe ser uno de: ${rolesValidos.join(', ')}`);
            }
        }

        return errores;
    }
};

module.exports = registroService;