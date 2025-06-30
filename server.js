const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3333;

sequelize.sync({ alter: true }).then(() => {
    console.log('💾 Banco sincronizado com sucesso!');
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
});
