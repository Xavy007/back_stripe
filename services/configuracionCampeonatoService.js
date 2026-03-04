const FaseService = require('./faseService');
const GrupoService = require('./grupoService');
const InscripcionService = require('./inscripcionService');
const GrupoInscripcionService = require('./grupoInscripcionService');
const JornadaService = require('./jornadaService');

// ============================================
// CONFIGURACIÓN DE CAMPEONATO POR GRUPOS
// ============================================
/**
 * Configura un campeonato con sistema de grupos
 * @param {Object} config - Configuración del campeonato
 * @param {number} config.id_cc - ID de CampeonatoCategoria
 * @param {number} config.cantidad_grupos - Cantidad de grupos (ej: 4)
 * @param {boolean} config.ida_vuelta - Si se juega ida y vuelta
 * @param {Date} config.fecha_inicio - Fecha de inicio
 * @param {Date} config.fecha_fin - Fecha de fin
 * @param {Array} config.equipos - Array de equipos inscritos con bombo
 */
const configurarCampeonatoPorGrupos = async (config) => {
    try {
        const {
            id_cc,
            cantidad_grupos = 4,
            ida_vuelta = false,
            fecha_inicio,
            fecha_fin,
            equipos = [],
            nombre_fase = 'Fase de Grupos'
        } = config;

        console.log('🏆 Iniciando configuración de campeonato por grupos...');

        // 1. Crear la fase de grupos
        const fase = await FaseService.crearFase({
            id_cc,
            tipo: 'grupos',
            nombre: nombre_fase,
            descripcion: `Fase de grupos con ${cantidad_grupos} grupos`,
            orden: 1,
            ida_vuelta,
            fecha_inicio,
            fecha_fin,
            f_estado: 'planificada'
        });

        console.log(`✅ Fase creada: ${fase.nombre} (ID: ${fase.id_fase})`);

        // 2. Crear los grupos
        const grupos = [];
        const letrasGrupos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

        for (let i = 0; i < cantidad_grupos; i++) {
            const grupo = await GrupoService.crearGrupo({
                id_cc,
                id_fase: fase.id_fase,
                clave: letrasGrupos[i],
                nombre: `Grupo ${letrasGrupos[i]}`,
                capacidad: Math.ceil(equipos.length / cantidad_grupos)
            });

            grupos.push(grupo);
            console.log(`✅ Grupo creado: ${grupo.nombre} (ID: ${grupo.id_grupo})`);
        }

        // 3. Distribuir equipos en grupos (serpenteo por bombo)
        const asignaciones = await distribuirEquiposEnGrupos(equipos, grupos, id_cc);

        console.log(`✅ ${asignaciones.length} equipos distribuidos en ${cantidad_grupos} grupos`);

        return {
            success: true,
            message: 'Campeonato por grupos configurado exitosamente',
            data: {
                fase,
                grupos,
                asignaciones
            }
        };
    } catch (error) {
        throw new Error(`Error al configurar campeonato por grupos: ${error.message}`);
    }
};

// ============================================
// CONFIGURACIÓN DE CAMPEONATO TIPO LIGA
// ============================================
/**
 * Configura un campeonato con sistema de liga (todos contra todos)
 */
const configurarCampeonatoTipoLiga = async (config) => {
    try {
        const {
            id_cc,
            ida_vuelta = true,
            fecha_inicio,
            fecha_fin,
            equipos = [],
            nombre_fase = 'Liga Regular'
        } = config;

        console.log('🏆 Iniciando configuración de campeonato tipo liga...');

        // 1. Crear la fase de liga
        const fase = await FaseService.crearFase({
            id_cc,
            tipo: 'liga',
            nombre: nombre_fase,
            descripcion: `Liga con ${equipos.length} equipos - Todos contra todos`,
            orden: 1,
            ida_vuelta,
            fecha_inicio,
            fecha_fin,
            f_estado: 'planificada'
        });

        console.log(`✅ Fase creada: ${fase.nombre} (ID: ${fase.id_fase})`);

        // 2. Calcular cantidad de jornadas
        const cantidadEquipos = equipos.length;
        const jornadasTotales = ida_vuelta ? (cantidadEquipos - 1) * 2 : (cantidadEquipos - 1);

        console.log(`📅 Se crearán ${jornadasTotales} jornadas`);

        return {
            success: true,
            message: 'Campeonato tipo liga configurado exitosamente',
            data: {
                fase,
                jornadas_totales: jornadasTotales,
                partidos_por_jornada: Math.floor(cantidadEquipos / 2)
            }
        };
    } catch (error) {
        throw new Error(`Error al configurar campeonato tipo liga: ${error.message}`);
    }
};

// ============================================
// CONFIGURACIÓN DE CAMPEONATO CON ELIMINATORIAS
// ============================================
/**
 * Configura un campeonato con sistema de eliminatorias (playoffs)
 */
