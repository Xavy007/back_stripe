/**
 * @file app.js
 * @description Configuración central de la aplicación Express.
 *
 * Este módulo inicializa y exporta la instancia de Express con todos los
 * middlewares globales y el registro de rutas de la API REST. La separación
 * entre app.js y server.js sigue el patrón recomendado para facilitar las
 * pruebas de integración (importar app sin levantar el servidor TCP).
 *
 * Middlewares aplicados globalmente:
 *   - express.json / urlencoded con límite 50 MB (soporte para imágenes en base64).
 *   - cors: configurado mediante variable de entorno CORS_ORIGIN.
 *   - express.static: sirve archivos subidos (/uploads) y recursos públicos (/public).
 *   - Logger de peticiones: registra método y ruta de cada request entrante.
 *
 * Árbol de rutas de la API (prefijo base /api):
 *   - /auth                    → Autenticación JWT (login, registro).
 *   - /persona                 → Gestión de personas (datos personales).
 *   - /campeonato              → CRUD de campeonatos.
 *   - /campeonato-categoria    → Configuración por categoría dentro de un campeonato.
 *   - /categoria               → Catálogo de categorías deportivas.
 *   - /equipo                  → Gestión de equipos.
 *   - /inscripciones           → Inscripción de equipos a campeonatos.
 *   - /jugadores               → Gestión de jugadores.
 *   - /fixture                 → Generación y consulta del fixture.
 *   - /partidos / /partido-jueces → Partidos y asignación de árbitros.
 *   - /planilla                → Planillas digitales (MongoDB).
 *   - /reportes                → Reportes estadísticos (MongoDB).
 *   - (otros módulos de apoyo): cancha, club, juez, carnet, historial, etc.
 *
 * @module app
 */

require('dotenv').config({ silent: true });

const express = require('express');
const path    = require('path');
const cors    = require('cors');
const app     = express();

/* ═══════════════════════════════════════════════════════════════════
   Importación de rutas
   Cada módulo de rutas corresponde a un dominio del sistema.
═══════════════════════════════════════════════════════════════════ */

// ── Seguridad y acceso ──
const authRoutes         = require('./routes/auth');
const authMiddleware     = require('./middleware/authMiddleware');
const roleMiddleware     = require('./middleware/roleMiddleware');
const usuarioroutes      = require('./routes/usuario.routes');

// ── Personas y ubicación ──
const personaRoutes      = require('./routes/persona.routes');
const nacionalidadroute  = require('./routes/nacionalidadRoutes');
const departamentosroutes= require('./routes/departamento.routes');
const provinciaRoutes    = require('./routes/provincia.routes');

// ── Competencia: estructura organizativa ──
const campeonatoroutes          = require('./routes/campeonato.routes');
const gestionCampeonatoroutes   = require('./routes/gestionCampeonato.routes');
const campeonatoCategoriaroutes = require('./routes/campeonatoCategoria.routes');
const categoriasroutes          = require('./routes/categorias.routes');
const inscripcionesRoutes       = require('./routes/inscripciones.routes');
const grupoInscripcionesRoutes  = require('./routes/grupoInscripciones.routes');
const fasesRoutes               = require('./routes/fases.routes');
const gruposRoutes              = require('./routes/grupos.routes');

// ── Competencia: ejecución del campeonato ──
const fixtureRoutes               = require('./routes/fixture.routes');
const jornadasRoutes              = require('./routes/jornadas.routes');
const participacionesRoutes       = require('./routes/participaciones.routes');
const historialCampeonatosRoutes  = require('./routes/historialCampeonatos.routes');
const tablaPosicionesRoutes       = require('./routes/tablaPosiciones.routes');
const configuracionCampeonatoRoutes = require('./routes/configuracionCampeonato.routes');
const configuracionPuntosRoutes   = require('./routes/configuracionPuntos.routes');

// ── Partidos y árbitros ──
const partidoJuecesRoutes = require('./routes/partidoJueces.routes');
const jueceRoutes         = require('./routes/jueces.routes');

// ── Equipos y personas involucradas ──
const equipoRoutes    = require('./routes/equipos.routes');
const jugadoresRoutes = require('./routes/jugador.routes');
const eqTecnicoroutes = require('./routes/eqTecnico.routes');
const vinculoRoutes   = require('./routes/vinculo.routes');

// ── Clubes y usuarios ──
const clubroutes       = require('./routes/clubes.routes');
const clubUsuarioRoutes= require('./routes/clubUsuario.routes');

// ── Infraestructura ──
const canchasroutes = require('./routes/cancha.routes');
const carnetsRoutes = require('./routes/carnet.routes');

