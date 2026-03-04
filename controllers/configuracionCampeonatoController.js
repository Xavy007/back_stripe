const ConfiguracionCampeonatoService = require('../services/configuracionCampeonatoService');

// ============================================
// CONFIGURAR CAMPEONATO POR GRUPOS
// ============================================
const configurarPorGrupos = async (req, res) => {
    try {
        const config = req.body;

        console.log('🏆 Solicitud de configuración por grupos:', config);

        // Validaciones básicas
        if (!config.id_cc) {
            return res.status(400).json({
                success: false,
                message: 'El ID de campeonato-categoría es requerido'
            });
        }

        if (!config.equipos || config.equipos.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar al menos un equipo inscrito'
            });
        }

        const resultado = await ConfiguracionCampeonatoService.configurarCampeonatoPorGrupos(config);

        res.status(201).json(resultado);
    } catch (error) {
        console.error('❌ Error en configurarPorGrupos:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// CONFIGURAR CAMPEONATO TIPO LIGA
// ============================================
const configurarTipoLiga = async (req, res) => {
    try {
        const config = req.body;

        console.log('🏆 Solicitud de configuración tipo liga:', config);

        if (!config.id_cc) {
            return res.status(400).json({
                success: false,
                message: 'El ID de campeonato-categoría es requerido'
            });
        }

        if (!config.equipos || config.equipos.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Se requieren al menos 2 equipos para una liga'
            });
        }

        const resultado = await ConfiguracionCampeonatoService.configurarCampeonatoTipoLiga(config);

        res.status(201).json(resultado);
    } catch (error) {
        console.error('❌ Error en configurarTipoLiga:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// CONFIGURAR ELIMINATORIAS
// ============================================
const configurarEliminatorias = async (req, res) => {
    try {
        const config = req.body;

        console.log('🏆 Solicitud de configuración de eliminatorias:', config);

        if (!config.id_cc) {
            return res.status(400).json({
                success: false,
                message: 'El ID de campeonato-categoría es requerido'
            });
        }

        if (!config.cantidad_equipos) {
            return res.status(400).json({
                success: false,
                message: 'Debe especificar la cantidad de equipos'
            });
        }

        const resultado = await ConfiguracionCampeonatoService.configurarCampeonatoEliminatorias(config);

        res.status(201).json(resultado);
    } catch (error) {
        console.error('❌ Error en configurarEliminatorias:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// CONFIGURAR CAMPEONATO COMPLETO (GRUPOS + ELIMINATORIAS)
// ============================================
const configurarCampeonatoCompleto = async (req, res) => {
    try {
        const config = req.body;

        console.log('🏆 Solicitud de configuración completa:', config);

        if (!config.id_cc) {
            return res.status(400).json({
                success: false,
                message: 'El ID de campeonato-categoría es requerido'
            });
        }

        const resultado = await ConfiguracionCampeonatoService.configurarCampeonatoCompleto(config);

        res.status(201).json(resultado);
    } catch (error) {
        console.error('❌ Error en configurarCampeonatoCompleto:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// CONFIGURAR FINAL FOUR
// ============================================
const configurarFinalFour = async (req, res) => {
    try {
        const config = req.body;

        console.log('🏆 Solicitud de configuración Final Four:', config);

        if (!config.id_cc) {
            return res.status(400).json({
                success: false,
                message: 'El ID de campeonato-categoría es requerido'
            });
        }

        const resultado = await ConfiguracionCampeonatoService.configurarFinalFour(config);

        res.status(201).json(resultado);
    } catch (error) {
        console.error('❌ Error en configurarFinalFour:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// OBTENER RESUMEN DE CONFIGURACIÓN
// ============================================
const obtenerResumenConfiguracion = async (req, res) => {
    try {
        const { id_cc } = req.params;

        if (!id_cc) {
            return res.status(400).json({
                success: false,
                message: 'El ID de campeonato-categoría es requerido'
            });
        }

        const resultado = await ConfiguracionCampeonatoService.obtenerResumenConfiguracion(id_cc);

        res.status(200).json(resultado);
    } catch (error) {
        console.error('❌ Error en obtenerResumenConfiguracion:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// VERIFICAR SI NÚMERO ES POTENCIA DE 2
// ============================================
const verificarPotenciaDe2 = async (req, res) => {
    try {
        const { numero } = req.params;
        const num = parseInt(numero);

        if (!num || num <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar un número válido mayor a 0'
            });
        }

        const esPotencia = ConfiguracionCampeonatoService.esPotenciaDe2(num);

        res.status(200).json({
            success: true,
            data: {
                numero: num,
                es_potencia_de_2: esPotencia,
                sugerencia: esPotencia ?
                    `${num} equipos es válido para eliminatorias` :
                    'Use 2, 4, 8, 16, 32 equipos para eliminatorias'
            }
        });
    } catch (error) {
        console.error('❌ Error en verificarPotenciaDe2:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    configurarPorGrupos,
    configurarTipoLiga,
    configurarEliminatorias,
    configurarCampeonatoCompleto,
    configurarFinalFour,
    obtenerResumenConfiguracion,
    verificarPotenciaDe2
};
