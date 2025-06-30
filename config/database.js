const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('Variáveis carregadas:', {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
});

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT
    }
);

sequelize.authenticate()
    .then(() => console.log('💾 Conectado ao banco de dados com sucesso!'))
    .catch(err => console.error('❌ Erro ao conectar ao banco de dados:', err));

module.exports = sequelize;
