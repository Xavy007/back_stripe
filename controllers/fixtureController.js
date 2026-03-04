// controllers/fixtureController.js

const fixtureService = require('../services/fixtureGenerador.service');
const { Partido, Jornada, Equipo, Cancha, Juez, Club, PartidoJuez, Persona, Usuario, Fase, Grupo, Inscripcion, CampeonatoCategoria, Categoria, Campeonato } = require('../models');

class FixtureController {
  /**
   * POST /api/fixture/generar
   * Genera fixture automático (sin guardar en BD)
   */
  async generarFixture(req, res) {
    try {
      const config = req.body;

      // Validaciones básicas
      if (!config.id_campeonato || !config.id_cc) {
        return res.status(400).json({
          success: false,
          message: 'id_campeonato e id_cc son requeridos'
        });
      }

      if (!config.tipo_fixture) {
        return res.status(400).json({
          success: false,
          message: 'tipo_fixture es requerido (todos_contra_todos, grupos, eliminatoria)'
        });
      }

      // Generar fixture
      const partidos = await fixtureService.generarFixture(config);
      const estadisticas = fixtureService.calcularEstadisticas(partidos);

      // Enriquecer partidos con datos de equipos
      const partidosEnriquecidos = await this.enriquecerPartidos(partidos);

      res.status(200).json({
        success: true,
        message: 'Fixture generado exitosamente',
        data: {
          partidos: partidosEnriquecidos,
          estadisticas,
          config
        }
      });

    } catch (error) {
      console.error('Error generando fixture:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar fixture',
        error: error.message
      });
    }
  }

  /**
   * POST /api/fixture/guardar
   * Guarda fixture completo en la BD
   */
  async guardarFixture(req, res) {
    const transaction = await Partido.sequelize.transaction();

    try {
      const { id_campeonato, id_cc, partidos } = req.body;

      if (!partidos || partidos.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No hay partidos para guardar'
        });
      }

      // Crear jornadas primero (si es necesario)
      const jornadas = await this.crearJornadas(id_campeonato, id_cc, partidos, transaction);

      // Asignar IDs de jornadas a partidos y limpiar campos temporales
      const partidosConJornadas = partidos.map(partido => {
        const jornada = jornadas.find(j => j.numero === partido.numero_jornada);

        // Crear objeto solo con campos válidos del modelo Partido
        const partidoLimpio = {
          id_campeonato: partido.id_campeonato,
          id_cc: partido.id_cc,
          equipo_local: partido.equipo_local,
          equipo_visitante: partido.equipo_visitante,
          fecha_hora: partido.fecha_hora,
          p_estado: partido.p_estado || 'programado',
          id_cancha: partido.id_cancha || null,
          id_jornada: jornada ? jornada.id_jornada : null,
          id_fase: partido.id_fase || null,
          id_grupo: partido.id_grupo || null,
          estado: partido.estado !== undefined ? partido.estado : true
        };

        return partidoLimpio;
      });

      // Guardar todos los partidos
      const partidosCreados = await Partido.bulkCreate(partidosConJornadas, { transaction });

      await transaction.commit();

      res.status(201).json({
        success: true,
        message: `${partidosCreados.length} partidos guardados exitosamente`,
        data: {
          partidos_creados: partidosCreados.length,
          jornadas_creadas: jornadas.length
        }
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Error guardando fixture:', error);
      res.status(500).json({
        success: false,
        message: 'Error al guardar fixture',
        error: error.message
      });
    }
  }

  /**
   * PUT /api/fixture/partido/:id_partido
   * Actualiza un partido específico (cancha, árbitros, horario)
   */
  async actualizarPartido(req, res) {
    try {
      const { id_partido } = req.params;
      const { id_cancha, fecha_hora, observaciones, jueces, id_planillero } = req.body;

      const partido = await Partido.findByPk(id_partido);

      if (!partido) {
        return res.status(404).json({
          success: false,
          message: 'Partido no encontrado'
        });
      }

      // Actualizar datos del partido
      await partido.update({
        id_cancha,
        fecha_hora,
        observaciones
      });

      // Si se enviaron árbitros o planillero, actualizar asignación de jueces
      if ((jueces && Array.isArray(jueces) && jueces.length > 0) || id_planillero) {
        // Buscar o crear registro de PartidoJuez
        let [partidoJuez, created] = await PartidoJuez.findOrCreate({
          where: { id_partido },
          defaults: {
            id_partido,
            id_arbitro1: jueces && jueces[0] || null,
            id_arbitro2: jueces && jueces[1] || null,
            id_anotador: jueces && jueces[2] || null,
            id_cronometrista: jueces && jueces[3] || null,
            id_planillero: id_planillero || null,
            confirmado: false,
            estado: true
          }
        });

        // Si ya existía, actualizar con los nuevos jueces y planillero
        if (!created) {
          const updateData = {};
          if (jueces && jueces.length > 0) {
            updateData.id_arbitro1 = jueces[0] || null;
            updateData.id_arbitro2 = jueces[1] || null;
            updateData.id_anotador = jueces[2] || null;
            updateData.id_cronometrista = jueces[3] || null;
          }
          if (id_planillero !== undefined) {
            updateData.id_planillero = id_planillero;
          }
          await partidoJuez.update(updateData);
        }
      }

      res.status(200).json({
        success: true,
        message: 'Partido actualizado exitosamente',
        data: partido
      });

    } catch (error) {
      console.error('Error actualizando partido:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar partido',
        error: error.message
      });
    }
  }

  /**
   * GET /api/fixture/campeonato/:id_campeonato/categoria/:id_cc
   * Obtiene fixture completo de un campeonato-categoria
   */
  async obtenerFixture(req, res) {
    try {
      const { id_campeonato, id_cc } = req.params;

      console.log(`🔍 Buscando fixture para campeonato=${id_campeonato}, categoria=${id_cc}`);

      const partidos = await Partido.findAll({
        where: {
          id_campeonato,
          id_cc,
          estado: true
        },
        include: [
          {
            model: Equipo,
            as: 'equipoLocal',
            attributes: ['id_equipo', 'nombre', 'id_club'],
            include: [
              {
                model: Club,
                as: 'club',
                attributes: ['id_club', 'nombre', 'logo']
              }
            ]
          },
          {
            model: Equipo,
            as: 'equipoVisitante',
            attributes: ['id_equipo', 'nombre', 'id_club'],
            include: [
              {
                model: Club,
                as: 'club',
                attributes: ['id_club', 'nombre', 'logo']
              }
            ]
          },
          {
            model: Cancha,
            as: 'cancha',
            attributes: ['id_cancha', 'nombre', 'direccion']
          },
          {
            model: Jornada,
            as: 'jornada',
            attributes: ['id_jornada', 'numero', 'nombre', 'fecha']
          },
          {
            model: PartidoJuez,
            as: 'asignacionJueces',
            required: false,
            attributes: ['id_partido_juez', 'id_arbitro1', 'id_arbitro2', 'id_anotador', 'id_cronometrista', 'id_planillero'],
            include: [
              {
                model: Juez,
                as: 'arbitro1',
                attributes: ['id_juez', 'juez_categoria', 'grado'],
                include: [
                  {
                    model: Persona,
                    as: 'persona',
                    attributes: ['nombre', 'ap', 'am']
                  }
                ]
              },
              {
                model: Juez,
                as: 'arbitro2',
                attributes: ['id_juez', 'juez_categoria', 'grado'],
                include: [
                  {
                    model: Persona,
                    as: 'persona',
                    attributes: ['nombre', 'ap', 'am']
                  }
                ]
              },
              {
                model: Juez,
                as: 'anotador',
                attributes: ['id_juez', 'juez_categoria', 'grado'],
                include: [
                  {
                    model: Persona,
                    as: 'persona',
                    attributes: ['nombre', 'ap', 'am']
                  }
                ]
              },
              {
                model: Juez,
                as: 'cronometrista',
                attributes: ['id_juez', 'juez_categoria', 'grado'],
                include: [
                  {
                    model: Persona,
                    as: 'persona',
                    attributes: ['nombre', 'ap', 'am']
                  }
                ]
              },
              {
                model: Usuario,
                as: 'planillero',
                attributes: ['id_usuario', 'rol'],
                include: [
                  {
                    model: Persona,
                    as: 'persona',
                    attributes: ['nombre', 'ap', 'am']
                  }
                ]
              }
            ]
          }
        ],
        order: [
          ['fecha_hora', 'ASC']
        ]
      });

      // Agrupar por jornada
      const jornadasMap = new Map();

      partidos.forEach(partido => {
        const numJornada = partido.jornada?.numero || 0;

        if (!jornadasMap.has(numJornada)) {
          jornadasMap.set(numJornada, {
            numero: numJornada,
            nombre: partido.jornada?.nombre || `Jornada ${numJornada}`,
            fecha: partido.jornada?.fecha,
            partidos: []
          });
        }

        jornadasMap.get(numJornada).partidos.push(partido);
      });

      const jornadas = Array.from(jornadasMap.values()).sort((a, b) => a.numero - b.numero);

      console.log(`✅ Fixture encontrado: ${partidos.length} partidos, ${jornadas.length} jornadas`);

      res.status(200).json({
        success: true,
        data: {
          total_partidos: partidos.length,
          total_jornadas: jornadas.length,
          jornadas
        }
      });

    } catch (error) {
      console.error('❌ Error obteniendo fixture:', error);
      console.error('Stack trace:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Error al obtener fixture',
        error: error.message
      });
    }
  }

  /**
   * GET /api/fixture/cc/:id_cc
   * Obtiene partidos de un campeonato-categoria (solo con id_cc)
   */
  async obtenerPartidosPorCC(req, res) {
    try {
      const { id_cc } = req.params;

      console.log(`🔍 Buscando partidos para id_cc=${id_cc}`);

      const partidos = await Partido.findAll({
        where: {
          id_cc,
          estado: true
        },
        include: [
          {
            model: Equipo,
            as: 'equipoLocal',
            attributes: ['id_equipo', 'nombre', 'id_club'],
            include: [{ model: Club, as: 'club', attributes: ['id_club', 'nombre', 'logo'] }]
          },
          {
            model: Equipo,
            as: 'equipoVisitante',
            attributes: ['id_equipo', 'nombre', 'id_club'],
            include: [{ model: Club, as: 'club', attributes: ['id_club', 'nombre', 'logo'] }]
          },
          {
            model: Cancha,
            as: 'cancha',
            attributes: ['id_cancha', 'nombre', 'direccion']
          },
          {
            model: Jornada,
            as: 'jornada',
            attributes: ['id_jornada', 'numero', 'nombre', 'fecha']
          }
        ],
        order: [['fecha_hora', 'ASC']]
      });

      // Formatear para frontend - extraer solo campos necesarios
      const partidosFormateados = partidos.map(p => ({
        id_partido: p.id_partido,
        fecha_partido: p.fecha_hora ? new Date(p.fecha_hora).toISOString().split('T')[0] : null,
        hora_partido: p.fecha_hora ? new Date(p.fecha_hora).toTimeString().slice(0, 5) : null,
        estado: p.p_estado,
        sets_local: p.resultado_local,
        sets_visitante: p.resultado_visitante,
        equipo_local: p.equipoLocal ? {
          id_equipo: p.equipoLocal.id_equipo,
          nombre: p.equipoLocal.nombre,
          club: p.equipoLocal.club ? {
            id_club: p.equipoLocal.club.id_club,
            nombre: p.equipoLocal.club.nombre,
            logo: p.equipoLocal.club.logo
          } : null
        } : null,
        equipo_visitante: p.equipoVisitante ? {
          id_equipo: p.equipoVisitante.id_equipo,
          nombre: p.equipoVisitante.nombre,
          club: p.equipoVisitante.club ? {
            id_club: p.equipoVisitante.club.id_club,
            nombre: p.equipoVisitante.club.nombre,
            logo: p.equipoVisitante.club.logo
          } : null
        } : null,
        cancha: p.cancha ? {
          id_cancha: p.cancha.id_cancha,
          nombre: p.cancha.nombre,
          direccion: p.cancha.direccion
        } : null,
        jornada: p.jornada ? {
          id_jornada: p.jornada.id_jornada,
          numero: p.jornada.numero,
          nombre: p.jornada.nombre,
          fecha: p.jornada.fecha
        } : null
      }));

      console.log(`✅ Encontrados ${partidos.length} partidos`);

      res.status(200).json({
        success: true,
        data: partidosFormateados,
        total: partidos.length
      });

    } catch (error) {
      console.error('❌ Error obteniendo partidos por CC:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener partidos',
        error: error.message
      });
    }
  }

  /**
   * GET /api/fixture/campeonato/:id_campeonato/todos
   * Obtiene TODOS los partidos del campeonato (todas las categorías)
   */
  async obtenerTodosLosPartidos(req, res) {
    try {
      const { id_campeonato } = req.params;
      const { fecha } = req.query; // Filtro opcional por fecha

      console.log(`🔍 Buscando TODOS los partidos para campeonato=${id_campeonato}${fecha ? `, fecha=${fecha}` : ''}`);

      const whereClause = {
        id_campeonato,
        estado: true
      };

      // Filtro opcional por fecha
      if (fecha) {
        const fechaInicio = new Date(fecha);
        fechaInicio.setHours(0, 0, 0, 0);
        const fechaFin = new Date(fecha);
        fechaFin.setHours(23, 59, 59, 999);

        whereClause.fecha_hora = {
          [Partido.sequelize.Sequelize.Op.between]: [fechaInicio, fechaFin]
        };
      }

      const partidos = await Partido.findAll({
        where: whereClause,
        include: [
          {
            model: Equipo,
            as: 'equipoLocal',
            attributes: ['id_equipo', 'nombre', 'id_club', 'id_categoria'],
            include: [
              {
                model: Club,
                as: 'club',
                attributes: ['id_club', 'nombre', 'logo', 'acronimo']
              }
            ]
          },
          {
            model: Equipo,
            as: 'equipoVisitante',
            attributes: ['id_equipo', 'nombre', 'id_club', 'id_categoria'],
            include: [
              {
                model: Club,
                as: 'club',
                attributes: ['id_club', 'nombre', 'logo', 'acronimo']
              }
            ]
          },
          {
            model: Cancha,
            as: 'cancha',
            attributes: ['id_cancha', 'nombre', 'direccion']
          },
          {
            model: CampeonatoCategoria,
            as: 'campeonatoCategoria',
            attributes: ['id_cc'],
            include: [
              {
                model: Categoria,
                as: 'categoria',
                attributes: ['id_categoria', 'nombre']
              }
            ]
          },
          {
            model: Jornada,
            as: 'jornada',
            attributes: ['id_jornada', 'numero', 'nombre', 'fecha'],
            include: [
              {
                model: Fase,
                as: 'fase',
                required: false,
                attributes: ['id_fase', 'nombre'],
                include: [
                  {
                    model: CampeonatoCategoria,
                    as: 'campeonatoCategoria',
                    attributes: ['id_cc'],
                    include: [
                      {
                        model: Categoria,
                        as: 'categoria',
                        attributes: ['id_categoria', 'nombre']
                      }
                    ]
                  }
                ]
              },
              {
                model: Grupo,
                as: 'grupo',
                required: false,
                attributes: ['id_grupo', 'nombre'],
                include: [
                  {
                    model: CampeonatoCategoria,
                    as: 'campeonatoCategoria',
                    attributes: ['id_cc'],
                    include: [
                      {
                        model: Categoria,
                        as: 'categoria',
                        attributes: ['id_categoria', 'nombre']
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            model: PartidoJuez,
            as: 'asignacionJueces',
            required: false,
            attributes: ['id_partido_juez', 'id_arbitro1', 'id_arbitro2', 'id_anotador', 'id_cronometrista', 'id_planillero'],
            include: [
              {
                model: Juez,
                as: 'arbitro1',
                attributes: ['id_juez', 'juez_categoria', 'grado'],
                include: [
                  {
                    model: Persona,
                    as: 'persona',
                    attributes: ['nombre', 'ap', 'am']
                  }
                ]
              },
              {
                model: Juez,
                as: 'arbitro2',
                attributes: ['id_juez', 'juez_categoria', 'grado'],
                include: [
                  {
                    model: Persona,
                    as: 'persona',
                    attributes: ['nombre', 'ap', 'am']
                  }
                ]
              },
              {
                model: Juez,
                as: 'anotador',
                attributes: ['id_juez', 'juez_categoria', 'grado'],
                include: [
                  {
                    model: Persona,
                    as: 'persona',
                    attributes: ['nombre', 'ap', 'am']
                  }
                ]
              },
              {
                model: Juez,
                as: 'cronometrista',
                attributes: ['id_juez', 'juez_categoria', 'grado'],
                include: [
                  {
                    model: Persona,
                    as: 'persona',
                    attributes: ['nombre', 'ap', 'am']
                  }
                ]
              },
              {
                model: Usuario,
                as: 'planillero',
                attributes: ['id_usuario', 'rol'],
                include: [
                  {
                    model: Persona,
                    as: 'persona',
                    attributes: ['nombre', 'ap', 'am']
                  }
                ]
              }
            ]
          }
        ],
        order: [
          ['fecha_hora', 'ASC']
        ]
      });

      console.log(`✅ Encontrados ${partidos.length} partidos`);

      res.status(200).json({
        success: true,
        data: {
          total_partidos: partidos.length,
          partidos
        }
      });

    } catch (error) {
      console.error('❌ Error obteniendo partidos:', error);
      console.error('Stack trace:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Error al obtener partidos',
        error: error.message
      });
    }
  }

  /**
   * GET /api/fixture/mis-partidos
   * Obtiene partidos filtrados según el rol del usuario autenticado
   * - Admin/Organizador: Todos los partidos
   * - Juez/Cronometrista: Solo partidos asignados
   */
  async obtenerMisPartidos(req, res) {
    try {
      const { id_usuario, rol } = req.usuario; // Datos del JWT
      const { id_campeonato } = req.query;

      console.log(`🔍 Obteniendo partidos para usuario ${id_usuario} con rol ${rol}`);

      // Si no se proporciona campeonato, retornar error
      if (!id_campeonato) {
        return res.status(400).json({
          success: false,
          message: 'id_campeonato es requerido'
        });
      }

      let partidos;

      // Admin y organizador ven todos los partidos
      if (rol === 'admin' || rol === 'organizador') {
        console.log('👑 Usuario con permisos completos - mostrando todos los partidos');

        partidos = await Partido.findAll({
          where: {
            id_campeonato,
            estado: true
          },
          include: [
            {
              model: Equipo,
              as: 'equipoLocal',
              attributes: ['id_equipo', 'nombre', 'id_club', 'id_categoria'],
              include: [
                {
                  model: Club,
                  as: 'club',
                  attributes: ['id_club', 'nombre', 'logo', 'acronimo']
                }
              ]
            },
            {
              model: Equipo,
              as: 'equipoVisitante',
              attributes: ['id_equipo', 'nombre', 'id_club', 'id_categoria'],
              include: [
                {
                  model: Club,
                  as: 'club',
                  attributes: ['id_club', 'nombre', 'logo', 'acronimo']
                }
              ]
            },
            {
              model: Cancha,
              as: 'cancha',
              attributes: ['id_cancha', 'nombre', 'direccion']
            },
            {
              model: CampeonatoCategoria,
              as: 'campeonatoCategoria',
              attributes: ['id_cc'],
              include: [
                {
                  model: Categoria,
                  as: 'categoria',
                  attributes: ['id_categoria', 'nombre']
                }
              ]
            },
            {
              model: Jornada,
              as: 'jornada',
              attributes: ['id_jornada', 'numero', 'nombre', 'fecha'],
              include: [
                {
                  model: Fase,
                  as: 'fase',
                  required: false,
                  attributes: ['id_fase', 'nombre'],
                  include: [
                    {
                      model: CampeonatoCategoria,
                      as: 'campeonatoCategoria',
                      attributes: ['id_cc'],
                      include: [
                        {
                          model: Categoria,
                          as: 'categoria',
                          attributes: ['id_categoria', 'nombre']
                        }
                      ]
                    }
                  ]
                },
                {
                  model: Grupo,
                  as: 'grupo',
                  required: false,
                  attributes: ['id_grupo', 'nombre'],
                  include: [
                    {
                      model: CampeonatoCategoria,
                      as: 'campeonatoCategoria',
                      attributes: ['id_cc'],
                      include: [
                        {
                          model: Categoria,
                          as: 'categoria',
                          attributes: ['id_categoria', 'nombre']
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              model: PartidoJuez,
              as: 'asignacionJueces',
              required: false,
              attributes: ['id_partido_juez', 'id_arbitro1', 'id_arbitro2', 'id_anotador', 'id_cronometrista', 'id_planillero'],
              include: [
                {
                  model: Juez,
                  as: 'arbitro1',
                  attributes: ['id_juez', 'juez_categoria', 'grado'],
                  include: [
                    {
                      model: Persona,
                      as: 'persona',
                      attributes: ['nombre', 'ap', 'am']
                    }
                  ]
                },
                {
                  model: Juez,
                  as: 'arbitro2',
                  attributes: ['id_juez', 'juez_categoria', 'grado'],
                  include: [
                    {
                      model: Persona,
                      as: 'persona',
                      attributes: ['nombre', 'ap', 'am']
                    }
                  ]
                },
                {
                  model: Juez,
                  as: 'anotador',
                  attributes: ['id_juez', 'juez_categoria', 'grado'],
                  include: [
                    {
                      model: Persona,
                      as: 'persona',
                      attributes: ['nombre', 'ap', 'am']
                    }
                  ]
                },
                {
                  model: Juez,
                  as: 'cronometrista',
                  attributes: ['id_juez', 'juez_categoria', 'grado'],
                  include: [
                    {
                      model: Persona,
                      as: 'persona',
                      attributes: ['nombre', 'ap', 'am']
                    }
                  ]
                },
                {
                  model: Usuario,
                  as: 'planillero',
                  attributes: ['id_usuario', 'rol'],
                  include: [
                    {
                      model: Persona,
                      as: 'persona',
                      attributes: ['nombre', 'ap', 'am']
                    }
                  ]
                }
              ]
            }
          ],
          order: [
            ['fecha_hora', 'ASC']
          ]
        });
      }
      // Jueces solo ven partidos donde están asignados
      else if (rol === 'juez') {
        console.log('⚖️ Usuario juez - filtrando por asignaciones');

        // Primero, buscar el id_juez asociado al usuario
        const usuario = await Usuario.findByPk(id_usuario, {
          include: [
            {
              model: Persona,
              as: 'persona',
              include: [
                {
                  model: Juez,
                  as: 'juez',
                  attributes: ['id_juez']
                }
              ]
            }
          ]
        });

        const id_juez = usuario?.persona?.juez?.id_juez;

        if (!id_juez) {
          console.log('⚠️ Usuario juez sin id_juez asociado');
          return res.status(200).json({
            success: true,
            data: {
              total_partidos: 0,
              partidos: []
            }
          });
        }

        // Buscar partidos donde el juez esté asignado
        partidos = await Partido.findAll({
          where: {
            id_campeonato,
            estado: true
          },
          include: [
            {
              model: Equipo,
              as: 'equipoLocal',
              attributes: ['id_equipo', 'nombre', 'id_club', 'id_categoria'],
              include: [
                {
                  model: Club,
                  as: 'club',
                  attributes: ['id_club', 'nombre', 'logo', 'acronimo']
                }
              ]
            },
            {
              model: Equipo,
              as: 'equipoVisitante',
              attributes: ['id_equipo', 'nombre', 'id_club', 'id_categoria'],
              include: [
                {
                  model: Club,
                  as: 'club',
                  attributes: ['id_club', 'nombre', 'logo', 'acronimo']
                }
              ]
            },
            {
              model: Cancha,
              as: 'cancha',
              attributes: ['id_cancha', 'nombre', 'direccion']
            },
            {
              model: CampeonatoCategoria,
              as: 'campeonatoCategoria',
              attributes: ['id_cc'],
              include: [
                {
                  model: Categoria,
                  as: 'categoria',
                  attributes: ['id_categoria', 'nombre']
                }
              ]
            },
            {
              model: Jornada,
              as: 'jornada',
              attributes: ['id_jornada', 'numero', 'nombre', 'fecha'],
              include: [
                {
                  model: Fase,
                  as: 'fase',
                  required: false,
                  attributes: ['id_fase', 'nombre'],
                  include: [
                    {
                      model: CampeonatoCategoria,
                      as: 'campeonatoCategoria',
                      attributes: ['id_cc'],
                      include: [
                        {
                          model: Categoria,
                          as: 'categoria',
                          attributes: ['id_categoria', 'nombre']
                        }
                      ]
                    }
                  ]
                },
                {
                  model: Grupo,
                  as: 'grupo',
                  required: false,
                  attributes: ['id_grupo', 'nombre'],
                  include: [
                    {
                      model: CampeonatoCategoria,
                      as: 'campeonatoCategoria',
                      attributes: ['id_cc'],
                      include: [
                        {
                          model: Categoria,
                          as: 'categoria',
                          attributes: ['id_categoria', 'nombre']
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              model: PartidoJuez,
              as: 'asignacionJueces',
              required: true, // IMPORTANTE: Solo partidos CON asignación
              attributes: ['id_partido_juez', 'id_arbitro1', 'id_arbitro2', 'id_anotador', 'id_cronometrista', 'id_planillero'],
              where: {
                [Partido.sequelize.Sequelize.Op.or]: [
                  { id_arbitro1: id_juez },
                  { id_arbitro2: id_juez },
                  { id_anotador: id_juez },
                  { id_cronometrista: id_juez },
                  { id_planillero: id_usuario }
                ]
              },
              include: [
                {
                  model: Juez,
                  as: 'arbitro1',
                  attributes: ['id_juez', 'juez_categoria', 'grado'],
                  include: [
                    {
                      model: Persona,
                      as: 'persona',
                      attributes: ['nombre', 'ap', 'am']
                    }
                  ]
                },
                {
                  model: Juez,
                  as: 'arbitro2',
                  attributes: ['id_juez', 'juez_categoria', 'grado'],
                  include: [
                    {
                      model: Persona,
                      as: 'persona',
                      attributes: ['nombre', 'ap', 'am']
                    }
                  ]
                },
                {
                  model: Juez,
                  as: 'anotador',
                  attributes: ['id_juez', 'juez_categoria', 'grado'],
                  include: [
                    {
                      model: Persona,
                      as: 'persona',
                      attributes: ['nombre', 'ap', 'am']
                    }
                  ]
                },
                {
                  model: Juez,
                  as: 'cronometrista',
                  attributes: ['id_juez', 'juez_categoria', 'grado'],
                  include: [
                    {
                      model: Persona,
                      as: 'persona',
                      attributes: ['nombre', 'ap', 'am']
                    }
                  ]
                },
                {
                  model: Usuario,
                  as: 'planillero',
                  attributes: ['id_usuario', 'rol'],
                  include: [
                    {
                      model: Persona,
                      as: 'persona',
                      attributes: ['nombre', 'ap', 'am']
                    }
                  ]
                }
              ]
            }
          ],
          order: [
            ['fecha_hora', 'ASC']
          ]
        });
      }
      else {
        // Otros roles no tienen acceso
        console.log('⛔ Rol sin permisos');
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para ver partidos'
        });
      }

      console.log(`✅ Encontrados ${partidos.length} partidos para el usuario`);

      res.status(200).json({
        success: true,
        data: {
          total_partidos: partidos.length,
          partidos
        }
      });

    } catch (error) {
      console.error('❌ Error obteniendo mis partidos:', error);
      console.error('Stack trace:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Error al obtener partidos',
        error: error.message
      });
    }
  }

  /**
   * GET /api/fixture/recursos
   * Obtiene canchas y árbitros disponibles para asignar
   */
  async obtenerRecursosDisponibles(req, res) {
    try {
      console.log('🔍 Obteniendo recursos disponibles...');

      const canchas = await Cancha.findAll({
        where: { estado: true },
        attributes: ['id_cancha', 'nombre', 'direccion', 'capacidad'],
        order: [['nombre', 'ASC']]
      });

      const jueces = await Juez.findAll({
        where: { estado: true },
        attributes: ['id_juez', 'juez_categoria', 'grado'],
        include: [
          {
            model: Persona,
            as: 'persona',
            attributes: ['nombre', 'ap', 'am']
          }
        ],
        order: [[{ model: Persona, as: 'persona' }, 'ap', 'ASC']]
      });

      // Obtener usuarios con rol de juez (planilleros)
      const planilleros = await Usuario.findAll({
        where: {
          rol: 'juez',
          estado: true
        },
        attributes: ['id_usuario', 'rol'],
        include: [
          {
            model: Persona,
            as: 'persona',
            attributes: ['nombre', 'ap', 'am']
          }
        ],
        order: [[{ model: Persona, as: 'persona' }, 'ap', 'ASC']]
      });

      console.log(`✅ Recursos encontrados: ${canchas.length} canchas, ${jueces.length} jueces, ${planilleros.length} planilleros`);

      res.status(200).json({
        success: true,
        data: {
          canchas,
          jueces,
          planilleros
        }
      });

    } catch (error) {
      console.error('Error obteniendo recursos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener recursos',
        error: error.message
      });
    }
  }

  /**
   * DELETE /api/fixture/partidos-duplicados/:id_campeonato
   * Elimina (soft delete) partidos duplicados manteniendo los más antiguos
   */
  async eliminarPartidosDuplicados(req, res) {
    const transaction = await Partido.sequelize.transaction();

    try {
      const { id_campeonato } = req.params;

      console.log(`🗑️ Eliminando duplicados del campeonato ${id_campeonato}`);

      // Obtener todos los partidos del campeonato con información de jornada
      const partidos = await Partido.findAll({
        where: {
          id_campeonato,
          estado: true
        },
        attributes: ['id_partido', 'equipo_local', 'equipo_visitante', 'id_jornada', 'createdAt'],
        include: [
          {
            model: Jornada,
            as: 'jornada',
            attributes: ['numero']
          }
        ],
        order: [['createdAt', 'ASC']]
      });

      // Agrupar por combinación única de equipo_local, equipo_visitante, numero_jornada
      const partidosMap = new Map();
      const duplicados = [];

      partidos.forEach(partido => {
        const numeroJornada = partido.jornada?.numero || 0;
        const key = `${partido.equipo_local}-${partido.equipo_visitante}-${numeroJornada}`;

        if (!partidosMap.has(key)) {
          // Guardar el primero (más antiguo)
          partidosMap.set(key, partido);
        } else {
          // Marcar como duplicado
          duplicados.push(partido.id_partido);
        }
      });

      if (duplicados.length === 0) {
        await transaction.commit();
        return res.status(200).json({
          success: true,
          message: 'No se encontraron partidos duplicados',
          data: {
            total_partidos: partidos.length,
            duplicados_eliminados: 0
          }
        });
      }

      // Soft delete de los duplicados
      await Partido.update(
        { estado: false },
        {
          where: { id_partido: duplicados },
          transaction
        }
      );

      await transaction.commit();

      console.log(`✅ ${duplicados.length} partidos duplicados eliminados (soft delete)`);

      res.status(200).json({
        success: true,
        message: `${duplicados.length} partidos duplicados eliminados exitosamente`,
        data: {
          total_partidos: partidos.length,
          duplicados_eliminados: duplicados.length,
          partidos_restantes: partidos.length - duplicados.length,
          ids_eliminados: duplicados
        }
      });

    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error eliminando duplicados:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar partidos duplicados',
        error: error.message
      });
    }
  }

  /**
   * GET /api/fixture/debug/campeonato/:id_campeonato
   * Obtiene información detallada de partidos para diagnóstico
   */
  async debugPartidos(req, res) {
    try {
      const { id_campeonato } = req.params;

      console.log(`🐛 DEBUG: Obteniendo partidos del campeonato ${id_campeonato}`);

      const partidos = await Partido.findAll({
        where: {
          id_campeonato,
          estado: true
        },
        attributes: [
          'id_partido',
          'id_campeonato',
          'id_cc',
          'equipo_local',
          'equipo_visitante',
          'id_jornada',
          'fecha_hora',
          'p_estado'
        ],
        include: [
          {
            model: Equipo,
            as: 'equipoLocal',
            attributes: ['id_equipo', 'nombre']
          },
          {
            model: Equipo,
            as: 'equipoVisitante',
            attributes: ['id_equipo', 'nombre']
          },
          {
            model: Jornada,
            as: 'jornada',
            attributes: ['id_jornada', 'numero', 'nombre']
          },
          {
            model: CampeonatoCategoria,
            as: 'campeonatoCategoria',
            attributes: ['id_cc'],
            include: [
              {
                model: Categoria,
                as: 'categoria',
                attributes: ['id_categoria', 'nombre']
              }
            ]
          }
        ],
        order: [['id_jornada', 'ASC'], ['id_partido', 'ASC']]
      });

      // Estadísticas
      const equiposUnicos = new Set();
      partidos.forEach(p => {
        equiposUnicos.add(p.equipo_local);
        equiposUnicos.add(p.equipo_visitante);
      });

      const jornadasUnicas = new Set();
      partidos.forEach(p => {
        if (p.id_jornada) jornadasUnicas.add(p.id_jornada);
      });

      const categoriasUnicas = new Set();
      partidos.forEach(p => {
        if (p.campeonatoCategoria?.id_cc) {
          categoriasUnicas.add(p.campeonatoCategoria.id_cc);
        }
      });

      // Agrupar por jornada
      const partidosPorJornada = {};
      partidos.forEach(p => {
        const jornadaKey = p.jornada?.numero || 'Sin jornada';
        if (!partidosPorJornada[jornadaKey]) {
          partidosPorJornada[jornadaKey] = [];
        }
        partidosPorJornada[jornadaKey].push({
          id_partido: p.id_partido,
          id_jornada: p.id_jornada,
          local: p.equipoLocal?.nombre,
          visitante: p.equipoVisitante?.nombre,
          categoria: p.campeonatoCategoria?.categoria?.nombre,
          fecha: p.fecha_hora
        });
      });

      const resultado = {
        campeonato_id: id_campeonato,
        total_partidos: partidos.length,
        total_equipos: equiposUnicos.size,
        total_jornadas: jornadasUnicas.size,
        total_categorias: categoriasUnicas.size,
        partidos_por_jornada: partidosPorJornada,
        todos_los_partidos: partidos.map(p => ({
          id_partido: p.id_partido,
          id_cc: p.id_cc,
          categoria: p.campeonatoCategoria?.categoria?.nombre,
          jornada: p.jornada?.numero,
          local: p.equipoLocal?.nombre,
          visitante: p.equipoVisitante?.nombre,
          fecha: p.fecha_hora,
          estado: p.p_estado
        }))
      };

      console.log(`✅ DEBUG: ${partidos.length} partidos, ${equiposUnicos.size} equipos, ${jornadasUnicas.size} jornadas`);

      res.status(200).json({
        success: true,
        data: resultado
      });

    } catch (error) {
      console.error('❌ Error en debug de partidos:', error);
      res.status(500).json({
        success: false,
        message: 'Error en debug',
        error: error.message
      });
    }
  }

  /**
   * GET /api/fixture/partido/:id_partido
   * Obtiene un partido específico con todos sus detalles
   */
  async obtenerPartido(req, res) {
    try {
      const { id_partido } = req.params;

      console.log(`🔍 Obteniendo partido ${id_partido}`);

      const partido = await Partido.findOne({
        where: {
          id_partido,
          estado: true
        },
        include: [
          {
            model: Equipo,
            as: 'equipoLocal',
            attributes: ['id_equipo', 'nombre', 'id_club', 'id_categoria'],
            include: [
              {
                model: Club,
                as: 'club',
                attributes: ['id_club', 'nombre', 'logo', 'acronimo']
              }
            ]
          },
          {
            model: Equipo,
            as: 'equipoVisitante',
            attributes: ['id_equipo', 'nombre', 'id_club', 'id_categoria'],
            include: [
              {
                model: Club,
                as: 'club',
                attributes: ['id_club', 'nombre', 'logo', 'acronimo']
              }
            ]
          },
          {
            model: Cancha,
            as: 'cancha',
            attributes: ['id_cancha', 'nombre', 'direccion', 'ciudad']
          },
          {
            model: Jornada,
            as: 'jornada',
            attributes: ['id_jornada', 'numero', 'nombre', 'fecha']
          },
          {
            model: Campeonato,
            as: 'campeonato',
            attributes: ['id_campeonato', 'nombre', 'gestion']
          },
          {
            model: CampeonatoCategoria,
            as: 'campeonatoCategoria',
            attributes: ['id_cc', 'id_campeonato', 'id_categoria'],
            include: [
              {
                model: Categoria,
                as: 'categoria',
                attributes: ['id_categoria', 'nombre', 'genero']
              }
            ]
          },
          {
            model: PartidoJuez,
            as: 'asignacionJueces',
            required: false,
            include: [
              {
                model: Juez,
                as: 'arbitro1',
                attributes: ['id_juez', 'juez_categoria', 'grado'],
                include: [{ model: Persona, as: 'persona', attributes: ['nombre', 'ap', 'am'] }]
              },
              {
                model: Juez,
                as: 'arbitro2',
                attributes: ['id_juez', 'juez_categoria', 'grado'],
                include: [{ model: Persona, as: 'persona', attributes: ['nombre', 'ap', 'am'] }]
              },
              {
                model: Juez,
                as: 'anotador',
                attributes: ['id_juez', 'juez_categoria', 'grado'],
                include: [{ model: Persona, as: 'persona', attributes: ['nombre', 'ap', 'am'] }]
              }
            ]
          }
        ]
      });

      if (!partido) {
        return res.status(404).json({
          success: false,
          message: 'Partido no encontrado'
        });
      }

      // Formatear respuesta para la planilla - TODOS los campos deben ser strings o primitivos
      const response = {
        id_partido: partido.id_partido,
        fecha_hora: partido.fecha_hora,
        fecha_partido: partido.fecha_hora ? new Date(partido.fecha_hora).toISOString().split('T')[0] : null,
        hora_partido: partido.fecha_hora ? new Date(partido.fecha_hora).toTimeString().slice(0, 5) : null,
        p_estado: partido.p_estado,
        marcador_local: partido.marcador_local,
        marcador_visitante: partido.marcador_visitante,
        sets_local: partido.sets_local,
        sets_visitante: partido.sets_visitante,
        numero_partido: partido.id_partido,
        equipo_local: partido.equipoLocal ? {
          id: partido.equipoLocal.id_equipo,
          nombre: String(partido.equipoLocal.nombre || ''),
          club: partido.equipoLocal.club ? {
            id_club: partido.equipoLocal.club.id_club,
            nombre: String(partido.equipoLocal.club.nombre || ''),
            logo: partido.equipoLocal.club.logo,
            acronimo: String(partido.equipoLocal.club.acronimo || '')
          } : null
        } : null,
        equipo_visitante: partido.equipoVisitante ? {
          id: partido.equipoVisitante.id_equipo,
          nombre: String(partido.equipoVisitante.nombre || ''),
          club: partido.equipoVisitante.club ? {
            id_club: partido.equipoVisitante.club.id_club,
            nombre: String(partido.equipoVisitante.club.nombre || ''),
            logo: partido.equipoVisitante.club.logo,
            acronimo: String(partido.equipoVisitante.club.acronimo || '')
          } : null
        } : null,
        cancha: partido.cancha ? {
          id_cancha: partido.cancha.id_cancha,
          nombre: String(partido.cancha.nombre || ''),
          direccion: String(partido.cancha.direccion || ''),
          ciudad: String(partido.cancha.ciudad || '')
        } : null,
        jornada: partido.jornada ? {
          id_jornada: partido.jornada.id_jornada,
          numero: partido.jornada.numero,
          nombre: String(partido.jornada.nombre || ''),
          fecha: partido.jornada.fecha
        } : null,
        categoria: partido.campeonatoCategoria?.categoria ? {
          id_categoria: partido.campeonatoCategoria.categoria.id_categoria,
          nombre: String(partido.campeonatoCategoria.categoria.nombre || ''),
          genero: String(partido.campeonatoCategoria.categoria.genero || '')
        } : null,
        campeonato: partido.campeonato ? {
          id: partido.campeonato.id_campeonato,
          nombre: String(partido.campeonato.nombre || ''),
          gestion: partido.campeonato.gestion,
          id_cc: partido.campeonatoCategoria?.id_cc
        } : null,
        arbitros: partido.asignacionJueces ? {
          primero: partido.asignacionJueces.arbitro1?.persona
            ? `${partido.asignacionJueces.arbitro1.persona.nombre} ${partido.asignacionJueces.arbitro1.persona.ap}`
            : null,
          segundo: partido.asignacionJueces.arbitro2?.persona
            ? `${partido.asignacionJueces.arbitro2.persona.nombre} ${partido.asignacionJueces.arbitro2.persona.ap}`
            : null,
          anotador: partido.asignacionJueces.anotador?.persona
            ? `${partido.asignacionJueces.anotador.persona.nombre} ${partido.asignacionJueces.anotador.persona.ap}`
            : null
        } : null
      };

      console.log(`✅ Partido ${id_partido} encontrado`);

      res.status(200).json({
        success: true,
        data: response
      });

    } catch (error) {
      console.error('❌ Error obteniendo partido:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener partido',
        error: error.message
      });
    }
  }

  // ===== HELPERS =====

  /**
   * Crea jornadas para el campeonato
   */
  async crearJornadas(id_campeonato, id_cc, partidos, transaction) {
    const jornadasUnicas = [...new Set(partidos.map(p => p.numero_jornada))].filter(Boolean);

    const jornadasData = jornadasUnicas.map(numeroJornada => ({
      numero: numeroJornada,  // Campo correcto del modelo
      nombre: `Jornada ${numeroJornada}`,  // Campo obligatorio
      id_fase: null,  // Opcional para fixtures simples
      id_grupo: null,  // Opcional para fixtures simples
      estado: true
    }));

    return await Jornada.bulkCreate(jornadasData, { transaction, ignoreDuplicates: true });
  }

  /**
   * Enriquece partidos con información de equipos
   */
  async enriquecerPartidos(partidos) {
    const equiposIds = new Set();
    partidos.forEach(p => {
      equiposIds.add(p.equipo_local);
      equiposIds.add(p.equipo_visitante);
    });

    const equipos = await Equipo.findAll({
      where: {
        id_equipo: Array.from(equiposIds)
      },
      attributes: ['id_equipo', 'nombre'],
      include: [{
        model: Club,
        as: 'club',
        attributes: ['nombre', 'acronimo', 'logo']
      }]
    });

    const equiposMap = new Map(equipos.map(e => [e.id_equipo, e]));

    return partidos.map(partido => ({
      ...partido,
      equipoLocal: equiposMap.get(partido.equipo_local),
      equipoVisitante: equiposMap.get(partido.equipo_visitante)
    }));
  }

  /**
   * GET /api/fixture/partidos
   * Obtener todos los partidos (sin filtro de campeonato)
   */
  async obtenerTodosPartidos(req, res) {
    try {
      const { fecha } = req.query;
      const whereClause = { estado: true };

      if (fecha) {
        const fechaInicio = new Date(fecha);
        fechaInicio.setHours(0, 0, 0, 0);
        const fechaFin = new Date(fecha);
        fechaFin.setHours(23, 59, 59, 999);
        whereClause.fecha_hora = {
          [Partido.sequelize.Sequelize.Op.between]: [fechaInicio, fechaFin]
        };
      }

      const partidos = await Partido.findAll({
        where: whereClause,
        include: [
          {
            model: Equipo,
            as: 'equipoLocal',
            attributes: ['id_equipo', 'nombre', 'id_club'],
            include: [{ model: Club, as: 'club', attributes: ['id_club', 'nombre', 'logo'] }]
          },
          {
            model: Equipo,
            as: 'equipoVisitante',
            attributes: ['id_equipo', 'nombre', 'id_club'],
            include: [{ model: Club, as: 'club', attributes: ['id_club', 'nombre', 'logo'] }]
          },
          { model: Cancha, as: 'cancha', attributes: ['id_cancha', 'nombre_cancha'] },
          { model: Campeonato, as: 'campeonato', attributes: ['id_campeonato', 'nombre_campeonato'] }
        ],
        order: [['fecha_hora', 'ASC']]
      });

      return res.json({ success: true, data: partidos });
    } catch (error) {
      console.error('Error al obtener todos los partidos:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new FixtureController();
