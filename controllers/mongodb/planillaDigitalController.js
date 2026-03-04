// controllers/mongodb/planillaDigitalController.js
const planillaService = require('../../services/mongodb/planillaDigitalService');

/**
 * GET /api/planilla/:idpartido
 * Obtiene la planilla completa de un partido
 */
const obtenerPlanilla = async (req, res) => {
  try {
    const { idpartido } = req.params;

    if (!idpartido || isNaN(idpartido)) {
      return res.status(400).json({
        success: false,
        message: 'ID de partido inválido'
      });
    }

    const planilla = await planillaService.obtenerPlanillaCompleta(parseInt(idpartido));

    res.json({
      success: true,
      data: planilla,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('❌ Error en obtenerPlanilla:', error);

    if (error.message === 'Partido no encontrado') {
      return res.status(404).json({
        success: false,
        message: 'Partido no encontrado'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al obtener la planilla',
      error: error.message
    });
  }
};

/**
 * GET /api/planilla/:idpartido/resumen
 * Obtiene un resumen rápido del partido
 */
const obtenerResumen = async (req, res) => {
  try {
    const { idpartido } = req.params;

    const resumen = await planillaService.obtenerResumenPartido(parseInt(idpartido));

    if (!resumen) {
      return res.status(404).json({
        success: false,
        message: 'Partido no encontrado'
      });
    }

    res.json({
      success: true,
      data: resumen
    });

  } catch (error) {
    console.error('❌ Error en obtenerResumen:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener resumen',
      error: error.message
    });
  }
};

/**
 * GET /api/planilla/finalizados
 * Lista todos los partidos finalizados disponibles
 */
const listarPartidosFinalizados = async (req, res) => {
  try {
    const filtros = {
      idcampeonato: req.query.campeonato ? parseInt(req.query.campeonato) : null,
      idcategoria: req.query.categoria ? parseInt(req.query.categoria) : null,
      fecha_desde: req.query.fecha_desde,
      limite: req.query.limite ? parseInt(req.query.limite) : 100
    };

    const partidos = await planillaService.listarPartidosFinalizados(filtros);

    res.json({
      success: true,
      data: partidos,
      total: partidos.length
    });

  } catch (error) {
    console.error('❌ Error en listarPartidosFinalizados:', error);
    res.status(500).json({
      success: false,
      message: 'Error al listar partidos',
      error: error.message
    });
  }
};

/**
 * GET /api/planilla/:idpartido/verificar
 * Verifica si el partido está listo para imprimir
 */
const verificarPartido = async (req, res) => {
  try {
    const { idpartido } = req.params;

    const verificacion = await planillaService.verificarPartidoListo(parseInt(idpartido));

    res.json({
      success: true,
      data: verificacion
    });

  } catch (error) {
    console.error('❌ Error en verificarPartido:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar partido',
      error: error.message
    });
  }
};

/**
 * GET /api/planilla/:idpartido/html
 * Renderiza la planilla en HTML listo para imprimir
 */
const renderizarPlanillaHTML = async (req, res) => {
  try {
    const { idpartido } = req.params;

    const planilla = await planillaService.obtenerPlanillaCompleta(parseInt(idpartido));

    // Renderizar la vista HTML con los datos
    res.render('planilla-digital', { planilla });

  } catch (error) {
    console.error('❌ Error en renderizarPlanillaHTML:', error);
    res.status(500).send(`
      <html>
        <body>
          <h1>Error al cargar la planilla</h1>
          <p>${error.message}</p>
        </body>
      </html>
    `);
  }
};

module.exports = {
  obtenerPlanilla,
  obtenerResumen,
  listarPartidosFinalizados,
  verificarPartido,
  renderizarPlanillaHTML
};
