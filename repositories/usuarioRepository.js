
const { Usuario, Persona } = require('../models');

// CREATE - Crear un usuario
const crearUsuario = async (data) => {

    return await Usuario.create(data);
    
};

// READ - Obtener todos los usuarios
const obtenerUsuarios = async () => {
    return await Usuario.findAll({
        include: [
            {
                model: Persona,
                as: 'persona'
            }
        ],order: [['id_usuario', 'ASC']],
    });
};

// READ - Obtener un usuario por ID
const obtenerUsuarioPorId = async (id_usuario) => {
    return await Usuario.findByPk(id_usuario, {
        include: [
            {
                model: Persona,
                as: 'persona'
            }
        ]
    });
};


// READ - Obtener usuario por ID con contraseña
const obtenerUsuarioPorIdConPassword = async (id_usuario) => {
    return await Usuario.scope('withPassword').findByPk(id_usuario, {
        include: [
            {
                model: Persona,
                as: 'persona'
            }
        ]
    });
};

// READ - Obtener usuario por email
const obtenerUsuarioPorEmail = async (email) => {
    return await Usuario.findOne({
        where: { email: email },
        include: [
            {
                model: Persona,
                as: 'persona'
            }
        ]
    });
};

// READ - Obtener usuario por email con contraseña (para login)
const obtenerUsuarioPorEmailConPassword = async (email) => {
    return await Usuario.scope('withPassword').findOne({
        where: { email: email, estado:true },
        include: [
            {
                model: Persona,
                as: 'persona'
            }
        ]
    });
};

// READ - Obtener usuarios por rol
const obtenerUsuariosPorRol = async (rol) => {
    return await Usuario.findAll({
        where: { rol: rol },
        include: [
            {
                model: Persona,
                as: 'persona'
            }
        ]
    });
};

// READ - Obtener usuarios verificados
const obtenerUsuariosVerificados = async () => {
    return await Usuario.findAll({
        where: { verificado: true },
        include: [
            {
                model: Persona,
                as: 'persona'
            }
        ]
    });
};

// READ - Obtener usuarios bloqueados
const obtenerUsuariosBloqueados = async () => {
    return await Usuario.findAll({
        where: {
            locked_until: {
                [require('sequelize').Op.gt]: new Date()
            }
        },
        include: [
            {
                model: Persona,
                as: 'persona'
            }
        ]
    });
};

// READ - Obtener usuario por ID de persona
const obtenerUsuarioPorIdPersona = async (id_persona) => {
    return await Usuario.findOne({
        where: { id_persona: id_persona },
        include: [
            {
                model: Persona,
                as: 'persona'
            }
        ]
    });
};

// READ - Obtener usuario por token de activación
const obtenerUsuarioPorToken = async (token) => {
    return await Usuario.findOne({ where: { token_activacion: token } });
};

// UPDATE - Actualizar usuario
const actualizarUsuario = async (id_usuario, data) => {
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
        return null;
    }
    return await usuario.update(data);
};

// UPDATE - Registrar intento fallido
const registrarIntentoFallido = async (id_usuario, options = {}) => {
    const usuario = await Usuario.scope('withPassword').findByPk(id_usuario);
    if (!usuario) {
        return null;
    }
    await usuario.recordFailedAttempt(options);
    return usuario;
};

// UPDATE - Resetear intentos fallidos
const resetearIntentos = async (id_usuario) => {
    const usuario = await Usuario.scope('withPassword').findByPk(id_usuario);
    if (!usuario) {
        return null;
    }
    await usuario.resetAttempts();
    return usuario;
};

// UPDATE - Cambiar estado de verificación
const cambiarVerificacion = async (id_usuario, verificado) => {
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
        return null;
    }
    return await usuario.update({ verificado });
};

// DELETE - Eliminar un usuario (eliminación física)
const eliminarUsuario = async (id_usuario) => {
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
        return null;
    }
    return await usuario.destroy();
};

module.exports = {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    obtenerUsuarioPorIdConPassword,
    obtenerUsuarioPorEmail,
    obtenerUsuarioPorEmailConPassword,
    obtenerUsuarioPorToken,
    obtenerUsuariosPorRol,
    obtenerUsuariosVerificados,
    obtenerUsuariosBloqueados,
    obtenerUsuarioPorIdPersona,
    actualizarUsuario,
    registrarIntentoFallido,
    resetearIntentos,
    cambiarVerificacion,
    eliminarUsuario
};