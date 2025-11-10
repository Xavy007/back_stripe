const usuarioService = require('../services/usuarioService');

const { sequelize } = require('../models'); // Tu instancia de sequelize
const personaService = require('../services/personaService');

const crearUsuario = async (req, res) => {
    const transaction = await sequelize.transaction();
    console.log(req.body);
    try {
        const { ci, nombre, ap, am, email, fnac, id_nacionalidad,genero, password, rol } = req.body;

        // Paso 1: Crear la PERSONA con transacción
        const personaData = { ci, nombre, ap, am,fnac, id_nacionalidad ,genero};
        const personaCreada = await personaService.crearPersona(personaData, transaction);
        
        if (!personaCreada || !personaCreada.id_persona) {
            throw new Error('No se pudo crear la persona');
        }

        // Paso 2: Crear el USUARIO con transacción
        const usuarioData = {
            id_persona: personaCreada.id_persona,
            email,
            password,
            rol: rol || 'user'
        };
        console.log(usuarioData);
        const usuario = await usuarioService.crearUsuario(usuarioData, transaction);

        // Si todo salió bien, confirmar la transacción
        await transaction.commit();

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: usuario
        });
    } catch (error) {
        // Si algo falló, revertir todo
        await transaction.rollback();
        
        res.status(400).json({
            success: false,
            error: 'Error al crear usuario',
            message: error.message
        });
    }
};

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.obtenerUsuarios();

    // Normaliza a objeto plano (sirve si el service retorna instancias Sequelize)
    const plain = usuarios.map(u => (typeof u.toJSON === 'function' ? u.toJSON() : u));

    const usuariosFormateados = plain.map(u => {
      const p = u.persona ?? null; // puede ser null si no hay match
      return {
        id: u.id ?? u.id_usuario,
        persona_id: u.persona_id ?? u.id_persona ?? u.personaId,
        email: u.email,
        rol: u.rol,
        estado: u.estado,
        verificado: u.verificado,
        bloqueado: u.bloqueado,
        intentosFallidos: u.intentosFallidos ?? u.failed_attempts,
        ultimoAcceso: u.ultimoAcceso ?? u.locked_until,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        persona: p ? {
          id: p.id ?? p.id_persona,
          nombre: p.nombre ?? p.nombres,
          ap: p.ap,
          am: p.am,
          ci: p.ci,
          telefono: p.telefono,
          direccion: p.direccion,
          fecha_nacimiento: p.fecha_nacimiento,
          nacionalidad: p.nacionalidad ?? p.Nacionalidad
        } : null
      };
    });

    res.status(200).json({
      success: true,
      message: 'Usuarios obtenidos exitosamente',
      data: usuariosFormateados,
      total: usuariosFormateados.length
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Error al obtener usuarios',
      message: error.message
    });
  }
};

const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await usuarioService.obtenerUsuarioPorId(id);
        
        // Formatear la respuesta
        const usuarioFormateado = {
            id: usuario.id,
            persona_id: usuario.persona_id,
            email: usuario.email,
            rol: usuario.rol,
            estado: usuario.estado,
            verificado: usuario.verificado,
            bloqueado: usuario.bloqueado,
            intentosFallidos: usuario.intentosFallidos,
            ultimoAcceso: usuario.ultimoAcceso,
            createdAt: usuario.createdAt,
            updatedAt: usuario.updatedAt,
            persona: usuario.Persona ? {
                id: usuario.Persona.id,
                nombre: usuario.Persona.nombre,
                apellido: usuario.Persona.apellido,
                documento: usuario.Persona.documento,
                telefono: usuario.Persona.telefono,
                direccion: usuario.Persona.direccion,
                fecha_nacimiento: usuario.Persona.fecha_nacimiento,
                nacionalidad: usuario.Persona.Nacionalidad
            } : null
        };

        res.status(200).json({
            success: true,
            message: 'Usuario obtenido exitosamente',
            data: usuarioFormateado
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            error: 'Usuario no encontrado',
            message: error.message
        });
    }
};

const obtenerUsuarioPorEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const usuario = await usuarioService.obtenerUsuarioPorEmail(email);
        
        // Formatear la respuesta
        const usuarioFormateado = {
            id: usuario.id,
            persona_id: usuario.persona_id,
            email: usuario.email,
            rol: usuario.rol,
            estado: usuario.estado,
            verificado: usuario.verificado,
            bloqueado: usuario.bloqueado,
            intentosFallidos: usuario.intentosFallidos,
            ultimoAcceso: usuario.ultimoAcceso,
            createdAt: usuario.createdAt,
            updatedAt: usuario.updatedAt,
            persona: usuario.Persona ? {
                id: usuario.Persona.id,
                nombre: usuario.Persona.nombre,
                apellido: usuario.Persona.apellido,
                documento: usuario.Persona.documento,
                telefono: usuario.Persona.telefono,
                direccion: usuario.Persona.direccion,
                fecha_nacimiento: usuario.Persona.fecha_nacimiento,
                nacionalidad: usuario.Persona.Nacionalidad
            } : null
        };

        res.status(200).json({
            success: true,
            message: 'Usuario obtenido exitosamente',
            data: usuarioFormateado
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            error: 'Usuario no encontrado',
            message: error.message
        });
    }
};

const obtenerUsuariosPorRol = async (req, res) => {
    try {
        const { rol } = req.params;
        const usuarios = await usuarioService.obtenerUsuariosPorRol(rol);
        
        // Formatear la respuesta
        const usuariosFormateados = usuarios.map(usuario => ({
            id: usuario.id,
            persona_id: usuario.persona_id,
            email: usuario.email,
            rol: usuario.rol,
            estado: usuario.estado,
            verificado: usuario.verificado,
            bloqueado: usuario.bloqueado,
            intentosFallidos: usuario.intentosFallidos,
            ultimoAcceso: usuario.ultimoAcceso,
            createdAt: usuario.createdAt,
            updatedAt: usuario.updatedAt,
            persona: usuario.Persona ? {
                id: usuario.Persona.id,
                nombre: usuario.Persona.nombre,
                apellido: usuario.Persona.apellido,
                documento: usuario.Persona.documento,
                telefono: usuario.Persona.telefono,
                direccion: usuario.Persona.direccion,
                fecha_nacimiento: usuario.Persona.fecha_nacimiento,
                nacionalidad: usuario.Persona.Nacionalidad
            } : null
        }));

        res.status(200).json({
            success: true,
            message: 'Usuarios obtenidos exitosamente',
            data: usuariosFormateados,
            total: usuariosFormateados.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Error al obtener usuarios',
            message: error.message
        });
    }
};

const obtenerUsuariosVerificados = async (req, res) => {
    try {
        const usuarios = await usuarioService.obtenerUsuariosVerificados();
        
        // Formatear la respuesta
        const usuariosFormateados = usuarios.map(usuario => ({
            id: usuario.id,
            persona_id: usuario.persona_id,
            email: usuario.email,
            rol: usuario.rol,
            estado: usuario.estado,
            verificado: usuario.verificado,
            bloqueado: usuario.bloqueado,
            intentosFallidos: usuario.intentosFallidos,
            ultimoAcceso: usuario.ultimoAcceso,
            createdAt: usuario.createdAt,
            updatedAt: usuario.updatedAt,
            persona: usuario.Persona ? {
                id: usuario.Persona.id,
                nombre: usuario.Persona.nombre,
                apellido: usuario.Persona.apellido,
                documento: usuario.Persona.documento,
                telefono: usuario.Persona.telefono,
                direccion: usuario.Persona.direccion,
                fecha_nacimiento: usuario.Persona.fecha_nacimiento,
                nacionalidad: usuario.Persona.Nacionalidad
            } : null
        }));

        res.status(200).json({
            success: true,
            message: 'Usuarios verificados obtenidos exitosamente',
            data: usuariosFormateados,
            total: usuariosFormateados.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Error al obtener usuarios',
            message: error.message
        });
    }
};

