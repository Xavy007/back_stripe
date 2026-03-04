// models/mongodb/EventosPartido.js
const mongoose = require('mongoose');

const eventosPartidoSchema = new mongoose.Schema({
  idpartido: {
    type: Number,
    required: true,
    index: true
  },

  numero_set: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  secuencia: {
    type: Number,
    required: true,
    index: true
  },

  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },

  tipo_evento: {
    type: String,
    required: true,
    enum: [
      'inicio_partido',
      'inicio_set',
      'punto',
      'rotacion',
      'timeout',
      'sustitucion',
      'sancion',
      'cambio_libero',
      'fin_set',
      'fin_partido',
      'revision_video',
      'lesion',
      'protesta',
      'calentamiento'
    ]
  },

  // DATOS DEL PUNTO (si tipo_evento === 'punto')
  punto: {
    equipo_saca: {
      type: String,
      enum: ['local', 'visitante']
    },
    jugador_saca: Number, // Dorsal
    
    resultado: {
      equipo_anota: {
        type: String,
        enum: ['local', 'visitante']
      },
      tipo_punto: {
        type: String,
        enum: [
          'ace',                    // Saque directo
          'ataque_exitoso',         // Remate ganador
          'bloqueo_exitoso',        // Bloqueo punto
          'error_ataque_rival',     // Error en ataque del rival
          'error_saque_rival',      // Error en saque del rival
          'error_recepcion_rival',  // Error en recepción del rival
          'error_bloqueo_rival',    // Toque de red/invasión en bloqueo
          'error_red',              // Toque de red
          'error_pase',             // Doble/levantada/4 toques
          'balon_fuera',            // Balón fuera sin toque
          'invasion',               // Invasión de campo
          'posicion_incorrecta',    // Falta de rotación
          'penalty'                 // Sanción
        ]
      },
      jugador_anota: Number, // Dorsal del jugador que anota (si aplica)
      jugador_asiste: Number, // Dorsal del armador (si aplica)
      zona_ataque: {
        type: String,
        enum: ['1', '2', '3', '4', '5', '6', 'zaguero', null]
      },
      zona_defensa: {
        type: String,
        enum: ['1', '2', '3', '4', '5', '6', null]
      },
      tipo_ataque: {
        type: String,
        enum: ['remate', 'finta', 'toque_dedos', 'bloqueo', null]
      },
      detalle: String // Descripción adicional
    }
  },

  // MARCADOR DESPUÉS DEL EVENTO
  marcador: {
    local: { type: Number, default: 0 },
    visitante: { type: Number, default: 0 }
  },

  // ROTACIÓN ACTUAL (después del evento)
  rotacion_actual: {
    local: {
      pos_I: Number,
      pos_II: Number,
      pos_III: Number,
      pos_IV: Number,
      pos_V: Number,
      pos_VI: Number,
      libero_activo: Number
    },
    visitante: {
      pos_I: Number,
      pos_II: Number,
      pos_III: Number,
      pos_IV: Number,
      pos_V: Number,
      pos_VI: Number,
      libero_activo: Number
    }
  },

  // DATOS ESPECÍFICOS POR TIPO DE EVENTO
  datos_evento: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // Para eventos especiales
  es_punto_decisivo: Boolean,      // Punto de set o match
  es_rally_largo: Boolean,          // Rally > 20 toques
  duracion_rally_segundos: Number,

  registrado_por: {
    usuario_id: Number,
    usuario_nombre: String,
    rol: String,
    timestamp: { type: Date, default: Date.now }
  }

}, {
  timestamps: true,
  collection: 'eventos_partido'
});

// Índices compuestos para consultas rápidas
eventosPartidoSchema.index({ idpartido: 1, numero_set: 1, secuencia: 1 }, { unique: true });
eventosPartidoSchema.index({ idpartido: 1, timestamp: 1 });
eventosPartidoSchema.index({ tipo_evento: 1 });
eventosPartidoSchema.index({ 'punto.resultado.equipo_anota': 1 });

// TTL index: eliminar eventos después de 30 días (opcional)
eventosPartidoSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model('EventosPartido', eventosPartidoSchema);
