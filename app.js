require('dotenv').config({ silent: true });

const express = require('express');
const app = express();

const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');

const personaRoutes = require('./routes/persona.routes');
const nacionalidadroute=require('./routes/nacionalidadRoutes');

app.use(express.json());

app.get('/api/protegido', authMiddleware, (req, res) => {
  res.json({ mensaje: 'Acceso autorizado', usuario: req.usuario });
});


app.get('/api/admin', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  res.json({ mensaje: 'Área de admin' });
});


app.use('/api/auth', authRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/nacionalidad',nacionalidadroute);

app.use((req, res, next) => { console.log(`${req.method} ${req.path}`); next(); });

/*const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});*/

module.exports=app;