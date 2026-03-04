// models/mongodb/SancionesPartido.js
const mongoose = require('mongoose');

const sancionesSchema = new mongoose.Schema({
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

  tipo_sancion: {
    type: String,
    required: true,
    enum: [
      'advertencia',           // Verbal, sin registro formal
      'penalty',               // Tarjeta amarilla (punto y saque para rival)
      'expulsion',             // Tarjeta roja (fuera del set)
      'descalificacion',       // Amarilla + Roja (fuera del partido)
      'penalty_acumulado'      // Segunda amarilla = roja
    ]
  },

  sancionado: {
    tipo_persona: {
      type: String,
      enum: ['jugador', 'tecnico', 'equipo'],
      required: true
    },
    dorsal: Number, // Si es jugador
    idjugador: Number,
    idpersona: Number, // Si es técnico
    nombre: String
  },

  motivo: {
    type: String,
    enum: [
      'conducta_grosera',
      'conducta_ofensiva',
      'agresion',
      'retraso_juego',
      'protesta_incorrecta',
      'falta_respeto',
      'salida_no_autorizada',
      'solicitud_ilegal',
      'otro'
    ],
    required: true
  },

  descripcion: String,

  consecuencia: {
    punto_rival: Boolean,
    saque_rival: Boolean,
    expulsado_set: Boolean,
    expulsado_partido: Boolean
  },

  marcador: {
    local: Number,
    visitante: Number
  },

  arbitro_sancionador: {
    idjuez: Number,
    nombre: String,
    tipo: {
      type: String,
      enum: ['primer_arbitro', 'segundo_arbitro']
    }
  },

  // Para tarjetas acumuladas
  es_tarjeta_acumulada: {
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
  collection: 'sanciones_partido'
});

sancionesSchema.index({ idpartido: 1, numero_set: 1 });
sancionesSchema.index({ equipo: 1, tipo_sancion: 1 });
sancionesSchema.index({ 'sancionado.idjugador': 1 });
sancionesSchema.index({ timestamp: 1 });

module.exports = mongoose.model('SancionesPartido', sancionesSchema);
