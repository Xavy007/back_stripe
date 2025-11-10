/**
 * repositories/equipoTecnicoRepository.js
 * 
 * VERSIÓN SIMPLIFICADA - Sin includes en absoluto
 * Evita todos los errores de Sequelize con aliases
 */

const { EqTecnico, Categoria, Persona, Club } = require('../models');
const { Op } = require('sequelize');

// ============================================
// CREATE
// ============================================

/**
 * Crear un nuevo equipo técnico
 * Si no viene id_persona, crea la persona automáticamente
 */
const crearEqTecnico = async (data) => {
    try {
        // Validaciones iniciales
        if (!data.id_categoria) {
            throw new Error('El ID de categoría es obligatorio');
        }
        if (!data.id_club) {
            throw new Error('El ID de club es obligatorio');
        }

        let id_persona = data.id_persona;

        // Si NO viene id_persona, creamos la persona con los datos proporcionados
        if (!id_persona) {
            // Validar que traigan datos de la persona
            if (!data.datoPersona) {
                throw new Error('Se requieren los datos de la persona para crearla');
            }

            // Validar datos mínimos requeridos para crear persona
            if (!data.datoPersona.nombre || !data.datoPersona.ci) {
                throw new Error('Se requieren al menos nombre y CI para crear una persona');
            }
            
            // Crear la nueva persona
            const nuevaPersona = await Persona.create({
                nombre: data.datoPersona.nombre,
                ap: data.datoPersona.ap || '',
                am: data.datoPersona.am || '',
                ci: data.datoPersona.ci,
                id_nacionalidad: data.datoPersona.id_nacionalidad || null,
                genero: data.datoPersona.genero || null,
                fnac: data.datoPersona.fnac || null,
                estado: true
            });

            id_persona = nuevaPersona.id_persona;
            console.log(`✓ Nueva persona creada con ID: ${id_persona}`);
        } else {
            // Si viene id_persona, verificar que exista y esté activa
            const persona = await Persona.findOne({
                where: { 
                    id_persona: id_persona,
                    estado: true
                },
                raw: true
            });
            
            if (!persona) {
                throw new Error('La persona especificada no existe o está inactiva');
            }
        }

        // Crear el equipo técnico con el id_persona
        const nuevoEqTecnico = await EqTecnico.create({
            id_persona: id_persona,
            id_categoria: data.id_categoria,
            id_club: data.id_club,
            estado: data.estado !== undefined ? data.estado : true,
            desde: data.desde || null,
            hasta: data.hasta || null,
            freg: new Date()
        });

        // Retornar el equipo técnico creado con sus relaciones
        return await obtenerEqTecnicoCompleto(nuevoEqTecnico.id_eqtecnico);
    } catch (error) {
        throw new Error(`Error al crear el equipo técnico: ${error.message}`);
    }
};

// ============================================
// READ - Obtener todos los equipos técnicos activos
// ============================================

