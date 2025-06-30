const { SaidaEstoque, Produto } = require('../models');

module.exports = {
    async listar(req, res) {
        const saidas = await SaidaEstoque.findAll({ include: Produto });
        return res.json(saidas);
    },

    async buscarPorId(req, res) {
        const { id } = req.params;
        const saida = await SaidaEstoque.findByPk(id, { include: Produto });

        if (!saida) {
            return res.status(404).json({ mensagem: 'Saída não encontrada.' });
        }

        return res.json(saida);
    },

    async criar(req, res) {
        const { produtoId, quantidade, destino } = req.body;

        const produto = await Produto.findByPk(produtoId);
        if (!produto) {
            return res.status(404).json({ mensagem: 'Produto não encontrado.' });
        }

        if (produto.quantidade < quantidade) {
            return res.status(400).json({ mensagem: 'Estoque insuficiente para essa saída.' });
        }

        const saida = await SaidaEstoque.create({
            ProdutoId: produtoId,
            quantidade,
            destino
        });

        // Atualiza a quantidade no produto
        produto.quantidade -= quantidade;
        await produto.save();

        return res.status(201).json(saida);
    },

    async deletar(req, res) {
        const { id } = req.params;

        const saida = await SaidaEstoque.findByPk(id);
        if (!saida) {
            return res.status(404).json({ mensagem: 'Saída não encontrada.' });
        }

        // Atualiza a quantidade do produto (devolve a saída)
        const produto = await Produto.findByPk(saida.ProdutoId);
        if (produto) {
            produto.quantidade += saida.quantidade;
            await produto.save();
        }

        await saida.destroy();
        return res.json({ mensagem: 'Saída deletada com sucesso.' });
    }
};
