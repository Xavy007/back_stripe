require('dotenv').config();

const base = {
  username: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  host:     process.env.DB_HOST || 'localhost',
  dialect:  'postgres',
  logging:  false,
  // Guarda qué seeders ya se ejecutaron (como SequelizeMeta para migraciones)
  seederStorage:          'sequelize',
  seederStorageTableName: 'SequelizeData'
};

module.exports = {
  development: { ...base },
  production:  { ...base }
};