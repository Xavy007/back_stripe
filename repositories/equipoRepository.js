const { Equipo, Club, Categoria, Jugador, Persona, Carnet } = require('../models');

// CREATE
const crearEquipo = async (data) => {
    return await Equipo.create(data);
};

// READ - Obtener todos los equipos activos
const obtenerEquipos = async () => {
    return await Equipo.findAll({
        where: { estado: true },
        include: [
            { model: Club, as: 'club' },
            { model: Categoria, as: 'categoria' }
        ]
    });
};

// READ - Obtener TODOS los equipos (incluyendo inactivos)
const obtenerTodosLosEquipos = async () => {
    return await Equipo.findAll({
        include: [
            { model: Club, as: 'club' },
            { model: Categoria, as: 'categoria' }
        ]
    });
};

// READ - Obtener un equipo por ID
const obtenerEquipoPorId = async (id_equipo) => {
    return await Equipo.findByPk(id_equipo, {
        include: [
            { model: Club, as: 'club' },
            { model: Categoria, as: 'categoria' }
        ]
    });
};

// READ - Obtener equipos por club
const obtenerEquiposPorClub = async (id_club) => {
    return await Equipo.findAll({
        where: { 
            id_club: id_club,
            estado: true 
        }
    });
};

// READ - Obtener equipos por categoría
const obtenerEquiposPorCategoria = async (id_categoria) => {
    return await Equipo.findAll({
        where: { 
            id_categoria: id_categoria,
            estado: true 
        }
    });
};

// READ - Obtener equipos por club y categoría
const obtenerEquiposPorClubYCategoria = async (id_club, id_categoria) => {
    return await Equipo.findAll({
        where: { 
            id_club: id_club,
            id_categoria: id_categoria,
            estado: true 
        }
    });
};

// READ - Obtener equipo con relaciones
const obtenerEquipoConRelaciones = async (id_equipo) => {
    return await Equipo.findByPk(id_equipo, {
            include: [
                        { model: Participacion },
                        { model: TablaPosicion },
                        { model: HistorialCampeonato }
                    ]
    });
};

// UPDATE
const actualizarEquipo = async (id_equipo, data) => {
    const equipo = await Equipo.findByPk(id_equipo);
    if (!equipo) {
        return null;
    }
    return await equipo.update(data);
};

// DELETE (soft delete - cambiar estado a false)
const eliminarEquipo = async (id_equipo) => {
    const equipo = await Equipo.findByPk(id_equipo);
    if (!equipo) {
        return null;
    }
    
    return await equipo.update({ estado: false });
};

// Obtener jugadores de un equipo específico (filtrados por gestión del campeonato)
const obtenerJugadoresDeEquipo = async (id_equipo, id_gestion = null) => {
    console.log(`🔍 obtenerJugadoresDeEquipo - equipo: ${id_equipo}, gestion: ${id_gestion}`);

    // Primero obtenemos el equipo para saber el club y categoría
    const equipo = await Equipo.findByPk(id_equipo, {
        include: [
            { model: Club, as: 'club' },
            { model: Categoria, as: 'categoria' }
        ]
    });

    if (!equipo) {
        console.log(`❌ Equipo ${id_equipo} no encontrado`);
        throw new Error('Equipo no encontrado');
    }

    console.log(`✅ Equipo encontrado: ${equipo.nombre}, club: ${equipo.id_club}, categoria: ${equipo.id_categoria}`);

    // Obtener género de la categoría
    const generoCategoria = equipo.categoria?.genero;
    console.log(`👤 Género de categoría: ${generoCategoria || 'sin filtro'}`);

    // Construir condiciones para el carnet - solo categoria y estado activo
    const carnetWhere = {
        id_categoria: equipo.id_categoria,
        estado_carnet: 'activo'
    };

    // Si se proporciona id_gestion, filtrar por gestión (opcional)
    if (id_gestion) {
        carnetWhere.id_gestion = id_gestion;
        console.log(`📋 Filtrando carnets por gestión: ${id_gestion}`);
    } else {
        console.log(`📋 Sin filtro de gestión - buscando cualquier carnet activo en categoria ${equipo.id_categoria}`);
    }

    // Obtener jugadores del club que coincidan con el género de la categoría
    const jugadores = await Jugador.findAll({
        where: {
            id_club: equipo.id_club,
            estado: true
        },
        include: [
            {
                model: Persona,
                attributes: ['id_persona', 'nombre', 'ap', 'am', 'fnac', 'ci', 'foto', 'genero'],
                where: generoCategoria ? { genero: generoCategoria } : undefined, // Filtrar por género
                required: true
            },
            {
                model: Carnet,
                as: 'carnets',
                where: carnetWhere,
                required: true // INNER JOIN - SOLO jugadores con carnet activo en esta categoría
            }
        ]
    });

    console.log(`✅ Encontrados ${jugadores.length} jugadores con carnet activo`);

    // Formatear la respuesta para el frontend
    return jugadores.map(jugador => ({
        id: jugador.id_jugador,
        id_persona: jugador.Persona?.id_persona,
        name: jugador.Persona?.nombre,
        ap: jugador.Persona?.ap,
        am: jugador.Persona?.am,
        genero: jugador.Persona?.genero,
        edad: jugador.Persona?.fnac ?
            Math.floor((new Date() - new Date(jugador.Persona.fnac)) / (365.25 * 24 * 60 * 60 * 1000)) : null,
        // Priorizar foto_carnet del carnet, si no existe usar foto de Persona como fallback
        foto: (jugador.carnets && jugador.carnets.length > 0 && jugador.carnets[0].foto_carnet)
            ? jugador.carnets[0].foto_carnet
            : (jugador.Persona?.foto || null),
        estatura: jugador.estatura,
        // Número de dorsal del carnet si existe
        number: jugador.carnets && jugador.carnets.length > 0 ?
            jugador.carnets[0].numero_dorsal?.toString() : null,
        // Posición si está en el carnet
        position: jugador.carnets && jugador.carnets.length > 0 ?
            jugador.carnets[0].posicion : null,
        // Estado del carnet
        carnet_activo: jugador.carnets && jugador.carnets.length > 0,
        // Stats iniciales para el partido
        stats: { points: 0, blocks: 0, aces: 0 }
    }));
};

