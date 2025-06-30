const { Categoria } = require('../models');

module.exports = {
    async listar(req, res) {
        const categorias = await Categoria.findAll();
        return res.json(categorias);
    },

    async buscarPorId(req, res) {
        const { id } = req.params;
        const categoria = await Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).json({ mensagem: 'Categoria não encontrada.' });
        }

        return res.json(categoria);
    },

    async criar(req, res) {
        const { nome } = req.body;

        const categoria = await Categoria.create({ nome });
        return res.status(201).json(categoria);
    },

    async atualizar(req, res) {
        const { id } = req.params;
        const { nome } = req.body;

        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ mensagem: 'Categoria não encontrada.' });
        }

        await categoria.update({ nome });
        return res.json(categoria);
    },

    async deletar(req, res) {
        const { id } = req.params;

        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ mensagem: 'Categoria não encontrada.' });
        }

        await categoria.destroy();
        return res.json({ mensagem: 'Categoria deletada com sucesso.' });
    }
};
