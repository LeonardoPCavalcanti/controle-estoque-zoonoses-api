const { Sequelize } = require('sequelize');
const path = require('path');

require('dotenv').config({
  path: path.resolve(process.cwd(), process.env.NODE_ENV === 'test' ? '.env.test' : '.env'),
  override: true // 
});


console.log('🔄 Carregando ambiente:', process.env.NODE_ENV || 'development');
console.log('💾 Conectando ao banco:', process.env.DB_NAME);
console.log('Host do banco:', process.env.DB_HOST);


const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
        logging: false
    }
);

module.exports = sequelize;