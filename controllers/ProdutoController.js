const { Produto, Categoria, Fornecedor } = require('../models');

module.exports = {
    async listar(req, res) {
        const produtos = await Produto.findAll({
            include: [Categoria, Fornecedor]
        });
        return res.json(produtos);
    },

    async buscarPorId(req, res) {
        const { id } = req.params;
        const produto = await Produto.findByPk(id, {
            include: [Categoria, Fornecedor]
        });

        if (!produto) {
            return res.status(404).json({ mensagem: 'Produto não encontrado.' });
        }

        return res.json(produto);
    },

    async criar(req, res) {
        const { nome, descricao, unidade, validade, quantidade, categoriaId, fornecedorId } = req.body;
        const produto = await Produto.create({
            nome,
            descricao,
            unidade,
            validade,
            quantidade,
            CategoriaId: categoriaId,
            FornecedorId: fornecedorId
        });
        return res.status(201).json(produto);
    },

    async atualizar(req, res) {
        const { id } = req.params;
        const { nome, descricao, unidade, validade, quantidade, categoriaId, fornecedorId } = req.body;

        const produto = await Produto.findByPk(id);

        if (!produto) {
            return res.status(404).json({ mensagem: 'Produto não encontrado.' });
        }

        await produto.update({
            nome,
            descricao,
            unidade,
            validade,
            quantidade,
            CategoriaId: categoriaId,
            FornecedorId: fornecedorId
        });

        return res.json(produto);
    },

    async deletar(req, res) {
        const { id } = req.params;
        const produto = await Produto.findByPk(id);

        if (!produto) {
            return res.status(404).json({ mensagem: 'Produto não encontrado.' });
        }

        await produto.destroy();
        return res.json({ mensagem: 'Produto deletado com sucesso.' });
    }
};
