'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TablaPosicion extends Model {
    static associate(models) {
      // TablaPosicion → Campeonato (Muchos a Uno)
      TablaPosicion.belongsTo(models.Campeonato, {
        foreignKey: 'id_campeonato',
        as: 'campeonato'
      });

      // TablaPosicion → Categoria (Muchos a Uno)
      TablaPosicion.belongsTo(models.Categoria, {
        foreignKey: 'id_categoria',
        as: 'categoria'
      });

      // TablaPosicion → Equipo (Muchos a Uno)
      TablaPosicion.belongsTo(models.Equipo, {
        foreignKey: 'id_equipo',
        as: 'equipo'
      });
    }

    // ===== GETTERS =====
    get estaActiva() {
      return this.estado === true;
    }

    get posicionTexto() {
      const sufijo = (n) => {
        if (n === 1) return 'er';
        if (n === 2) return 'do';
        if (n === 3) return 'er';
        return 'to';
      };
      return `${this.posicion}${sufijo(this.posicion)} lugar`;
    }

    get promedioPuntosPartido() {
      if (this.partidos_jugados === 0) return 0;
      return (this.puntos / this.partidos_jugados).toFixed(2);
    }

    get porcentajeVictorias() {
      if (this.partidos_jugados === 0) return 0;
      const victorias = this.ganados + this.wo;
      return ((victorias / this.partidos_jugados) * 100).toFixed(2);
    }

    get diferenciaSetsTexto() {
      const signo = this.diferencia_sets >= 0 ? '+' : '';
      return `${signo}${this.diferencia_sets}`;
    }

    get diferenciaPuntosTexto() {
      const signo = this.diferencia_puntos >= 0 ? '+' : '';
      return `${signo}${this.diferencia_puntos}`;
    }

    get promedioPuntosPorSet() {
      const setsJugados = this.sets_ganados + this.sets_perdidos;
      if (setsJugados === 0) return 0;
      return (this.puntos_favor / setsJugados).toFixed(2);
    }

    get tieneSetsGanados() {
      return this.sets_ganados > 0;
    }

    get esLider() {
      return this.posicion === 1;
    }

    get esPrimeroDelGrupo() {
      return this.posicion === 1;
    }

    get esSegundo() {
      return this.posicion === 2;
    }

    get esTercero() {
      return this.posicion === 3;
    }

    get esCuarto() {
      return this.posicion === 4;
    }

    get esCuantoPuestoArriba() {
      // Útil para mostrar "4 puestos arriba del descenso" o similar
      return this.posicion;
    }

    get registroCompleto() {
      return `${this.ganados}G-${this.perdidos}P-${this.wo}WO`;
    }

    get setsRegistro() {
      return `${this.sets_ganados}-${this.sets_perdidos}`;
    }

    get puntosRegistro() {
      return `${this.puntos_favor}-${this.puntos_contra}`;
    }

    get resumen() {
      if (this.equipo && this.categoria) {
        return `${this.posicionTexto} - ${this.equipo.nombre} (${this.categoria.nombre}) - ${this.puntos}pts`;
      }
      return `${this.posicionTexto} - ${this.puntos} puntos`;
    }

    get detalleCompleto() {
      return {
        posicion: this.posicion,
        equipo: this.equipo?.nombre,
        categoria: this.categoria?.nombre,
        campeonato: this.campeonato?.nombre,
        puntos: this.puntos,
        partidos: this.partidos_jugados,
        ganados: this.ganados,
        perdidos: this.perdidos,
        wo: this.wo,
        registro: this.registroCompleto,
        setsGanados: this.sets_ganados,
        setsPerdidos: this.sets_perdidos,
        registroSets: this.setsRegistro,
        diferenciaSets: this.diferenciaSetsTexto,
        puntosAFavor: this.puntos_favor,
        puntosEnContra: this.puntos_contra,
        registroPuntos: this.puntosRegistro,
        diferenciaPuntos: this.diferenciaPuntosTexto,
        promedioPuntos: this.promedioPuntosPartido,
        porcentajeVictorias: this.porcentajeVictorias
      };
    }
  }

  TablaPosicion.init({
    id_tabla: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID único de la posición'
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

    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categorias',
        key: 'id_categoria'
      },
      validate: {
        notNull: {
          msg: 'La categoría es requerida'
        }
      },
      comment: 'FK → Categorias'
    },

    id_equipo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Equipos',
        key: 'id_equipo'
      },
      validate: {
        notNull: {
          msg: 'El equipo es requerido'
        }
      },
      comment: 'FK → Equipos'
    },

    posicion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: 'La posición debe ser al menos 1'
        }
      },
      comment: 'Posición en la tabla (1, 2, 3...)'
    },

    puntos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Los puntos no pueden ser negativos'
        }
      },
      comment: 'Puntos acumulados en la tabla'
    },

    partidos_jugados: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Los partidos no pueden ser negativos'
        }
      },
      comment: 'Partidos jugados'
    },

    ganados: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Los partidos ganados no pueden ser negativos'
        }
      },
      comment: 'Partidos ganados'
    },

    perdidos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Los partidos perdidos no pueden ser negativos'
        }
      },
      comment: 'Partidos perdidos'
    },

    wo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Los walkover no pueden ser negativos'
        }
      },
      comment: 'Walkover (victorias por no presentación)'
    },

    sets_ganados: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Los sets ganados no pueden ser negativos'
        }
      },
      comment: 'Sets ganados'
    },

    sets_perdidos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Los sets perdidos no pueden ser negativos'
        }
      },
      comment: 'Sets perdidos'
    },

    diferencia_sets: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Diferencia de sets (sets_ganados - sets_perdidos)'
    },

    puntos_favor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Los puntos a favor no pueden ser negativos'
        }
      },
      comment: 'Puntos a favor en los sets'
    },

    puntos_contra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Los puntos en contra no pueden ser negativos'
        }
      },
      comment: 'Puntos en contra en los sets'
    },

    diferencia_puntos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Diferencia de puntos (puntos_favor - puntos_contra)'
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
    modelName: 'TablaPosiciones',
    tableName: 'TablaPosiciones',
    timestamps: true
  });

  return TablaPosicion;
};