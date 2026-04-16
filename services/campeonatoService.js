/**
 * @file services/campeonatoService.js
 * @description Capa de lógica de negocio para la entidad Campeonato.
 *
 * Actúa como intermediario entre los controladores HTTP y el repositorio de
 * datos, centralizando todas las validaciones de dominio, reglas de negocio
 * y transformaciones previas al acceso a la base de datos.
 *
 * Responsabilidades:
 *   - Validar campos obligatorios y formatos antes de persistir.
 *   - Hacer cumplir las reglas de dominio (fechas coherentes, enumerados válidos).
 *   - Proteger campos inmutables (id_gestion, freg) ante actualizaciones.
 *   - Implementar soft delete: el eliminado lógico fija estado=false sin borrar la fila.
 *   - Delegar las operaciones de BD al CampeonatoRepository (patrón Repository).
 *
 * Enumerados del dominio:
 *   CAMPEONATO_TIPOS : campeonato | liga | copa | relampago | amistoso | torneo
 *   C_ESTADOS        : programado | en_curso | finalizado | suspendido | cancelado
 *
 * Diferencia entre estado y c_estado:
 *   - estado    (BOOLEAN) : soft delete — true = registro activo, false = eliminado.
 *   - c_estado  (ENUM)    : ciclo de vida operativo del campeonato.
 *
 * Notas de diseño:
 *   - La validación de fecha en el pasado está comentada intencionalmente para
 *     permitir el registro de campeonatos históricos durante la migración de datos.
 *   - Todas las funciones son async y lanzan Error con mensajes legibles para
 *     el controlador, que los convierte en respuestas HTTP apropiadas.
 *
 * @module services/campeonatoService
 */

const CampeonatoRepository = require('../repositories/campeonatoRepository');

/* ─────────────────────────────────────────────────
 * Constantes de dominio
 * ───────────────────────────────────────────────── */

/**
 * Tipos de competencia disponibles en el sistema.
 * El controlador recibe el tipo como cadena de texto y este servicio
 * valida que pertenezca a este conjunto antes de persistir.
 * @constant {string[]}
 */
const CAMPEONATO_TIPOS = ['campeonato', 'liga', 'copa', 'relampago', 'amistoso', 'torneo'];

/**
 * Estados operativos del ciclo de vida de un campeonato.
 * Reflejan el campo ENUM `c_estado` de la tabla Campeonatos.
 * La transición típica es: programado → en_curso → finalizado.
 * @constant {string[]}
 * 
 * 
 */
const C_ESTADOS = ['programado', 'en_curso', 'finalizado', 'suspendido', 'cancelado'];

/* ═══════════════════════════════════════════════════════════════════
   CREATE
═══════════════════════════════════════════════════════════════════ */

/**
 * Crea un nuevo campeonato en la base de datos.
 *
 * Validaciones aplicadas:
 *   1. `nombre`     : obligatorio y no vacío.
 *   2. `id_gestion` : obligatorio, debe ser entero (FK → Gestiones).
 *   3. `tipo`       : obligatorio y debe pertenecer a CAMPEONATO_TIPOS.
 *   4. `fecha_inicio` < `fecha_fin` cuando ambas se proporcionan.
 *
 * Nota: La validación de fecha futura está deshabilitada para permitir
 * el ingreso de campeonatos históricos (ver comentario en el código).
 *
 * El campo `c_estado` se inicializa en 'programado' si no se especifica.
 * El campo `estado` siempre se fija en `true` (registro activo).
 *
 * @async
 * @param {object}  data                - Datos del nuevo campeonato.
 * @param {string}  data.nombre         - Nombre del campeonato (obligatorio).
 * @param {number}  data.id_gestion     - FK de la gestión a la que pertenece (obligatorio).
 * @param {string}  data.tipo           - Tipo de competencia (obligatorio, ver CAMPEONATO_TIPOS).
 * @param {string}  [data.fecha_inicio] - Fecha de inicio ISO 8601 (opcional).
 * @param {string}  [data.fecha_fin]    - Fecha de fin ISO 8601 (opcional; debe ser > fecha_inicio).
 * @param {string}  [data.c_estado]     - Estado operativo inicial (por defecto: 'programado').
 * @returns {Promise<object>} El campeonato creado con todos sus campos, incluido `id_campeonato`.
 * @throws {Error} Si alguna validación falla o el repositorio devuelve un error de BD.
 */
