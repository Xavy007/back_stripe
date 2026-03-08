/**
 * @file server.js
 * @description Punto de entrada principal de la aplicación PuntoSet Backend.
 *
 * Responsabilidades:
 *   1. Cargar variables de entorno desde .env.
 *   2. Conectar la base de datos documental MongoDB (para planillas digitales
 *      y reportes en tiempo real).
 *   3. Crear el servidor HTTP sobre la instancia de Express exportada por app.js.
 *   4. Configurar Socket.IO con soporte CORS y transports (WebSocket + polling
 *      como fallback para entornos con proxies restrictivos).
 *   5. Registrar los namespaces de Socket.IO:
 *        - configuracionPuntos.socket → gestión de puntos en tiempo real.
 *        - partido.socket            → marcador en vivo y estado del partido.
 *   6. Iniciar la escucha HTTP en el puerto configurado.
 *   7. Implementar graceful shutdown para SIGINT y SIGTERM, garantizando el
 *      cierre ordenado de conexiones antes de detener el proceso.
 *
 * Variables de entorno relevantes:
 *   - PORT          : Puerto de escucha (por defecto 8080).
 *   - CORS_ORIGIN   : Origen(es) permitidos por CORS. '*' habilita cualquier origen.
 *   - MONGODB_URI   : Cadena de conexión a MongoDB Atlas o instancia local.
 *
 * @module server
 */

require('dotenv').config();

const http      = require('http');
const socketIO  = require('socket.io');
const app       = require('./app');
const connectMongoDB = require('./config/mongodb');

const PORT = process.env.PORT || 8080;

/**
 * Inicializa y arranca el servidor de forma asíncrona.
 * El orden de arranque es deliberado:
 *   MongoDB primero → HTTP después → Socket.IO al final,
 * para garantizar que todas las dependencias estén disponibles antes de
 * aceptar conexiones de clientes.
 *
 * @async
 * @returns {Promise<void>}
 */
const startServer = async () => {
  try {
    // ── 1. Conectar MongoDB (requerido para planillas y reportes) ──
    await connectMongoDB();

    // ── 2. Crear servidor HTTP envolviendo la app Express ──
    //    Se usa http.createServer() en vez de app.listen() para poder
    //    adjuntar Socket.IO al mismo servidor TCP.
    const server = http.createServer(app);

    // ── 3. Configurar Socket.IO ──
    const io = socketIO(server, {
      cors: {
        // Permite CORS dinámico: '*' en desarrollo, dominio específico en producción
        origin: process.env.CORS_ORIGIN === '*' ? true : process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true
      },
      // Intentar WebSocket primero, degradar a long-polling si falla
      transports: ['websocket', 'polling']
    });

    // ── 4. Registrar handlers de Socket.IO por dominio ──
    require('./sockets/configuracionPuntos.socket')(io); // Puntuación en tiempo real
    require('./sockets/partido.socket')(io);             // Estado del partido en vivo

    console.log('✅ Socket.IO configurado correctamente');

    // ── 5. Iniciar escucha en todas las interfaces de red (0.0.0.0) ──
    //    Escuchar en 0.0.0.0 es necesario para contenedores Docker y
    //    entornos con múltiples interfaces de red.
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`🔌 Socket.IO disponible en ws://localhost:${PORT}`);
    });

    // ── 6. Graceful shutdown ──
    /**
     * Cierra ordenadamente todas las conexiones antes de terminar el proceso.
     * Se aplica un timeout de 10 segundos como salvaguarda para evitar que el
     * proceso quede colgado si alguna conexión no se cierra correctamente.
     */
    function shutdown() {
      console.log('⏹️  Shutting down server...');

      // Cerrar Socket.IO primero (desconectar clientes WebSocket)
      io.close(() => {
        console.log('🔌 Socket.IO cerrado');
      });

      // Cerrar servidor HTTP (dejar de aceptar nuevas conexiones)
      server.close(() => {
        // Cerrar conexión de MongoDB limpiamente
        const mongoose = require('mongoose');
        mongoose.connection.close(false, () => {
          console.log('✅ Server closed');
          process.exit(0);
        });
      });

      // Timeout de seguridad: forzar cierre si tarda más de 10 segundos
      setTimeout(() => {
        console.error('⚠️  Forzando cierre...');
        process.exit(1);
      }, 10000);
    }

    // Capturar señales del sistema operativo para shutdown controlado
    process.on('SIGINT', shutdown);   // Ctrl+C en terminal
    process.on('SIGTERM', shutdown);  // Kill de sistema / Docker stop

    module.exports = server;
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();
