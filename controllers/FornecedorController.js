const { Fornecedor } = require('../models');

module.exports = {
    async listar(req, res) {
        const fornecedores = await Fornecedor.findAll();
        return res.json(fornecedores);
    },

    async buscarPorId(req, res) {
        const { id } = req.params;
        const fornecedor = await Fornecedor.findByPk(id);

        if (!fornecedor) {
            return res.status(404).json({ mensagem: 'Fornecedor não encontrado.' });
        }

        return res.json(fornecedor);
    },

    async criar(req, res) {
        const { nome, cnpj, contato, email } = req.body;

        const fornecedor = await Fornecedor.create({ nome, cnpj, contato, email });
        return res.status(201).json(fornecedor);
    },

    async atualizar(req, res) {
        const { id } = req.params;
        const { nome, cnpj, contato, email } = req.body;

        const fornecedor = await Fornecedor.findByPk(id);
        if (!fornecedor) {
            return res.status(404).json({ mensagem: 'Fornecedor não encontrado.' });
        }

        await fornecedor.update({ nome, cnpj, contato, email });
        return res.json(fornecedor);
    },

    async deletar(req, res) {
        const { id } = req.params;

        const fornecedor = await Fornecedor.findByPk(id);
        if (!fornecedor) {
            return res.status(404).json({ mensagem: 'Fornecedor não encontrado.' });
        }

        await fornecedor.destroy();
        return res.json({ mensagem: 'Fornecedor deletado com sucesso.' });
    }
};
