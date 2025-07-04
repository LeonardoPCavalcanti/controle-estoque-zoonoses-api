const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Produto = sequelize.define('Produto', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: DataTypes.TEXT,
  unidade: DataTypes.STRING,
  validade: DataTypes.DATE,
  quantidade: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  CategoriaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  FornecedorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  SetorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Produto;