const configurarCampeonatoEliminatorias = async (config) => {
    try {
        const {
            id_cc,
            cantidad_equipos = 8, // 8, 16, 32, etc.
            ida_vuelta = false,
            fecha_inicio,
            fecha_fin,
            orden = 1,
            nombre_fase
        } = config;

        console.log('🏆 Iniciando configuración de eliminatorias...');

        // Validar que sea potencia de 2
        if (!esPotenciaDe2(cantidad_equipos)) {
            throw new Error('La cantidad de equipos debe ser potencia de 2 (2, 4, 8, 16, 32...)');
        }

        // Determinar el nombre de la fase según cantidad de equipos
        const nombreFaseCalculado = nombre_fase || obtenerNombreFaseEliminatoria(cantidad_equipos);

        const fase = await FaseService.crearFase({
            id_cc,
            tipo: 'eliminatoria',
            nombre: nombreFaseCalculado,
            descripcion: `Eliminatoria directa con ${cantidad_equipos} equipos`,
            orden,
            ida_vuelta,
            fecha_inicio,
            fecha_fin,
            f_estado: 'planificada'
        });

        console.log(`✅ Fase creada: ${fase.nombre} (ID: ${fase.id_fase})`);

        return {
            success: true,
            message: 'Fase de eliminatorias configurada exitosamente',
            data: {
                fase,
                cantidad_partidos: cantidad_equipos / 2,
                equipos_clasifican: cantidad_equipos / 2
            }
        };
    } catch (error) {
        throw new Error(`Error al configurar eliminatorias: ${error.message}`);
    }
};

// ============================================
// CONFIGURACIÓN DE CAMPEONATO MIXTO (GRUPOS + ELIMINATORIAS)
// ============================================
/**
 * Configura un campeonato completo: Grupos → Octavos → Cuartos → Semifinal → Final
 */
const configurarCampeonatoCompleto = async (config) => {
    try {
        const {
            id_cc,
            cantidad_grupos = 4,
            equipos_por_grupo = 4,
            clasifican_por_grupo = 2,
            ida_vuelta_grupos = false,
            ida_vuelta_eliminatorias = false,
            fecha_inicio_grupos,
            fecha_fin_grupos,
            fecha_inicio_eliminatorias,
            fecha_fin_eliminatorias,
            incluir_final_four = false
        } = config;

        console.log('🏆 Iniciando configuración de campeonato completo...');

        const fases = [];

        // FASE 1: Grupos
        const faseGrupos = await configurarCampeonatoPorGrupos({
            id_cc,
            cantidad_grupos,
            ida_vuelta: ida_vuelta_grupos,
            fecha_inicio: fecha_inicio_grupos,
            fecha_fin: fecha_fin_grupos,
            nombre_fase: 'Fase de Grupos',
            equipos: [] // Se deben agregar después
        });

        fases.push(faseGrupos.data.fase);
        console.log(`✅ Fase de grupos configurada`);

        // Calcular equipos clasificados
        const equiposClasificados = cantidad_grupos * clasifican_por_grupo;

        // FASE 2: Eliminatorias según equipos clasificados
        const fasesEliminatorias = await configurarEliminatoriasCompletas({
            id_cc,
            cantidad_equipos: equiposClasificados,
            ida_vuelta: ida_vuelta_eliminatorias,
            fecha_inicio: fecha_inicio_eliminatorias,
            fecha_fin: fecha_fin_eliminatorias,
            orden_inicial: 2,
            incluir_final_four
        });

        fases.push(...fasesEliminatorias);

        console.log(`✅ Campeonato completo configurado con ${fases.length} fases`);

        return {
            success: true,
            message: 'Campeonato completo configurado exitosamente',
            data: {
                fases,
                total_fases: fases.length,
                estructura: fases.map(f => f.nombre)
            }
        };
    } catch (error) {
        throw new Error(`Error al configurar campeonato completo: ${error.message}`);
    }
};

