// models/mongodb/EstadisticasEquiposPartido.js
const mongoose = require('mongoose');

const estadisticasEquiposSchema = new mongoose.Schema({
  idpartido: {
    type: Number,
    required: true,
    index: true
  },

  equipo: {
    type: String,
    enum: ['local', 'visitante'],
    required: true
  },

  idequipo: {
    type: Number,
    required: true
  },

  nombre_equipo: String,

  // ESTADÍSTICAS GENERALES
  generales: {
    puntos_totales: { type: Number, default: 0 },
    sets_ganados: { type: Number, default: 0 },
    sets_perdidos: { type: Number, default: 0 },
    diferencia_puntos: { type: Number, default: 0 }
  },

  // ESTADÍSTICAS POR SET
  por_set: [{
    numero_set: Number,
    puntos: Number,
    ganado: Boolean,
    aces: Number,
    bloqueos: Number,
    errores: Number
  }],

  // ATAQUE
  ataque: {
    total_intentos: { type: Number, default: 0 },
    exitosos: { type: Number, default: 0 },
    bloqueados: { type: Number, default: 0 },
    errores: { type: Number, default: 0 },
    efectividad: { type: Number, default: 0 },
    puntos_ataque: { type: Number, default: 0 }
  },

  // SAQUE
  saque: {
    total_saques: { type: Number, default: 0 },
    aces: { type: Number, default: 0 },
    errores: { type: Number, default: 0 },
    efectividad: { type: Number, default: 0 }
  },

  // BLOQUEO
  bloqueo: {
    exitosos: { type: Number, default: 0 },
    toques: { type: Number, default: 0 },
    errores: { type: Number, default: 0 },
    puntos_bloqueo: { type: Number, default: 0 }
  },

  // RECEPCIÓN
  recepcion: {
    total_recepciones: { type: Number, default: 0 },
    perfectas: { type: Number, default: 0 },
    buenas: { type: Number, default: 0 },
    malas: { type: Number, default: 0 },
    errores: { type: Number, default: 0 },
    efectividad: { type: Number, default: 0 }
  },

  // DEFENSA
  defensa: {
    total_defensas: { type: Number, default: 0 },
    exitosas: { type: Number, default: 0 },
    errores: { type: Number, default: 0 },
    efectividad: { type: Number, default: 0 }
  },

  // ERRORES TOTALES
  errores: {
    saque: { type: Number, default: 0 },
    ataque: { type: Number, default: 0 },
    bloqueo: { type: Number, default: 0 },
    recepcion: { type: Number, default: 0 },
    posicion: { type: Number, default: 0 },
    red: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },

  // RECURSOS UTILIZADOS
  recursos_utilizados: {
    substituciones_por_set: {
      type: [Number],
      default: [0, 0, 0, 0, 0]  // [set1, set2, set3, set4, set5]
    },
    timeouts_por_set: {
      type: [Number],
      default: [0, 0, 0, 0, 0]
    },
    total_substituciones: { type: Number, default: 0 },
    total_timeouts: { type: Number, default: 0 }
  },

  // SANCIONES
  sanciones: {
    advertencias: { type: Number, default: 0 },
    penalties: { type: Number, default: 0 },
    expulsiones: { type: Number, default: 0 },
    descalificaciones: { type: Number, default: 0 }
  },

  // RALLYS
  rallys: {
    total: { type: Number, default: 0 },
    ganados: { type: Number, default: 0 },
    perdidos: { type: Number, default: 0 },
    promedio_duracion: { type: Number, default: 0 }
  },

  // RACHAS
  rachas: {
    mejor_racha_puntos: { type: Number, default: 0 },
    racha_actual: { type: Number, default: 0 }
  }

}, {
  timestamps: true,
  collection: 'estadisticas_equipos_partido'
});

estadisticasEquiposSchema.index({ idpartido: 1, equipo: 1 }, { unique: true });
estadisticasEquiposSchema.index({ idequipo: 1 });

// Método para calcular efectividades
estadisticasEquiposSchema.methods.calcularEfectividades = function() {
  // Ataque
  if (this.ataque.total_intentos > 0) {
    this.ataque.efectividad = ((this.ataque.exitosos / this.ataque.total_intentos) * 100).toFixed(2);
  }
  
  // Saque
  if (this.saque.total_saques > 0) {
    this.saque.efectividad = (((this.saque.total_saques - this.saque.errores) / this.saque.total_saques) * 100).toFixed(2);
  }
  
  // Recepción
  if (this.recepcion.total_recepciones > 0) {
    this.recepcion.efectividad = (((this.recepcion.perfectas + this.recepcion.buenas) / this.recepcion.total_recepciones) * 100).toFixed(2);
  }
  
  // Defensa
  if (this.defensa.total_defensas > 0) {
    this.defensa.efectividad = ((this.defensa.exitosas / this.defensa.total_defensas) * 100).toFixed(2);
  }

  // Calcular total de errores
  this.errores.total = this.errores.saque + this.errores.ataque + this.errores.bloqueo + 
                       this.errores.recepcion + this.errores.posicion + this.errores.red;
  
  return this.save();
};

module.exports = mongoose.model('EstadisticasEquiposPartido', estadisticasEquiposSchema);
