// models/mongodb/EstadisticasJugadoresPartido.js
const mongoose = require('mongoose');

const estadisticasJugadoresSchema = new mongoose.Schema({
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

  idjugador: {
    type: Number,
    required: true,
    index: true
  },

  idparticipacion: Number,
  
  dorsal: {
    type: Number,
    required: true
  },

  nombre_completo: String,
  posicion: String,

  // ESTADÍSTICAS DE ATAQUE
  ataque: {
    intentos: { type: Number, default: 0 },
    exitosos: { type: Number, default: 0 },
    bloqueados: { type: Number, default: 0 },
    errores: { type: Number, default: 0 },
    efectividad: { type: Number, default: 0 }, // % = (exitosos / intentos) * 100
    
    // Detalles por zona
    zona_4: { intentos: Number, exitosos: Number },
    zona_3: { intentos: Number, exitosos: Number },
    zona_2: { intentos: Number, exitosos: Number },
    zaguero: { intentos: Number, exitosos: Number }
  },

  // ESTADÍSTICAS DE SAQUE
  saque: {
    intentos: { type: Number, default: 0 },
    aces: { type: Number, default: 0 },
    errores: { type: Number, default: 0 },
    efectividad: { type: Number, default: 0 }, // % = (aces / intentos) * 100
    puntos_directos: { type: Number, default: 0 } // Aces
  },

  // ESTADÍSTICAS DE BLOQUEO
  bloqueo: {
    solos: { type: Number, default: 0 },        // Bloqueos individuales
    asistidos: { type: Number, default: 0 },    // Bloqueos dobles/triples
    total_puntos: { type: Number, default: 0 }, // solos + asistidos
    toques: { type: Number, default: 0 },       // Toques de bloqueo sin punto
    errores: { type: Number, default: 0 }       // Red, invasión
  },

  // ESTADÍSTICAS DE RECEPCIÓN
  recepcion: {
    intentos: { type: Number, default: 0 },
    perfectas: { type: Number, default: 0 },    // Pase perfecto (código 3)
    buenas: { type: Number, default: 0 },       // Pase jugable (código 2)
    malas: { type: Number, default: 0 },        // Pase difícil (código 1)
    errores: { type: Number, default: 0 },      // Error directo (código 0)
    efectividad: { type: Number, default: 0 }   // % perfectas + buenas
  },

  // ESTADÍSTICAS DE DEFENSA (DIG)
  defensa: {
    intentos: { type: Number, default: 0 },
    exitosas: { type: Number, default: 0 },
    errores: { type: Number, default: 0 },
    efectividad: { type: Number, default: 0 }
  },

  // ARMADO (para armadores/colocadores)
  armado: {
    sets_armados: { type: Number, default: 0 },
    asistencias: { type: Number, default: 0 },      // Sets que resultaron en punto
    errores: { type: Number, default: 0 },
    efectividad: { type: Number, default: 0 }       // % asistencias
  },

  // PUNTOS TOTALES ANOTADOS
  puntos_anotados: {
    type: Number,
    default: 0
  },

  // Desglose de puntos
  puntos_por_concepto: {
    ataque: { type: Number, default: 0 },
    bloqueo: { type: Number, default: 0 },
    saque: { type: Number, default: 0 }
  },

  // TIEMPO EN CANCHA
  tiempo_juego: {
    sets_jugados: [Number],                  // [1, 2, 3] si jugó sets 1, 2 y 3
    minutos_totales: { type: Number, default: 0 },
    rallys_jugados: { type: Number, default: 0 }
  },

  // SANCIONES RECIBIDAS
  sanciones: {
    advertencias: { type: Number, default: 0 },
    amarillas: { type: Number, default: 0 },
    rojas: { type: Number, default: 0 }
  },

  // ROTACIONES
  rotaciones: {
    veces_servidor: { type: Number, default: 0 },
    puntos_en_saque: { type: Number, default: 0 },  // Puntos mientras servía
    rotaciones_jugadas: { type: Number, default: 0 }
  },

  // MVP Y RECONOCIMIENTOS
  reconocimientos: {
    es_mvp: { type: Boolean, default: false },
    mejor_atacante: { type: Boolean, default: false },
    mejor_bloqueador: { type: Boolean, default: false },
    mejor_sacador: { type: Boolean, default: false },
    mejor_defensor: { type: Boolean, default: false }
  },

  // RATING CALCULADO (0-10)
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },

  ultima_actualizacion: {
    usuario_id: Number,
    timestamp: { type: Date, default: Date.now }
  }

}, {
  timestamps: true,
  collection: 'estadisticas_jugadores_partido'
});

// Índice único por partido y jugador
estadisticasJugadoresSchema.index({ idpartido: 1, idjugador: 1 }, { unique: true });
estadisticasJugadoresSchema.index({ idpartido: 1, equipo: 1 });
estadisticasJugadoresSchema.index({ puntos_anotados: -1 });
estadisticasJugadoresSchema.index({ 'reconocimientos.es_mvp': 1 });

// Método para calcular efectividades
estadisticasJugadoresSchema.methods.calcularEfectividades = function() {
  // Ataque
  if (this.ataque.intentos > 0) {
    this.ataque.efectividad = ((this.ataque.exitosos / this.ataque.intentos) * 100).toFixed(2);
  }
  
  // Saque
  if (this.saque.intentos > 0) {
    this.saque.efectividad = (((this.saque.intentos - this.saque.errores) / this.saque.intentos) * 100).toFixed(2);
  }
  
  // Recepción
  if (this.recepcion.intentos > 0) {
    this.recepcion.efectividad = (((this.recepcion.perfectas + this.recepcion.buenas) / this.recepcion.intentos) * 100).toFixed(2);
  }
  
  // Defensa
  if (this.defensa.intentos > 0) {
    this.defensa.efectividad = ((this.defensa.exitosas / this.defensa.intentos) * 100).toFixed(2);
  }
  
  // Armado
  if (this.armado.sets_armados > 0) {
    this.armado.efectividad = ((this.armado.asistencias / this.armado.sets_armados) * 100).toFixed(2);
  }
  
  return this.save();
};

module.exports = mongoose.model('EstadisticasJugadoresPartido', estadisticasJugadoresSchema);
