const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const { sequelize } = require('../models');
// Importamos o modelo Categoria junto com os outros
const { Usuario, Categoria } = require('../models');

// Descreve a suíte de testes para as rotas de Categorias
describe('Integration Tests for /api/categorias Routes', () => {
  // Variáveis para guardar os tokens e os dados de teste
  let adminToken;
  let leitorToken;
  let categoriaTeste;

  // Bloco que roda UMA VEZ ANTES de todos os testes neste arquivo
  beforeAll(async () => {
    // Garante um ambiente limpo, apagando e recriando as tabelas
    await sequelize.sync({ force: true });

    // --- ARRANGE (Preparação) ---
    // Criamos os mesmos usuários de teste que usamos antes
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await Usuario.bulkCreate([
      {
        nome: 'Admin Teste',
        email: 'admin@teste.com',
        senha: hashedPassword,
        papel: 'admin',
      },
      {
        nome: 'Leitor Teste',
        email: 'leitor@teste.com',
        senha: hashedPassword,
        papel: 'leitor',
      },
    ]);

    // Criamos uma categoria "semente" para usar nos testes de GET por id, PUT e DELETE
    categoriaTeste = await Categoria.create({ nome: 'Medicamentos' });

    // Fazemos login com os usuários para obter tokens JWT
    const loginAdmin = await request(app)
      .post('/api/usuarios/login')
      .send({ email: 'admin@teste.com', senha: 'admin123' });
    adminToken = loginAdmin.body.token;

    const loginLeitor = await request(app)
      .post('/api/usuarios/login')
      .send({ email: 'leitor@teste.com', senha: 'admin123' });
    leitorToken = loginLeitor.body.token;
  });

  // Bloco que roda UMA VEZ APÓS todos os testes para limpar a conexão
  afterAll(async () => {
    await sequelize.close();
  });

  // --- Testes para a rota POST /api/categorias ---
  describe('POST /api/categorias', () => {
    it('should create a new category when user is an admin', async () => {
      const response = await request(app)
        .post('/api/categorias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nome: 'Material de Escritório' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.nome).toBe('Material de Escritório');
    });

    it('should return 403 Forbidden when user is not an admin', async () => {
      const response = await request(app)
        .post('/api/categorias')
        .set('Authorization', `Bearer ${leitorToken}`)
        .send({ nome: 'Tentativa Ilegal' });

      expect(response.status).toBe(403);
    });
  });

  // --- Testes para a rota GET /api/categorias ---
  describe('GET /api/categorias', () => {
    it('should return a list of categories for any authenticated user', async () => {
      const response = await request(app)
        .get('/api/categorias')
        .set('Authorization', `Bearer ${leitorToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      // Esperamos que a lista contenha a categoria que criamos no setup
      expect(response.body.some(cat => cat.nome === 'Medicamentos')).toBe(true);
    });

    it('should return a single category by id', async () => {
      const response = await request(app)
        .get(`/api/categorias/${categoriaTeste.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(categoriaTeste.id);
    });
  });

  // --- Testes para a rota PUT /api/categorias/:id ---
  describe('PUT /api/categorias/:id', () => {
    it('should update a category when user is an admin', async () => {
      const response = await request(app)
        .put(`/api/categorias/${categoriaTeste.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nome: 'Medicamentos Controlados' });

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe('Medicamentos Controlados');
    });

    it('should return 403 Forbidden when user is not an admin', async () => {
      const response = await request(app)
        .put(`/api/categorias/${categoriaTeste.id}`)
        .set('Authorization', `Bearer ${leitorToken}`)
        .send({ nome: 'Tentativa Ilegal' });

      expect(response.status).toBe(403);
    });
  });

  // --- Testes para a rota DELETE /api/categorias/:id ---
  describe('DELETE /api/categorias/:id', () => {
    it('should delete a category when user is an admin', async () => {
      // Primeiro, criamos uma categoria nova só para este teste de deleção
      const categoriaParaDeletar = await Categoria.create({ nome: 'Para Deletar' });

      const response = await request(app)
        .delete(`/api/categorias/${categoriaParaDeletar.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200); // ou 204, dependendo da sua implementação

      // Verificação extra: confirma que a categoria foi removida do banco
      const categoryInDb = await Categoria.findByPk(categoriaParaDeletar.id);
      expect(categoryInDb).toBeNull();
    });

    it('should return 403 Forbidden when user is not an admin', async () => {
      const response = await request(app)
        .delete(`/api/categorias/${categoriaTeste.id}`)
        .set('Authorization', `Bearer ${leitorToken}`);

      expect(response.status).toBe(403);
    });
  });
});