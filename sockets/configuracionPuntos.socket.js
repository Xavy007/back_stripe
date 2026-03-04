// sockets/configuracionPuntos.socket.js
const configuracionService = require('../services/configuracionPuntos.service');

module.exports = (io) => {
  const configuracionNamespace = io.of('/configuracion-puntos');

  configuracionNamespace.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    // Cliente se suscribe a un campeonato específico
    socket.on('subscribe:campeonato', async ({ idcampeonato, userId }) => {
      socket.join(`campeonato:${idcampeonato}`);
      
      // Enviar configuración actual
      const configActual = await configuracionService.obtenerConfiguracion(idcampeonato);
      socket.emit('configuracion:inicial', configActual);

      // Iniciar monitoreo de cambios
      configuracionService.iniciarMonitoreo(idcampeonato, (cambio) => {
        configuracionNamespace
          .to(`campeonato:${idcampeonato}`)
          .emit('configuracion:cambio', cambio);
      });
    });

    // Actualizar desde la app de planilla digital
    socket.on('configuracion:actualizar', async ({ idcampeonato, cambios, userId }) => {
      try {
        const actualizado = await configuracionService.actualizarConfiguracion(
          idcampeonato,
          cambios,
          userId
        );

        // Broadcast a todos los suscritos
        configuracionNamespace
          .to(`campeonato:${idcampeonato}`)
          .emit('configuracion:actualizada', {
            idcampeonato,
            datos: actualizado,
            actualizadoPor: userId
          });

      } catch (error) {
        socket.emit('configuracion:error', { 
          message: error.message 
        });
      }
    });

    socket.on('unsubscribe:campeonato', ({ idcampeonato }) => {
      socket.leave(`campeonato:${idcampeonato}`);
    });

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });

  // Escuchar eventos del servicio para broadcast global
  configuracionService.on('configuracion:updated', (data) => {
    configuracionNamespace
      .to(`campeonato:${data.idcampeonato}`)
      .emit('configuracion:sync', data);
  });
};
