// models/mongodb/ConfiguracionPuntos.js
const mongoose = require('mongoose');

const configuracionPuntosSchema = new mongoose.Schema({
  idcampeonato: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  
  // SISTEMA DE PUNTOS POR RESULTADO
  puntos_victoria: {
    type: Number,
    default: 2,
    min: 0
  },
  puntos_derrota: {
    type: Number,
    default: 1,
    min: 0
  },
  puntos_wo_favor: {
    type: Number,
    default: 2,
    min: 0
  },
  puntos_wo_contra: {
    type: Number,
    default: 0
  },

  // CRITERIOS DE DESEMPATE (orden de prioridad)
  criterios_desempate: {
    type: [String],
    default: ['enfrentamiento_directo', 'diferencia_sets', 'diferencia_puntos', 'sets_favor', 'puntos_favor'],
    enum: [
      'enfrentamiento_directo',
      'diferencia_sets',
      'diferencia_puntos',
      'sets_favor',
      'sets_contra',
      'puntos_favor',
      'puntos_contra',
      'sorteo'
    ]
  },

  // ⭐ CONFIGURACIÓN DE SETS (CORREGIDO)
  configuracion_sets: {
    formato_partido: {
      type: String,
      enum: ['mejor_de_3', 'mejor_de_5'], // Al mejor de 2 o al mejor de 3
      default: 'mejor_de_5'
    },
    sets_maximos: {
      type: Number,
      enum: [3, 5], // 3 sets o 5 sets máximo
      default: 5
    },
    sets_para_ganar: {
      type: Number,
      enum: [2, 3], // 2 sets (de 3) o 3 sets (de 5)
      default: 3
    },
    puntos_set_normal: {
      type: Number,
      default: 25,
      min: 15
    },
    puntos_set_decisivo: {
      type: Number,
      default: 15,
      min: 10
    },
    diferencia_minima: {
      type: Number,
      default: 2,
      min: 1
    },
    limite_puntos: {
      type: Number,
      default: null // null = sin límite, o ej: 30 para limitar a 30 puntos máximo
    }
  },

  // SISTEMA DE PUNTUACIÓN (Rally Point vs Tradicional)
  sistema_puntuacion: {
    type: String,
    enum: ['rally_point', 'tradicional'],
    default: 'rally_point'
  },

  // LÍMITES Y REGLAS
  limites_partido: {
    max_jugadores_plantel: {
      type: Number,
      default: 14
    },
    max_substituciones_set: {
      type: Number,
      default: 6
    },
    max_timeouts_set: {
      type: Number,
      default: 2
    },
    duracion_timeout_segundos: {
      type: Number,
      default: 30
    },
    permite_libero: {
      type: Boolean,
      default: true
    },
    max_liberos: {
      type: Number,
      default: 2
    }
  },

  // BONIFICACIONES ESPECIALES (opcional)
  bonificaciones: {
    victoria_directa: { 
      type: Number, 
      default: 0,
      description: 'Puntos extra por ganar 2-0 (mejor de 3) o 3-0 (mejor de 5)'
    },
    victoria_ajustada: { 
      type: Number, 
      default: 0,
      description: 'Puntos por ganar 2-1 (mejor de 3) o 3-1/3-2 (mejor de 5)'
    },
    derrota_competitiva: { 
      type: Number, 
      default: 0,
      description: 'Punto por perder en set decisivo (1-2 o 2-3)'
    }
  },

  // CONTROL
  activo: {
    type: Boolean,
    default: true
  },
  modificado_por: {
    usuario_id: Number,
    timestamp: Date,
    nombre: String
  }
}, {
  timestamps: true,
  collection: 'configuracion_puntos'
});

// Validación personalizada
configuracionPuntosSchema.pre('save', function(next) {
  if (this.configuracion_sets.formato_partido === 'mejor_de_3') {
    this.configuracion_sets.sets_maximos = 3;
    this.configuracion_sets.sets_para_ganar = 2;
  } else if (this.configuracion_sets.formato_partido === 'mejor_de_5') {
    this.configuracion_sets.sets_maximos = 5;
    this.configuracion_sets.sets_para_ganar = 3;
  }
  next();
});

configuracionPuntosSchema.index({ idcampeonato: 1, activo: 1 });

module.exports = mongoose.model('ConfiguracionPuntos', configuracionPuntosSchema);
