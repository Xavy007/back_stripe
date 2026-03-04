// models/mongodb/TimeoutsPartido.js
const mongoose = require('mongoose');

const timeoutsSchema = new mongoose.Schema({
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

  numero_timeout: {
    type: Number,
    required: true,
    min: 1,
    max: 2 // Máximo 2 timeouts por set por equipo
  },

  equipo: {
    type: String,
    enum: ['local', 'visitante'],
    required: true
  },

  timestamp_inicio: {
    type: Date,
    default: Date.now,
    index: true
  },

  timestamp_fin: Date,

  duracion_segundos: {
    type: Number,
    default: 30,
    max: 60
  },

  marcador: {
    local: Number,
    visitante: Number
  },

  solicitado_por: {
    tipo: {
      type: String,
      enum: ['dt', 'capitan', 'arbitro']
    },
    nombre: String,
    idpersona: Number
  },

  // Timeouts técnicos automáticos (en algunos torneos a los 8 y 16 puntos)
  es_timeout_tecnico: {
    type: Boolean,
    default: false
  },

  registrado_por: {
    usuario_id: Number,
    usuario_nombre: String,
    timestamp: { type: Date, default: Date.now }
  }

}, {
  timestamps: true,
  collection: 'timeouts_partido'
});

timeoutsSchema.index({ idpartido: 1, numero_set: 1, equipo: 1 });
timeoutsSchema.index({ timestamp_inicio: 1 });

module.exports = mongoose.model('TimeoutsPartido', timeoutsSchema);
