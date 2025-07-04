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
    references: { model: 'Categorias', key: 'id' },
  },
  FornecedorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Fornecedors', key: 'id' }, // Sequelize pluraliza automaticamente
  },
  SetorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Setors', key: 'id' }, // idem acima
  },
});

module.exports = Produto;
