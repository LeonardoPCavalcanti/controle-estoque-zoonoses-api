const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Produto = sequelize.define('Produto', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: DataTypes.TEXT,
    unidade: DataTypes.STRING,
    validade: DataTypes.DATE,
    quantidade: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = Produto;
