require('dotenv').config({ silent: true });

const express = require('express');
const path= require('path');
const app = express();

const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');
const personaRoutes = require('./routes/persona.routes');
const nacionalidadroute=require('./routes/nacionalidadRoutes');
const canchasroutes=require('./routes/cancha.routes');
const categoriasroutes= require('./routes/categorias.routes');
const clubroutes=require('./routes/clubes.routes');
const campeonatoroutes=require('./routes/campeonato.routes');
const gestionCampeonatoroutes=require('./routes/gestionCampeonato.routes')
const equipoRoutes= require('./routes/equipos.routes')
const campeonatoCategoriaroutes=require('./routes/campeonatoCategoria.routes');
const usuarioroutes=require('./routes/usuario.routes');
const vinculoRoutes= require('./routes/vinculo.routes');
const jugadoresRoutes= require('./routes/jugador.routes');
const eqTecnicoroutes= require('./routes/eqTecnico.routes');
const departamentosroutes=require('./routes/departamento.routes');
const provinciaRoutes = require('./routes/provincia.routes');
const carnetsRoutes= require('./routes/carnet.routes')
const clubUsuarioRoutes= require('./routes/clubUsuario.routes')
const jueceRoutes= require('./routes/jueces.routes')
const eqtecnico=require('./routes/eqTecnico.routes')
const fasesRoutes = require('./routes/fases.routes');
const gruposRoutes = require('./routes/grupos.routes');
const inscripcionesRoutes = require('./routes/inscripciones.routes');
const grupoInscripcionesRoutes = require('./routes/grupoInscripciones.routes');
const jornadasRoutes = require('./routes/jornadas.routes');
const participacionesRoutes = require('./routes/participaciones.routes');
const partidoJuecesRoutes = require('./routes/partidoJueces.routes');
const historialCampeonatosRoutes = require('./routes/historialCampeonatos.routes');
const tablaPosicionesRoutes = require('./routes/tablaPosiciones.routes');
const configuracionCampeonatoRoutes = require('./routes/configuracionCampeonato.routes');
const configuracionPuntosRoutes = require('./routes/configuracionPuntos.routes');
const fixtureRoutes = require('./routes/fixture.routes');
const planillaDigitalRoutes = require('./routes/mongodb/planillaDigital.routes');
const reportesRoutes = require('./routes/mongodb/reportes.routes');
const cors = require('cors');

// Aumentar límite de tamaño para JSON y URL-encoded (para archivos en base64 si se usan)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configuración de CORS según .env o permitir todo en desarrollo
const corsOptions = {
  origin: process.env.CORS_ORIGIN === '*' ? true : process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

app.options('*', cors());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/api/protegido', authMiddleware, (req, res) => {
  res.json({ mensaje: 'Acceso autorizado', usuario: req.usuario });
});

const mongodbRoutes = require('./routes/mongodb');
app.use('/api/mongodb', mongodbRoutes);

app.get('/api/admin', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  res.json({ mensaje: 'Área de admin' });
});


app.use('/api/auth', authRoutes);
app.use('/api/persona', personaRoutes);
app.use('/api/nacionalidad',nacionalidadroute);
app.use('/api/cancha',canchasroutes);
app.use('/api/categoria',categoriasroutes);
app.use('/api/club',clubroutes);
app.use('/api/campeonato',campeonatoroutes);
app.use('/api/gestion',gestionCampeonatoroutes);
app.use('/api/equipo',equipoRoutes);
app.use('/api/campeonato-categoria',campeonatoCategoriaroutes);
app.use('/api/usuario',usuarioroutes);
app.use('/api/vinculo', vinculoRoutes)
app.use('/api/jugadores',jugadoresRoutes)
app.use('/api/eqtecnicos', eqTecnicoroutes);
app.use('/api/departamentos',departamentosroutes );
app.use('/api/provincias', provinciaRoutes);
app.use('/api/carnets', carnetsRoutes);
app.use('/api/clubusuario',clubUsuarioRoutes);
app.use('/api/jueces',jueceRoutes);
app.use('/api/eqtecnico',eqTecnicoroutes);
app.use('/api/fases', fasesRoutes);
app.use('/api/grupos', gruposRoutes);
app.use('/api/inscripciones', inscripcionesRoutes);
app.use('/api/grupo-inscripciones', grupoInscripcionesRoutes);
app.use('/api/jornadas', jornadasRoutes);
app.use('/api/participaciones', participacionesRoutes);
app.use('/api/partido-jueces', partidoJuecesRoutes);
app.use('/api/historial-campeonatos', historialCampeonatosRoutes);
app.use('/api/tabla-posiciones', tablaPosicionesRoutes);
app.use('/api/configuracion-campeonato', configuracionCampeonatoRoutes);
app.use('/api/configuracion-puntos', configuracionPuntosRoutes);
app.use('/api/fixture', fixtureRoutes);
app.use('/api/planilla', planillaDigitalRoutes);
app.use('/api/reportes', reportesRoutes);
app.use((req, res, next) => { console.log(`${req.method} ${req.path}`); next(); });


module.exports=app;


/**
 // server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH"]
  }
});

// Conectar MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.error('Error MongoDB:', err));

// Configurar Socket.IO
require('./sockets/configuracionPuntos.socket')(io);

// Rutas REST
const configuracionRoutes = require('./routes/configuracionPuntos.routes');
app.use('/api/configuracion-puntos', configuracionRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

*/