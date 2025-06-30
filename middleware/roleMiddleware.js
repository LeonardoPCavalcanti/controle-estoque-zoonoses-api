function autorizarRoles(...rolesPermitidos) {
    return (req, res, next) => {
        const { papel } = req.usuario;
        if (!rolesPermitidos.includes(papel)) {
            return res.status(403).json({ mensagem: 'Acesso negado.' });
        }
        next();
    };
}

module.exports = autorizarRoles;
