const { TablaPosiciones: TablaPosicion, Campeonato, Categoria, Equipo, Club, CampeonatoCategoria, Inscripcion } = require('../models');

// ============================================
// CREATE - Crear una nueva posición en tabla
// ============================================
const crearTablaPosicion = async (data) => {
    return await TablaPosicion.create(data);
};

// ============================================
// READ - Obtener todas las posiciones activas
// ============================================
const obtenerTablaPosiciones = async () => {
    return await TablaPosicion.findAll({
        where: { estado: true },
        include: [
            {
                model: Campeonato,
                as: 'campeonato'
            },
            {
                model: Categoria,
                as: 'categoria'
            },
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' }
                ]
            }
        ],
        order: [['posicion', 'ASC']]
    });
};

// ============================================
// READ - Obtener TODAS las posiciones (incluyendo inactivas)
// ============================================
const obtenerTodasLasTablaPosiciones = async () => {
    return await TablaPosicion.findAll({
        include: [
            {
                model: Campeonato,
                as: 'campeonato'
            },
            {
                model: Categoria,
                as: 'categoria'
            },
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' }
                ]
            }
        ],
        order: [['posicion', 'ASC']]
    });
};

// ============================================
// READ - Obtener una posición por ID
// ============================================
const obtenerTablaPosicionPorId = async (id_tabla) => {
    return await TablaPosicion.findByPk(id_tabla, {
        include: [
            {
                model: Campeonato,
                as: 'campeonato'
            },
            {
                model: Categoria,
                as: 'categoria'
            },
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' }
                ]
            }
        ]
    });
};

// ============================================
// READ - Obtener tabla por Campeonato
// ============================================
const obtenerTablaPorCampeonato = async (id_campeonato) => {
    return await TablaPosicion.findAll({
        where: {
            id_campeonato,
            estado: true
        },
        include: [
            {
                model: Categoria,
                as: 'categoria'
            },
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' }
                ]
            }
        ],
        order: [['posicion', 'ASC']]
    });
};

// ============================================
// READ - Obtener tabla por Campeonato y Categoría
// ============================================
const obtenerTablaPorCampeonatoCategoria = async (id_campeonato, id_categoria) => {
    return await TablaPosicion.findAll({
        where: {
            id_campeonato,
            id_categoria,
            estado: true
        },
        include: [
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' }
                ]
            }
        ],
        order: [['posicion', 'ASC']]
    });
};

// ============================================
// READ - Obtener posición de un equipo específico
// ============================================
const obtenerPosicionEquipo = async (id_campeonato, id_categoria, id_equipo) => {
    return await TablaPosicion.findOne({
        where: {
            id_campeonato,
            id_categoria,
            id_equipo,
            estado: true
        },
        include: [
            {
                model: Campeonato,
                as: 'campeonato'
            },
            {
                model: Categoria,
                as: 'categoria'
            },
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' }
                ]
            }
        ]
    });
};

// ============================================
// READ - Obtener top N equipos
// ============================================
const obtenerTopEquipos = async (id_campeonato, id_categoria, limite = 5) => {
    return await TablaPosicion.findAll({
        where: {
            id_campeonato,
            id_categoria,
            estado: true
        },
        include: [
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' }
                ]
            }
        ],
        order: [['posicion', 'ASC']],
        limit: limite
    });
};

// ============================================
// UPDATE - Actualizar una posición
// ============================================
const actualizarTablaPosicion = async (id_tabla, data) => {
    const tablaPosicion = await TablaPosicion.findByPk(id_tabla);
    if (!tablaPosicion) {
        return null;
    }
    return await tablaPosicion.update(data);
};

// ============================================
// DELETE - Eliminar (soft delete) una posición
// ============================================
const eliminarTablaPosicion = async (id_tabla) => {
    const tablaPosicion = await TablaPosicion.findByPk(id_tabla);
    if (!tablaPosicion) {
        return null;
    }
    return await tablaPosicion.update({ estado: false });
};

