// models/mongodb/PartidoDigital.js
const mongoose = require('mongoose');

const partidoDigitalSchema = new mongoose.Schema({
  // REFERENCIA A POSTGRESQL
  idpartido: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },

  // INFORMACIÓN GENERAL
  info_general: {
    idcampeonato: Number,
    idcategoria: Number,
    idfase: Number,
    idjornada: Number,
    idcancha: Number,
    fecha_programada: Date,
    hora_inicio_programada: Date,
    hora_inicio_real: Date,
    hora_finalizacion: Date,
    duracion_total_minutos: Number,
    numero_partido: String,
    tipo_partido: {
      type: String,
      enum: ['oficial', 'amistoso', 'playoff', 'final']
    }
  },

  // EQUIPOS PARTICIPANTES
  equipos: {
    local: {
      idequipo: { type: Number, required: true },
      idinscripcion: Number,
      nombre: String,
      club: String,
      uniforme_principal: {
        color_camiseta: String,
        color_short: String,
        color_medias: String
      },
      uniforme_alternativo: {
        color_camiseta: String,
        color_short: String,
        color_medias: String
      },
      uniforme_usado: {
        type: String,
        enum: ['principal', 'alternativo']
      }
    },
    visitante: {
      idequipo: { type: Number, required: true },
      idinscripcion: Number,
      nombre: String,
      club: String,
      uniforme_principal: {
        color_camiseta: String,
        color_short: String,
        color_medias: String
      },
      uniforme_alternativo: {
        color_camiseta: String,
        color_short: String,
        color_medias: String
      },
      uniforme_usado: {
        type: String,
        enum: ['principal', 'alternativo']
      }
    }
  },

  // PLANTELES (hasta 14 jugadores)
  planteles: {
    local: {
      jugadores: [{
        idparticipacion: Number,
        idjugador: Number,
        numero_dorsal: { type: Number, required: true, min: 1, max: 99 },
        nombre_completo: String,
        posicion: {
          type: String,
          enum: ['Armador', 'Opuesto', 'Central', 'Libero', 'Punta', 'Universal']
        },
        es_capitan: { type: Boolean, default: false },
        es_libero: { type: Boolean, default: false },
        participa: { type: Boolean, default: true },
        motivo_no_participa: String
      }],
      cuerpo_tecnico: [{
        ideqtecnico: Number,
        idpersona: Number,
        nombre_completo: String,
        rol: {
          type: String,
          enum: ['DT', 'EA', 'AC', 'M', 'F']
        },
        participa: { type: Boolean, default: true }
      }]
    },
    visitante: {
      jugadores: [{
        idparticipacion: Number,
        idjugador: Number,
        numero_dorsal: { type: Number, required: true, min: 1, max: 99 },
        nombre_completo: String,
        posicion: {
          type: String,
          enum: ['Armador', 'Opuesto', 'Central', 'Libero', 'Punta', 'Universal']
        },
        es_capitan: { type: Boolean, default: false },
        es_libero: { type: Boolean, default: false },
        participa: { type: Boolean, default: true },
        motivo_no_participa: String
      }],
      cuerpo_tecnico: [{
        ideqtecnico: Number,
        idpersona: Number,
        nombre_completo: String,
        rol: {
          type: String,
          enum: ['DT', 'EA', 'AC', 'M', 'F']
        },
        participa: { type: Boolean, default: true }
      }]
    }
  },

  // CUERPO ARBITRAL
  arbitraje: {
    primer_arbitro: {
      idjuez: Number,
      nombre_completo: String,
      grado: String,
      firma_digital: String,
      timestamp_firma: Date
    },
    segundo_arbitro: {
      idjuez: Number,
      nombre_completo: String,
      grado: String,
      firma_digital: String,
      timestamp_firma: Date
    },
    anotador: {
      nombre: String,
      firma_digital: String,
      timestamp_firma: Date
    },
    cronometrista: {
      nombre: String
    },
    jueces_linea: [{
      nombre: String,
      posicion: { type: Number, min: 1, max: 4 }
    }]
  },

  // ⭐ CONFIGURACIÓN DEL PARTIDO (CORREGIDO)
  configuracion: {
    formato_partido: {
      type: String,
      enum: ['mejor_de_3', 'mejor_de_5'],
      required: true,
      default: 'mejor_de_5'
    },
    sets_maximos: {
      type: Number,
      enum: [3, 5],
      required: true
    },
    sets_para_ganar: {
      type: Number,
      enum: [2, 3],
      required: true
    },
    sistema_puntuacion: {
      type: String,
      enum: ['rally_point', 'tradicional'],
      default: 'rally_point'
    },
    puntos_set_normal: { type: Number, default: 25 },
    puntos_set_decisivo: { type: Number, default: 15 },
    diferencia_minima: { type: Number, default: 2 }
  },

  // ESTADO DEL PARTIDO
  estado_partido: {
    tipo: {
      type: String,
      enum: ['no_iniciado', 'en_calentamiento', 'en_juego', 'timeout', 'entre_sets', 'finalizado', 'suspendido', 'wo'],
      default: 'no_iniciado'
    },
    set_actual: { 
      type: Number, 
      default: 0,
      min: 0,
      max: 5 
    },
    equipo_saca: {
      type: String,
      enum: ['local', 'visitante', null]
    },
    ganador: {
      type: String,
      enum: ['local', 'visitante', null]
    },
    motivo_finalizacion: {
      type: String,
      enum: ['normal', 'wo', 'descalificacion', 'suspension']
    }
  },

  // RESULTADO GENERAL
  resultado: {
    sets_local: { type: Number, default: 0, min: 0, max: 3 },
    sets_visitante: { type: Number, default: 0, min: 0, max: 3 },
    puntos_totales_local: { type: Number, default: 0 },
    puntos_totales_visitante: { type: Number, default: 0 }
  },

  // APROBACIONES Y FIRMAS
  aprobaciones: {
    capitan_local: {
      idjugador: Number,
      nombre: String,
      firma_digital: String,
      timestamp: Date,
      conforme: Boolean,
      observaciones: String
    },
    capitan_visitante: {
      idjugador: Number,
      nombre: String,
      firma_digital: String,
      timestamp: Date,
      conforme: Boolean,
      observaciones: String
    },
    dt_local: {
      idpersona: Number,
      nombre: String,
      firma_digital: String,
      timestamp: Date
    },
    dt_visitante: {
      idpersona: Number,
      nombre: String,
      firma_digital: String,
      timestamp: Date
    },
    planilla_cerrada: { type: Boolean, default: false },
    fecha_cierre: Date,
    cerrada_por: {
      usuario_id: Number,
      nombre: String
    }
  },

  // OBSERVACIONES GENERALES
  observaciones: {
    protestas: [{
      timestamp: Date,
      equipo: String,
      descripcion: String,
      resolucion: String
    }],
    comentarios_arbitro: String,
    comentarios_anotador: String,
    incidencias: [String]
  },

  // CONTROL DE VERSIONES
  version: { type: Number, default: 1 },
  ultima_sincronizacion: Date,
  sincronizado_postgresql: { type: Boolean, default: false },
  
  modificaciones: [{
    usuario_id: Number,
    usuario_nombre: String,
    timestamp: { type: Date, default: Date.now },
    accion: String,
    datos: mongoose.Schema.Types.Mixed
  }]

}, {
  timestamps: true,
  collection: 'partidos_digitales'
});

