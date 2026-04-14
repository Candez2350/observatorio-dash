require('dotenv').config();
const { Pool } = require('pg');

// Configuração do Pool de conexões do PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false // Necessário para a conexão com o NeonDB em muitos casos, garantindo SSL
  }
});

// Testando a conexão ao iniciar
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erro ao conectar ao banco de dados NeonDB:', err.stack);
  }
  console.log('Conexão com o banco de dados PostgreSQL (NeonDB) estabelecida com sucesso!');
  release();
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
