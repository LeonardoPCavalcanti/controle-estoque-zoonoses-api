const express = require('express');
const cors = require('cors');
require('dotenv').config();

const corsOptions = {
  origin: 'http://localhost:8080', 
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
// Importa rotas
const produtoRoutes = require('./routes/produto');
const usuarioRoutes = require('./routes/usuario');
const setorRoutes = require('./routes/setor');
const fornecedorRoutes = require('./routes/fornecedor');
const categoriaRoutes = require('./routes/categoria');
const entradaRoutes = require('./routes/entrada');
const saidaRoutes = require('./routes/saida');

app.use('/api/produtos', produtoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/setores', setorRoutes);
app.use('/api/fornecedores', fornecedorRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/entradas', entradaRoutes);
app.use('/api/saidas', saidaRoutes);

app.get('/', (req, res) => {
    res.send('🚀 API do Sistema de Estoque de Zoonoses funcionando!');
});

module.exports = app;
