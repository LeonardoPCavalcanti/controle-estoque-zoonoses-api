const { Usuario } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports = {
    async registrar(req, res) {
        const { nome, email, senha, papel } = req.body;

        const usuarioExiste = await Usuario.findOne({ where: { email } });
        if (usuarioExiste) {
            return res.status(400).json({ mensagem: 'Usuário já cadastrado.' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const usuario = await Usuario.create({
            nome,
            email,
            senha: senhaHash,
            papel
        });

        return res.status(201).json({ mensagem: 'Usuário criado com sucesso!', usuario });
    },

    async login(req, res) {
        const { email, senha } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({ mensagem: 'Senha incorreta.' });
        }

        const token = jwt.sign(
            { id: usuario.id, papel: usuario.papel, nome: usuario.nome },
            process.env.SECRET,
            { expiresIn: '1d' }
        );

        return res.json({ token });
    }
};
