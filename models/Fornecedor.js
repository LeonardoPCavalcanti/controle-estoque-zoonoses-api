const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fornecedor = sequelize.define('Fornecedor', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cnpj: DataTypes.STRING,
    contato: DataTypes.STRING,
    email: DataTypes.STRING
});

module.exports = Fornecedor;
