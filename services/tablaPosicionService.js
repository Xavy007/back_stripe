const TablaPosicionRepository = require('../repositories/tablaPosicionRepository');

// ============================================
// CREATE - Crear una nueva posición en tabla
// ============================================
const crearTablaPosicion = async (data) => {
    // Validaciones
    if (!data.id_campeonato || !Number.isInteger(parseInt(data.id_campeonato))) {
        throw new Error('El ID del campeonato es requerido y debe ser un número válido');
    }

    if (!data.id_categoria || !Number.isInteger(parseInt(data.id_categoria))) {
        throw new Error('El ID de la categoría es requerido y debe ser un número válido');
    }

    if (!data.id_equipo || !Number.isInteger(parseInt(data.id_equipo))) {
        throw new Error('El ID del equipo es requerido y debe ser un número válido');
    }

    if (!data.posicion || !Number.isInteger(parseInt(data.posicion)) || data.posicion < 1) {
        throw new Error('La posición es requerida y debe ser un número mayor o igual a 1');
    }

    // Validar valores numéricos no negativos
    const camposNumericos = [
        'puntos', 'partidos_jugados', 'ganados', 'perdidos', 'wo',
        'sets_ganados', 'sets_perdidos', 'puntos_favor', 'puntos_contra'
    ];

    for (const campo of camposNumericos) {
        if (data[campo] !== undefined && data[campo] < 0) {
            throw new Error(`El campo ${campo} no puede ser negativo`);
        }
    }

    try {
        const nuevaTablaPosicion = await TablaPosicionRepository.crearTablaPosicion({
            ...data,
            puntos: data.puntos || 0,
            partidos_jugados: data.partidos_jugados || 0,
            ganados: data.ganados || 0,
            perdidos: data.perdidos || 0,
            wo: data.wo || 0,
            sets_ganados: data.sets_ganados || 0,
            sets_perdidos: data.sets_perdidos || 0,
            diferencia_sets: data.diferencia_sets || 0,
            puntos_favor: data.puntos_favor || 0,
            puntos_contra: data.puntos_contra || 0,
            diferencia_puntos: data.diferencia_puntos || 0,
            estado: data.estado !== undefined ? data.estado : true
        });
        return nuevaTablaPosicion;
    } catch (error) {
        throw new Error(`Error al crear la posición en tabla: ${error.message}`);
    }
};

// ============================================
// READ - Obtener todas las posiciones activas
// ============================================
const obtenerTablaPosiciones = async () => {
    try {
        const tablaPosiciones = await TablaPosicionRepository.obtenerTablaPosiciones();
        return tablaPosiciones || [];
    } catch (error) {
        throw new Error(`Error al obtener las posiciones: ${error.message}`);
    }
};

// ============================================
// READ - Obtener TODAS las posiciones (incluyendo inactivas)
// ============================================
const obtenerTodasLasTablaPosiciones = async () => {
    try {
        const tablaPosiciones = await TablaPosicionRepository.obtenerTodasLasTablaPosiciones();
        return tablaPosiciones || [];
    } catch (error) {
        throw new Error(`Error al obtener todas las posiciones: ${error.message}`);
    }
};

// ============================================
// READ - Obtener una posición por ID
// ============================================
const obtenerTablaPosicionPorId = async (id_tabla) => {
    if (!id_tabla || !Number.isInteger(parseInt(id_tabla))) {
        throw new Error('El ID de la tabla debe ser un número válido');
    }

    try {
        const tablaPosicion = await TablaPosicionRepository.obtenerTablaPosicionPorId(id_tabla);

        if (!tablaPosicion) {
            throw new Error('La posición en tabla no existe');
        }

        return tablaPosicion;
    } catch (error) {
        throw new Error(`Error al obtener la posición: ${error.message}`);
    }
};

// ============================================
// READ - Obtener tabla por Campeonato
// ============================================
const obtenerTablaPorCampeonato = async (id_campeonato) => {
    if (!id_campeonato || !Number.isInteger(parseInt(id_campeonato))) {
        throw new Error('El ID del campeonato debe ser un número válido');
    }

    try {
        const tablaPosiciones = await TablaPosicionRepository.obtenerTablaPorCampeonato(id_campeonato);
        return tablaPosiciones || [];
    } catch (error) {
        throw new Error(`Error al obtener la tabla por campeonato: ${error.message}`);
    }
};

