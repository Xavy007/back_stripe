// stripehub/config/mongodb.js
const mongoose = require('mongoose');

const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dotset';
    
    await mongoose.connect(mongoURI);

    console.log('✅ MongoDB conectado exitosamente');
    console.log(`   📊 Base de datos: ${mongoose.connection.name}`);
    console.log(`   🏠 Host: ${mongoose.connection.host}`);
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    console.warn('⚠️  La aplicación continuará sin MongoDB');
    console.warn('⚠️  Las funcionalidades de planilla digital no estarán disponibles');
    // No hacer exit para que la app siga con PostgreSQL
  }
};

// Eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('🔗 MongoDB conectado');
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB desconectado');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error en MongoDB:', err.message);
});

module.exports = connectMongoDB;
