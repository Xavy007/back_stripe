// models/mongodb/SubstitucionesPartido.js
const mongoose = require('mongoose');

const substitucionesSchema = new mongoose.Schema({
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

  numero_sustitucion: {
    type: Number,
    required: true,
    min: 1,
    max: 6 // Máximo 6 sustituciones por set por equipo
  },

  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },

  equipo: {
    type: String,
    enum: ['local', 'visitante'],
    required: true
  },

  jugador_sale: {
    dorsal: { type: Number, required: true },
    idjugador: Number,
    nombre: String,
    posicion_en_cancha: String // 'I', 'II', 'III', 'IV', 'V', 'VI' o 'fuera'
  },

  jugador_entra: {
    dorsal: { type: Number, required: true },
    idjugador: Number,
    nombre: String,
    posicion_que_ocupa: String // 'I', 'II', 'III', 'IV', 'V', 'VI'
  },

  tipo_sustitucion: {
    type: String,
    enum: ['regular', 'libero', 'excepcional', 'por_lesion'],
    default: 'regular'
  },

  marcador: {
    local: Number,
    visitante: Number
  },

  // Control de sustituciones (máximo 6 por set)
  es_reversible: {
    type: Boolean,
    default: true
  }, // Si puede volver a entrar el jugador que salió

  // Sustitución libero no cuenta en el límite de 6
  cuenta_en_limite: {
    type: Boolean,
    default: true
  },

  registrado_por: {
    usuario_id: Number,
    usuario_nombre: String,
    timestamp: { type: Date, default: Date.now }
  }

}, {
  timestamps: true,
  collection: 'substituciones_partido'
});

substitucionesSchema.index({ idpartido: 1, numero_set: 1 });
substitucionesSchema.index({ idpartido: 1, equipo: 1 });
substitucionesSchema.index({ timestamp: 1 });

module.exports = mongoose.model('SubstitucionesPartido', substitucionesSchema);
