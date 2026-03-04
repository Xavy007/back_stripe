// models/mongodb/FormacionesSets.js
const mongoose = require('mongoose');

const formacionesSchema = new mongoose.Schema({
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

  // ⭐ TIMESTAMP para tiempo real
  timestamp_registro: {
    type: Date,
    default: Date.now,
    index: true
  },

  // FORMACIÓN EQUIPO LOCAL
  formacion_local: {
    servidor_inicial: { type: Number, required: true }, // Número de dorsal
    libero_activo: Number,
    
    // Posiciones en cancha (I-VI según reglamento FIVB)
    posicion_I: { type: Number, required: true },   // Zaguero derecho (servidor)
    posicion_II: { type: Number, required: true },  // Delantero derecho
    posicion_III: { type: Number, required: true }, // Delantero centro
    posicion_IV: { type: Number, required: true },  // Delantero izquierdo
    posicion_V: { type: Number, required: true },   // Zaguero izquierdo
    posicion_VI: { type: Number, required: true },  // Zaguero centro
    
    // Orden de rotación (para control)
    orden_rotacion: {
      type: [Number],
      validate: {
        validator: function(v) {
          return v.length === 6;
        },
        message: 'Orden de rotación debe tener 6 jugadores'
      }
    }
  },

  // FORMACIÓN EQUIPO VISITANTE
  formacion_visitante: {
    servidor_inicial: { type: Number, required: true },
    libero_activo: Number,
    
    posicion_I: { type: Number, required: true },
    posicion_II: { type: Number, required: true },
    posicion_III: { type: Number, required: true },
    posicion_IV: { type: Number, required: true },
    posicion_V: { type: Number, required: true },
    posicion_VI: { type: Number, required: true },
    
    orden_rotacion: {
      type: [Number],
      validate: {
        validator: function(v) {
          return v.length === 6;
        },
        message: 'Orden de rotación debe tener 6 jugadores'
      }
    }
  },

  // Equipo que recibe primero en este set
  equipo_recibidor: {
    type: String,
    enum: ['local', 'visitante'],
    required: true
  },

  // ⭐ ESTADO de la formación (para tiempo real)
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'en_juego'],
    default: 'pendiente'
  },

  // ⭐ Confirmación de entrenadores
  confirmaciones: {
    local: {
      confirmado: { type: Boolean, default: false },
      timestamp: Date,
      usuario_id: Number
    },
    visitante: {
      confirmado: { type: Boolean, default: false },
      timestamp: Date,
      usuario_id: Number
    }
  },

  registrado_por: {
    usuario_id: Number,
    timestamp: { type: Date, default: Date.now }
  }

}, {
  timestamps: true,
  collection: 'formaciones_sets'
});

formacionesSchema.index({ idpartido: 1, numero_set: 1 }, { unique: true });
// ⭐ Índice para tiempo real
formacionesSchema.index({ idpartido: 1, estado: 1 });
formacionesSchema.index({ timestamp_registro: 1 });

module.exports = mongoose.model('FormacionesSets', formacionesSchema);
