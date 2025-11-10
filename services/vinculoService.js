const { Persona, Usuario } = require('../models');

const vinculoService = {
    // ✅ La función DE VALIDACIÓN está DENTRO del objeto
    validarDatosUsuario: (data) => {
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
            const rolesValidos = ['admin', 'presidente', 'secretario', 'presidenteclub', 'representante'];
            if (!rolesValidos.includes(data.rol.toLowerCase())) {
                errores.push(`El rol debe ser uno de: ${rolesValidos.join(', ')}`);
            }
        }
        return errores;
    },

    // ✅ La función principal
    crearUsuarioParaPersona: async (id_persona, datosUsuario) => {
        try {
            const persona = await Persona.findByPk(id_persona);
            if (!persona) {
                throw new Error(`La persona con ID ${id_persona} no existe`);
            }

            const usuarioExistente = await Usuario.findOne({
                where: { id_persona: id_persona }
            });
            
            if (usuarioExistente) {
                throw new Error(`Esta persona ya tiene un usuario asociado (ID: ${usuarioExistente.id_usuario})`);
            }

            // ✅ Llamar a la función así:
            const errores = vinculoService.validarDatosUsuario(datosUsuario);
            if (errores.length > 0) {
                throw new Error(`Datos inválidos: ${errores.join(', ')}`);
            }

            const usuario = await Usuario.create({
                email: datosUsuario.email,
                password: datosUsuario.password,
                rol: datosUsuario.rol,
                id_persona: id_persona
            });

            return {
                success: true,
                message: `Usuario creado exitosamente para la persona ${persona.nombre}`,
                data: {
                    id_usuario: usuario.id_usuario,
                    email: usuario.email,
                    rol: usuario.rol,
                    id_persona: id_persona,
                    persona: {
                        id_persona: persona.id_persona,
                        nombre: persona.nombre,
                        apellido: persona.ap,
                        ci: persona.ci
                    }
                }
            };
        } catch (error) {
            console.error('Error:', error.message);
            throw error;
        }
    },

    obtenerPersonasSinUsuario: async () => {
        try {
            const todasPersonas = await Persona.findAll({
                where: { estado: true }
            });

            const personasConUsuario = await Persona.findAll({
                include: [{
                    model: Usuario,
                    as: 'usuario',
                    required: true
                }]
            });

            const idsConUsuario = personasConUsuario.map(p => p.id_persona);
            const personasSinUsuario = todasPersonas.filter(p => 
                !idsConUsuario.includes(p.id_persona)
            );

            return {
                success: true,
                message: `${personasSinUsuario.length} personas sin usuario asignado`,
                data: personasSinUsuario.map(p => ({
                    id_persona: p.id_persona,
                    nombre: p.nombre,
                    apellido: p.ap,
                    ci: p.ci,
                    email: p.email || 'N/A',
                    estado: p.estado
                })),
                total: personasSinUsuario.length
            };
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }
};

module.exports = vinculoService;