const obtenerUsuariosBloqueados = async (req, res) => {
    try {
        const usuarios = await usuarioService.obtenerUsuariosBloqueados();
        
        // Formatear la respuesta
        const usuariosFormateados = usuarios.map(usuario => ({
            id: usuario.id,
            persona_id: usuario.persona_id,
            email: usuario.email,
            rol: usuario.rol,
            estado: usuario.estado,
            verificado: usuario.verificado,
            bloqueado: usuario.bloqueado,
            intentosFallidos: usuario.intentosFallidos,
            ultimoAcceso: usuario.ultimoAcceso,
            createdAt: usuario.createdAt,
            updatedAt: usuario.updatedAt,
            persona: usuario.Persona ? {
                id: usuario.Persona.id,
                nombre: usuario.Persona.nombre,
                apellido: usuario.Persona.apellido,
                documento: usuario.Persona.documento,
                telefono: usuario.Persona.telefono,
                direccion: usuario.Persona.direccion,
                fecha_nacimiento: usuario.Persona.fecha_nacimiento,
                nacionalidad: usuario.Persona.Nacionalidad
            } : null
        }));

        res.status(200).json({
            success: true,
            message: 'Usuarios bloqueados obtenidos exitosamente',
            data: usuariosFormateados,
            total: usuariosFormateados.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Error al obtener usuarios bloqueados',
            message: error.message
        });
    }
};


// ============================================
// UPDATE
// ============================================

const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await usuarioService.actualizarUsuario(id, req.body);
        res.status(200).json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: usuario
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Error al actualizar usuario',
            message: error.message
        });
    }
};

const cambiarContrasena = async (req, res) => {
    try {
        const { id } = req.params;
        const { contraseniaAnterior, contraseniaNueva } = req.body;

        const resultado = await usuarioService.cambiarContrasena(
            id,
            contraseniaAnterior,
            contraseniaNueva
        );

        res.status(200).json({
            success: true,
            message: resultado.message
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Error al cambiar contraseña',
            message: error.message
        });
    }
};

const cambiarVerificacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { verificado } = req.body;

        const usuario = await usuarioService.cambiarVerificacion(id, verificado);

        res.status(200).json({
            success: true,
            message: `Usuario ${verificado ? 'verificado' : 'desverificado'} exitosamente`,
            data: usuario
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Error al cambiar verificación',
            message: error.message
        });
    }
};

const desbloquearUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await usuarioService.desbloquearUsuario(id);

        res.status(200).json({
            success: true,
            message: resultado.message
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Error al desbloquear usuario',
            message: error.message
        });
    }
};


const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await usuarioService.eliminarUsuario(id);
        res.status(200).json({
            success: true,
            message: 'Usuario eliminado exitosamente',
            data: usuario
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Error al eliminar usuario',
            message: error.message
        });
    }
};


