'use strict';
const {
  Model
} = require('sequelize');
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    token: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ip: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    user_agent: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'sessions',
    timestamps: true,
    underscored: false
  });

  Session.associate = function(models) {
    Session.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
  };

  // Helper to check if session is expired
  Session.prototype.isExpired = function() {
    return this.expires_at && new Date() > new Date(this.expires_at);
  };

  return Session;
};