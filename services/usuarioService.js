const UsuarioRepository = require('../repositories/usuarioRepository');
const { Persona } = require('../models');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { enviarEmailActivacion, enviarEmailReset } = require('./emailService');

const ROLES_VALIDOS = ['admin', 'presidente', 'secretario', 'presidenteclub', 'representante', 'juez'];
const PASSWORD_MIN_LENGTH = 12;

const crearUsuario = async (data) => {
    if (!data.email || data.email.trim() === '') {
        throw new Error('El email es obligatorio');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        throw new Error('El email no es válido');
    }

    if (!data.rol) {
        throw new Error('El rol es obligatorio');
    }

    if (!ROLES_VALIDOS.includes(data.rol.toLowerCase())) {
        throw new Error(`El rol debe ser uno de: ${ROLES_VALIDOS.join(', ')}`);
    }

    if (!data.id_persona || !Number.isInteger(data.id_persona)) {
        throw new Error('El ID de persona es obligatorio y debe ser un número válido');
    }

    const usuarioExistente = await UsuarioRepository.obtenerUsuarioPorEmail(data.email);
    if (usuarioExistente) {
        throw new Error('Ya existe un usuario con este email');
    }

    const persona = await Persona.findByPk(data.id_persona);
    if (!persona) {
        throw new Error('La persona especificada no existe');
    }

    const usuarioPersona = await UsuarioRepository.obtenerUsuarioPorIdPersona(data.id_persona);
    if (usuarioPersona) {
        throw new Error('Esta persona ya tiene un usuario asociado');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expira = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 horas
    const passwordPlaceholder = crypto.randomBytes(24).toString('hex'); // nunca se comparte

    try {
        const nuevoUsuario = await UsuarioRepository.crearUsuario({
            id_persona: data.id_persona,
            email: data.email,
            password: passwordPlaceholder,
            rol: data.rol.toLowerCase(),
            verificado: false,
            token_activacion: token,
            token_expira: expira,
        });

        // Enviar email de activación (no bloqueante: si falla, el usuario igual se crea)
        const nombre = `${persona.nombre} ${persona.ap || ''}`.trim();
        enviarEmailActivacion({ destinatario: data.email, nombre, token }).catch((err) => {
            console.error('⚠️ No se pudo enviar el email de activación:', err.message);
        });

        return nuevoUsuario;
    } catch (error) {
        throw new Error(`Error al crear usuario: ${error.message}`);
    }
};

const activarCuenta = async (token, password) => {
    if (!token) throw new Error('Token requerido');
    if (!password || password.length < PASSWORD_MIN_LENGTH) {
        throw new Error(`La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`);
    }

    const usuario = await UsuarioRepository.obtenerUsuarioPorToken(token);
    if (!usuario) throw new Error('El enlace de activación no es válido o ya fue usado');
    if (new Date() > new Date(usuario.token_expira)) {
        throw new Error('El enlace de activación ha expirado. Solicita uno nuevo al administrador');
    }

    // Usar scope withPassword para poder guardar la contraseña
    const usuarioConPass = await UsuarioRepository.obtenerUsuarioPorIdConPassword(usuario.id_usuario);
    usuarioConPass.password = password;
    usuarioConPass.verificado = true;
    usuarioConPass.token_activacion = null;
    usuarioConPass.token_expira = null;
    await usuarioConPass.save();

    return { message: 'Cuenta activada exitosamente. Ya puedes iniciar sesión.' };
};

const solicitarResetPassword = async (email) => {
    if (!email) throw new Error('El email es obligatorio');

    const usuario = await UsuarioRepository.obtenerUsuarioPorEmail(email);
    if (!usuario || !usuario.verificado) return; // Respuesta genérica: no revelar si existe

    const persona = await Persona.findByPk(usuario.id_persona);
    const nombre = persona ? `${persona.nombre} ${persona.ap || ''}`.trim() : email;

    const token = crypto.randomBytes(32).toString('hex');
    const expira = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 horas

    await UsuarioRepository.actualizarUsuario(usuario.id_usuario, {
        token_activacion: token,
        token_expira: expira,
    });

    enviarEmailReset({ destinatario: email, nombre, token }).catch((err) => {
        console.error('⚠️ No se pudo enviar el email de reset:', err.message);
    });
};

const resetearPassword = async (token, password) => {
    if (!token) throw new Error('Token requerido');
    if (!password || password.length < PASSWORD_MIN_LENGTH) {
        throw new Error(`La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`);
    }

    const usuario = await UsuarioRepository.obtenerUsuarioPorToken(token);
    if (!usuario) throw new Error('El enlace no es válido o ya fue usado');
    if (new Date() > new Date(usuario.token_expira)) {
        throw new Error('El enlace ha expirado. Solicita uno nuevo');
    }

    const usuarioConPass = await UsuarioRepository.obtenerUsuarioPorIdConPassword(usuario.id_usuario);
    usuarioConPass.password = password;
    usuarioConPass.token_activacion = null;
    usuarioConPass.token_expira = null;
    await usuarioConPass.save();

    return { message: 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión.' };
};

const obtenerUsuarios = async () => {
    try {
        const usuarios = await UsuarioRepository.obtenerUsuarios();
        return usuarios || [];
    } catch (error) {
        throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
};

const obtenerUsuarioPorId = async (id_usuario) => {
    if (!id_usuario || !Number.isInteger(parseInt(id_usuario))) {
        throw new Error('El ID del usuario debe ser un número válido');
    }

    try {
        const usuario = await UsuarioRepository.obtenerUsuarioPorId(id_usuario);
        if (!usuario) {
            throw new Error('El usuario no existe');
        }
        return usuario;
    } catch (error) {
        throw new Error(`Error al obtener usuario: ${error.message}`);
    }
};



const obtenerUsuarioPorIdPersona = async (id_persona) => {
    if (!id_persona || !Number.isInteger(parseInt(id_persona))) {
        throw new Error('El ID del usuario debe ser un número válido');
    }

    try {
        const usuario = await UsuarioRepository.obtenerUsuarioPorIdPersona(id_persona);
        return usuario || null;
    } catch (error) {
        throw new Error(`Error al obtener usuario: ${error.message}`);
    }
};






const obtenerUsuarioPorEmail = async (email) => {
    if (!email || email.trim() === '') {
        throw new Error('El email es obligatorio');
    }

    try {
        const usuario = await UsuarioRepository.obtenerUsuarioPorEmail(email);
        if (!usuario) {
            throw new Error('El usuario no existe');
        }
        return usuario;
    } catch (error) {
        throw new Error(`Error al obtener usuario: ${error.message}`);
    }
};

const obtenerUsuariosPorRol = async (rol) => {
    if (!rol || !ROLES_VALIDOS.includes(rol.toLowerCase())) {
        throw new Error(`El rol debe ser uno de: ${ROLES_VALIDOS.join(', ')}`);
    }

    try {
        const usuarios = await UsuarioRepository.obtenerUsuariosPorRol(rol.toLowerCase());
        return usuarios || [];
    } catch (error) {
        throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
};

const obtenerUsuariosVerificados = async () => {
    try {
        const usuarios = await UsuarioRepository.obtenerUsuariosVerificados();
        return usuarios || [];
    } catch (error) {
        throw new Error(`Error al obtener usuarios verificados: ${error.message}`);
    }
};

const obtenerUsuariosBloqueados = async () => {
    try {
        const usuarios = await UsuarioRepository.obtenerUsuariosBloqueados();
        return usuarios || [];
    } catch (error) {
        throw new Error(`Error al obtener usuarios bloqueados: ${error.message}`);
    }
};


// ============================================
// UPDATE
// ============================================

const actualizarUsuario = async (id_usuario, data) => {
    if (!id_usuario || !Number.isInteger(parseInt(id_usuario))) {
        throw new Error('El ID del usuario debe ser un número válido');
    }

    if (!data || Object.keys(data).length === 0) {
        throw new Error('Debes proporcionar datos para actualizar');
    }

    // Validar email si se proporciona
    if (data.email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new Error('El email no es válido');
        }

        const usuarioExistente = await UsuarioRepository.obtenerUsuarioPorEmail(data.email);
        if (usuarioExistente && usuarioExistente.id_usuario !== parseInt(id_usuario)) {
            throw new Error('Ya existe otro usuario con este email');
        }
    }

    // Validar rol si se proporciona
    if (data.rol !== undefined) {
        if (!ROLES_VALIDOS.includes(data.rol.toLowerCase())) {
            throw new Error(`El rol debe ser uno de: ${ROLES_VALIDOS.join(', ')}`);
        }
        data.rol = data.rol.toLowerCase();
    }

    // No permitir cambiar id_persona desde aquí
    delete data.id_persona;
    
    // No permitir cambiar contraseña desde aquí (usar cambiarContrasena)
    delete data.password;

    try {
        const usuario = await UsuarioRepository.actualizarUsuario(id_usuario, data);
        if (!usuario) {
            throw new Error('El usuario no existe');
        }
        
        // Retornar el usuario actualizado con datos de persona
        return await UsuarioRepository.obtenerUsuarioPorId(id_usuario);
    } catch (error) {
        throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
};

const cambiarContrasena = async (id_usuario, contraseniaAnterior, contraseniaNueva) => {
    if (!id_usuario || !Number.isInteger(parseInt(id_usuario))) {
        throw new Error('El ID del usuario debe ser un número válido');
    }

    if (!contraseniaAnterior || contraseniaAnterior.trim() === '') {
        throw new Error('La contraseña anterior es obligatoria');
    }

    if (!contraseniaNueva || contraseniaNueva.trim() === '') {
        throw new Error('La contraseña nueva es obligatoria');
    }

    if (contraseniaNueva.length < PASSWORD_MIN_LENGTH) {
        throw new Error(`La nueva contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`);
    }

    try {
        const usuario = await UsuarioRepository.obtenerUsuarioPorIdConPassword(id_usuario);
        if (!usuario) {
            throw new Error('El usuario no existe');
        }

        const esValida = await usuario.verifyPassword(contraseniaAnterior);
        if (!esValida) {
            throw new Error('La contraseña anterior es incorrecta');
        }

        usuario.password = contraseniaNueva;
        await usuario.save();

        return { message: 'Contraseña actualizada exitosamente' };
    } catch (error) {
        throw new Error(error.message);
    }
};

const cambiarVerificacion = async (id_usuario, verificado) => {
    if (!id_usuario || !Number.isInteger(parseInt(id_usuario))) {
        throw new Error('El ID del usuario debe ser un número válido');
    }
    if (typeof verificado !== 'boolean') {
        throw new Error('Verificado debe ser true o false');
    }
    try {
        const usuario = await UsuarioRepository.cambiarVerificacion(id_usuario, verificado);
        if (!usuario) {
            throw new Error('El usuario no existe');
        }
        return usuario;
    } catch (error) {
        throw new Error(error.message);
    }
};


const eliminarUsuario = async (id_usuario) => {
    if (!id_usuario || !Number.isInteger(parseInt(id_usuario))) {
        throw new Error('El ID del usuario debe ser un número válido');
    }

    try {
        const usuario = await UsuarioRepository.obtenerUsuarioPorId(id_usuario);
        if (!usuario) {
            throw new Error('El usuario no existe');
        }

        await UsuarioRepository.eliminarUsuario(id_usuario);
        return { 
            message: 'Usuario eliminado exitosamente',
            usuario 
        };
    } catch (error) {
        throw new Error(error.message);
    }
};


// ============================================
// AUTENTICACIÓN
// ============================================

const login = async (email, password) => {
    if (!email || email.trim() === '') {
        throw new Error('El email es obligatorio');
    }
    if (!password || password.trim() === '') {
        throw new Error('La contraseña es obligatoria');
    }
    try {
        const usuario = await UsuarioRepository.obtenerUsuarioPorEmailConPassword(email);
        if (!usuario) {
            throw new Error('Email o contraseña incorrectos');
        }
        if (usuario.isLocked && usuario.isLocked()) {
            const tiempoRestante = usuario.locked_until ? 
                Math.ceil((new Date(usuario.locked_until) - new Date()) / 60000) : 0;
            throw new Error(`Usuario bloqueado por intentos fallidos. Intenta de nuevo en ${tiempoRestante} minutos.`);
        }

        const esValida = await usuario.verifyPassword(password);
        if (!esValida) {
            await UsuarioRepository.registrarIntentoFallido(usuario.id_usuario);
            
            const usuarioActualizado = await UsuarioRepository.obtenerUsuarioPorIdConPassword(usuario.id_usuario);
            if (usuarioActualizado && usuarioActualizado.isLocked && usuarioActualizado.isLocked()) {
                throw new Error('Demasiados intentos fallidos. Usuario bloqueado temporalmente.');
            }
            
            throw new Error('Email o contraseña incorrectos');
        }

        await UsuarioRepository.resetearIntentos(usuario.id_usuario);

        if (!usuario.verificado) {
            throw new Error('Usuario no verificado. Contacta con el administrador');
        }

        // Convertir a objeto plano para acceder a datos de persona
        const usuarioData = usuario.toJSON ? usuario.toJSON() : usuario;

        // Generar JWT con datos completos
        const token = jwt.sign(
            {
                id_usuario: usuarioData.id_usuario,
                email: usuarioData.email,
                rol: usuarioData.rol,
                id_persona: usuarioData.id_persona,
                nombre: usuarioData.persona?.nombre || '',
                apellido: usuarioData.persona?.ap || '',
                apellido_materno: usuarioData.persona?.am || ''
            },
            process.env.JWT_SECRET || 'tu_secret_key',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        return {
            success: true,
            message: 'Login exitoso',
            data: {
                token,
                usuario: {
                    id_usuario: usuarioData.id_usuario,
                    email: usuarioData.email,
                    rol: usuarioData.rol,
                    verificado: usuarioData.verificado,
                    nombre: usuarioData.persona?.nombre || '',
                    apellido: `${usuarioData.persona?.ap || ''} ${usuarioData.persona?.am || ''}`.trim(),
                    ci: usuarioData.persona?.ci || '',
                    telefono: usuarioData.persona?.telefono || '',
                    persona: usuarioData.persona || null
                }
            }
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

const desbloquearUsuario = async (id_usuario) => {
    if (!id_usuario || !Number.isInteger(parseInt(id_usuario))) {
        throw new Error('El ID del usuario debe ser un número válido');
    }

    try {
        const usuario = await UsuarioRepository.resetearIntentos(id_usuario);
        if (!usuario) {
            throw new Error('El usuario no existe');
        }
        return { message: 'Usuario desbloqueado exitosamente' };
    } catch (error) {
        throw new Error(error.message);
    }
};
const actualizarEstado= async (id, estadoBool) =>{
  const actualizado = await UsuarioRepository.actualizarUsuario(id, { estado: estadoBool });
  if (!actualizado) return null; 
 
  return actualizado;
}
module.exports = {
    crearUsuario,
    activarCuenta,
    solicitarResetPassword,
    resetearPassword,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    obtenerUsuarioPorIdPersona,
    obtenerUsuarioPorEmail,
    obtenerUsuariosPorRol,
    obtenerUsuariosVerificados,
    obtenerUsuariosBloqueados,
    actualizarUsuario,
    cambiarContrasena,
    cambiarVerificacion,
    eliminarUsuario,
    login,
    desbloquearUsuario,
    actualizarEstado
};
/*const UsuarioRepository = require('../repositories/usuarioRepository');
const { Persona } = require('../models');
const jwt = require('jsonwebtoken');

const ROLES_VALIDOS = ['admin', 'presidente', 'secretario', 'presidenteclub', 'representante','juez'];
const PASSWORD_MIN_LENGTH = 12;

// ============================================
// CREATE
// ============================================

const crearUsuario = async (data) => {
    // Validar email
    if (!data.email || data.email.trim() === '') {
        throw new Error('El email es obligatorio');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        throw new Error('El email no es válido');
    }

    // Validar contraseña
    if (!data.password || data.password.trim() === '') {
        throw new Error('La contraseña es obligatoria');
    }

    if (data.password.length < PASSWORD_MIN_LENGTH) {
        throw new Error(`La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`);
    }

    // Validar rol
    if (!data.rol) {
        throw new Error('El rol es obligatorio');
    }

    if (!ROLES_VALIDOS.includes(data.rol)) {
        throw new Error(`El rol debe ser uno de: ${ROLES_VALIDOS.join(', ')}`);
    }

    // Validar ID de persona
    if (!data.id_persona || !Number.isInteger(data.id_persona)) {
        throw new Error('El ID de persona es obligatorio y debe ser un número válido');
    }

    // Verificar que no exista un usuario con el mismo email
    const usuarioExistente = await UsuarioRepository.obtenerUsuarioPorEmail(data.email);
    if (usuarioExistente) {
        throw new Error('Ya existe un usuario con este email');
    }

    // Verificar que la persona existe
    const persona = await Persona.findByPk(data.id_persona);
    if (!persona) {
        throw new Error('La persona especificada no existe');
    }

    // Verificar que no exista ya un usuario para esta persona
    const usuarioPersona = await UsuarioRepository.obtenerUsuarioPorIdPersona(data.id_persona);
    if (usuarioPersona) {
        throw new Error('Esta persona ya tiene un usuario asociado');
    }

    try {
        const nuevoUsuario = await UsuarioRepository.crearUsuario({
            ...data,
            rol: data.rol.toLowerCase(),
            verificado: data.verificado !== undefined ? data.verificado : true
        });
        return nuevoUsuario;
    } catch (error) {
        throw new Error(`Error al crear usuario: ${error.message}`);
    }
};


// ============================================
// READ
// ============================================

const obtenerUsuarios = async () => {
    try {
        const usuarios = await UsuarioRepository.obtenerUsuarios();
        return usuarios || [];
    } catch (error) {
        throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
};

const obtenerUsuarioPorId = async (id_usuario) => {
    if (!id_usuario || !Number.isInteger(parseInt(id_usuario))) {
        throw new Error('El ID del usuario debe ser un número válido');
    }

    try {
        const usuario = await UsuarioRepository.obtenerUsuarioPorId(id_usuario);
        if (!usuario) {
            throw new Error('El usuario no existe');
        }
        return usuario;
    } catch (error) {
        throw new Error(`Error al obtener usuario: ${error.message}`);
    }
};

const obtenerUsuarioPorEmail = async (email) => {
    if (!email || email.trim() === '') {
        throw new Error('El email es obligatorio');
    }

    try {
        const usuario = await UsuarioRepository.obtenerUsuarioPorEmail(email);
        if (!usuario) {
            throw new Error('El usuario no existe');
        }
        return usuario;
    } catch (error) {
        throw new Error(`Error al obtener usuario: ${error.message}`);
    }
};

const obtenerUsuariosPorRol = async (rol) => {
    if (!rol || !ROLES_VALIDOS.includes(rol.toLowerCase())) {
        throw new Error(`El rol debe ser uno de: ${ROLES_VALIDOS.join(', ')}`);
    }

    try {
        const usuarios = await UsuarioRepository.obtenerUsuariosPorRol(rol.toLowerCase());
        return usuarios || [];
    } catch (error) {
        throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
};

const obtenerUsuariosVerificados = async () => {
    try {
        const usuarios = await UsuarioRepository.obtenerUsuariosVerificados();
        return usuarios || [];
    } catch (error) {
        throw new Error(`Error al obtener usuarios verificados: ${error.message}`);
    }
};

const obtenerUsuariosBloqueados = async () => {
    try {
        const usuarios = await UsuarioRepository.obtenerUsuariosBloqueados();
        return usuarios || [];
    } catch (error) {
        throw new Error(`Error al obtener usuarios bloqueados: ${error.message}`);
    }
};


// ============================================
// UPDATE
// ============================================

const actualizarUsuario = async (id_usuario, data) => {
    if (!id_usuario || !Number.isInteger(parseInt(id_usuario))) {
        throw new Error('El ID del usuario debe ser un número válido');
    }

    if (!data || Object.keys(data).length === 0) {
        throw new Error('Debes proporcionar datos para actualizar');
    }

    // Validar email si se proporciona
    if (data.email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new Error('El email no es válido');
        }

        const usuarioExistente = await UsuarioRepository.obtenerUsuarioPorEmail(data.email);
        if (usuarioExistente && usuarioExistente.id_usuario !== parseInt(id_usuario)) {
            throw new Error('Ya existe otro usuario con este email');
        }
    }

    // Validar rol si se proporciona
    if (data.rol !== undefined) {
        if (!ROLES_VALIDOS.includes(data.rol.toLowerCase())) {
            throw new Error(`El rol debe ser uno de: ${ROLES_VALIDOS.join(', ')}`);
        }
        data.rol = data.rol.toLowerCase();
    }

    // No permitir cambiar id_persona desde aquí
    delete data.id_persona;

    try {
        const usuario = await UsuarioRepository.actualizarUsuario(id_usuario, data);
        if (!usuario) {
            throw new Error('El usuario no existe');
        }
        return usuario;
    } catch (error) {
        throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
};

const cambiarContrasena = async (id_usuario, contraseniaAnterior, contraseniaNueva) => {
    if (!id_usuario || !Number.isInteger(parseInt(id_usuario))) {
        throw new Error('El ID del usuario debe ser un número válido');
    }

    if (!contraseniaAnterior || contraseniaAnterior.trim() === '') {
        throw new Error('La contraseña anterior es obligatoria');
    }

    if (!contraseniaNueva || contraseniaNueva.trim() === '') {
        throw new Error('La contraseña nueva es obligatoria');
    }

    if (contraseniaNueva.length < PASSWORD_MIN_LENGTH) {
        throw new Error(`La nueva contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`);
    }

    try {
        const usuario = await UsuarioRepository.obtenerUsuarioPorIdConPassword(id_usuario);
        if (!usuario) {
            throw new Error('El usuario no existe');
        }

        const esValida = await usuario.verifyPassword(contraseniaAnterior);
        if (!esValida) {
            throw new Error('La contraseña anterior es incorrecta');
        }

        usuario.password = contraseniaNueva;
        await usuario.save();

        return { message: 'Contraseña actualizada exitosamente' };
    } catch (error) {
        throw new Error(`Error al cambiar contraseña: ${error.message}`);
    }
};

const cambiarVerificacion = async (id_usuario, verificado) => {
    if (!id_usuario || !Number.isInteger(parseInt(id_usuario))) {
        throw new Error('El ID del usuario debe ser un número válido');
    }

    if (typeof verificado !== 'boolean') {
        throw new Error('Verificado debe ser true o false');
    }

    try {
        const usuario = await UsuarioRepository.cambiarVerificacion(id_usuario, verificado);
        if (!usuario) {
            throw new Error('El usuario no existe');
        }
        return usuario;
    } catch (error) {
        throw new Error(`Error al cambiar verificación: ${error.message}`);
    }
};


// ============================================
// DELETE
// ============================================

const eliminarUsuario = async (id_usuario) => {
    if (!id_usuario || !Number.isInteger(parseInt(id_usuario))) {
        throw new Error('El ID del usuario debe ser un número válido');
    }

    try {
        const usuario = await UsuarioRepository.obtenerUsuarioPorId(id_usuario);
        if (!usuario) {
            throw new Error('El usuario no existe');
        }

        const usuarioEliminado = await UsuarioRepository.eliminarUsuario(id_usuario);
        return usuarioEliminado;
    } catch (error) {
        throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
};


// ============================================
// AUTENTICACIÓN
// ============================================

const login = async (email, password) => {
    if (!email || email.trim() === '') {
        throw new Error('El email es obligatorio');
    }

    if (!password || password.trim() === '') {
        throw new Error('La contraseña es obligatoria');
    }

    try {
        // Obtener usuario con contraseña
        const usuario = await UsuarioRepository.obtenerUsuarioPorEmailConPassword(email);

        if (!usuario) {
            throw new Error('Email o contraseña incorrectos');
        }

        // Verificar si está bloqueado
        if (usuario.isLocked()) {
            throw new Error('Usuario bloqueado por intentos fallidos. Intenta más tarde.');
        }

        // Verificar contraseña
        const esValida = await usuario.verifyPassword(password);
        if (!esValida) {
            await UsuarioRepository.registrarIntentoFallido(usuario.id_usuario);
            throw new Error('Email o contraseña incorrectos');
        }

        // Resetear intentos fallidos
        await UsuarioRepository.resetearIntentos(usuario.id_usuario);

        // Verificar si está verificado
        if (!usuario.verificado) {
            throw new Error('Usuario no verificado. Contacta con el administrador');
        }

        // Generar JWT
        const token = jwt.sign(
            {
                id_usuario: usuario.id_usuario,
                email: usuario.email,
                rol: usuario.rol,
                id_persona: usuario.id_persona,
                nombre: usuario.persona?.nombre,
                apellido: usuario.persona?.ap
            },
            process.env.JWT_SECRET || 'tu_secret_key',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        return {
            success: true,
            message: 'Login exitoso',
            data: {
                token,
                usuario: {
                    id_usuario: usuario.id_usuario,
                    email: usuario.email,
                    rol: usuario.rol,
                    nombre: usuario.persona?.nombre,
                    apellido: usuario.persona?.ap,
                    persona: usuario.persona
                }
            }
        };
    } catch (error) {
        throw new Error(`Error al hacer login: ${error.message}`);
    }
};

const desbloquearUsuario = async (id_usuario) => {
    if (!id_usuario || !Number.isInteger(parseInt(id_usuario))) {
        throw new Error('El ID del usuario debe ser un número válido');
    }

    try {
        const usuario = await UsuarioRepository.resetearIntentos(id_usuario);
        if (!usuario) {
            throw new Error('El usuario no existe');
        }
        return { message: 'Usuario desbloqueado exitosamente' };
    } catch (error) {
        throw new Error(`Error al desbloquear usuario: ${error.message}`);
    }
};

module.exports = {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    obtenerUsuarioPorEmail,
    obtenerUsuariosPorRol,
    obtenerUsuariosVerificados,
    obtenerUsuariosBloqueados,
    actualizarUsuario,
    cambiarContrasena,
    cambiarVerificacion,
    eliminarUsuario,
    login,
    desbloquearUsuario
};*/