// ============================================
// AUTENTICACIÓN
// ============================================

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const resultado = await usuarioService.login(email, password);

        res.status(200).json(resultado);
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Login fallido',
            message: error.message
        });
    }
};
const cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const estadoBool = toBooleanEstado(req.body.estado); // "activo" -> true

    console.log(estadoBool);
    console.log(id);
    if (!['activo', 'inactivo'].includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Debe ser "activo" o "inactivo"'
      });
    }
    const usuario = await usuarioService.actualizarEstado(id, estadoBool);
     res.status(200).json({
      success: true,
      message: `Usuario ${estado === 'activo' ? 'activado' : 'desactivado'} exitosamente`,
      data: usuario
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Error al cambiar estado',
      message: error.message
    });
  }
};
function toBooleanEstado(valor) {
  if (typeof valor === 'boolean') return valor;
  if (valor == null) throw new Error('estado requerido');

  const s = String(valor).trim().toLowerCase();
  if (['1', 'true', 'activo', 'active', 'on', 'sí', 'si', 'yes'].includes(s)) return true;
  if (['0', 'false', 'inactivo', 'inactive', 'off', 'no'].includes(s)) return false;

  throw new Error(`estado inválido: ${valor}`);
}

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
    desbloquearUsuario,
    eliminarUsuario,
    login,
    cambiarEstado
};
/*const usuarioService = require('../services/usuarioService');

// ============================================
// CREATE
// ============================================

const crearUsuario = async (req, res) => {
    try {
        const usuario = await usuarioService.crearUsuario(req.body);
        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: usuario
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Error al crear usuario',
            message: error.message
        });
    }
};


// ============================================
// READ
// ============================================

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.obtenerUsuarios();
        res.status(200).json({
            success: true,
            message: 'Usuarios obtenidos exitosamente',
            data: usuarios,
            total: usuarios.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Error al obtener usuarios',
            message: error.message
        });
    }
};

const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await usuarioService.obtenerUsuarioPorId(id);
        res.status(200).json({
            success: true,
            message: 'Usuario obtenido exitosamente',
            data: usuario
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            error: 'Usuario no encontrado',
            message: error.message
        });
    }
};

const obtenerUsuarioPorEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const usuario = await usuarioService.obtenerUsuarioPorEmail(email);
        res.status(200).json({
            success: true,
            message: 'Usuario obtenido exitosamente',
            data: usuario
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            error: 'Usuario no encontrado',
            message: error.message
        });
    }
};

const obtenerUsuariosPorRol = async (req, res) => {
    try {
        const { rol } = req.params;
        const usuarios = await usuarioService.obtenerUsuariosPorRol(rol);
        res.status(200).json({
            success: true,
            message: 'Usuarios obtenidos exitosamente',
            data: usuarios,
            total: usuarios.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Error al obtener usuarios',
            message: error.message
        });
    }
};

const obtenerUsuariosVerificados = async (req, res) => {
    try {
        const usuarios = await usuarioService.obtenerUsuariosVerificados();
        res.status(200).json({
            success: true,
            message: 'Usuarios verificados obtenidos exitosamente',
            data: usuarios,
            total: usuarios.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Error al obtener usuarios',
            message: error.message
        });
    }
};

const obtenerUsuariosBloqueados = async (req, res) => {
    try {
        const usuarios = await usuarioService.obtenerUsuariosBloqueados();
        res.status(200).json({
            success: true,
            message: 'Usuarios bloqueados obtenidos exitosamente',
            data: usuarios,
            total: usuarios.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Error al obtener usuarios bloqueados',
            message: error.message
        });
    }
};


// ============================================
// UPDATE
// ============================================

const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await usuarioService.actualizarUsuario(id, req.body);
        res.status(200).json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: usuario
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Error al actualizar usuario',
            message: error.message
        });
    }
};

const cambiarContrasena = async (req, res) => {
    try {
        const { id } = req.params;
        const { contraseniaAnterior, contraseniaNueva } = req.body;

        const resultado = await usuarioService.cambiarContrasena(
            id,
            contraseniaAnterior,
            contraseniaNueva
        );

        res.status(200).json({
            success: true,
            message: resultado.message
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Error al cambiar contraseña',
            message: error.message
        });
    }
};

const cambiarVerificacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { verificado } = req.body;

        const usuario = await usuarioService.cambiarVerificacion(id, verificado);

        res.status(200).json({
            success: true,
            message: `Usuario ${verificado ? 'verificado' : 'desverificado'} exitosamente`,
            data: usuario
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Error al cambiar verificación',
            message: error.message
        });
    }
};

const desbloquearUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await usuarioService.desbloquearUsuario(id);

        res.status(200).json({
            success: true,
            message: resultado.message
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Error al desbloquear usuario',
            message: error.message
        });
    }
};


// ============================================
// DELETE
// ============================================

const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await usuarioService.eliminarUsuario(id);
        res.status(200).json({
            success: true,
            message: 'Usuario eliminado exitosamente',
            data: usuario
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Error al eliminar usuario',
            message: error.message
        });
    }
};


// ============================================
// AUTENTICACIÓN
// ============================================

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const resultado = await usuarioService.login(email, password);

        res.status(200).json(resultado);
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Login fallido',
            message: error.message
        });
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
    desbloquearUsuario,
    eliminarUsuario,
    login
};*/