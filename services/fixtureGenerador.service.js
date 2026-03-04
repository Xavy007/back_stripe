// services/fixtureGenerador.service.js

/**
 * Servicio para generar fixtures automáticos de campeonatos
 * Soporta:
 * - Todos contra todos (ida y vuelta, solo ida)
 * - Por grupos
 * - Playoffs/eliminatorias
 */

const { Inscripcion, Participacion, Equipo, GrupoInscripcion, Grupo, Club } = require('../models');

class FixtureGeneradorService {
  /**
   * Genera fixture completo para un campeonato
   * @param {Object} config - Configuración del fixture
   * @returns {Array} Lista de partidos generados (sin guardar en BD)
   */
  async generarFixture(config) {
    const {
      id_campeonato,
      id_cc, // ID de campeonato-categoria
      tipo_fixture, // 'todos_contra_todos', 'todos_vs_todos', 'grupos', 'eliminatoria'
      ida_vuelta, // true/false
      id_fase, // Opcional: fase del campeonato
      grupos, // Opcional: array de IDs de grupos
      fecha_inicio, // Fecha de inicio del fixture
      dias_entre_jornadas, // Días entre cada jornada
      hora_inicio, // Hora predeterminada para partidos
    } = config;

    let partidos = [];

    // Normalizar tipo_fixture
    const tipoNormalizado = tipo_fixture === 'todos_vs_todos' ? 'todos_contra_todos' : tipo_fixture;

    switch (tipoNormalizado) {
      case 'todos_contra_todos':
        partidos = await this.generarTodosContraTodos(config);
        break;
      case 'grupos':
        partidos = await this.generarPorGrupos(config);
        break;
      case 'eliminatoria':
        partidos = await this.generarEliminatoria(config);
        break;
      default:
        throw new Error(`Tipo de fixture no válido: ${tipo_fixture}`);
    }

    return partidos;
  }

  /**
   * Genera fixture de todos contra todos
   */
  async generarTodosContraTodos(config) {
    const { id_campeonato, id_cc, ida_vuelta, fecha_inicio, dias_entre_jornadas, hora_inicio } = config;

    // Obtener equipos inscritos (usar Inscripcion en lugar de Participacion)
    const inscripciones = await Inscripcion.findAll({
      where: {
        id_cc,
        estado: true
      },
      include: [{
        model: Equipo,
        as: 'equipo',
        attributes: ['id_equipo', 'nombre']
      }]
    });

    if (inscripciones.length < 2) {
      throw new Error('Se necesitan al menos 2 equipos inscritos para generar un fixture');
    }

    const equipos = inscripciones.map(ins => ins.equipo.id_equipo);
    const partidos = [];

    // Algoritmo Round-Robin (todos contra todos)
    const rondas = this.generarRoundRobin(equipos);

    let jornadaNumero = 1;
    let fechaActual = new Date(fecha_inicio);

    // Generar partidos de ida
    rondas.forEach((ronda, indexRonda) => {
      ronda.forEach((partido) => {
        partidos.push({
          id_campeonato,
          id_cc,
          equipo_local: partido[0],
          equipo_visitante: partido[1],
          id_jornada: null, // Se asignará después
          numero_jornada: jornadaNumero, // Campo temporal para agrupar, no se guarda en BD
          fecha_hora: new Date(
            fechaActual.getFullYear(),
            fechaActual.getMonth(),
            fechaActual.getDate(),
            parseInt(hora_inicio.split(':')[0]),
            parseInt(hora_inicio.split(':')[1])
          ),
          p_estado: 'programado',
          id_cancha: null, // Se asignará manualmente
          estado: true
        });
      });

      jornadaNumero++;
      fechaActual.setDate(fechaActual.getDate() + dias_entre_jornadas);
    });

    // Si es ida y vuelta, generar partidos de vuelta
    if (ida_vuelta) {
      rondas.forEach((ronda, indexRonda) => {
        ronda.forEach((partido) => {
          partidos.push({
            id_campeonato,
            id_cc,
            equipo_local: partido[1], // Invertir local y visitante
            equipo_visitante: partido[0],
            id_jornada: null,
            numero_jornada: jornadaNumero, // Campo temporal para agrupar, no se guarda en BD
            fecha_hora: new Date(
              fechaActual.getFullYear(),
              fechaActual.getMonth(),
              fechaActual.getDate(),
              parseInt(hora_inicio.split(':')[0]),
              parseInt(hora_inicio.split(':')[1])
            ),
            p_estado: 'programado',
            id_cancha: null,
            estado: true
          });
        });

        jornadaNumero++;
        fechaActual.setDate(fechaActual.getDate() + dias_entre_jornadas);
      });
    }

    return partidos;
  }

