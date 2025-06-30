const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SaidaEstoque = sequelize.define('SaidaEstoque', {
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    data_saida: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    destino: DataTypes.STRING
});

module.exports = SaidaEstoque;
