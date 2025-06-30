const { Setor } = require('../models');

module.exports = {
    async listar(req, res) {
        const setores = await Setor.findAll();
        return res.json(setores);
    },

    async buscarPorId(req, res) {
        const { id } = req.params;
        const setor = await Setor.findByPk(id);

        if (!setor) {
            return res.status(404).json({ mensagem: 'Setor não encontrado.' });
        }

        return res.json(setor);
    },

    async criar(req, res) {
        const { nome, descricao } = req.body;

        const setor = await Setor.create({ nome, descricao });
        return res.status(201).json(setor);
    },

    async atualizar(req, res) {
        const { id } = req.params;
        const { nome, descricao } = req.body;

        const setor = await Setor.findByPk(id);
        if (!setor) {
            return res.status(404).json({ mensagem: 'Setor não encontrado.' });
        }

        await setor.update({ nome, descricao });
        return res.json(setor);
    },

    async deletar(req, res) {
        const { id } = req.params;

        const setor = await Setor.findByPk(id);
        if (!setor) {
            return res.status(404).json({ mensagem: 'Setor não encontrado.' });
        }

        await setor.destroy();
        return res.json({ mensagem: 'Setor deletado com sucesso.' });
    }
};
