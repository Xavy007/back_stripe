const setsPartidoService = require('../../services/mongodb/setsPartido.service');
const EventosPartido = require('../../models/mongodb/EventosPartido');

class SetsPartidoController {
  async obtenerPorPartido(req, res) {
    try {
      const { idpartido } = req.params;
      const idPartidoInt = parseInt(idpartido);

      // Intentar obtener sets de la colección SetsPartido
      let sets = await setsPartidoService.obtenerPorPartido(idPartidoInt);

      // Si no hay sets guardados, calcular desde los eventos
      if (!sets || sets.length === 0) {
        console.log(`⚠️ No hay sets en colección, calculando desde eventos para partido ${idPartidoInt}`);

        // Obtener todos los eventos del partido
        const eventos = await EventosPartido.find({ idpartido: idPartidoInt })
          .sort({ numero_set: 1, secuencia: -1 });

        if (eventos && eventos.length > 0) {
          // Agrupar eventos por set y obtener el último de cada uno (mayor marcador)
          const setsMap = new Map();

          for (const evento of eventos) {
            const numSet = evento.numero_set;

            // Si no tenemos este set o el marcador es mayor, guardarlo
            if (!setsMap.has(numSet)) {
              setsMap.set(numSet, {
                numero_set: numSet,
                puntos_local: evento.marcador?.local || 0,
                puntos_visitante: evento.marcador?.visitante || 0,
                ganador: null,
                estado: 'finalizado'
              });
            } else {
              const setActual = setsMap.get(numSet);
              const puntosEvento = (evento.marcador?.local || 0) + (evento.marcador?.visitante || 0);
              const puntosActual = setActual.puntos_local + setActual.puntos_visitante;

              if (puntosEvento > puntosActual) {
                setActual.puntos_local = evento.marcador?.local || 0;
                setActual.puntos_visitante = evento.marcador?.visitante || 0;
              }
            }
          }

          // Convertir a array y determinar ganadores
          sets = Array.from(setsMap.values())
            .map(set => ({
              ...set,
              ganador: set.puntos_local > set.puntos_visitante ? 'local' : 'visitante'
            }))
            .sort((a, b) => a.numero_set - b.numero_set);

          console.log(`✅ Sets calculados desde eventos:`, sets);
        }
      }

      res.json({ success: true, data: sets || [] });
    } catch (error) {
      console.error('Error obteniendo sets:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async obtenerSetActual(req, res) {
    try {
      const { idpartido, numero_set } = req.params;
      const set = await setsPartidoService.obtenerSetActual(parseInt(idpartido), parseInt(numero_set));
      res.json({ success: true, data: set });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}

module.exports = new SetsPartidoController();