// ⭐ Validación antes de guardar
partidoDigitalSchema.pre('save', async function() {
  // Sincronizar configuración
  if (this.configuracion.formato_partido === 'mejor_de_3') {
    this.configuracion.sets_maximos = 3;
    this.configuracion.sets_para_ganar = 2;
  } else if (this.configuracion.formato_partido === 'mejor_de_5') {
    this.configuracion.sets_maximos = 5;
    this.configuracion.sets_para_ganar = 3;
  }

  // Validar que el resultado sea lógico
  const setsLocal = this.resultado.sets_local;
  const setsVisitante = this.resultado.sets_visitante;
  const setsParaGanar = this.configuracion.sets_para_ganar;

  if (setsLocal >= setsParaGanar) {
    this.estado_partido.ganador = 'local';
    this.estado_partido.tipo = 'finalizado';
  } else if (setsVisitante >= setsParaGanar) {
    this.estado_partido.ganador = 'visitante';
    this.estado_partido.tipo = 'finalizado';
  }
});

// Índices para optimización
partidoDigitalSchema.index({ idpartido: 1 });
partidoDigitalSchema.index({ 'info_general.idcampeonato': 1 });
partidoDigitalSchema.index({ 'estado_partido.tipo': 1 });
partidoDigitalSchema.index({ 'info_general.fecha_programada': 1 });

module.exports = mongoose.model('PartidoDigital', partidoDigitalSchema);
