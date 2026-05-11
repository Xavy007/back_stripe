'use strict';

const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.belongsTo(models.Persona, {
        foreignKey: 'id_persona',
        as: 'persona',
      });
      Usuario.hasMany(models.ClubUsuario, {
        foreignKey: 'id_usuario',
        as: 'clubesAsignados'
      });
    }

    async verifyPassword(plain) {
      if (!this.password) return false;
      return bcrypt.compare(plain, this.password);
    }

    async recordFailedAttempt({ maxAttempts = 5, lockMinutes = 15 } = {}) {
      this.failed_attempts = (this.failed_attempts || 0) + 1;
      if (this.failed_attempts >= maxAttempts) {
        this.locked_until = new Date(Date.now() + lockMinutes * 60 * 1000);
        this.failed_attempts = 0;
      }
      await this.save();
    }

    async resetAttempts() {
      this.failed_attempts = 0;
      this.locked_until = null;
      await this.save();
    }

    isLocked() {
      return this.locked_until && new Date() < new Date(this.locked_until);
    }

    toJSON() {
      const values = Object.assign({}, this.get());
      delete values.password;
      return values;
    }
  }

  Usuario.init({
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: { args: [12, 255], msg: 'La contraseña debe tener al menos 12 caracteres' }
      }
    },
    rol: {
      type: DataTypes.ENUM('admin', 'presidente', 'secretario', 'presidenteclub', 'representante','juez'),
      allowNull: false
    },
    failed_attempts: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    locked_until: { type: DataTypes.DATE, allowNull: true },
    verificado: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    estado: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    token_activacion: { type: DataTypes.STRING, allowNull: true },
    token_expira: { type: DataTypes.DATE, allowNull: true },

    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'personas', key: 'id_persona' }, // confirma el nombre real de la tabla
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    defaultScope: { attributes: { exclude: ['password'] } },
    scopes: { withPassword: {} },
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.password) usuario.password = await bcrypt.hash(usuario.password, 10);
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed && usuario.changed('password')) {
          usuario.password = await bcrypt.hash(usuario.password, 10);
        }
      }
    }
  });

  return Usuario;
};