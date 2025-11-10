/**
 * Controlador de Vínculo
 * Crea usuario para persona existente
 */

const vinculoService = require('../services/vinculoService');

const vinculoController = {
    /**
     * POST /api/vinculo/crear-usuario/:id_persona
     * Crear usuario para una persona existente
     * 
     * Params: id_persona (ID de la persona)
     * Body: { email, password, rol }
     */
    crearUsuarioParaPersona: async (req, res) => {
        try {
            const { id_persona } = req.params;
            const { email, password, rol } = req.body;

            // Validar que id_persona es válido
            if (!id_persona || !Number.isInteger(parseInt(id_persona))) {
                return res.status(400).json({
                    success: false,
                    error: 'ID de persona inválido',
                    message: 'El ID debe ser un número entero'
                });
            }

            // Validar que tenemos los datos necesarios
            if (!email || !password || !rol) {
                return res.status(400).json({
                    success: false,
                    error: 'Datos incompletos',
                    message: 'Se requieren: email, password, rol'
                });
            }

            // Crear usuario
            const resultado = await vinculoService.crearUsuarioParaPersona(
                parseInt(id_persona),
                { email, password, rol }
            );

            res.status(201).json(resultado);

        } catch (error) {
            console.error('Error en vinculoController:', error);
            
            // Manejo específico de errores
            if (error.message.includes('no existe')) {
                return res.status(404).json({
                    success: false,
                    error: 'Persona no encontrada',
                    message: error.message
                });
            }

            if (error.message.includes('ya tiene')) {
                return res.status(409).json({
                    success: false,
                    error: 'Conflicto',
                    message: error.message
                });
            }

            res.status(400).json({
                success: false,
                error: 'Error al crear usuario',
                message: error.message
            });
        }
    },

    /**
     * GET /api/vinculo/personas-sin-usuario
     * Obtener personas que no tienen usuario asignado
     */
    obtenerPersonasSinUsuario: async (req, res) => {
        try {
            const resultado = await vinculoService.obtenerPersonasSinUsuario();
            res.status(200).json(resultado);

        } catch (error) {
            console.error('Error:', error);
            res.status(400).json({
                success: false,
                error: 'Error al obtener personas',
                message: error.message
            });
        }
    }
};

module.exports = vinculoController;