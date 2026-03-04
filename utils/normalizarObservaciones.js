// services/mongodb/utils/normalizarObservaciones.js (por ejemplo)
function normalizarObservaciones(partido) {
  // Si no hay observaciones o es texto plano
  if (!partido.observaciones || typeof partido.observaciones === 'string') {
    const texto = typeof partido.observaciones === 'string'
      ? partido.observaciones
      : '';

    partido.observaciones = {
      protestas: [],
      comentarios_arbitro: texto,  // guardo el texto anterior aquí
      comentarios_anotador: '',
      incidencias: []
    };
  }

  // Asegurar que las colecciones existan
  if (!Array.isArray(partido.observaciones.protestas)) {
    partido.observaciones.protestas = [];
  }
  if (!Array.isArray(partido.observaciones.incidencias)) {
    partido.observaciones.incidencias = [];
  }

  return partido;
}

module.exports = normalizarObservaciones;