// Obtener plantilla habilitada (participaciones) de un equipo
const obtenerPlantillaHabilitada = async (id_equipo, id_campeonato = null) => {
    const { Participacion, Jugador, Persona, Carnet, Categoria, Campeonato, GestionCampeonato } = require('../models');

    // Construir filtros
    const whereClause = { id_equipo };

    if (id_campeonato) {
        whereClause.id_campeonato = id_campeonato;
    }

    // Obtener participaciones con relaciones
    const participaciones = await Participacion.findAll({
        where: whereClause,
        include: [
            {
                model: Jugador,
                as: 'jugador',
                attributes: ['id_jugador'],
                include: [
                    {
                        model: Persona,
                        attributes: ['id_persona', 'nombre', 'ap', 'am', 'fnac', 'genero', 'foto']
                    },
                    {
                        model: Carnet,
                        as: 'carnets',
                        attributes: ['foto_carnet'],
                        where: { estado_carnet: 'activo' },
                        required: false
                    }
                ]
            },
            {
                model: Categoria,
                as: 'categoria',
                attributes: ['id_categoria', 'nombre']
            },
            {
                model: Campeonato,
                as: 'campeonato',
                attributes: ['id_campeonato', 'nombre', 'id_gestion'],
                include: [{
                    model: GestionCampeonato,
                    as: 'gestion',
                    attributes: ['id_gestion', 'gestion', 'nombre']
                }]
            }
        ],
        order: [['dorsal', 'ASC']]
    });

    // Formatear respuesta
    return participaciones.map(p => ({
        id_participacion: p.id_participacion,
        dorsal: p.dorsal,
        posicion: p.posicion,
        estado: p.estado,
        fecha_inscripcion: p.fecha_inscripcion,
        // Datos del jugador
        jugador: {
            id_jugador: p.jugador?.id_jugador,
            nombre_completo: p.jugador?.Persona ?
                `${p.jugador.Persona.nombre} ${p.jugador.Persona.ap} ${p.jugador.Persona.am || ''}`.trim() :
                'Sin nombre',
            nombre: p.jugador?.Persona?.nombre,
            ap: p.jugador?.Persona?.ap,
            am: p.jugador?.Persona?.am,
            foto: (p.jugador?.carnets && p.jugador.carnets.length > 0 && p.jugador.carnets[0].foto_carnet)
                ? p.jugador.carnets[0].foto_carnet
                : (p.jugador?.Persona?.foto || null),
            genero: p.jugador?.Persona?.genero,
            edad: p.jugador?.Persona?.fnac ?
                Math.floor((new Date() - new Date(p.jugador.Persona.fnac)) / (365.25 * 24 * 60 * 60 * 1000)) :
                null
        },
        // Datos de la categoría
        categoria: {
            id_categoria: p.categoria?.id_categoria,
            nombre: p.categoria?.nombre
        },
        // Datos del campeonato
        campeonato: {
            id_campeonato: p.campeonato?.id_campeonato,
            nombre: p.campeonato?.nombre,
            gestion: p.campeonato?.gestion?.gestion || 'Sin gestión'
        },
        // Estadísticas
        estadisticas: {
            partidos_jugados: p.cantidad_partidos,
            goles: p.cantidad_goles,
            tarjetas_amarillas: p.cantidad_tarjetas_amarillas,
            tarjetas_rojas: p.cantidad_tarjetas_rojas,
            promedio_goles: p.cantidad_partidos > 0 ?
                (p.cantidad_goles / p.cantidad_partidos).toFixed(2) :
                '0.00'
        }
    }));
};

module.exports = {
    crearEquipo,
    obtenerEquipos,
    obtenerTodosLosEquipos,
    obtenerEquipoPorId,
    obtenerEquiposPorClub,
    obtenerEquiposPorCategoria,
    obtenerEquiposPorClubYCategoria,
    obtenerEquipoConRelaciones,
    actualizarEquipo,
    eliminarEquipo,
    obtenerJugadoresDeEquipo,
    obtenerPlantillaHabilitada
};