// ============================================
// CONFIGURACIÓN DE FINAL FOUR
// ============================================
const configurarFinalFour = async (config) => {
    try {
        const {
            id_cc,
            fecha_inicio,
            fecha_fin,
            orden = 1
        } = config;

        console.log('🏆 Configurando Final Four...');

        // Semifinal 1 y 2
        const faseSemifinal = await FaseService.crearFase({
            id_cc,
            tipo: 'final_four',
            nombre: 'Semifinales',
            descripcion: 'Semifinales - Final Four',
            orden,
            ida_vuelta: false,
            fecha_inicio,
            fecha_fin,
            f_estado: 'planificada'
        });

        // Final
        const faseFinal = await FaseService.crearFase({
            id_cc,
            tipo: 'final_four',
            nombre: 'Final',
            descripcion: 'Final del campeonato',
            orden: orden + 1,
            ida_vuelta: false,
            fecha_inicio,
            fecha_fin,
            f_estado: 'planificada'
        });

        console.log(`✅ Final Four configurado`);

        return {
            success: true,
            message: 'Final Four configurado exitosamente',
            data: {
                semifinales: faseSemifinal,
                final: faseFinal
            }
        };
    } catch (error) {
        throw new Error(`Error al configurar Final Four: ${error.message}`);
    }
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Distribuye equipos en grupos usando serpenteo por bombo
 */
const distribuirEquiposEnGrupos = async (equipos, grupos, id_cc) => {
    const asignaciones = [];

    // Ordenar equipos por bombo (1, 2, 3, 4...)
    const equiposOrdenados = [...equipos].sort((a, b) => a.bombo - b.bombo);

    let grupoIndex = 0;
    let direccion = 1; // 1 = adelante, -1 = atrás (serpenteo)

    for (let i = 0; i < equiposOrdenados.length; i++) {
        const equipo = equiposOrdenados[i];

        // Crear la asignación
        const asignacion = await GrupoInscripcionService.crearGrupoInscripcion({
            id_grupo: grupos[grupoIndex].id_grupo,
            id_inscripcion: equipo.id_inscripcion,
            bombo: equipo.bombo,
            slot: i % grupos.length + 1
        });

        asignaciones.push(asignacion);

        // Serpenteo: A -> B -> C -> D -> D -> C -> B -> A
        grupoIndex += direccion;

        if (grupoIndex >= grupos.length) {
            grupoIndex = grupos.length - 1;
            direccion = -1;
        } else if (grupoIndex < 0) {
            grupoIndex = 0;
            direccion = 1;
        }
    }

    return asignaciones;
};

/**
 * Configura todas las fases eliminatorias necesarias
 */
const configurarEliminatoriasCompletas = async (config) => {
    const {
        id_cc,
        cantidad_equipos,
        ida_vuelta,
        fecha_inicio,
        fecha_fin,
        orden_inicial,
        incluir_final_four
    } = config;

    const fases = [];
    let equiposActuales = cantidad_equipos;
    let ordenActual = orden_inicial;

    // Crear fases hasta llegar a 4 equipos (si hay final four) o 2 equipos
    while (equiposActuales > (incluir_final_four ? 4 : 2)) {
        const nombreFase = obtenerNombreFaseEliminatoria(equiposActuales);

        const fase = await FaseService.crearFase({
            id_cc,
            tipo: 'eliminatoria',
            nombre: nombreFase,
            descripcion: `Eliminatoria directa con ${equiposActuales} equipos`,
            orden: ordenActual,
            ida_vuelta,
            fecha_inicio,
            fecha_fin,
            f_estado: 'planificada'
        });

        fases.push(fase);
        equiposActuales = equiposActuales / 2;
        ordenActual++;
    }

    // Si hay final four, crear semifinales y final
    if (incluir_final_four && equiposActuales === 4) {
        const finalFour = await configurarFinalFour({
            id_cc,
            fecha_inicio,
            fecha_fin,
            orden: ordenActual
        });

        fases.push(finalFour.data.semifinales);
        fases.push(finalFour.data.final);
    } else if (equiposActuales === 2) {
        // Solo crear la final
        const faseFinal = await FaseService.crearFase({
            id_cc,
            tipo: 'eliminatoria',
            nombre: 'Final',
            descripcion: 'Final del campeonato',
            orden: ordenActual,
            ida_vuelta,
            fecha_inicio,
            fecha_fin,
            f_estado: 'planificada'
        });

        fases.push(faseFinal);
    }

    return fases;
};

/**
 * Verifica si un número es potencia de 2
 */
const esPotenciaDe2 = (n) => {
    return n > 0 && (n & (n - 1)) === 0;
};

/**
 * Obtiene el nombre de la fase según cantidad de equipos
 */
const obtenerNombreFaseEliminatoria = (cantidad) => {
    const nombres = {
        2: 'Final',
        4: 'Semifinales',
        8: 'Cuartos de Final',
        16: 'Octavos de Final',
        32: 'Dieciseisavos de Final',
        64: 'Treintaidosavos de Final'
    };

    return nombres[cantidad] || `Eliminatoria ${cantidad} equipos`;
};

/**
 * Obtiene resumen de configuración de un campeonato
 */
const obtenerResumenConfiguracion = async (id_cc) => {
    try {
        const fases = await FaseService.obtenerFasesPorCampeonatoCategoria(id_cc);

        if (fases.length === 0) {
            return {
                success: false,
                message: 'No hay configuración para este campeonato'
            };
        }

        const resumen = {
            total_fases: fases.length,
            fases: fases.map(f => ({
                id: f.id_fase,
                nombre: f.nombre,
                tipo: f.tipo,
                orden: f.orden,
                estado: f.f_estado,
                ida_vuelta: f.ida_vuelta,
                fecha_inicio: f.fecha_inicio,
                fecha_fin: f.fecha_fin
            }))
        };

        return {
            success: true,
            message: 'Resumen de configuración obtenido',
            data: resumen
        };
    } catch (error) {
        throw new Error(`Error al obtener resumen: ${error.message}`);
    }
};

module.exports = {
    configurarCampeonatoPorGrupos,
    configurarCampeonatoTipoLiga,
    configurarCampeonatoEliminatorias,
    configurarCampeonatoCompleto,
    configurarFinalFour,
    obtenerResumenConfiguracion,
    // Funciones auxiliares exportadas
    distribuirEquiposEnGrupos,
    esPotenciaDe2,
    obtenerNombreFaseEliminatoria
};
