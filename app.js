require('dotenv').config({ silent: true });

const express = require('express');
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
const cors = require('cors');
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',   // o un array de orígenes permitidos
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true                  // si usas cookies / auth con credenciales
}));
app.options('*', cors()); 

app.get('/api/protegido', authMiddleware, (req, res) => {
  res.json({ mensaje: 'Acceso autorizado', usuario: req.usuario });
});


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
app.use((req, res, next) => { console.log(`${req.method} ${req.path}`); next(); });


module.exports=app;