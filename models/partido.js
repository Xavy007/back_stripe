'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Partido extends Model {
    static associate(models) {
      // Partido → Campeonato (Muchos a Uno)
      Partido.belongsTo(models.Campeonato, {
        foreignKey: 'id_campeonato',
        as: 'campeonato'
      });

      // Partido → CampeonatoCategoria (Muchos a Uno)
      Partido.belongsTo(models.CampeonatoCategoria, {
        foreignKey: 'id_cc',
        as: 'campeonatoCategoria'
      });

      // Partido → Cancha (Muchos a Uno)
      Partido.belongsTo(models.Cancha, {
        foreignKey: 'id_cancha',
        as: 'cancha'
      });

      // Equipo Local (Muchos a Uno)
      Partido.belongsTo(models.Equipo, {
        foreignKey: 'equipo_local',
        as: 'equipoLocal'
      });

      // Equipo Visitante (Muchos a Uno)
      Partido.belongsTo(models.Equipo, {
        foreignKey: 'equipo_visitante',
        as: 'equipoVisitante'
      });

      // Árbitro 1 (Muchos a Uno)
      Partido.belongsTo(models.Juez, {
        foreignKey: 'id_arbitro1',
        as: 'arbitro1'
      });

      // Árbitro 2 (Muchos a Uno)
      Partido.belongsTo(models.Juez, {
        foreignKey: 'id_arbitro2',
        as: 'arbitro2'
      });

      // Anotador (Muchos a Uno)
      Partido.belongsTo(models.Juez, {
        foreignKey: 'id_anotador',
        as: 'anotador'
      });

      // Cronometrista (Muchos a Uno)
      Partido.belongsTo(models.Juez, {
        foreignKey: 'id_cronometrista',
        as: 'cronometrista'
      });

      // Partido → Fase (Muchos a Uno)
      Partido.belongsTo(models.Fase, {
        foreignKey: 'id_fase',
        as: 'fase'
      });

      // Partido → Jornada (Muchos a Uno)
      Partido.belongsTo(models.Jornada, {
        foreignKey: 'id_jornada',
        as: 'jornada'
      });

      // Partido → Grupo (Muchos a Uno)
      Partido.belongsTo(models.Grupo, {
        foreignKey: 'id_grupo',
        as: 'grupo'
      });
    }

    // ===== GETTERS =====
    get estaProgramado() {
      return this.p_estado === 'programado';
    }

    get estaEnJuego() {
      return this.p_estado === 'en_juego';
    }

    get estaFinalizado() {
      return this.p_estado === 'finalizado';
    }

    get estaSuspendido() {
      return this.p_estado === 'suspendido';
    }

    get esWalkover() {
      return this.p_estado === 'wo';
    }

    get pEstadoTexto() {
      const estados = {
        'programado': 'Programado',
        'en_juego': 'En Juego',
        'finalizado': 'Finalizado',
        'suspendido': 'Suspendido',
        'wo': 'Walkover'
      };
      return estados[this.p_estado] || this.p_estado;
    }

    get nombrePartido() {
      if (this.equipoLocal && this.equipoVisitante) {
        return `${this.equipoLocal.nombre} vs ${this.equipoVisitante.nombre}`;
      }
      return 'Partido sin equipos';
    }

    get resultado() {
      if (this.resultado_local === null || this.resultado_visitante === null) {
        return null;
      }
      return `${this.resultado_local} - ${this.resultado_visitante}`;
    }

    get ganador() {
      if (!this.resultado_local || !this.resultado_visitante) return null;
      if (this.resultado_local > this.resultado_visitante) {
        return this.equipoLocal?.nombre || 'Local';
      }
      if (this.resultado_visitante > this.resultado_local) {
        return this.equipoVisitante?.nombre || 'Visitante';
      }
      return 'Empate';
    }

    get setsDiferencia() {
      if (this.resultado_local === null || this.resultado_visitante === null) {
        return null;
      }
      return Math.abs(this.resultado_local - this.resultado_visitante);
    }

    get equipoLocalGano() {
      return this.resultado_local > this.resultado_visitante;
    }

    get equipoVisitanteGano() {
      return this.resultado_visitante > this.resultado_local;
    }

    get estaCompleto() {
      return this.id_arbitro1 && this.id_arbitro2 && this.id_anotador && this.id_cronometrista;
    }

    get arbitrosAsignados() {
      return {
        arbitro1: this.arbitro1?.persona?.nombre || 'No asignado',
        arbitro2: this.arbitro2?.persona?.nombre || 'No asignado',
        anotador: this.anotador?.persona?.nombre || 'No asignado',
        cronometrista: this.cronometrista?.persona?.nombre || 'No asignado'
      };
    }

    get fechaFormato() {
      if (!this.fecha_hora) return 'Sin definir';
      const opciones = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(this.fecha_hora).toLocaleDateString('es-ES', opciones);
    }

    get diasFaltanParaPartido() {
      if (!this.fecha_hora) return null;
      const hoy = new Date();
      const partido = new Date(this.fecha_hora);
      const diff = partido - hoy;
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    get horasParaPartido() {
      if (!this.fecha_hora) return null;
      const hoy = new Date();
      const partido = new Date(this.fecha_hora);
      const diff = partido - hoy;
      return Math.floor(diff / (1000 * 60 * 60));
    }

    get resumen() {
      let res = `${this.nombrePartido} - ${this.fechaFormato}`;
      if (this.resultado) {
        res += ` [${this.resultado}]`;
      }
      res += ` (${this.pEstadoTexto})`;
      return res;
    }

    get detalleCompleto() {
      return {
        nombrePartido: this.nombrePartido,
        local: this.equipoLocal?.nombre,
        visitante: this.equipoVisitante?.nombre,
        resultado: this.resultado,
        ganador: this.ganador,
        fecha: this.fechaFormato,
        cancha: this.cancha?.nombre,
        grupo: this.grupo?.nombre,
        jornada: this.jornada?.nombre,
        fase: this.fase?.nombre,
        estado: this.pEstadoTexto,
        arbitros: this.arbitrosAsignados,
        observaciones: this.observaciones,
        acta: this.acta_url
      };
    }
  }

  Partido.init({
    id_partido: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID único del partido'
    },

    id_campeonato: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Campeonatos',
        key: 'id_campeonato'
      },
      validate: {
        notNull: {
          msg: 'El campeonato es requerido'
        }
      },
      comment: 'FK → Campeonatos'
    },

    id_cc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'CampeonatoCategorias',
        key: 'id_cc'
      },
      validate: {
        notNull: {
          msg: 'La categoría-campeonato es requerida'
        }
      },
      comment: 'FK → CampeonatoCategorias (categoría específica)'
    },

    id_cancha: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Canchas',
        key: 'id_cancha'
      },
      validate: {
        notNull: {
          msg: 'La cancha es requerida'
        }
      },
      comment: 'FK → Canchas (dónde se juega)'
    },

    equipo_local: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Equipos',
        key: 'id_equipo'
      },
      validate: {
        notNull: {
          msg: 'El equipo local es requerido'
        }
      },
      comment: 'FK → Equipos (equipo que juega de local)'
    },

    equipo_visitante: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Equipos',
        key: 'id_equipo'
      },
      validate: {
        notNull: {
          msg: 'El equipo visitante es requerido'
        }
      },
      comment: 'FK → Equipos (equipo que juega de visitante)'
    },

    // ===== 4 ÁRBITROS DE VOLEIBOL =====
    id_arbitro1: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Jueces',
        key: 'id_juez'
      },
      comment: 'FK → Jueces (Árbitro Principal o Árbitro 1)'
    },

    id_arbitro2: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Jueces',
        key: 'id_juez'
      },
      comment: 'FK → Jueces (Árbitro Segundo o Árbitro 2)'
    },

    id_anotador: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Jueces',
        key: 'id_juez'
      },
      comment: 'FK → Jueces (Anotador/Secretario)'
    },

    id_cronometrista: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Jueces',
        key: 'id_juez'
      },
      comment: 'FK → Jueces (Cronometrista)'
    },

    p_estado: {
      type: DataTypes.ENUM('programado', 'en_juego', 'finalizado', 'suspendido', 'wo'),
      allowNull: false,
      defaultValue: 'programado',
      validate: {
        isIn: {
          args: [['programado', 'en_juego', 'finalizado', 'suspendido', 'wo']],
          msg: 'El estado debe ser válido (wo = walkover)'
        }
      },
      comment: 'Estado del partido (wo = walkover/victoria por no presentación)'
    },

    resultado_local: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: 'El resultado no puede ser negativo'
        },
        max: {
          args: [3],
          msg: 'En voleibol máximo 3 sets'
        }
      },
      comment: 'Sets ganados por equipo local'
    },

    resultado_visitante: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: 'El resultado no puede ser negativo'
        },
        max: {
          args: [3],
          msg: 'En voleibol máximo 3 sets'
        }
      },
      comment: 'Sets ganados por equipo visitante'
    },

    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 2000],
          msg: 'Las observaciones no pueden exceder 2000 caracteres'
        }
      },
      comment: 'Notas sobre el partido'
    },

    acta_url: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'URL del acta del partido'
    },

    id_fase: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Fases',
        key: 'id_fase'
      },
      comment: 'FK → Fases (ej: grupos, cuartos, semis, final)'
    },

    id_jornada: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Jornadas',
        key: 'id_jornada'
      },
      comment: 'FK → Jornadas (qué jornada es)'
    },

    id_grupo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Grupos',
        key: 'id_grupo'
      },
      comment: 'FK → Grupos (en qué grupo)'
    },

    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'La fecha y hora debe ser válida'
        }
      },
      comment: 'Cuándo se juega el partido'
    },

    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      validate: {
        isIn: {
          args: [[true, false]],
          msg: 'El estado debe ser verdadero o falso'
        }
      },
      comment: 'Soft delete: true = activo, false = eliminado'
    },

    freg: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha de registro'
    }
  }, {
    sequelize,
    modelName: 'Partido',
    tableName: 'Partidos',
    timestamps: true
  });

  return Partido;
};