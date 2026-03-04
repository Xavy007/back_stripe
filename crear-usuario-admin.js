// Script para crear usuario admin para persona existente
// Ejecutar con: node crear-usuario-admin.js

const bcrypt = require('bcrypt');
const { sequelize, Usuario, Persona } = require('./models');

async function crearUsuarioAdmin() {
  try {
    console.log('🔍 Verificando persona con id_persona = 2...');

    // Verificar que existe la persona
    const persona = await Persona.findByPk(2);
    if (!persona) {
      console.error('❌ No existe la persona con id_persona = 2');
      process.exit(1);
    }

    console.log('✅ Persona encontrada:', {
      id_persona: persona.id_persona,
      nombre: persona.nombre,
      ap: persona.ap,
      am: persona.am,
      ci: persona.ci
    });

    // Verificar si ya existe un usuario para esta persona
    const usuarioExistente = await Usuario.scope('withPassword').findOne({
      where: { id_persona: 2 }
    });

    if (usuarioExistente) {
      console.log('⚠️  Ya existe un usuario para esta persona:');
      console.log({
        id_usuario: usuarioExistente.id_usuario,
        email: usuarioExistente.email,
        rol: usuarioExistente.rol,
        estado: usuarioExistente.estado
      });

      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      return new Promise((resolve) => {
        readline.question('¿Deseas eliminarlo y crear uno nuevo? (s/n): ', async (answer) => {
          if (answer.toLowerCase() === 's') {
            await usuarioExistente.destroy();
            console.log('✅ Usuario anterior eliminado');
            readline.close();
            resolve(true);
          } else {
            console.log('❌ Operación cancelada');
            readline.close();
            process.exit(0);
          }
        });
      }).then(() => crearNuevoUsuario());
    } else {
      await crearNuevoUsuario();
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

async function crearNuevoUsuario() {
  try {
    console.log('\n🔨 Creando nuevo usuario admin...');

    const password = 'Admin123456!';
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      id_persona: 2,
      email: 'javier.alcoba@dotset.com',
      password: hashedPassword,
      rol: 'admin',
      verificado: true,
      estado: true,
      failed_attempts: 0
    });

    console.log('\n✅ Usuario creado exitosamente:');
    console.log({
      id_usuario: nuevoUsuario.id_usuario,
      email: nuevoUsuario.email,
      rol: nuevoUsuario.rol,
      estado: nuevoUsuario.estado,
      verificado: nuevoUsuario.verificado
    });

    console.log('\n📧 Credenciales:');
    console.log('   Email:', nuevoUsuario.email);
    console.log('   Password:', password);

    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error al crear usuario:', error.message);
    await sequelize.close();
    process.exit(1);
  }
}

// Ejecutar
crearUsuarioAdmin();
