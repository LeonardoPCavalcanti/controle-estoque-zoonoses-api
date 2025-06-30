const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EntradaEstoque = sequelize.define('EntradaEstoque', {
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    data_entrada: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = EntradaEstoque;
