/**
 * Controlador de Registro
 * Maneja el registro de nuevos usuarios con sus datos personales
 */

const registroService = require('../services/registroService');

const registroController = {
    /**
     * POST /api/registro
     * Registrar nuevo usuario con datos de persona
     * 
     * Body: {
     *   persona: { ci, nombre, ap, am, fnac, id_nacionalidad, genero, foto },
     *   usuario: { email, password, rol }
     * }
     */
    registrar: async (req, res) => {
        try {
            const { persona, usuario } = req.body;

            // VALIDAR DATOS DE PERSONA
            const erroresPersona = registroService.validarPersona(persona);
            if (erroresPersona.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Datos de persona inválidos',
                    detalles: erroresPersona
                });
            }

            // VALIDAR DATOS DE USUARIO
            const erroresUsuario = registroService.validarUsuario(usuario);
            if (erroresUsuario.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Datos de usuario inválidos',
                    detalles: erroresUsuario
                });
            }

            // REGISTRAR (crear persona + usuario)
            const resultado = await registroService.registroCompleto(persona, usuario);

            res.status(201).json(resultado);

        } catch (error) {
            console.error('Error en registro:', error);
            res.status(400).json({
                success: false,
                error: 'Error al registrar',
                message: error.message
            });
        }
    }
};

module.exports = registroController;