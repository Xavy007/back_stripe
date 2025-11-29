const CarnetService = require('../services/CarnetService');

// CREATE - Solicitar un nuevo carnet
const solicitarCarnet = async (req, res) => {
    try {
        console.log(req.body);
        const { id_jugador, id_gestion, solicitado_por, duracion_dias } = req.body;
        
        const resultado = await CarnetService.solicitarCarnet(
            id_jugador,
            id_gestion,
            solicitado_por,
            duracion_dias
        );

        res.status(201).json({
            success: true,
            message: resultado.mensaje,
            data: resultado.carnet
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE - Activar un carnet (cambiar de pendiente a activo)
const activarCarnet = async (req, res) => {
    console.log(req)
    try {
        const { id } = req.params;

        const resultado = await CarnetService.activarCarnet(id);

        res.status(200).json({
            success: true,
            message: resultado.mensaje,
            data: resultado.carnet
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE - Cancelar un carnet
const cancelarCarnet = async (req, res) => {
    try {
        const { id } = req.params;
        const { razon } = req.body;

        const resultado = await CarnetService.cancelarCarnet(id, razon);

        res.status(200).json({
            success: true,
            message: resultado.mensaje,
            data: resultado.carnet
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener un carnet por ID
const obtenerCarnetPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await CarnetService.obtenerCarnet(id);

        res.status(200).json({
            success: true,
            message: 'Carnet obtenido exitosamente',
            data: resultado.carnet
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener un carnet por número
const obtenerCarnetPorNumero = async (req, res) => {
    try {
        const { numero_carnet } = req.params;

        const resultado = await CarnetService.obtenerCarnetPorNumero(numero_carnet);

        res.status(200).json({
            success: true,
            message: 'Carnet obtenido exitosamente',
            data: resultado.carnet
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener carnets de un jugador
const obtenerCarnetsPorJugador = async (req, res) => {
    try {
        const { id_jugador } = req.params;

        const resultado = await CarnetService.obtenerCarnetsPorJugador(id_jugador);

        res.status(200).json({
            success: true,
            message: 'Carnets obtenidos exitosamente',
            data: resultado.carnets,
            total: resultado.total
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener carnet activo de un jugador en una gestión
const obtenerCarnetActual = async (req, res) => {
    try {
        const { id_jugador, id_gestion } = req.params;

        const resultado = await CarnetService.obtenerCarnetActual(id_jugador, id_gestion);

        if (!resultado.exito) {
            return res.status(404).json({
                success: false,
                message: resultado.mensaje
            });
        }

        res.status(200).json({
            success: true,
            message: 'Carnet obtenido exitosamente',
            data: resultado.carnet
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener carnets de una gestión
const obtenerCarnetsPorGestion = async (req, res) => {
    try {
        const { id_gestion } = req.params;
        const { estado } = req.query;

        const resultado = await CarnetService.obtenerCarnetsPorGestion(id_gestion, estado);

        res.status(200).json({
            success: true,
            message: 'Carnets obtenidos exitosamente',
            gestion: resultado.gestion,
            data: resultado.carnets,
            total: resultado.total
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener carnets con paginación
const obtenerConPaginacion = async (req, res) => {
    try {
        const { pagina = 1, limite = 10, ...filtros } = req.query;

        const resultado = await CarnetService.obtenerConPaginacion(
            parseInt(pagina),
            parseInt(limite),
            filtros
        );

        res.status(200).json({
            success: true,
            message: 'Carnets obtenidos exitosamente',
            ...resultado
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Buscar carnets
const buscarCarnets = async (req, res) => {
    try {
        const criterios = req.body;

        const resultado = await CarnetService.buscarCarnets(criterios);

        res.status(200).json({
            success: true,
            message: 'Búsqueda realizada exitosamente',
            data: resultado.carnets,
            total: resultado.total
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE - Marcar carnets vencidos
const marcarCarnetsvencidos = async (req, res) => {
    try {
        const resultado = await CarnetService.marcarCarnetsvencidos();

        res.status(200).json({
            success: true,
            message: resultado.mensaje,
            cantidad: resultado.cantidad
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// READ - Obtener estadísticas de una gestión
const obtenerEstadisticas = async (req, res) => {
    try {
        const { id_gestion } = req.params;

        const resultado = await CarnetService.obtenerEstadisticas(id_gestion);

        res.status(200).json({
            success: true,
            message: 'Estadísticas obtenidas exitosamente',
            gestion: resultado.gestion,
            data: resultado.estadisticas
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    solicitarCarnet,
    activarCarnet,
    cancelarCarnet,
    obtenerCarnetPorId,
    obtenerCarnetPorNumero,
    obtenerCarnetsPorJugador,
    obtenerCarnetActual,
    obtenerCarnetsPorGestion,
    obtenerConPaginacion,
    buscarCarnets,
    marcarCarnetsvencidos,
    obtenerEstadisticas
};