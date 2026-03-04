const TablaPosicionService = require('../services/tablaPosicionService');

// ============================================
// CREATE - Crear una nueva posición en tabla
// ============================================
const crearTablaPosicion = async (req, res) => {
    try {
        const data = req.body;

        console.log('📨 Datos recibidos para crear posición en tabla:', data);

        const tablaPosicion = await TablaPosicionService.crearTablaPosicion(data);

        res.status(201).json({
            success: true,
            message: 'Posición en tabla creada exitosamente',
            data: tablaPosicion
        });
    } catch (error) {
        console.error('❌ Error en crearTablaPosicion:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener todas las posiciones activas
// ============================================
const obtenerTablaPosiciones = async (req, res) => {
    try {
        const tablaPosiciones = await TablaPosicionService.obtenerTablaPosiciones();

        res.status(200).json({
            success: true,
            message: 'Posiciones obtenidas exitosamente',
            data: tablaPosiciones,
            total: tablaPosiciones.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerTablaPosiciones:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener TODAS las posiciones (incluyendo inactivas)
// ============================================
const obtenerTodasLasTablaPosiciones = async (req, res) => {
    try {
        const tablaPosiciones = await TablaPosicionService.obtenerTodasLasTablaPosiciones();

        res.status(200).json({
            success: true,
            message: 'Todas las posiciones obtenidas exitosamente',
            data: tablaPosiciones,
            total: tablaPosiciones.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerTodasLasTablaPosiciones:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener una posición por ID
// ============================================
const obtenerTablaPosicionPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const tablaPosicion = await TablaPosicionService.obtenerTablaPosicionPorId(id);

        res.status(200).json({
            success: true,
            message: 'Posición obtenida exitosamente',
            data: tablaPosicion
        });
    } catch (error) {
        console.error('❌ Error en obtenerTablaPosicionPorId:', error);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener tabla por Campeonato
// ============================================
const obtenerTablaPorCampeonato = async (req, res) => {
    try {
        const { id_campeonato } = req.params;
        const tablaPosiciones = await TablaPosicionService.obtenerTablaPorCampeonato(id_campeonato);

        res.status(200).json({
            success: true,
            message: `${tablaPosiciones.length} posiciones encontradas`,
            data: tablaPosiciones,
            total: tablaPosiciones.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerTablaPorCampeonato:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener tabla por Campeonato y Categoría
// ============================================
const obtenerTablaPorCampeonatoCategoria = async (req, res) => {
    try {
        const { id_campeonato, id_categoria } = req.params;
        const tablaPosiciones = await TablaPosicionService.obtenerTablaPorCampeonatoCategoria(id_campeonato, id_categoria);

        res.status(200).json({
            success: true,
            message: `${tablaPosiciones.length} posiciones encontradas`,
            data: tablaPosiciones,
            total: tablaPosiciones.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerTablaPorCampeonatoCategoria:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener posición de un equipo específico
// ============================================
const obtenerPosicionEquipo = async (req, res) => {
    try {
        const { id_campeonato, id_categoria, id_equipo } = req.params;
        const posicion = await TablaPosicionService.obtenerPosicionEquipo(id_campeonato, id_categoria, id_equipo);

        res.status(200).json({
            success: true,
            message: 'Posición del equipo obtenida exitosamente',
            data: posicion
        });
    } catch (error) {
        console.error('❌ Error en obtenerPosicionEquipo:', error);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// READ - Obtener top N equipos
// ============================================
const obtenerTopEquipos = async (req, res) => {
    try {
        const { id_campeonato, id_categoria } = req.params;
        const limite = parseInt(req.query.limite) || 5;

        const topEquipos = await TablaPosicionService.obtenerTopEquipos(id_campeonato, id_categoria, limite);

        res.status(200).json({
            success: true,
            message: `Top ${topEquipos.length} equipos obtenidos`,
            data: topEquipos,
            total: topEquipos.length
        });
    } catch (error) {
        console.error('❌ Error en obtenerTopEquipos:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// UPDATE - Actualizar una posición
// ============================================
const actualizarTablaPosicion = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        console.log(`📨 Actualizando posición ${id} con:`, data);

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Se deben proporcionar datos para actualizar'
            });
        }

        const tablaPosicion = await TablaPosicionService.actualizarTablaPosicion(id, data);

        res.status(200).json({
            success: true,
            message: 'Posición actualizada exitosamente',
            data: tablaPosicion
        });
    } catch (error) {
        console.error('❌ Error en actualizarTablaPosicion:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// DELETE - Eliminar (soft delete) una posición
// ============================================
const eliminarTablaPosicion = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`🗑️ Eliminando posición con ID: ${id}`);

        const tablaPosicion = await TablaPosicionService.eliminarTablaPosicion(id);

        res.status(200).json({
            success: true,
            message: 'Posición eliminada exitosamente',
            data: tablaPosicion
        });
    } catch (error) {
        console.error('❌ Error en eliminarTablaPosicion:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// INICIALIZAR - Crear tabla con equipos inscritos
// ============================================
const inicializarTabla = async (req, res) => {
    try {
        const { id_campeonato, id_categoria } = req.params;

        console.log(`📊 Inicializando tabla para campeonato ${id_campeonato}, categoría ${id_categoria}`);

        const tablaPosiciones = await TablaPosicionService.inicializarTablaConEquiposInscritos(id_campeonato, id_categoria);

        res.status(200).json({
            success: true,
            message: `Tabla inicializada con ${tablaPosiciones.length} equipos`,
            data: tablaPosiciones,
            total: tablaPosiciones.length
        });
    } catch (error) {
        console.error('❌ Error en inicializarTabla:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
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
    inicializarTabla
};