const crearCampeonato = async (data) => {
    // Validaciones de campos obligatorios
    if (!data.nombre || data.nombre.trim() === '') {
        throw new Error('El nombre del campeonato es obligatorio');
    }

    if (!data.id_gestion || !Number.isInteger(data.id_gestion)) {
        throw new Error('El ID de gestión es obligatorio y debe ser un número');
    }

    if (!data.tipo) {
        throw new Error('El tipo de campeonato es obligatorio');
    }

    if (!CAMPEONATO_TIPOS.includes(data.tipo)) {
        throw new Error(`El tipo debe ser uno de: ${CAMPEONATO_TIPOS.join(', ')}`);
    }

    // Validar coherencia temporal: inicio debe preceder al fin
    if (data.fecha_inicio && data.fecha_fin) {
        const fechaInicio = new Date(data.fecha_inicio);
        const fechaFin = new Date(data.fecha_fin);

        if (fechaInicio >= fechaFin) {
            throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
        }
    }

    /*
     * Validación de fecha en el pasado — DESHABILITADA INTENCIONALMENTE.
     * Se mantiene comentada para facilitar el registro de campeonatos históricos
     * durante procesos de migración o carga inicial de datos.
     *
     * if (data.fecha_inicio) {
     *     const fechaInicio = new Date(data.fecha_inicio);
     *     if (fechaInicio < new Date()) {
     *         throw new Error('La fecha de inicio no puede ser en el pasado');
     *     }
     * }
     */

    try {
        const nuevoCampeonato = await CampeonatoRepository.crearCampeonato({
            ...data,
            c_estado: data.c_estado || 'programado', // Estado operativo inicial por defecto
            estado: true // Los nuevos campeonatos siempre se crean como activos
        });
        return nuevoCampeonato;
    } catch (error) {
        throw new Error(`Error al crear el campeonato: ${error.message}`);
    }
};

/* ═══════════════════════════════════════════════════════════════════
   READ
═══════════════════════════════════════════════════════════════════ */

/**
 * Obtiene todos los campeonatos activos (estado = true).
 *
 * Filtra automáticamente los campeonatos eliminados lógicamente.
 * Útil para los listados operativos del frontend donde solo se
 * trabaja con competencias vigentes.
 *
 * @async
 * @returns {Promise<object[]>} Array de campeonatos activos; [] si no hay ninguno.
 * @throws {Error} Si ocurre un error en la consulta a la base de datos.
 */
const obtenerCampeonatos = async () => {
    try {
        const campeonatos = await CampeonatoRepository.obtenerCampeonatos();

        if (!campeonatos) {
            return [];
        }

        return campeonatos;
    } catch (error) {
        throw new Error(`Error al obtener campeonatos: ${error.message}`);
    }
};

/**
 * Obtiene TODOS los campeonatos, incluidos los eliminados lógicamente (estado = false).
 *
 * Diseñado para vistas administrativas de auditoría o recuperación de registros.
 * Evitar su uso en interfaces de usuario normales para no mostrar campeonatos cancelados.
 *
 * @async
 * @returns {Promise<object[]>} Array completo de campeonatos (activos e inactivos); [] si no hay ninguno.
 * @throws {Error} Si ocurre un error en la consulta a la base de datos.
 */
const obtenerTodosLosCampeonatos = async () => {
    try {
        const campeonatos = await CampeonatoRepository.obtenerTodosLosCampeonatos();

        if (!campeonatos) {
            return [];
        }

        return campeonatos;
    } catch (error) {
        throw new Error(`Error al obtener todos los campeonatos: ${error.message}`);
    }
};

/**
 * Obtiene un campeonato activo por su clave primaria.
 *
 * Valida que el ID sea un entero antes de consultar el repositorio.
 * Lanza un error descriptivo si el campeonato no existe, para que el
 * controlador pueda responder con 404.
 *
 * @async
 * @param {number|string} id_campeonato - ID del campeonato a consultar.
 * @returns {Promise<object>} El campeonato encontrado con sus datos básicos.
 * @throws {Error} Si el ID no es válido, el campeonato no existe, o hay error de BD.
 */