// ============================================
// READ - Obtener tabla por Campeonato y Categoría
// ============================================
const obtenerTablaPorCampeonatoCategoria = async (id_campeonato, id_categoria) => {
    if (!id_campeonato || !Number.isInteger(parseInt(id_campeonato))) {
        throw new Error('El ID del campeonato debe ser un número válido');
    }

    if (!id_categoria || !Number.isInteger(parseInt(id_categoria))) {
        throw new Error('El ID de la categoría debe ser un número válido');
    }

    try {
        let tablaPosiciones = await TablaPosicionRepository.obtenerTablaPorCampeonatoCategoria(id_campeonato, id_categoria);

        // Si la tabla está vacía, intentar inicializarla con los equipos inscritos
        if (!tablaPosiciones || tablaPosiciones.length === 0) {
            console.log(`📊 Tabla vacía para campeonato ${id_campeonato} y categoría ${id_categoria}. Inicializando...`);
            tablaPosiciones = await TablaPosicionRepository.inicializarTablaConEquiposInscritos(id_campeonato, id_categoria);
        } else {
            // Sincronizar: agregar equipos inscritos que no estén en la tabla
            console.log(`📊 Sincronizando tabla con ${tablaPosiciones.length} equipos existentes...`);
            tablaPosiciones = await TablaPosicionRepository.sincronizarTablaConInscripciones(id_campeonato, id_categoria);
        }

        return tablaPosiciones || [];
    } catch (error) {
        throw new Error(`Error al obtener la tabla por campeonato y categoría: ${error.message}`);
    }
};

// ============================================
// READ - Obtener posición de un equipo específico
// ============================================
const obtenerPosicionEquipo = async (id_campeonato, id_categoria, id_equipo) => {
    if (!id_campeonato || !Number.isInteger(parseInt(id_campeonato))) {
        throw new Error('El ID del campeonato debe ser un número válido');
    }

    if (!id_categoria || !Number.isInteger(parseInt(id_categoria))) {
        throw new Error('El ID de la categoría debe ser un número válido');
    }

    if (!id_equipo || !Number.isInteger(parseInt(id_equipo))) {
        throw new Error('El ID del equipo debe ser un número válido');
    }

    try {
        const posicion = await TablaPosicionRepository.obtenerPosicionEquipo(id_campeonato, id_categoria, id_equipo);

        if (!posicion) {
            throw new Error('No se encontró la posición del equipo en esta categoría');
        }

        return posicion;
    } catch (error) {
        throw new Error(`Error al obtener la posición del equipo: ${error.message}`);
    }
};

// ============================================
// READ - Obtener top N equipos
// ============================================
const obtenerTopEquipos = async (id_campeonato, id_categoria, limite = 5) => {
    if (!id_campeonato || !Number.isInteger(parseInt(id_campeonato))) {
        throw new Error('El ID del campeonato debe ser un número válido');
    }

    if (!id_categoria || !Number.isInteger(parseInt(id_categoria))) {
        throw new Error('El ID de la categoría debe ser un número válido');
    }

    if (limite < 1 || limite > 20) {
        throw new Error('El límite debe estar entre 1 y 20');
    }

    try {
        const topEquipos = await TablaPosicionRepository.obtenerTopEquipos(id_campeonato, id_categoria, limite);
        return topEquipos || [];
    } catch (error) {
        throw new Error(`Error al obtener el top de equipos: ${error.message}`);
    }
};

// ============================================
// UPDATE - Actualizar una posición
// ============================================
const actualizarTablaPosicion = async (id_tabla, data) => {
    if (!id_tabla || !Number.isInteger(parseInt(id_tabla))) {
        throw new Error('El ID de la tabla debe ser un número válido');
    }

    if (!data || Object.keys(data).length === 0) {
        throw new Error('Debes proporcionar datos para actualizar');
    }

    // Validar posición si se proporciona
    if (data.posicion !== undefined && (data.posicion < 1 || !Number.isInteger(parseInt(data.posicion)))) {
        throw new Error('La posición debe ser un número mayor o igual a 1');
    }

    // Validar valores numéricos no negativos
    const camposNumericos = [
        'puntos', 'partidos_jugados', 'ganados', 'perdidos', 'wo',
        'sets_ganados', 'sets_perdidos', 'puntos_favor', 'puntos_contra'
    ];

    for (const campo of camposNumericos) {
        if (data[campo] !== undefined && data[campo] < 0) {
            throw new Error(`El campo ${campo} no puede ser negativo`);
        }
    }

    try {
        const tablaPosicion = await TablaPosicionRepository.actualizarTablaPosicion(id_tabla, data);

        if (!tablaPosicion) {
            throw new Error('La posición en tabla no existe');
        }

        return tablaPosicion;
    } catch (error) {
        throw new Error(`Error al actualizar la posición: ${error.message}`);
    }
};