const obtenerEqTecnicos = async (filtros = {}) => {
    try {
        const where = { estado: true };

        if (filtros.id_club) {
            where.id_club = parseInt(filtros.id_club);
        }

        if (filtros.id_categoria) {
            where.id_categoria = parseInt(filtros.id_categoria);
        }

        if (filtros.id_persona) {
            where.id_persona = parseInt(filtros.id_persona);
        }

        // Query simple - sin includes
        const equipos = await EqTecnico.findAll({
            where,
            order: [['id_eqtecnico', 'DESC']],
            raw: true
        });

        return {
            success: true,
            message: `${equipos.length} equipos técnicos encontrados`,
            data: equipos,
            total: equipos.length
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Obtener TODOS los equipos técnicos (incluyendo inactivos)
// ============================================

const obtenerTodosLosEqTecnicos = async () => {
    try {
        const equipos = await EqTecnico.findAll({
            order: [['id_eqtecnico', 'DESC']],
            raw: true
        });

        return {
            success: true,
            message: `${equipos.length} equipos técnicos encontrados`,
            data: equipos,
            total: equipos.length
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Obtener un equipo técnico por ID
// ============================================

const obtenerEqTecnicoPorId = async (id_eqtecnico) => {
    try {
        if (!id_eqtecnico || isNaN(id_eqtecnico)) {
            throw new Error('El ID del equipo técnico debe ser un número válido');
        }

        const eqtecnico = await EqTecnico.findByPk(id_eqtecnico, {
            raw: true
        });

        if (!eqtecnico) {
            throw new Error('El equipo técnico no existe');
        }

        return {
            success: true,
            data: eqtecnico
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Obtener equipo técnico completo
// ============================================

const obtenerEqTecnicoCompleto = async (id_eqtecnico) => {
    try {
        if (!id_eqtecnico || isNaN(id_eqtecnico)) {
            throw new Error('El ID del equipo técnico debe ser un número válido');
        }

        const eqtecnico = await EqTecnico.findByPk(id_eqtecnico, {
            raw: true
        });

        if (!eqtecnico) {
            throw new Error('El equipo técnico no existe');
        }

        // Obtener datos relacionados por separado
        const persona = await Persona.findByPk(eqtecnico.id_persona, {
            attributes: ['id_persona', 'nombre', 'apellido', 'ci', 'fnac', 'genero', 'estado'],
            raw: true
        });

        const categoria = await Categoria.findByPk(eqtecnico.id_categoria, {
            attributes: ['id_categoria', 'nombre', 'descripcion'],
            raw: true
        });

        const club = await Club.findByPk(eqtecnico.id_club, {
            attributes: ['id_club', 'nombre', 'ciudad'],
            raw: true
        });

        return {
            ...eqtecnico,
            Persona: persona,
            Categoria: categoria,
            Club: club
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Obtener equipos técnicos por persona
// ============================================

const obtenerEqTecnicosPorPersona = async (id_persona) => {
    try {
        if (!id_persona || isNaN(id_persona)) {
            throw new Error('El ID de persona debe ser un número válido');
        }

        // Verificar si la persona existe
        const persona = await Persona.findByPk(id_persona, { raw: true });
        if (!persona) {
            throw new Error('La persona especificada no existe');
        }

        const equipos = await EqTecnico.findAll({
            where: { 
                id_persona: id_persona,
                estado: true 
            },
            order: [['id_eqtecnico', 'DESC']],
            raw: true
        });

        return equipos;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Obtener equipos técnicos por categoría
// ============================================

const obtenerEqTecnicosPorCategoria = async (id_categoria) => {
    try {
        if (!id_categoria || isNaN(id_categoria)) {
            throw new Error('El ID de categoría debe ser un número válido');
        }

        const equipos = await EqTecnico.findAll({
            where: { 
                id_categoria: id_categoria,
                estado: true 
            },
            order: [['id_eqtecnico', 'DESC']],
            raw: true
        });

        return equipos;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Obtener equipos técnicos por club
// ============================================

const obtenerEqTecnicosPorClub = async (id_club) => {
    try {
        if (!id_club || isNaN(id_club)) {
            throw new Error('El ID de club debe ser un número válido');
        }

        const equipos = await EqTecnico.findAll({
            where: { 
                id_club: id_club,
                estado: true 
            },
            order: [['id_eqtecnico', 'DESC']],
            raw: true
        });

        return equipos;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Obtener equipos técnicos por período
// ============================================

const obtenerEqTecnicosPorPeriodo = async (fecha) => {
    try {
        const fechaBuscada = fecha ? new Date(fecha) : new Date();

        const equipos = await EqTecnico.findAll({
            where: {
                desde: {
                    [Op.lte]: fechaBuscada
                },
                [Op.or]: [
                    { hasta: null },
                    { hasta: { [Op.gte]: fechaBuscada } }
                ],
                estado: true
            },
            order: [['id_eqtecnico', 'DESC']],
            raw: true
        });

        return equipos;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Obtener equipos técnicos activos en fecha actual
// ============================================

const obtenerEqTecnicosActuales = async () => {
    try {
        const hoy = new Date();

        const equipos = await EqTecnico.findAll({
            where: {
                estado: true,
                desde: { [Op.lte]: hoy },
                [Op.or]: [
                    { hasta: null },
                    { hasta: { [Op.gte]: hoy } }
                ]
            },
            order: [['id_eqtecnico', 'DESC']],
            raw: true
        });

        return equipos;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Verificar si una persona es equipo técnico
// ============================================

const esEqTecnico = async (id_persona) => {
    try {
        const eqtecnico = await EqTecnico.findOne({
            where: { 
                id_persona: id_persona,
                estado: true
            },
            raw: true
        });

        return !!eqtecnico;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Obtener equipo técnico por ID de persona
// ============================================

const obtenerEqTecnicoPorIdPersona = async (id_persona) => {
    try {
        const eqtecnico = await EqTecnico.findOne({
            where: { id_persona: id_persona },
            raw: true
        });

        return eqtecnico;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Obtener personas sin ser equipo técnico
// ============================================

const obtenerPersonasSinEqTecnico = async () => {
    try {
        // Obtener todas las personas activas
        const personas = await Persona.findAll({
            where: { estado: true },
            attributes: ['id_persona', 'nombre', 'apellido', 'ci', 'fnac', 'genero', 'estado'],
            raw: true
        });

        // Obtener ids de personas que son equipos técnicos
        const equiposTecnicos = await EqTecnico.findAll({
            attributes: ['id_persona'],
            raw: true
        });

        const equipoIds = equiposTecnicos.map(e => e.id_persona);

        // Filtrar personas que no son equipos técnicos
        const personasSinEquipo = personas.filter(p => !equipoIds.includes(p.id_persona));

        return personasSinEquipo;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Obtener cantidad de equipos técnicos por club
// ============================================

const contarEqTecnicosPorClub = async (id_club) => {
    try {
        const cantidad = await EqTecnico.count({
            where: { 
                id_club: id_club,
                estado: true
            }
        });

        return cantidad;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// READ - Verificar disponibilidad de período para una persona
// ============================================

const verificarDisponibilidadPeriodo = async (id_persona, desde, hasta, excluyendo_id = null) => {
    try {
        const where = {
            id_persona: id_persona,
            estado: true,
            [Op.or]: [
                {
                    desde: { [Op.between]: [desde, hasta] }
                },
                {
                    hasta: { [Op.between]: [desde, hasta] }
                },
                {
                    [Op.and]: [
                        { desde: { [Op.lte]: desde } },
                        { 
                            [Op.or]: [
                                { hasta: null },
                                { hasta: { [Op.gte]: hasta } }
                            ]
                        }
                    ]
                }
            ]
        };

        if (excluyendo_id) {
            where.id_eqtecnico = { [Op.ne]: excluyendo_id };
        }

        const conflictos = await EqTecnico.count({ where });

        return conflictos === 0;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// UPDATE
// ============================================

const actualizarEqTecnico = async (id_eqtecnico, data) => {
    try {
        if (!id_eqtecnico || isNaN(id_eqtecnico)) {
            throw new Error('El ID del equipo técnico debe ser un número válido');
        }

        // Si se está actualizando la persona, validar que exista
        if (data.id_persona) {
            const persona = await Persona.findOne({
                where: { 
                    id_persona: data.id_persona,
                    estado: true
                },
                raw: true
            });
            
            if (!persona) {
                throw new Error('La persona especificada no existe o está inactiva');
            }
        }

        const eqtecnico = await EqTecnico.findByPk(id_eqtecnico);

        if (!eqtecnico) {
            throw new Error('El equipo técnico no existe');
        }

        await eqtecnico.update(data);

        return eqtecnico.toJSON();
    } catch (error) {
        throw new Error(error.message);
    }
};

// ============================================
// DELETE - Soft delete
// ============================================

const eliminarEqTecnico = async (id_eqtecnico) => {
    try {
        if (!id_eqtecnico || isNaN(id_eqtecnico)) {
            throw new Error('El ID del equipo técnico debe ser un número válido');
        }

        const eqtecnico = await EqTecnico.findByPk(id_eqtecnico);

        if (!eqtecnico) {
            throw new Error('El equipo técnico no existe');
        }

        await eqtecnico.update({ estado: false });

        return eqtecnico.toJSON();
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    crearEqTecnico,
    obtenerEqTecnicos,
    obtenerTodosLosEqTecnicos,
    obtenerEqTecnicoPorId,
    obtenerEqTecnicoCompleto,
    obtenerEqTecnicosPorPersona,
    obtenerEqTecnicosPorCategoria,
    obtenerEqTecnicosPorClub,
    obtenerEqTecnicosPorPeriodo,
    obtenerEqTecnicosActuales,
    esEqTecnico,
    obtenerEqTecnicoPorIdPersona,
    actualizarEqTecnico,
    eliminarEqTecnico,
    obtenerPersonasSinEqTecnico,
    contarEqTecnicosPorClub,
    verificarDisponibilidadPeriodo
};