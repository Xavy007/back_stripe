/**
 * @file services/fixtureGenerador.service.js
 * @description Servicio de generación automática de fixtures para campeonatos de vóleibol.
 *
 * Encapsula los algoritmos de programación deportiva que transforman una lista
 * de equipos inscritos en un calendario completo de partidos. Los partidos
 * generados se retornan como objetos JavaScript listos para persistir en BD,
 * pero la escritura efectiva queda a cargo del controlador o servicio invocante.
 *
 * Formatos de competencia soportados:
 *   - todos_contra_todos (alias: todos_vs_todos):
 *       Cada equipo enfrenta a todos los demás una vez (o dos, con ida y vuelta).
 *       Algoritmo: Round-Robin con rotación circular. Garantiza distribución
 *       uniforme de partidos locales y visitantes.
 *
 *   - grupos:
 *       Los equipos se dividen en grupos pre-asignados (GrupoInscripcion).
 *       Dentro de cada grupo se aplica Round-Robin independiente.
 *       Todos los partidos del mismo grupo comparten id_grupo.
 *
 *   - eliminatoria:
 *       Bracket eliminatorio directo. Requiere un número de equipos
 *       que sea potencia de 2 (2, 4, 8, 16…). Los emparejamientos
 *       siguen la convención estándar: 1° vs último, 2° vs penúltimo…
 *
 * Campos generados en cada objeto partido:
 *   - id_campeonato, id_cc, equipo_local, equipo_visitante : identificadores relacionales.
 *   - numero_jornada : campo temporal para agrupar partidos; no se persiste en BD.
 *   - fecha_hora     : calculada a partir de fecha_inicio + días entre jornadas.
 *   - p_estado       : siempre 'programado' al generar.
 *   - id_cancha      : null; se asigna manualmente en la programación final.
 *   - estado         : true (activo).
 *
 * Nota sobre id_jornada vs numero_jornada:
 *   `numero_jornada` es un identificador temporal de agrupamiento. El controlador
 *   debe crear los registros Jornada en BD y reemplazar `numero_jornada` por el
 *   `id_jornada` correspondiente antes de persistir los partidos.
 *
 * El módulo se exporta como singleton (instancia única de la clase).
 *
 * @module services/fixtureGeneradorService
 */

const { Inscripcion, Participacion, Equipo, GrupoInscripcion, Grupo, Club } = require('../models');

/**
 * @class FixtureGeneradorService
 * @description Contiene todos los algoritmos de generación de calendarios deportivos.
 */
class FixtureGeneradorService {

  /* ═══════════════════════════════════════════════════════════════════
     Método principal — punto de entrada unificado
  ═══════════════════════════════════════════════════════════════════ */

