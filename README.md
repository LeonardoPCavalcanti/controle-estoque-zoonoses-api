# 🎯 Backend - Controle de Estoque (Zoonoses)

API REST construída com Node.js, Express e Sequelize para controle de setores, produtos e histórico de movimentações.

## ⚙️ Tecnologias

- Node.js
- Express
- Sequelize (ORM)
- PostgreSQL

## 🚀 Como executar localmente

### Pré-requisitos

- Node.js (versão 18+)
- PostgreSQL
- Docker (opcional, caso use o banco em container)

### Variáveis de ambiente

Crie um arquivo `.env` na raiz com o conteúdo:

```env
DB_NAME=zoonoses_estoque
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
SECRET=Zoonoses_Super_Secret_Key
```

### Passos

1. Instale as dependências:
```bash
npm install
```

2. Rode as migrations/seeds (se aplicável):
```bash
npx sequelize-cli db:migrate
```

3. Inicie o servidor:
```bash
npm start
```

A API estará acessível em: [http://localhost:3001](http://localhost:3001)