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
    },
    categoriaId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fornecedorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    setorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Produto;
