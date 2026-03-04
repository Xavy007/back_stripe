const express = require('express');
const router = express.Router();
const ConfiguracionCampeonatoController = require('../controllers/configuracionCampeonatoController');

// ============================================
// CONFIGURACIÓN POR GRUPOS
// ============================================
/**
 * POST /api/configuracion-campeonato/grupos
 * Body: {
 *   id_cc: number,
 *   cantidad_grupos: number,
 *   ida_vuelta: boolean,
 *   fecha_inicio: Date,
 *   fecha_fin: Date,
 *   equipos: [{id_inscripcion: number, bombo: number}, ...]
 * }
 */
router.post('/grupos', ConfiguracionCampeonatoController.configurarPorGrupos);

// ============================================
// CONFIGURACIÓN TIPO LIGA
// ============================================
/**
 * POST /api/configuracion-campeonato/liga
 * Body: {
 *   id_cc: number,
 *   ida_vuelta: boolean,
 *   fecha_inicio: Date,
 *   fecha_fin: Date,
 *   equipos: [{id_inscripcion: number}, ...]
 * }
 */
router.post('/liga', ConfiguracionCampeonatoController.configurarTipoLiga);

// ============================================
// CONFIGURACIÓN ELIMINATORIAS
// ============================================
/**
 * POST /api/configuracion-campeonato/eliminatorias
 * Body: {
 *   id_cc: number,
 *   cantidad_equipos: number (2, 4, 8, 16, 32...),
 *   ida_vuelta: boolean,
 *   fecha_inicio: Date,
 *   fecha_fin: Date,
 *   orden: number (orden de la fase)
 * }
 */
router.post('/eliminatorias', ConfiguracionCampeonatoController.configurarEliminatorias);

// ============================================
// CONFIGURACIÓN CAMPEONATO COMPLETO
// ============================================
/**
 * POST /api/configuracion-campeonato/completo
 * Body: {
 *   id_cc: number,
 *   cantidad_grupos: number,
 *   equipos_por_grupo: number,
 *   clasifican_por_grupo: number,
 *   ida_vuelta_grupos: boolean,
 *   ida_vuelta_eliminatorias: boolean,
 *   fecha_inicio_grupos: Date,
 *   fecha_fin_grupos: Date,
 *   fecha_inicio_eliminatorias: Date,
 *   fecha_fin_eliminatorias: Date,
 *   incluir_final_four: boolean
 * }
 */
router.post('/completo', ConfiguracionCampeonatoController.configurarCampeonatoCompleto);

// ============================================
// CONFIGURACIÓN FINAL FOUR
// ============================================
/**
 * POST /api/configuracion-campeonato/final-four
 * Body: {
 *   id_cc: number,
 *   fecha_inicio: Date,
 *   fecha_fin: Date,
 *   orden: number
 * }
 */
router.post('/final-four', ConfiguracionCampeonatoController.configurarFinalFour);

// ============================================
// OBTENER RESUMEN DE CONFIGURACIÓN
// ============================================
/**
 * GET /api/configuracion-campeonato/resumen/:id_cc
 */
router.get('/resumen/:id_cc', ConfiguracionCampeonatoController.obtenerResumenConfiguracion);

// ============================================
// VERIFICAR SI NÚMERO ES POTENCIA DE 2
// ============================================
/**
 * GET /api/configuracion-campeonato/validar-equipos/:numero
 */
router.get('/validar-equipos/:numero', ConfiguracionCampeonatoController.verificarPotenciaDe2);

module.exports = router;