// ── MongoDB: planillas y reportes ──
const planillaDigitalRoutes = require('./routes/mongodb/planillaDigital.routes');
const reportesRoutes        = require('./routes/mongodb/reportes.routes');
const mongodbRoutes         = require('./routes/mongodb');

/* ═══════════════════════════════════════════════════════════════════
   Middlewares globales
═══════════════════════════════════════════════════════════════════ */

/**
 * Parseo de cuerpo de petición.
 * El límite de 50 MB soporta imágenes codificadas en base64 que se envían
 * desde el frontend en formularios de carnet y logos de equipo.
 */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

/**
 * Configuración CORS.
 * - En desarrollo: CORS_ORIGIN='*' permite cualquier origen.
 * - En producción: se especifica el dominio del frontend.
 * Se habilita también el manejo de preflight (OPTIONS) con app.options('*').
 */
const corsOptions = {
  origin: process.env.CORS_ORIGIN === '*' ? true : process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors()); // Responder a preflight OPTIONS en todas las rutas

/**
 * Archivos estáticos.
 * - /uploads → imágenes y documentos subidos por usuarios (fotos, carnets, logos).
 * - /public  → recursos estáticos del servidor (plantillas PDF, assets).
 */
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/public',  express.static(path.join(__dirname, 'public')));

/* ═══════════════════════════════════════════════════════════════════
   Rutas protegidas de prueba / administración
═══════════════════════════════════════════════════════════════════ */

/** Ruta de prueba de autenticación JWT. */
app.get('/api/protegido', authMiddleware, (req, res) => {
  res.json({ mensaje: 'Acceso autorizado', usuario: req.usuario });
});

/** Ruta exclusiva para administradores (requiere rol 'admin'). */
app.get('/api/admin', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  res.json({ mensaje: 'Área de admin' });
});

/* ═══════════════════════════════════════════════════════════════════
   Registro de rutas de la API REST
   Prefijo base: /api
═══════════════════════════════════════════════════════════════════ */

// ── MongoDB (planillas y reportes) ──
app.use('/api/mongodb',   mongodbRoutes);
app.use('/api/planilla',  planillaDigitalRoutes);
app.use('/api/reportes',  reportesRoutes);

// ── Autenticación y usuarios ──
app.use('/api/auth',     authRoutes);
app.use('/api/usuario',  usuarioroutes);

// ── Personas y ubicación ──
app.use('/api/persona',       personaRoutes);
app.use('/api/nacionalidad',  nacionalidadroute);
app.use('/api/departamentos', departamentosroutes);
app.use('/api/provincias',    provinciaRoutes);

// ── Estructura organizativa del campeonato ──
app.use('/api/campeonato',           campeonatoroutes);
app.use('/api/gestion',              gestionCampeonatoroutes);
app.use('/api/campeonato-categoria', campeonatoCategoriaroutes);
app.use('/api/categoria',            categoriasroutes);
app.use('/api/inscripciones',        inscripcionesRoutes);
app.use('/api/grupo-inscripciones',  grupoInscripcionesRoutes);
app.use('/api/fases',                fasesRoutes);
app.use('/api/grupos',               gruposRoutes);

// ── Ejecución del campeonato ──
app.use('/api/fixture',                   fixtureRoutes);
app.use('/api/jornadas',                  jornadasRoutes);
app.use('/api/participaciones',           participacionesRoutes);
app.use('/api/historial-campeonatos',     historialCampeonatosRoutes);
app.use('/api/tabla-posiciones',          tablaPosicionesRoutes);
app.use('/api/configuracion-campeonato',  configuracionCampeonatoRoutes);
app.use('/api/configuracion-puntos',      configuracionPuntosRoutes);

// ── Partidos y árbitros ──
app.use('/api/partido-jueces', partidoJuecesRoutes);
app.use('/api/jueces',         jueceRoutes);

// ── Equipos y personas ──
app.use('/api/equipo',     equipoRoutes);
app.use('/api/jugadores',  jugadoresRoutes);
app.use('/api/eqtecnicos', eqTecnicoroutes);
app.use('/api/eqtecnico',  eqTecnicoroutes); // Alias mantenido por compatibilidad
app.use('/api/vinculo',    vinculoRoutes);

// ── Clubes ──
app.use('/api/club',       clubroutes);
app.use('/api/clubusuario',clubUsuarioRoutes);

// ── Infraestructura ──
app.use('/api/cancha',   canchasroutes);
app.use('/api/carnets',  carnetsRoutes);

/* ═══════════════════════════════════════════════════════════════════
   Logger de peticiones
   Registra cada request entrante para facilitar el debugging.
   En producción se recomienda reemplazar por un logger dedicado (winston, morgan).
═══════════════════════════════════════════════════════════════════ */
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

module.exports = app;