// ============================================
// FIND OR CREATE - Buscar o crear posición de equipo
// ============================================
const buscarOCrearPosicionEquipo = async (id_campeonato, id_categoria, id_equipo) => {
    let posicion = await TablaPosicion.findOne({
        where: {
            id_campeonato,
            id_categoria,
            id_equipo,
            estado: true
        }
    });

    if (!posicion) {
        // Contar cuántos equipos hay para asignar posición temporal
        const totalEquipos = await TablaPosicion.count({
            where: { id_campeonato, id_categoria, estado: true }
        });

        posicion = await TablaPosicion.create({
            id_campeonato,
            id_categoria,
            id_equipo,
            posicion: totalEquipos + 1,
            puntos: 0,
            partidos_jugados: 0,
            ganados: 0,
            perdidos: 0,
            wo: 0,
            sets_ganados: 0,
            sets_perdidos: 0,
            diferencia_sets: 0,
            puntos_favor: 0,
            puntos_contra: 0,
            diferencia_puntos: 0,
            estado: true
        });
    }

    return posicion;
};

// ============================================
// RECALCULAR POSICIONES - Ordenar por puntos, diferencia sets, diferencia puntos
// ============================================
const recalcularPosiciones = async (id_campeonato, id_categoria) => {
    const posiciones = await TablaPosicion.findAll({
        where: {
            id_campeonato,
            id_categoria,
            estado: true
        },
        order: [
            ['puntos', 'DESC'],
            ['diferencia_sets', 'DESC'],
            ['diferencia_puntos', 'DESC'],
            ['sets_ganados', 'DESC'],
            ['puntos_favor', 'DESC']
        ]
    });

    // Actualizar posiciones
    for (let i = 0; i < posiciones.length; i++) {
        await posiciones[i].update({ posicion: i + 1 });
    }

    return posiciones;
};

// ============================================
// INICIALIZAR TABLA - Crear entradas para todos los equipos inscritos
// ============================================
const inicializarTablaConEquiposInscritos = async (id_campeonato, id_categoria) => {
    console.log(`📊 Inicializando tabla para campeonato ${id_campeonato}, categoría ${id_categoria}`);

    // 1. Buscar el id_cc correspondiente
    const campeonatoCategoria = await CampeonatoCategoria.findOne({
        where: {
            id_campeonato,
            id_categoria,
            estado: true
        }
    });

    if (!campeonatoCategoria) {
        console.log(`⚠️ No existe CampeonatoCategoria para campeonato ${id_campeonato} y categoría ${id_categoria}`);
        return [];
    }

    const id_cc = campeonatoCategoria.id_cc;
    console.log(`📋 id_cc encontrado: ${id_cc}`);

    // 2. Obtener todas las inscripciones activas para este id_cc
    const inscripciones = await Inscripcion.findAll({
        where: {
            id_cc,
            estado: true
        },
        include: [
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' }
                ]
            }
        ]
    });

    // También buscar inscripciones inactivas para debug
    const todasInscripciones = await Inscripcion.findAll({
        where: { id_cc },
        include: [{ model: Equipo, as: 'equipo' }]
    });

    console.log(`📋 Inscripciones activas: ${inscripciones.length}, Total (incluyendo inactivas): ${todasInscripciones.length}`);
    todasInscripciones.forEach(i => {
        console.log(`   - Equipo ${i.equipo?.nombre || i.id_equipo}: estado=${i.estado}`);
    });

    if (inscripciones.length === 0) {
        console.log(`⚠️ No hay inscripciones activas para id_cc ${id_cc}`);
        return [];
    }

    console.log(`📋 Encontradas ${inscripciones.length} inscripciones activas para inicializar tabla`);

    // 3. Para cada equipo inscrito, crear entrada si no existe
    const posicionesCreadas = [];
    let posicionActual = 1;

    for (const inscripcion of inscripciones) {
        const id_equipo = inscripcion.id_equipo;

        // Verificar si ya existe entrada en la tabla
        let posicion = await TablaPosicion.findOne({
            where: {
                id_campeonato,
                id_categoria,
                id_equipo,
                estado: true
            }
        });

        if (!posicion) {
            // Crear nueva entrada con valores iniciales
            posicion = await TablaPosicion.create({
                id_campeonato,
                id_categoria,
                id_equipo,
                posicion: posicionActual,
                puntos: 0,
                partidos_jugados: 0,
                ganados: 0,
                perdidos: 0,
                wo: 0,
                sets_ganados: 0,
                sets_perdidos: 0,
                diferencia_sets: 0,
                puntos_favor: 0,
                puntos_contra: 0,
                diferencia_puntos: 0,
                estado: true
            });
            console.log(`✅ Creada posición para equipo ${inscripcion.equipo?.nombre || id_equipo}`);
            posicionesCreadas.push(posicion);
        }
        posicionActual++;
    }

    // 4. Retornar la tabla completa actualizada
    return await TablaPosicion.findAll({
        where: {
            id_campeonato,
            id_categoria,
            estado: true
        },
        include: [
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' }
                ]
            }
        ],
        order: [['posicion', 'ASC']]
    });
};