// ============================================
// DELETE - Eliminar (soft delete) una posición
// ============================================
const eliminarTablaPosicion = async (id_tabla) => {
    if (!id_tabla || !Number.isInteger(parseInt(id_tabla))) {
        throw new Error('El ID de la tabla debe ser un número válido');
    }

    try {
        const tablaPosicion = await TablaPosicionRepository.eliminarTablaPosicion(id_tabla);

        if (!tablaPosicion) {
            throw new Error('La posición en tabla no existe');
        }

        return tablaPosicion;
    } catch (error) {
        throw new Error(`Error al eliminar la posición: ${error.message}`);
    }
};

// ============================================
// ACTUALIZAR TABLA TRAS PARTIDO - Función principal
// ============================================
/**
 * Actualiza la tabla de posiciones después de finalizar un partido
 * @param {Object} datosPartido - Datos del partido finalizado
 * @param {number} datosPartido.id_campeonato - ID del campeonato
 * @param {number} datosPartido.id_categoria - ID de la categoría
 * @param {number} datosPartido.equipo_local - ID del equipo local
 * @param {number} datosPartido.equipo_visitante - ID del equipo visitante
 * @param {number} datosPartido.sets_local - Sets ganados por el local
 * @param {number} datosPartido.sets_visitante - Sets ganados por el visitante
 * @param {number} datosPartido.puntos_local - Puntos totales del local (opcional)
 * @param {number} datosPartido.puntos_visitante - Puntos totales del visitante (opcional)
 * @param {boolean} datosPartido.es_wo - Si el partido fue WO (opcional)
 */