  /**
   * Genera el fixture completo para una categoría de campeonato.
   *
   * Actúa como enrutador interno: delega la generación al método
   * especializado según el `tipo_fixture` recibido en la configuración.
   * Normaliza el alias `todos_vs_todos` → `todos_contra_todos` para
   * mantener compatibilidad con distintas convenciones de nomenclatura.
   *
   * @async
   * @param {object}  config                    - Parámetros de configuración del fixture.
   * @param {number}  config.id_campeonato       - FK del campeonato al que pertenecen los partidos.
   * @param {number}  config.id_cc               - FK de CampeonatoCategorias (categoría activa).
   * @param {string}  config.tipo_fixture         - Formato: 'todos_contra_todos' | 'todos_vs_todos' | 'grupos' | 'eliminatoria'.
   * @param {boolean} config.ida_vuelta           - true genera partidos de vuelta (local↔visitante invertidos).
   * @param {number}  [config.id_fase]            - FK de Fases; requerido para tipo 'eliminatoria'.
   * @param {number[]}[config.grupos]             - IDs de grupos; requerido para tipo 'grupos'.
   * @param {string}  config.fecha_inicio         - Fecha ISO de inicio del fixture (ej: '2025-03-01').
   * @param {number}  config.dias_entre_jornadas  - Días de separación entre jornadas consecutivas.
   * @param {string}  config.hora_inicio          - Hora predeterminada de inicio en formato 'HH:MM'.
   * @returns {Promise<object[]>} Array de objetos partido listos para persistir (sin id_partido aún).
   * @throws {Error} Si el tipo de fixture no es reconocido.
   */
  async generarFixture(config) {
    const {
      id_campeonato,
      id_cc,           // ID de campeonato-categoria
      tipo_fixture,    // 'todos_contra_todos', 'todos_vs_todos', 'grupos', 'eliminatoria'
      ida_vuelta,      // true/false
      id_fase,         // Opcional: fase del campeonato
      grupos,          // Opcional: array de IDs de grupos
      fecha_inicio,    // Fecha de inicio del fixture
      dias_entre_jornadas, // Días entre cada jornada
      hora_inicio,     // Hora predeterminada para partidos
    } = config;

    let partidos = [];

    // Normalizar alias: 'todos_vs_todos' es equivalente a 'todos_contra_todos'
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

  /* ═══════════════════════════════════════════════════════════════════
     Generador: Todos contra todos (Round-Robin)
  ═══════════════════════════════════════════════════════════════════ */

  /**
   * Genera un fixture de todos contra todos usando el algoritmo Round-Robin.
   *
   * Consulta las inscripciones activas de la categoría para obtener los
   * IDs de los equipos participantes. Luego aplica Round-Robin circular para
   * garantizar que cada equipo juegue exactamente una vez contra cada rival.
   *
   * Si `ida_vuelta = true`, se genera una segunda vuelta espejada donde los
   * roles de local y visitante se invierten. La segunda vuelta inicia en la
   * jornada siguiente a la última de la ida.
   *
   * Los partidos se agrupan en jornadas mediante el campo temporal
   * `numero_jornada`. Cada jornada avanza `dias_entre_jornadas` días.
   *
   * @async
   * @param {object}  config                    - Misma estructura que {@link generarFixture}.
   * @param {number}  config.id_campeonato       - FK del campeonato.
   * @param {number}  config.id_cc               - FK de la categoría.
   * @param {boolean} config.ida_vuelta           - Si se generan partidos de vuelta.
   * @param {string}  config.fecha_inicio         - Fecha ISO de la primera jornada.
   * @param {number}  config.dias_entre_jornadas  - Días entre jornadas.
   * @param {string}  config.hora_inicio          - Hora de inicio 'HH:MM'.
   * @returns {Promise<object[]>} Array de partidos generados (ida + vuelta si aplica).
   * @throws {Error} Si hay menos de 2 equipos inscritos en la categoría.
   */
  async generarTodosContraTodos(config) {
    const { id_campeonato, id_cc, ida_vuelta, fecha_inicio, dias_entre_jornadas, hora_inicio } = config;

    // Consultar equipos inscritos y activos en la categoría del campeonato
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

    // Aplicar algoritmo Round-Robin para obtener los enfrentamientos por ronda
    const rondas = this.generarRoundRobin(equipos);

    let jornadaNumero = 1;
    let fechaActual = new Date(fecha_inicio);

    // ── Partidos de ida ──
    rondas.forEach((ronda) => {
      ronda.forEach((partido) => {
        partidos.push({
          id_campeonato,
          id_cc,
          equipo_local:    partido[0],
          equipo_visitante: partido[1],
          id_jornada:      null,           // Se asignará tras crear la Jornada en BD
          numero_jornada:  jornadaNumero,  // Campo temporal; no se persiste en Partidos
          fecha_hora: new Date(
            fechaActual.getFullYear(),
            fechaActual.getMonth(),
            fechaActual.getDate(),
            parseInt(hora_inicio.split(':')[0]),
            parseInt(hora_inicio.split(':')[1])
          ),
          p_estado:   'programado',
          id_cancha:  null, // Asignación manual posterior
          estado:     true
        });
      });

      jornadaNumero++;
      fechaActual.setDate(fechaActual.getDate() + dias_entre_jornadas);
    });

    // ── Partidos de vuelta (roles local/visitante invertidos) ──
    if (ida_vuelta) {
      rondas.forEach((ronda) => {
        ronda.forEach((partido) => {
          partidos.push({
            id_campeonato,
            id_cc,
            equipo_local:    partido[1], // Invertir local y visitante
            equipo_visitante: partido[0],
            id_jornada:      null,
            numero_jornada:  jornadaNumero,
            fecha_hora: new Date(
              fechaActual.getFullYear(),
              fechaActual.getMonth(),
              fechaActual.getDate(),
              parseInt(hora_inicio.split(':')[0]),
              parseInt(hora_inicio.split(':')[1])
            ),
            p_estado:   'programado',
            id_cancha:  null,
            estado:     true
          });
        });

        jornadaNumero++;
        fechaActual.setDate(fechaActual.getDate() + dias_entre_jornadas);
      });
    }

    return partidos;
  }

  /* ═══════════════════════════════════════════════════════════════════
     Generador: Fase de grupos
  ═══════════════════════════════════════════════════════════════════ */

  /**
   * Genera fixture para la fase de grupos de un campeonato.
   *
   * Itera sobre los grupos configurados y aplica Round-Robin independiente
   * dentro de cada uno. Los partidos de cada grupo incluyen el campo `id_grupo`
   * para identificar su pertenencia. Los grupos con menos de 2 equipos se omiten.
   *
   * Los partidos de todos los grupos comparten un contador de jornada global
   * (`jornadaGlobal`) para alinear las fechas entre grupos cuando se programan
   * simultáneamente en la misma jornada.
   *
   * @async
   * @param {object}  config               - Misma estructura que {@link generarFixture}.
   * @param {number}  config.id_campeonato  - FK del campeonato.
   * @param {number}  config.id_cc          - FK de la categoría.
   * @param {number[]}config.grupos         - Array de IDs de grupos (Grupos).
   * @param {boolean} config.ida_vuelta     - Si se generan partidos de vuelta dentro de cada grupo.
   * @param {string}  config.fecha_inicio   - Fecha ISO de la primera jornada.
   * @param {number}  config.dias_entre_jornadas - Días entre jornadas.
   * @param {string}  config.hora_inicio    - Hora de inicio 'HH:MM'.
   * @returns {Promise<object[]>} Array de todos los partidos de todos los grupos.
   */
  async generarPorGrupos(config) {
    const { id_campeonato, id_cc, grupos, ida_vuelta, fecha_inicio, dias_entre_jornadas, hora_inicio } = config;

    const todosPartidos = [];
    let fechaActual = new Date(fecha_inicio);
    let jornadaGlobal = 1;

    // Procesar cada grupo de forma independiente
    for (const id_grupo of grupos) {
      // Obtener los equipos asignados a este grupo mediante GrupoInscripcion
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

      // Grupos con un solo equipo no pueden generar partidos; se omiten
      if (grupoInscripciones.length < 2) {
        continue;
      }

      const equiposGrupo = grupoInscripciones.map(gi => gi.participacion.equipo.id_equipo);
      const rondasGrupo = this.generarRoundRobin(equiposGrupo);

      // ── Partidos de ida del grupo ──
      rondasGrupo.forEach((ronda) => {
        ronda.forEach((partido) => {
          todosPartidos.push({
            id_campeonato,
            id_cc,
            id_grupo, // Identifica a qué grupo pertenece el partido
            equipo_local:    partido[0],
            equipo_visitante: partido[1],
            numero_jornada:  jornadaGlobal,
            fecha_hora: new Date(
              fechaActual.getFullYear(),
              fechaActual.getMonth(),
              fechaActual.getDate(),
              parseInt(hora_inicio.split(':')[0]),
              parseInt(hora_inicio.split(':')[1])
            ),
            p_estado:   'programado',
            es_ida:     true,
            es_vuelta:  false,
            id_cancha:  null,
            estado:     true
          });
        });
      });

      // ── Partidos de vuelta del grupo (roles invertidos) ──
      if (ida_vuelta) {
        rondasGrupo.forEach((ronda) => {
          ronda.forEach((partido) => {
            todosPartidos.push({
              id_campeonato,
              id_cc,
              id_grupo,
              equipo_local:    partido[1], // Invertir
              equipo_visitante: partido[0],
              numero_jornada:  jornadaGlobal,
              fecha_hora: new Date(
                fechaActual.getFullYear(),
                fechaActual.getMonth(),
                fechaActual.getDate(),
                parseInt(hora_inicio.split(':')[0]),
                parseInt(hora_inicio.split(':')[1])
              ),
              p_estado:   'programado',
              es_ida:     false,
              es_vuelta:  true,
              id_cancha:  null,
              estado:     true
            });
          });
        });
      }
    }

    return todosPartidos;
  }

  /* ═══════════════════════════════════════════════════════════════════
     Generador: Eliminatoria (bracket)
  ═══════════════════════════════════════════════════════════════════ */

  /**
   * Genera el bracket de una fase eliminatoria (playoffs).
   *
   * Empareja a los equipos clasificados siguiendo la convención de seeding
   * estándar: el primero contra el último, el segundo contra el penúltimo, etc.
   * Esto premia a los mejor clasificados con rivales más débiles en la primera ronda.
   *
   * Restricción: el número de equipos debe ser una potencia de 2 (2, 4, 8, 16…).
   * Si no se cumple, el servicio invocante debe aplicar "byes" previamente.
   *
   * Los partidos se programan con `dias_entre_partidos` días de diferencia
   * entre sí (no entre rondas), comenzando desde `fecha_inicio`.
   *
   * @async
   * @param {object}  config                       - Configuración de la eliminatoria.
   * @param {number}  config.id_campeonato          - FK del campeonato.
   * @param {number}  config.id_cc                  - FK de la categoría.
   * @param {number}  config.id_fase                - FK de la fase eliminatoria (Fases).
   * @param {number[]}config.equipos_clasificados   - IDs de equipos en orden de clasificación (mejor→peor).
   * @param {string}  config.fecha_inicio            - Fecha ISO del primer partido.
   * @param {number}  config.dias_entre_partidos     - Días entre cada partido del bracket.
   * @param {string}  config.hora_inicio             - Hora de inicio 'HH:MM'.
   * @returns {Promise<object[]>} Array de partidos del bracket de primera ronda.
   * @throws {Error} Si no hay equipos clasificados o su cantidad no es potencia de 2.
   */
  async generarEliminatoria(config) {
    const { id_campeonato, id_cc, id_fase, equipos_clasificados, fecha_inicio, dias_entre_partidos, hora_inicio } = config;

    if (!equipos_clasificados || equipos_clasificados.length === 0) {
      throw new Error('No hay equipos clasificados para la eliminatoria');
    }

    // Restricción matemática del bracket eliminatorio puro
    const numEquipos = equipos_clasificados.length;
    if (!this.esPotenciaDeDos(numEquipos)) {
      throw new Error('El número de equipos debe ser potencia de 2 (2, 4, 8, 16, etc.)');
    }

    const partidos = [];
    let fechaActual = new Date(fecha_inicio);

    // Emparejar: 1° vs último, 2° vs penúltimo… (seeding estándar de bracket)
    for (let i = 0; i < numEquipos / 2; i++) {
      partidos.push({
        id_campeonato,
        id_cc,
        id_fase,
        equipo_local:    equipos_clasificados[i],
        equipo_visitante: equipos_clasificados[numEquipos - 1 - i],
        numero_ronda:   1,
        numero_partido: i + 1,
        fecha_hora: new Date(
          fechaActual.getFullYear(),
          fechaActual.getMonth(),
          fechaActual.getDate() + (i * dias_entre_partidos), // Escalonar fechas
          parseInt(hora_inicio.split(':')[0]),
          parseInt(hora_inicio.split(':')[1])
        ),
        p_estado:       'programado',
        es_eliminatoria: true,
        id_cancha:      null,
        estado:         true
      });
    }

    return partidos;
  }

  /* ═══════════════════════════════════════════════════════════════════
     Algoritmos auxiliares
  ═══════════════════════════════════════════════════════════════════ */

  /**
   * Genera todos los enfrentamientos de un torneo Round-Robin.
   *
   * Utiliza el algoritmo de rotación circular (Berger tables), donde el primer
   * elemento permanece fijo y los demás rotan en sentido horario en cada ronda.
   *
   * Si el número de equipos es impar, se agrega un "bye" (null) para balancear
   * el bracket; los partidos contra el bye se descartan automáticamente.
   *
   * Propiedades del resultado:
   *   - Cada par de equipos aparece exactamente una vez.
   *   - La distribución local/visitante es uniforme a lo largo del torneo.
   *   - Total de rondas: N-1 (N = número de equipos, par o impar).
   *
   * @param {number[]} equipos - Array de IDs de equipos a enfrentar.
   * @returns {Array<Array<[number, number]>>} Array de rondas; cada ronda es un array
   *   de pares [id_local, id_visitante].
   * @example
   * generarRoundRobin([1, 2, 3, 4]);
   * // Ronda 1: [[1,4],[2,3]]
   * // Ronda 2: [[1,3],[4,2]]
   * // Ronda 3: [[1,2],[3,4]]
   */
  generarRoundRobin(equipos) {
    const n = equipos.length;
    const rondas = [];

    // Agregar "bye" (null) si el número de equipos es impar para balancear el bracket
    const equiposAux = n % 2 === 0 ? [...equipos] : [...equipos, null];
    const totalEquipos = equiposAux.length;

    // Generar N-1 rondas (número mínimo para que todos se enfrenten una vez)
    for (let ronda = 0; ronda < totalEquipos - 1; ronda++) {
      const partidosRonda = [];

      for (let i = 0; i < totalEquipos / 2; i++) {
        const local     = equiposAux[i];
        const visitante = equiposAux[totalEquipos - 1 - i];

        // Descartar partidos contra el bye (equipo fantasma de relleno)
        if (local !== null && visitante !== null) {
          partidosRonda.push([local, visitante]);
        }
      }

      rondas.push(partidosRonda);

      // Rotación circular: el primer elemento permanece fijo; los demás rotan
      const fijo    = equiposAux[0];
      const rotados = equiposAux.slice(1);
      rotados.push(rotados.shift()); // Desplazar el primer elemento al final
      equiposAux.splice(0, equiposAux.length, fijo, ...rotados);
    }

    return rondas;
  }

  /**
   * Verifica si un número entero positivo es potencia de 2.
   *
   * Utiliza la propiedad binaria: una potencia de 2 tiene exactamente un bit en 1.
   * Por lo tanto `n & (n-1) === 0` es true solo si n es potencia de 2.
   *
   * Ejemplos válidos: 2, 4, 8, 16, 32, 64…
   *
   * @param {number} n - Número a evaluar (debe ser entero positivo).
   * @returns {boolean} true si n es potencia de 2; false en cualquier otro caso.
   */
  esPotenciaDeDos(n) {
    return n > 0 && (n & (n - 1)) === 0;
  }

  /* ═══════════════════════════════════════════════════════════════════
     Utilidades de resumen
  ═══════════════════════════════════════════════════════════════════ */

  /**
   * Calcula estadísticas resumidas del fixture generado.
   *
   * Útil para mostrar al usuario un resumen antes de confirmar la
   * persistencia del fixture en la base de datos.
   *
   * @param {object[]} partidos - Array de partidos generados por cualquiera de los métodos de esta clase.
   * @returns {{
   *   total_partidos:         number,
   *   total_jornadas:         number,
   *   equipos_participantes:  number,
   *   fecha_inicio:           Date|null,
   *   fecha_fin:              Date|null
   * }} Objeto con métricas del fixture.
   */
  calcularEstadisticas(partidos) {
    return {
      total_partidos:        partidos.length,
      total_jornadas:        Math.max(...partidos.map(p => p.numero_jornada || 0)),
      equipos_participantes: new Set([
        ...partidos.map(p => p.equipo_local),
        ...partidos.map(p => p.equipo_visitante)
      ]).size,
      fecha_inicio: partidos.length > 0 ? partidos[0].fecha_hora : null,
      fecha_fin:    partidos.length > 0 ? partidos[partidos.length - 1].fecha_hora : null
    };
  }
}

/*
 * Se exporta como singleton para que toda la aplicación comparta la misma
 * instancia del servicio, evitando la creación redundante del objeto.
 */
module.exports = new FixtureGeneradorService();