const obtenerCampeonatoPorId = async (id_campeonato) => {
    // Validar que el ID sea parseable como entero
    if (!id_campeonato || !Number.isInteger(parseInt(id_campeonato))) {
        throw new Error('El ID del campeonato debe ser un número válido');
    }

    try {
        const campeonato = await CampeonatoRepository.obtenerCampeonatoPorId(id_campeonato);

        if (!campeonato) {
            throw new Error('El campeonato no existe');
        }

        return campeonato;
    } catch (error) {
        throw new Error(`Error al obtener el campeonato: ${error.message}`);
    }
};

/**
 * Alias de `obtenerCampeonatoPorId` para búsquedas iniciadas desde el cuerpo
 * de la petición HTTP (req.body.id_campeonato) en lugar de los parámetros de ruta.
 *
 * Comparte la misma lógica de validación y delegación al repositorio.
 *
 * @async
 * @param {number|string} id_campeonato - ID del campeonato a consultar.
 * @returns {Promise<object>} El campeonato encontrado.
 * @throws {Error} Si el ID no es válido o el campeonato no existe.
 */
const getbyId = async (id_campeonato) => {
    if (!id_campeonato || !Number.isInteger(parseInt(id_campeonato))) {
        throw new Error('El ID del campeonato debe ser un número válido');
    }

    try {
        const campeonato = await CampeonatoRepository.obtenerCampeonatoPorId(id_campeonato);

        if (!campeonato) {
            throw new Error('El campeonato no existe');
        }

        return campeonato;
    } catch (error) {
        throw new Error(`Error al obtener el campeonato: ${error.message}`);
    }
};

/**
 * Obtiene un campeonato con todas sus relaciones cargadas (eager loading).
 *
 * Incluye asociaciones como CampeonatoCategorias, Gestion u otras definidas
 * en el repositorio. Útil para vistas de detalle que requieren datos anidados
 * (p. ej., listar las categorías habilitadas en un campeonato específico).
 *
 * @async
 * @param {number|string} id_campeonato - ID del campeonato a consultar.
 * @returns {Promise<object>} El campeonato con sus relaciones incluidas.
 * @throws {Error} Si el ID no es válido, el campeonato no existe, o hay error de BD.
 */
const obtenerCampeonatoConRelaciones = async (id_campeonato) => {
    if (!id_campeonato || !Number.isInteger(parseInt(id_campeonato))) {
        throw new Error('El ID del campeonato debe ser un número válido');
    }

    try {
        const campeonato = await CampeonatoRepository.obtenerCampeonatoConRelaciones(id_campeonato);

        if (!campeonato) {
            throw new Error('El campeonato no existe');
        }

        return campeonato;
    } catch (error) {
        throw new Error(`Error al obtener el campeonato con relaciones: ${error.message}`);
    }
};

/**
 * Obtiene todos los campeonatos activos filtrados por tipo de competencia.
 *
 * Normaliza el tipo a minúsculas antes de validar y consultar, para tolerar
 * variaciones de capitalización provenientes del cliente.
 *
 * @async
 * @param {string} tipo - Tipo de competencia (ver CAMPEONATO_TIPOS).
 * @returns {Promise<object[]>} Array de campeonatos del tipo indicado; [] si no hay ninguno.
 * @throws {Error} Si el tipo no es válido o hay error de BD.
 */
const obtenerCampeonatosPorTipo = async (tipo) => {
    if (!tipo || !CAMPEONATO_TIPOS.includes(tipo.toLowerCase())) {
        throw new Error(`Debes proporcionar un tipo válido: ${CAMPEONATO_TIPOS.join(', ')}`);
    }

    try {
        const campeonatos = await CampeonatoRepository.obtenerCampeonatosPorTipo(tipo.toLowerCase());

        if (!campeonatos) {
            return [];
        }

        return campeonatos;
    } catch (error) {
        throw new Error(`Error al obtener campeonatos por tipo: ${error.message}`);
    }
};

/**
 * Obtiene todos los campeonatos activos filtrados por estado operativo (c_estado).
 *
 * Permite consultar, por ejemplo, todos los campeonatos "en_curso" para la
 * pantalla de marcador en tiempo real, o los "programados" para la agenda.
 *
 * @async
 * @param {string} c_estado - Estado operativo a filtrar (ver C_ESTADOS).
 * @returns {Promise<object[]>} Array de campeonatos en el estado indicado; [] si no hay ninguno.
 * @throws {Error} Si el estado no es válido o hay error de BD.
 */
