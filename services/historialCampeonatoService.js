const HistorialCampeonatoRepository = require('../repositories/historialCampeonatoRepository');

// ============================================
// CREATE - Crear un nuevo registro histórico
// ============================================
const crearHistorialCampeonato = async (data) => {
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

    if (!data.posicion_final || !Number.isInteger(parseInt(data.posicion_final))) {
        throw new Error('La posición final es requerida y debe ser un número válido');
    }

    if (data.posicion_final < 1) {
        throw new Error('La posición final debe ser al menos 1');
    }

    if (data.puntos !== undefined && data.puntos < 0) {
        throw new Error('Los puntos no pueden ser negativos');
    }

    try {
        const nuevoHistorial = await HistorialCampeonatoRepository.crearHistorialCampeonato({
            ...data,
            puntos: data.puntos || 0,
            estado: true,
            freg: new Date()
        });
        return nuevoHistorial;
    } catch (error) {
        throw new Error(`Error al crear el registro histórico: ${error.message}`);
    }
};

// ============================================
// READ - Obtener todos los registros históricos activos
// ============================================
const obtenerHistorialCampeonatos = async () => {
    try {
        const historial = await HistorialCampeonatoRepository.obtenerHistorialCampeonatos();
        return historial || [];
    } catch (error) {
        throw new Error(`Error al obtener registros históricos: ${error.message}`);
    }
};

// ============================================
// READ - Obtener TODOS los registros históricos (incluyendo inactivos)
// ============================================
const obtenerTodosLosHistorialCampeonatos = async () => {
    try {
        const historial = await HistorialCampeonatoRepository.obtenerTodosLosHistorialCampeonatos();
        return historial || [];
    } catch (error) {
        throw new Error(`Error al obtener todos los registros históricos: ${error.message}`);
    }
};

// ============================================
// READ - Obtener un registro histórico por ID
// ============================================
const obtenerHistorialCampeonatoPorId = async (id_historial) => {
    if (!id_historial || !Number.isInteger(parseInt(id_historial))) {
        throw new Error('El ID del registro histórico debe ser un número válido');
    }

    try {
        const historial = await HistorialCampeonatoRepository.obtenerHistorialCampeonatoPorId(id_historial);

        if (!historial) {
            throw new Error('El registro histórico no existe');
        }

        return historial;
    } catch (error) {
        throw new Error(`Error al obtener el registro histórico: ${error.message}`);
    }
};

// ============================================
// READ - Obtener historial por Campeonato
// ============================================
const obtenerHistorialPorCampeonato = async (id_campeonato) => {
    if (!id_campeonato || !Number.isInteger(parseInt(id_campeonato))) {
        throw new Error('El ID del campeonato debe ser un número válido');
    }

    try {
        const historial = await HistorialCampeonatoRepository.obtenerHistorialPorCampeonato(id_campeonato);
        return historial || [];
    } catch (error) {
        throw new Error(`Error al obtener historial por campeonato: ${error.message}`);
    }
};

// ============================================
// READ - Obtener historial por Equipo
// ============================================
const obtenerHistorialPorEquipo = async (id_equipo) => {
    if (!id_equipo || !Number.isInteger(parseInt(id_equipo))) {
        throw new Error('El ID del equipo debe ser un número válido');
    }

    try {
        const historial = await HistorialCampeonatoRepository.obtenerHistorialPorEquipo(id_equipo);
        return historial || [];
    } catch (error) {
        throw new Error(`Error al obtener historial por equipo: ${error.message}`);
    }
};

// ============================================
// READ - Obtener campeonatos ganados por un equipo
// ============================================
const obtenerCampeonatosGanados = async (id_equipo) => {
    if (!id_equipo || !Number.isInteger(parseInt(id_equipo))) {
        throw new Error('El ID del equipo debe ser un número válido');
    }

    try {
        const campeonatosGanados = await HistorialCampeonatoRepository.obtenerCampeonatosGanados(id_equipo);
        return campeonatosGanados || [];
    } catch (error) {
        throw new Error(`Error al obtener campeonatos ganados: ${error.message}`);
    }
};

// ============================================
// READ - Obtener top N equipos de un campeonato
// ============================================
const obtenerTopEquipos = async (id_campeonato, limite = 10) => {
    if (!id_campeonato || !Number.isInteger(parseInt(id_campeonato))) {
        throw new Error('El ID del campeonato debe ser un número válido');
    }

    if (limite < 1 || limite > 100) {
        throw new Error('El límite debe estar entre 1 y 100');
    }

    try {
        const topEquipos = await HistorialCampeonatoRepository.obtenerTopEquipos(id_campeonato, limite);
        return topEquipos || [];
    } catch (error) {
        throw new Error(`Error al obtener top equipos: ${error.message}`);
    }
};

// ============================================
// UPDATE - Actualizar un registro histórico
// ============================================
const actualizarHistorialCampeonato = async (id_historial, data) => {
    if (!id_historial || !Number.isInteger(parseInt(id_historial))) {
        throw new Error('El ID del registro histórico debe ser un número válido');
    }

    if (!data || Object.keys(data).length === 0) {
        throw new Error('Debes proporcionar datos para actualizar');
    }

    // Validar posicion_final si se proporciona
    if (data.posicion_final !== undefined && (data.posicion_final < 1 || !Number.isInteger(parseInt(data.posicion_final)))) {
        throw new Error('La posición final debe ser un número válido mayor o igual a 1');
    }

    // Validar puntos si se proporciona
    if (data.puntos !== undefined && data.puntos < 0) {
        throw new Error('Los puntos no pueden ser negativos');
    }

    // No permitir cambiar estado o freg desde aquí
    delete data.estado;
    delete data.freg;

    try {
        const historial = await HistorialCampeonatoRepository.actualizarHistorialCampeonato(id_historial, data);

        if (!historial) {
            throw new Error('El registro histórico no existe');
        }

        return historial;
    } catch (error) {
        throw new Error(`Error al actualizar el registro histórico: ${error.message}`);
    }
};

// ============================================
// DELETE - Eliminar (soft delete) un registro histórico
// ============================================
const eliminarHistorialCampeonato = async (id_historial) => {
    if (!id_historial || !Number.isInteger(parseInt(id_historial))) {
        throw new Error('El ID del registro histórico debe ser un número válido');
    }

    try {
        const historial = await HistorialCampeonatoRepository.obtenerHistorialCampeonatoPorId(id_historial);
        if (!historial) {
            throw new Error('El registro histórico no existe');
        }

        if (!historial.estado) {
            throw new Error('El registro histórico ya está eliminado');
        }

        const historialEliminado = await HistorialCampeonatoRepository.eliminarHistorialCampeonato(id_historial);
        return historialEliminado;
    } catch (error) {
        throw new Error(`Error al eliminar el registro histórico: ${error.message}`);
    }
};

module.exports = {
    crearHistorialCampeonato,
    obtenerHistorialCampeonatos,
    obtenerTodosLosHistorialCampeonatos,
    obtenerHistorialCampeonatoPorId,
    obtenerHistorialPorCampeonato,
    obtenerHistorialPorEquipo,
    obtenerCampeonatosGanados,
    obtenerTopEquipos,
    actualizarHistorialCampeonato,
    eliminarHistorialCampeonato
};