  /**
   * Genera fixture por grupos
   */
  async generarPorGrupos(config) {
    const { id_campeonato, id_cc, grupos, ida_vuelta, fecha_inicio, dias_entre_jornadas, hora_inicio } = config;

    const todosPartidos = [];
    let fechaActual = new Date(fecha_inicio);
    let jornadaGlobal = 1;

    // Generar fixture para cada grupo
    for (const id_grupo of grupos) {
      // Obtener equipos del grupo
      const grupoInscripciones = await GrupoInscripcion.findAll({
        where: {
          id_grupo,
          estado: true
        },
        include: [{
          model: Participacion,
          as: 'participacion',
          include: [{
            model: Equipo,
            as: 'equipo',
            attributes: ['id_equipo', 'nombre']
          }]
        }]
      });

      if (grupoInscripciones.length < 2) {
        continue; // Saltar grupos con menos de 2 equipos
      }

      const equiposGrupo = grupoInscripciones.map(gi => gi.participacion.equipo.id_equipo);
      const rondasGrupo = this.generarRoundRobin(equiposGrupo);

      // Generar partidos de ida para este grupo
      rondasGrupo.forEach((ronda) => {
        ronda.forEach((partido) => {
          todosPartidos.push({
            id_campeonato,
            id_cc,
            id_grupo,
            equipo_local: partido[0],
            equipo_visitante: partido[1],
            numero_jornada: jornadaGlobal,
            fecha_hora: new Date(
              fechaActual.getFullYear(),
              fechaActual.getMonth(),
              fechaActual.getDate(),
              parseInt(hora_inicio.split(':')[0]),
              parseInt(hora_inicio.split(':')[1])
            ),
            p_estado: 'programado',
            es_ida: true,
            es_vuelta: false,
            id_cancha: null,
            estado: true
          });
        });
      });

      // Si es ida y vuelta
      if (ida_vuelta) {
        rondasGrupo.forEach((ronda) => {
          ronda.forEach((partido) => {
            todosPartidos.push({
              id_campeonato,
              id_cc,
              id_grupo,
              equipo_local: partido[1],
              equipo_visitante: partido[0],
              numero_jornada: jornadaGlobal,
              fecha_hora: new Date(
                fechaActual.getFullYear(),
                fechaActual.getMonth(),
                fechaActual.getDate(),
                parseInt(hora_inicio.split(':')[0]),
                parseInt(hora_inicio.split(':')[1])
              ),
              p_estado: 'programado',
              es_ida: false,
              es_vuelta: true,
              id_cancha: null,
              estado: true
            });
          });
        });
      }
    }

    return todosPartidos;
  }

  /**
   * Genera fixture de eliminatoria (playoffs)
   */
  async generarEliminatoria(config) {
    const { id_campeonato, id_cc, id_fase, equipos_clasificados, fecha_inicio, dias_entre_partidos, hora_inicio } = config;

    if (!equipos_clasificados || equipos_clasificados.length === 0) {
      throw new Error('No hay equipos clasificados para la eliminatoria');
    }

    // Verificar que sea potencia de 2
    const numEquipos = equipos_clasificados.length;
    if (!this.esPotenciaDeDos(numEquipos)) {
      throw new Error('El número de equipos debe ser potencia de 2 (2, 4, 8, 16, etc.)');
    }

    const partidos = [];
    let fechaActual = new Date(fecha_inicio);

    // Emparejar equipos (1 vs último, 2 vs penúltimo, etc.)
    for (let i = 0; i < numEquipos / 2; i++) {
      partidos.push({
        id_campeonato,
        id_cc,
        id_fase,
        equipo_local: equipos_clasificados[i],
        equipo_visitante: equipos_clasificados[numEquipos - 1 - i],
        numero_ronda: 1,
        numero_partido: i + 1,
        fecha_hora: new Date(
          fechaActual.getFullYear(),
          fechaActual.getMonth(),
          fechaActual.getDate() + (i * dias_entre_partidos),
          parseInt(hora_inicio.split(':')[0]),
          parseInt(hora_inicio.split(':')[1])
        ),
        p_estado: 'programado',
        es_eliminatoria: true,
        id_cancha: null,
        estado: true
      });
    }

    return partidos;
  }

  /**
   * Algoritmo Round-Robin para generar enfrentamientos
   * @param {Array} equipos - IDs de equipos
   * @returns {Array} Array de rondas, cada ronda con array de partidos [local, visitante]
   */
  generarRoundRobin(equipos) {
    const n = equipos.length;
    const rondas = [];

    // Si hay número impar, agregar "bye" (equipo fantasma)
    const equiposAux = n % 2 === 0 ? [...equipos] : [...equipos, null];
    const totalEquipos = equiposAux.length;

    // Generar rondas
    for (let ronda = 0; ronda < totalEquipos - 1; ronda++) {
      const partidosRonda = [];

      for (let i = 0; i < totalEquipos / 2; i++) {
        const local = equiposAux[i];
        const visitante = equiposAux[totalEquipos - 1 - i];

        // Si alguno es "bye", saltar partido
        if (local !== null && visitante !== null) {
          partidosRonda.push([local, visitante]);
        }
      }

      rondas.push(partidosRonda);

      // Rotar equipos (el primero se queda fijo)
      const fijo = equiposAux[0];
      const rotados = equiposAux.slice(1);
      rotados.push(rotados.shift()); // Rotar
      equiposAux.splice(0, equiposAux.length, fijo, ...rotados);
    }

    return rondas;
  }

  /**
   * Verifica si un número es potencia de 2
   */
  esPotenciaDeDos(n) {
    return n > 0 && (n & (n - 1)) === 0;
  }

  /**
   * Calcula estadísticas del fixture
   */
  calcularEstadisticas(partidos) {
    return {
      total_partidos: partidos.length,
      total_jornadas: Math.max(...partidos.map(p => p.numero_jornada || 0)),
      equipos_participantes: new Set([
        ...partidos.map(p => p.equipo_local),
        ...partidos.map(p => p.equipo_visitante)
      ]).size,
      fecha_inicio: partidos.length > 0 ? partidos[0].fecha_hora : null,
      fecha_fin: partidos.length > 0 ? partidos[partidos.length - 1].fecha_hora : null
    };
  }
}

module.exports = new FixtureGeneradorService();
