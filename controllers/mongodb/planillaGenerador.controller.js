// controllers/mongodb/planillaGenerador.controller.js
const planillaGeneradorService = require('../../services/mongodb/planillaGenerador.service');

class PlanillaGeneradorController {
  
  async generarHTML(req, res) {
    try {
      const { idpartido } = req.params;

      const html = await planillaGeneradorService.generarPlanillaHTML(
        parseInt(idpartido)
      );

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async generarPDF(req, res) {
    try {
      const { idpartido } = req.params;

      const resultado = await planillaGeneradorService.generarPlanillaPDF(
        parseInt(idpartido)
      );

      res.json({
        success: true,
        data: resultado,
        message: 'Planilla PDF generada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async descargarPDF(req, res) {
    try {
      const { idpartido } = req.params;

      const resultado = await planillaGeneradorService.generarPlanillaPDF(
        parseInt(idpartido)
      );

      res.download(resultado.filepath, resultado.filename);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new PlanillaGeneradorController();
