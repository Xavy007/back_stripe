const express = require('express');
const app = express();
const personaRoutes = require('./routes/persona.routes');
const nacionalidadroute=require('./routes/nacionalidadRoutes');

app.use(express.json());
app.use('/personas', personaRoutes);
app.use('/nacionalidad',nacionalidadroute);

module.exports=app;