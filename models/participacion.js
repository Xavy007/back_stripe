'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Participacion extends Model {
    static associate(models) {
      // Participacion → Jugador (Muchos a Uno)
      Participacion.belongsTo(models.Jugador, {
        foreignKey: 'id_jugador',
        as: 'jugador'
      });

      // Participacion → Equipo (Muchos a Uno)
      Participacion.belongsTo(models.Equipo, {
        foreignKey: 'id_equipo',
        as: 'equipo'
      });

      // Participacion → Campeonato (Muchos a Uno)
      Participacion.belongsTo(models.Campeonato, {
        foreignKey: 'id_campeonato',
        as: 'campeonato'
      });

      // Participacion → Categoria (Muchos a Uno)
      Participacion.belongsTo(models.Categoria, {
        foreignKey: 'id_categoria',
        as: 'categoria'
      });

      // NOTA: No hay relación directa con CampeonatoCategoria porque id_cc no existe en la tabla
      // La relación se puede obtener mediante id_campeonato + id_categoria
    }

    // ===== GETTERS =====
    get estaActivo() {
      return this.estado === 'activo';
    }

    get estaSuspendido() {
      return this.estado === 'suspendido';
    }

    get estaDeBaja() {
      return this.estado === 'baja';
    }

    get estaVetado() {
      return this.estado === 'vetado';
    }

    get estadoTexto() {
      const estados = {
        'activo': 'Activo',
        'suspendido': 'Suspendido',
        'baja': 'Baja',
        'vetado': 'Vetado'
      };
      return estados[this.estado] || this.estado;
    }

    get posicionTexto() {
      const posiciones = {
        'Armador': 'Armador',
        'Opuesto': 'Opuesto',
        'Central': 'Central',
        'Libero': 'Líbero',
        'Punta': 'Punta',
        'Entrenador': 'Entrenador',
        'Otro': 'Otro'
      };
      return posiciones[this.posicion] || this.posicion || 'Sin definir';
    }

    get dorsalFormato() {
      return `#${this.dorsal}`;
    }

    get promedioPuntos() {
      if (this.cantidad_partidos === 0) return 0;
      return (this.cantidad_goles / this.cantidad_partidos).toFixed(2);
    }

    get tieneTarjetaRoja() {
      return this.cantidad_tarjetas_rojas > 0;
    }

    get esLibero() {
      return this.posicion === 'Libero';
    }

    get resumen() {
      if (this.jugador && this.equipo && this.categoria) {
        return `${this.jugador.persona?.nombre || 'Jugador'} - ${this.dorsalFormato} (${this.posicionTexto}) - ${this.equipo.nombre} (${this.categoria.nombre}) - ${this.estadoTexto}`;
      }
      return 'Participación sin datos';
    }

    get estadisticas() {
      return {
        dorsal: this.dorsal,
        posicion: this.posicionTexto,
        partidos: this.cantidad_partidos,
        goles: this.cantidad_goles,
        promedio: this.promedioPuntos,
        tarjetasAmarillas: this.cantidad_tarjetas_amarillas,
        tarjetasRojas: this.cantidad_tarjetas_rojas,
        estado: this.estadoTexto
      };
    }
  }

  Participacion.init({
    id_participacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID único de la participación'
    },

    id_jugador: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Jugadores',
        key: 'id_jugador'
      },
      validate: {
        notNull: {
          msg: 'El jugador es requerido'
        }
      },
      comment: 'FK → Jugadores (quién participa)'
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
      comment: 'FK → Equipos (en cuál equipo)'
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
      comment: 'FK → Campeonatos (en cuál campeonato)'
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
      comment: 'FK → Categorias (en cuál categoría)'
    },

    // NOTA: id_cc no existe en la base de datos
    // La relación campeonato-categoría se identifica con id_campeonato + id_categoria

    id_cc: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
      comment: 'Campo VIRTUAL - no se guarda en BD. Solo para compatibilidad con código legacy'
    },

    dorsal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: 'El dorsal debe ser al menos 1'
        },
        max: {
          args: [99],
          msg: 'El dorsal no puede exceder 99'
        }
      },
      comment: 'Número de camiseta (1-99)'
    },

    posicion: {
      type: DataTypes.ENUM('Armador', 'Opuesto', 'Central', 'Libero', 'Punta', 'Entrenador', 'Otro'),
      allowNull: true,
      validate: {
        isIn: {
          args: [['Armador', 'Opuesto', 'Central', 'Libero', 'Punta', 'Entrenador', 'Otro']],
          msg: 'La posición debe ser válida'
        }
      },
      comment: 'Posición que juega'
    },

    estado: {
      type: DataTypes.ENUM('activo', 'suspendido', 'baja', 'vetado'),
      allowNull: false,
      defaultValue: 'activo',
      validate: {
        isIn: {
          args: [['activo', 'suspendido', 'baja', 'vetado']],
          msg: 'El estado debe ser válido'
        }
      },
      comment: 'Estado: activo (puede jugar), suspendido (sanción), baja (se fue), vetado (prohibido)'
    },

    fecha_inscripcion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: {
          msg: 'La fecha debe ser válida'
        }
      },
      comment: 'Cuándo se registró en este equipo/categoría'
    },

    fecha_baja: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'La fecha debe ser válida'
        }
      },
      comment: 'Cuándo se retiró del equipo'
    },

    razon_baja: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: 'La razón no puede exceder 500 caracteres'
        }
      },
      comment: 'Motivo: lesión, retiro voluntario, sanción, cambio, etc'
    },

    cantidad_partidos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'La cantidad de partidos no puede ser negativa'
        }
      },
      comment: 'Partidos jugados EN ESTE EQUIPO/CATEGORÍA'
    },

    cantidad_goles: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'La cantidad de goles no puede ser negativa'
        }
      },
      comment: 'Puntos anotados EN ESTE EQUIPO/CATEGORÍA'
    },

    cantidad_tarjetas_amarillas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Las tarjetas amarillas no pueden ser negativas'
        }
      },
      comment: 'Tarjetas amarillas EN ESTE EQUIPO'
    },

    cantidad_tarjetas_rojas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Las tarjetas rojas no pueden ser negativas'
        }
      },
      comment: 'Tarjetas rojas EN ESTE EQUIPO'
    },

    freg: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha de registro en BD'
    }
  }, {
    sequelize,
    modelName: 'Participacion',
    tableName: 'Participaciones',
    timestamps: true
  });

  return Participacion;
};