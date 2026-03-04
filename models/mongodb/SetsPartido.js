// models/mongodb/SetsPartido.js
const mongoose = require('mongoose');

const setsPartidoSchema = new mongoose.Schema({
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

  // ⭐ Indica si es set decisivo
  es_set_decisivo: {
    type: Boolean,
    default: false
  },

  puntos_local: {
    type: Number,
    required: true,
    default: 0
  },
  
  puntos_visitante: {
    type: Number,
    required: true,
    default: 0
  },

  ganador: {
    type: String,
    enum: ['local', 'visitante', null],
    default: null
  },

  duracion: {
    hora_inicio: Date,
    hora_fin: Date,
    duracion_minutos: Number
  },

  estado: {
    type: String,
    enum: ['no_iniciado', 'en_juego', 'finalizado'],
    default: 'no_iniciado'
  },

  // Referencia al equipo que recibió primero
  equipo_recibidor_inicial: {
    type: String,
    enum: ['local', 'visitante']
  },

  // ⭐ Puntos límite para este set
  puntos_necesarios_ganar: {
    type: Number,
    default: 25 // 25 para set normal, 15 para decisivo
  },

  // Puntos decisivos (>25 o >15)
  punto_match: Boolean,
  punto_set: Boolean

}, {
  timestamps: true,
  collection: 'sets_partido'
});

// ⭐ Hook para definir si es set decisivo
setsPartidoSchema.pre('save', async function() {
  // Obtener el partido
  const PartidoDigital = mongoose.model('PartidoDigital');
  const partido = await PartidoDigital.findOne({ idpartido: this.idpartido });

  if (partido) {
    const setsParaGanar = partido.configuracion.sets_para_ganar;
    const setsMaximos = partido.configuracion.sets_maximos;

    // Es set decisivo si es el último set posible
    this.es_set_decisivo = (this.numero_set === setsMaximos);

    // Definir puntos necesarios
    if (this.es_set_decisivo) {
      this.puntos_necesarios_ganar = partido.configuracion.puntos_set_decisivo;
    } else {
      this.puntos_necesarios_ganar = partido.configuracion.puntos_set_normal;
    }
  }
});

setsPartidoSchema.index({ idpartido: 1, numero_set: 1 }, { unique: true });

module.exports = mongoose.model('SetsPartido', setsPartidoSchema);
