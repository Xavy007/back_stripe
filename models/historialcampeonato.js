'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HistorialCampeonato extends Model {
    static associate(models) {
      // HistorialCampeonato → Campeonato (Muchos a Uno)
      HistorialCampeonato.belongsTo(models.Campeonato, {
        foreignKey: 'id_campeonato',
        as: 'campeonato'
      });

      // HistorialCampeonato → Categoria (Muchos a Uno)
      HistorialCampeonato.belongsTo(models.Categoria, {
        foreignKey: 'id_categoria',
        as: 'categoria'
      });

      // HistorialCampeonato → Equipo (Muchos a Uno)
      HistorialCampeonato.belongsTo(models.Equipo, {
        foreignKey: 'id_equipo',
        as: 'equipo'
      });
    }

    // ===== GETTERS =====
    get estaActivo() {
      return this.estado === true;
    }

    get posicionTexto() {
      const sufijo = (n) => {
        if (n === 1) return 'er';
        if (n === 2) return 'do';
        if (n === 3) return 'er';
        return 'to';
      };
      return `${this.posicion_final}${sufijo(this.posicion_final)} lugar`;
    }

    get esCampeón() {
      return this.posicion_final === 1;
    }

    get esSubcampeón() {
      return this.posicion_final === 2;
    }

    get esTercero() {
      return this.posicion_final === 3;
    }

    get esCuarto() {
      return this.posicion_final === 4;
    }

    get tuvoBuenDesempeño() {
      return this.posicion_final <= 3;
    }

    get logrosTexto() {
      if (this.esCampeón) return 'CAMPEÓN 🏆';
      if (this.esSubcampeón) return 'Subcampeón 🥈';
      if (this.esTercero) return 'Tercero 🥉';
      return this.posicionTexto;
    }

    get hasHistorial() {
      return this.descripcion !== null && this.descripcion !== undefined && this.descripcion.trim().length > 0;
    }

    get resumen() {
      if (this.equipo && this.categoria && this.campeonato) {
        return `${this.equipo.nombre} - ${this.posicionTexto} en ${this.campeonato.nombre} (${this.categoria.nombre}) - ${this.puntos}pts`;
      }
      return `${this.posicionTexto} - ${this.puntos} puntos`;
    }

    get fichaHistorica() {
      return {
        campeonato: this.campeonato?.nombre,
        categoria: this.categoria?.nombre,
        equipo: this.equipo?.nombre,
        posicion: this.posicionTexto,
        logro: this.logrosTexto,
        puntos: this.puntos,
        descripcion: this.descripcion,
        fecha: this.freg?.toLocaleDateString('es-ES')
      };
    }

    get detalleCompleto() {
      return {
        campeonato: this.campeonato?.nombre,
        categoria: this.categoria?.nombre,
        equipo: this.equipo?.nombre,
        posicionFinal: this.posicion_final,
        posicionTexto: this.posicionTexto,
        puntos: this.puntos,
        logro: this.logrosTexto,
        descripcion: this.descripcion,
        esActivo: this.estaActivo,
        fechaRegistro: this.freg?.toLocaleDateString('es-ES', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      };
    }

    get medallaEmoji() {
      if (this.esCampeón) return '🥇';
      if (this.esSubcampeón) return '🥈';
      if (this.esTercero) return '🥉';
      return '⭐';
    }
  }

  HistorialCampeonato.init({
    id_historial: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID único del historial'
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

    posicion_final: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: 'La posición debe ser al menos 1'
        }
      },
      comment: 'Posición final del equipo en el campeonato'
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
      comment: 'Puntos finales acumulados'
    },

    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: 'La descripción no puede exceder 1000 caracteres'
        }
      },
      comment: 'Notas adicionales sobre el desempeño'
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
    modelName: 'HistorialCampeonatos',
    tableName: 'HistorialCampeonatos',
    timestamps: true
  });

  return HistorialCampeonato;
};