const obtenerCampeonatosPorEstado = async (c_estado) => {
    if (!c_estado || !C_ESTADOS.includes(c_estado.toLowerCase())) {
        throw new Error(`Debes proporcionar un estado válido: ${C_ESTADOS.join(', ')}`);
    }

    try {
        const campeonatos = await CampeonatoRepository.obtenerCampeonatosPorEstado(c_estado.toLowerCase());

        if (!campeonatos) {
            return [];
        }

        return campeonatos;
    } catch (error) {
        throw new Error(`Error al obtener campeonatos por estado: ${error.message}`);
    }
};

/**
 * Obtiene todos los campeonatos activos pertenecientes a una gestión específica.
 *
 * La gestión es el período organizacional anual (p. ej., gestión 2024, 2025).
 * Útil para agrupar todos los campeonatos de una temporada en el panel de administración.
 *
 * @async
 * @param {number|string} id_gestion - ID de la gestión a filtrar (FK → Gestiones).
 * @returns {Promise<object[]>} Array de campeonatos de la gestión; [] si no hay ninguno.
 * @throws {Error} Si el ID de gestión no es válido o hay error de BD.
 */
const obtenerCampeonatosPorGestion = async (id_gestion) => {
    if (!id_gestion || !Number.isInteger(parseInt(id_gestion))) {
        throw new Error('El ID de gestión debe ser un número válido');
    }

    try {
        const campeonatos = await CampeonatoRepository.obtenerCampeonatosPorGestion(id_gestion);

        if (!campeonatos) {
            return [];
        }

        return campeonatos;
    } catch (error) {
        throw new Error(`Error al obtener campeonatos por gestión: ${error.message}`);
    }
};

/* ═══════════════════════════════════════════════════════════════════
   UPDATE
═══════════════════════════════════════════════════════════════════ */

/**
 * Actualiza los datos de un campeonato existente.
 *
 * Validaciones aplicadas:
 *   1. ID válido como entero.
 *   2. Al menos un campo a actualizar (data no vacío).
 *   3. `nombre` no puede quedar vacío si se incluye.
 *   4. `tipo` debe pertenecer a CAMPEONATO_TIPOS si se modifica.
 *   5. `c_estado` debe pertenecer a C_ESTADOS si se modifica.
 *   6. Coherencia temporal: si se modifica una fecha, se recupera la otra
 *      del registro actual para validar que inicio < fin.
 *
 * Campos protegidos (eliminados del payload antes de persistir):
 *   - `estado`     : gestionado exclusivamente por soft delete (eliminarCampeonato).
 *   - `freg`       : fecha de registro inmutable desde la creación.
 *   - `id_gestion` : la gestión no puede cambiar una vez asignada.
 *
 * @async
 * @param {number|string} id_campeonato - ID del campeonato a actualizar.
 * @param {object}        data          - Campos a modificar (parcial).
 * @param {string}        [data.nombre]      - Nuevo nombre (no vacío si se proporciona).
 * @param {string}        [data.tipo]        - Nuevo tipo (debe pertenecer a CAMPEONATO_TIPOS).
 * @param {string}        [data.c_estado]    - Nuevo estado operativo (debe pertenecer a C_ESTADOS).
 * @param {string}        [data.fecha_inicio]- Nueva fecha de inicio ISO 8601.
 * @param {string}        [data.fecha_fin]   - Nueva fecha de fin ISO 8601.
 * @returns {Promise<object>} El campeonato actualizado con todos sus campos.
 * @throws {Error} Si alguna validación falla, el campeonato no existe, o hay error de BD.
 */
