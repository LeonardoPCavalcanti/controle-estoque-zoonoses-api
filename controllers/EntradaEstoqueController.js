const { EntradaEstoque, Produto } = require('../models');

module.exports = {
    async listar(req, res) {
        const entradas = await EntradaEstoque.findAll({ include: Produto });
        return res.json(entradas);
    },

    async buscarPorId(req, res) {
        const { id } = req.params;
        const entrada = await EntradaEstoque.findByPk(id, { include: Produto });

        if (!entrada) {
            return res.status(404).json({ mensagem: 'Entrada não encontrada.' });
        }

        return res.json(entrada);
    },

    async criar(req, res) {
        const { produtoId, quantidade } = req.body;

        const produto = await Produto.findByPk(produtoId);
        if (!produto) {
            return res.status(404).json({ mensagem: 'Produto não encontrado.' });
        }

        const entrada = await EntradaEstoque.create({
            ProdutoId: produtoId,
            quantidade
        });

        // Atualiza a quantidade no produto
        produto.quantidade += quantidade;
        await produto.save();

        return res.status(201).json(entrada);
    },

    async deletar(req, res) {
        const { id } = req.params;

        const entrada = await EntradaEstoque.findByPk(id);
        if (!entrada) {
            return res.status(404).json({ mensagem: 'Entrada não encontrada.' });
        }

        // Atualiza a quantidade do produto (remove a entrada)
        const produto = await Produto.findByPk(entrada.ProdutoId);
        if (produto) {
            produto.quantidade -= entrada.quantidade;
            if (produto.quantidade < 0) produto.quantidade = 0;
            await produto.save();
        }

        await entrada.destroy();
        return res.json({ mensagem: 'Entrada deletada com sucesso.' });
    }
};