// ============================================
// SINCRONIZAR TABLA - Agregar equipos faltantes de inscripciones
// ============================================
const sincronizarTablaConInscripciones = async (id_campeonato, id_categoria) => {
    console.log(`🔄 Sincronizando tabla para campeonato ${id_campeonato}, categoría ${id_categoria}`);

    // 1. Buscar el id_cc correspondiente
    const campeonatoCategoria = await CampeonatoCategoria.findOne({
        where: {
            id_campeonato,
            id_categoria,
            estado: true
        }
    });

    if (!campeonatoCategoria) {
        console.log(`⚠️ No existe CampeonatoCategoria para sincronizar`);
        // Retornar la tabla existente sin cambios
        return await TablaPosicion.findAll({
            where: { id_campeonato, id_categoria, estado: true },
            include: [{ model: Equipo, as: 'equipo', include: [{ model: Club, as: 'club' }] }],
            order: [['posicion', 'ASC']]
        });
    }

    const id_cc = campeonatoCategoria.id_cc;

    // 2. Obtener todas las inscripciones activas
    const inscripciones = await Inscripcion.findAll({
        where: {
            id_cc,
            estado: true
        },
        include: [{ model: Equipo, as: 'equipo' }]
    });

    console.log(`📋 Inscripciones activas encontradas: ${inscripciones.length}`);

    // 3. Para cada inscripción, verificar si ya está en la tabla
    let agregados = 0;
    for (const inscripcion of inscripciones) {
        const existeEnTabla = await TablaPosicion.findOne({
            where: {
                id_campeonato,
                id_categoria,
                id_equipo: inscripcion.id_equipo,
                estado: true
            }
        });

        if (!existeEnTabla) {
            // Contar equipos actuales para asignar posición
            const totalEquipos = await TablaPosicion.count({
                where: { id_campeonato, id_categoria, estado: true }
            });

            await TablaPosicion.create({
                id_campeonato,
                id_categoria,
                id_equipo: inscripcion.id_equipo,
                posicion: totalEquipos + 1,
                puntos: 0,
                partidos_jugados: 0,
                ganados: 0,
                perdidos: 0,
                wo: 0,
                sets_ganados: 0,
                sets_perdidos: 0,
                diferencia_sets: 0,
                puntos_favor: 0,
                puntos_contra: 0,
                diferencia_puntos: 0,
                estado: true
            });
            console.log(`✅ Agregado equipo ${inscripcion.equipo?.nombre || inscripcion.id_equipo} a la tabla`);
            agregados++;
        }
    }

    if (agregados > 0) {
        console.log(`📊 Se agregaron ${agregados} equipos faltantes a la tabla`);
        // Recalcular posiciones después de agregar
        await recalcularPosiciones(id_campeonato, id_categoria);
    }

    // 4. Retornar tabla actualizada
    return await TablaPosicion.findAll({
        where: {
            id_campeonato,
            id_categoria,
            estado: true
        },
        include: [
            {
                model: Equipo,
                as: 'equipo',
                include: [
                    { model: Club, as: 'club' }
                ]
            }
        ],
        order: [['posicion', 'ASC']]
    });
};

module.exports = {
    crearTablaPosicion,
    obtenerTablaPosiciones,
    obtenerTodasLasTablaPosiciones,
    obtenerTablaPosicionPorId,
    obtenerTablaPorCampeonato,
    obtenerTablaPorCampeonatoCategoria,
    obtenerPosicionEquipo,
    obtenerTopEquipos,
    actualizarTablaPosicion,
    eliminarTablaPosicion,
    buscarOCrearPosicionEquipo,
    recalcularPosiciones,
    inicializarTablaConEquiposInscritos,
    sincronizarTablaConInscripciones
};
