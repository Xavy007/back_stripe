// routes/mongodb/index.js
const express = require('express');
const router = express.Router();

// Importar todas las rutas
const configuracionPuntosRoutes = require('./configuracionPuntos.routes');
const partidoDigitalRoutes = require('./partidoDigital.routes');
const setsPartidoRoutes = require('./setsPartido.routes');
const formacionesSetsRoutes = require('./formacionesSets.routes');
const eventosPartidoRoutes = require('./eventosPartido.routes');
const substitucionesPartidoRoutes = require('./substitucionesPartido.routes');
const timeoutsPartidoRoutes = require('./timeoutsPartido.routes');
const sancionesPartidoRoutes = require('./sancionesPartido.routes');
const estadisticasJugadoresRoutes = require('./estadisticasJugadores.routes');
const estadisticasEquiposRoutes = require('./estadisticasEquipos.routes');
const planillaDigitalRoutes = require('./planillaDigital.routes');
// routes/mongodb/index.js
const planillaGeneradorRoutes = require('./planillaGenerador.routes');

// ... otras rutas

router.use('/planilla', planillaGeneradorRoutes);
// Montar rutas
router.use('/configuracion-puntos', configuracionPuntosRoutes);
router.use('/partidos-digitales', partidoDigitalRoutes);
router.use('/sets', setsPartidoRoutes);
router.use('/formaciones', formacionesSetsRoutes);
router.use('/eventos', eventosPartidoRoutes);
router.use('/substituciones', substitucionesPartidoRoutes);
router.use('/timeouts', timeoutsPartidoRoutes);
router.use('/sanciones', sancionesPartidoRoutes);
router.use('/estadisticas-jugadores', estadisticasJugadoresRoutes);
router.use('/estadisticas-equipos', estadisticasEquiposRoutes);
router.use('/planilla-digital', planillaDigitalRoutes);

module.exports = router;
