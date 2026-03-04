/*require('dotenv').config();

const app = require('./app');
const connectMongoDB = require('./config/mongodb');
const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


// graceful shutdown
function shutdown() {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = server;*/
// stripehub/server.js
require('dotenv').config();

const http = require('http');
const socketIO = require('socket.io');
const app = require('./app');
const connectMongoDB = require('./config/mongodb');

const PORT = process.env.PORT || 8080;

// Función asíncrona para iniciar el servidor
const startServer = async () => {
  try {
    // 1. Conectar MongoDB primero
    await connectMongoDB();

    // 2. Crear servidor HTTP con Express
    const server = http.createServer(app);

    // 3. Configurar Socket.IO
    const io = socketIO(server, {
      cors: {
        origin: process.env.CORS_ORIGIN === '*' ? true : process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    // 4. Inicializar socket handlers
    require('./sockets/configuracionPuntos.socket')(io);
    require('./sockets/partido.socket')(io);

    console.log('✅ Socket.IO configurado correctamente');

    // 5. Iniciar el servidor
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`🔌 Socket.IO disponible en ws://localhost:${PORT}`);
    });

    // Graceful shutdown
    function shutdown() {
      console.log('⏹️  Shutting down server...');

      // Cerrar Socket.IO
      io.close(() => {
        console.log('🔌 Socket.IO cerrado');
      });

      server.close(() => {
        // Cerrar conexión de MongoDB
        const mongoose = require('mongoose');
        mongoose.connection.close(false, () => {
          console.log('✅ Server closed');
          process.exit(0);
        });
      });

      setTimeout(() => {
        console.error('⚠️  Forzando cierre...');
        process.exit(1);
      }, 10000);
    }

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    module.exports = server;
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
};

// Iniciar el servidor
startServer();