const actualizarTablaTrasPartido = async (datosPartido) => {
    const {
        id_campeonato,
        id_categoria,
        equipo_local,
        equipo_visitante,
        sets_local,
        sets_visitante,
        puntos_local = 0,
        puntos_visitante = 0,
        es_wo = false
    } = datosPartido;

    console.log('📊 Actualizando tabla de posiciones tras partido:');
    console.log(`   Campeonato: ${id_campeonato}, Categoría: ${id_categoria}`);
    console.log(`   Local (${equipo_local}): ${sets_local} sets, ${puntos_local} puntos`);
    console.log(`   Visitante (${equipo_visitante}): ${sets_visitante} sets, ${puntos_visitante} puntos`);

    // Validaciones básicas
    if (!id_campeonato || !id_categoria || !equipo_local || !equipo_visitante) {
        throw new Error('Faltan datos requeridos del partido');
    }

    if (sets_local === undefined || sets_visitante === undefined) {
        throw new Error('Faltan los resultados de sets del partido');
    }

    try {
        // 1. Buscar o crear posición para ambos equipos
        const posicionLocal = await TablaPosicionRepository.buscarOCrearPosicionEquipo(
            id_campeonato, id_categoria, equipo_local
        );
        const posicionVisitante = await TablaPosicionRepository.buscarOCrearPosicionEquipo(
            id_campeonato, id_categoria, equipo_visitante
        );

        // 2. Determinar ganador y asignar puntos según sistema de puntos:
        // - Victoria (3-0, 3-1 o 3-2): Ganador 2 pts, Perdedor 1 pt
        // - WO: Ganador 2 pts, Perdedor 0 pts
        let puntosGanadorLocal = 0;
        let puntosGanadorVisitante = 0;
        let ganoLocal = sets_local > sets_visitante;

        if (es_wo) {
            // Walkover - ganador 2 pts, perdedor 0 pts
            if (ganoLocal) {
                puntosGanadorLocal = 2;
                puntosGanadorVisitante = 0;
            } else {
                puntosGanadorLocal = 0;
                puntosGanadorVisitante = 2;
            }
        } else {
            // Partido normal - ganador 2 pts, perdedor 1 pt
            if (ganoLocal) {
                puntosGanadorLocal = 2;
                puntosGanadorVisitante = 1;
            } else {
                puntosGanadorVisitante = 2;
                puntosGanadorLocal = 1;
            }
        }

        // 3. Actualizar estadísticas del equipo local
        const nuevosDatosLocal = {
            partidos_jugados: posicionLocal.partidos_jugados + 1,
            ganados: posicionLocal.ganados + (ganoLocal && !es_wo ? 1 : 0),
            perdidos: posicionLocal.perdidos + (!ganoLocal && !es_wo ? 1 : 0),
            wo: posicionLocal.wo + (es_wo && ganoLocal ? 1 : 0),
            sets_ganados: posicionLocal.sets_ganados + sets_local,
            sets_perdidos: posicionLocal.sets_perdidos + sets_visitante,
            puntos_favor: posicionLocal.puntos_favor + puntos_local,
            puntos_contra: posicionLocal.puntos_contra + puntos_visitante,
            puntos: posicionLocal.puntos + puntosGanadorLocal
        };
        nuevosDatosLocal.diferencia_sets = nuevosDatosLocal.sets_ganados - nuevosDatosLocal.sets_perdidos;
        nuevosDatosLocal.diferencia_puntos = nuevosDatosLocal.puntos_favor - nuevosDatosLocal.puntos_contra;

        await posicionLocal.update(nuevosDatosLocal);

        // 4. Actualizar estadísticas del equipo visitante
        const nuevosDatosVisitante = {
            partidos_jugados: posicionVisitante.partidos_jugados + 1,
            ganados: posicionVisitante.ganados + (!ganoLocal && !es_wo ? 1 : 0),
            perdidos: posicionVisitante.perdidos + (ganoLocal && !es_wo ? 1 : 0),
            wo: posicionVisitante.wo + (es_wo && !ganoLocal ? 1 : 0),
            sets_ganados: posicionVisitante.sets_ganados + sets_visitante,
            sets_perdidos: posicionVisitante.sets_perdidos + sets_local,
            puntos_favor: posicionVisitante.puntos_favor + puntos_visitante,
            puntos_contra: posicionVisitante.puntos_contra + puntos_local,
            puntos: posicionVisitante.puntos + puntosGanadorVisitante
        };
        nuevosDatosVisitante.diferencia_sets = nuevosDatosVisitante.sets_ganados - nuevosDatosVisitante.sets_perdidos;
        nuevosDatosVisitante.diferencia_puntos = nuevosDatosVisitante.puntos_favor - nuevosDatosVisitante.puntos_contra;

        await posicionVisitante.update(nuevosDatosVisitante);

        // 5. Recalcular posiciones de toda la tabla
        const tablasActualizadas = await TablaPosicionRepository.recalcularPosiciones(
            id_campeonato, id_categoria
        );

        console.log('✅ Tabla de posiciones actualizada correctamente');
        console.log(`   ${tablasActualizadas.length} equipos en la tabla`);

        return {
            success: true,
            message: 'Tabla de posiciones actualizada',
            posicionLocal: nuevosDatosLocal,
            posicionVisitante: nuevosDatosVisitante,
            totalEquipos: tablasActualizadas.length
        };

    } catch (error) {
        console.error('❌ Error actualizando tabla de posiciones:', error);
        throw new Error(`Error al actualizar la tabla de posiciones: ${error.message}`);
    }
};

// ============================================
// INICIALIZAR TABLA - Crear entradas para todos los equipos inscritos
// ============================================
const inicializarTablaConEquiposInscritos = async (id_campeonato, id_categoria) => {
    if (!id_campeonato || !Number.isInteger(parseInt(id_campeonato))) {
        throw new Error('El ID del campeonato debe ser un número válido');
    }

    if (!id_categoria || !Number.isInteger(parseInt(id_categoria))) {
        throw new Error('El ID de la categoría debe ser un número válido');
    }

    try {
        console.log(`📊 Inicializando tabla de posiciones para campeonato ${id_campeonato}, categoría ${id_categoria}`);
        const tablaPosiciones = await TablaPosicionRepository.inicializarTablaConEquiposInscritos(id_campeonato, id_categoria);
        console.log(`✅ Tabla inicializada con ${tablaPosiciones.length} equipos`);
        return tablaPosiciones;
    } catch (error) {
        throw new Error(`Error al inicializar la tabla: ${error.message}`);
    }
};

module.exports = {
    crearTablaPosicion,
    obtenerTablaPosiciones,
    obtenerTodasLasTablaPosiciones,
    obtenerTablaPosicionPorId,
    obtenerTablaPorCampeonato,
    obtenerTablaPorCampeonatoCategoria,
    obtenerPosicionEquipo,
    obtenerTopEquipos,
    actualizarTablaPosicion,
    eliminarTablaPosicion,
    actualizarTablaTrasPartido,
    inicializarTablaConEquiposInscritos
};
