const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'photomanagement',
  password: process.env.DB_PASSWORD || 'root',
  port: process.env.DB_PORT || 5432,
});

pool.connect()
  .then(() => console.log('✅ PostgreSQL connecté'))
  .catch(err => console.error('❌ Erreur de connexion PostgreSQL :', err));

module.exports = pool;
