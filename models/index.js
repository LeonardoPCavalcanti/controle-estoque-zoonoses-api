const sequelize = require('../config/database');

const Produto = require('./Produto');
const Categoria = require('./Categoria');
const Fornecedor = require('./Fornecedor');
const Usuario = require('./Usuario');
const EntradaEstoque = require('./EntradaEstoque');
const SaidaEstoque = require('./SaidaEstoque');
const Setor = require('./Setor');


// Relacionamentos
Produto.belongsTo(Categoria);
Categoria.hasMany(Produto);

Produto.belongsTo(Fornecedor);
Fornecedor.hasMany(Produto);

EntradaEstoque.belongsTo(Produto);
Produto.hasMany(EntradaEstoque);

SaidaEstoque.belongsTo(Produto);
Produto.hasMany(SaidaEstoque);

// Produto pertence a um Setor
Produto.belongsTo(Setor);
Setor.hasMany(Produto);

module.exports = {
    sequelize,
    Produto,
    Categoria,
    Fornecedor,
    Usuario,
    EntradaEstoque,
    SaidaEstoque,
    Setor
};