const actualizarCampeonato = async (id_campeonato, data) => {
    // Validar ID
    if (!id_campeonato || !Number.isInteger(parseInt(id_campeonato))) {
        throw new Error('El ID del campeonato debe ser un número válido');
    }

    // Validar que tenga datos para actualizar
    if (!data || Object.keys(data).length === 0) {
        throw new Error('Debes proporcionar datos para actualizar');
    }

    // Validar campos actualizables individualmente
    if (data.nombre !== undefined) {
        if (data.nombre.trim() === '') {
            throw new Error('El nombre no puede estar vacío');
        }
    }

    if (data.tipo !== undefined) {
        if (!CAMPEONATO_TIPOS.includes(data.tipo)) {
            throw new Error(`El tipo debe ser uno de: ${CAMPEONATO_TIPOS.join(', ')}`);
        }
    }

    if (data.c_estado !== undefined) {
        if (!C_ESTADOS.includes(data.c_estado)) {
            throw new Error(`El estado debe ser uno de: ${C_ESTADOS.join(', ')}`);
        }
    }

    // Validar coherencia temporal cuando se modifica alguna fecha.
    // Se recupera el registro actual para completar la fecha que no se está modificando.
    if (data.fecha_inicio || data.fecha_fin) {
        const campeonatoActual = await CampeonatoRepository.obtenerCampeonatoPorId(id_campeonato);
        const fechaInicio = data.fecha_inicio ? new Date(data.fecha_inicio) : new Date(campeonatoActual.fecha_inicio);
        const fechaFin = data.fecha_fin ? new Date(data.fecha_fin) : new Date(campeonatoActual.fecha_fin);

        if (fechaInicio >= fechaFin) {
            throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
        }
    }

    // Proteger campos inmutables: se eliminan del payload antes de persistir.
    // - estado    : solo modificable vía eliminarCampeonato (soft delete).
    // - freg      : fecha de creación, nunca editable.
    // - id_gestion: la gestión es fija una vez creado el campeonato.
    delete data.estado;
    delete data.freg;
    delete data.id_gestion;

    try {
        const campeonato = await CampeonatoRepository.actualizarCampeonato(id_campeonato, data);

        if (!campeonato) {
            throw new Error('El campeonato no existe');
        }

        return campeonato;
    } catch (error) {
        throw new Error(`Error al actualizar el campeonato: ${error.message}`);
    }
};

/* ═══════════════════════════════════════════════════════════════════
   DELETE (soft delete)
═══════════════════════════════════════════════════════════════════ */

/**
 * Elimina lógicamente un campeonato (soft delete).
 *
 * No borra la fila de la base de datos. En su lugar, el repositorio
 * fija el campo `estado = false`, ocultando el campeonato de todas
 * las consultas estándar que filtran por estado=true.
 *
 * Verificaciones previas:
 *   1. El campeonato debe existir (no null).
 *   2. El campeonato debe estar activo (estado=true); si ya está
 *      eliminado, se lanza un error para evitar operaciones redundantes.
 *
 * @async
 * @param {number|string} id_campeonato - ID del campeonato a eliminar lógicamente.
 * @returns {Promise<object>} El campeonato con estado=false tras la operación.
 * @throws {Error} Si el ID no es válido, el campeonato no existe,
 *                 ya está eliminado, o hay error de BD.
 */
const eliminarCampeonato = async (id_campeonato) => {
    // Validar ID
    if (!id_campeonato || !Number.isInteger(parseInt(id_campeonato))) {
        throw new Error('El ID del campeonato debe ser un número válido');
    }

    try {
        // Verificar existencia y estado activo antes de proceder
        const campeonato = await CampeonatoRepository.obtenerCampeonatoPorId(id_campeonato);
        if (!campeonato) {
            throw new Error('El campeonato no existe');
        }

        if (!campeonato.estado) {
            throw new Error('El campeonato ya está eliminado');
        }

        // Delegar el soft delete al repositorio (estado → false)
        const campeonatoEliminado = await CampeonatoRepository.eliminarCampeonato(id_campeonato);

        return campeonatoEliminado;
    } catch (error) {
        throw new Error(`Error al eliminar el campeonato: ${error.message}`);
    }
};

/* ═══════════════════════════════════════════════════════════════════
   Exportaciones del módulo
═══════════════════════════════════════════════════════════════════ */

module.exports = {
    crearCampeonato,
    obtenerCampeonatos,
    obtenerTodosLosCampeonatos,
    obtenerCampeonatoPorId,
    getbyId,
    obtenerCampeonatoConRelaciones,
    obtenerCampeonatosPorTipo,
    obtenerCampeonatosPorEstado,
    obtenerCampeonatosPorGestion,
    actualizarCampeonato,
    eliminarCampeonato
};
