const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../../app'); 
const { sequelize } = require('../../models'); 
const { Usuario, Produto } = require('../../models');

// Descreve a suíte de testes para as rotas de Produtos
describe('Integration Tests for /api/produtos Routes', () => {
  // Variáveis para guardar os tokens e os dados de teste
  let adminToken;
  let leitorToken;
  let produtoTeste;

  // Bloco que roda UMA VEZ ANTES de todos os testes neste arquivo
  beforeAll(async () => {
    // Zera e recria as tabelas do banco de dados para garantir um ambiente limpo
    await sequelize.sync({ force: true });

    // --- ARRANGE (Preparação) ---
    // Criamos usuários de teste com cargos diferentes
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

    // Criamos um produto "semente" para usar nos testes de GET, PUT e DELETE
    produtoTeste = await Produto.create({
      nome: 'Gaze Estéril',
      descricao: 'Pacote com 50 unidades',
      quantidade: 150,
    });

    // Fazemos login com nossos usuários de teste para obter tokens JWT válidos
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

  // --- Testes para a rota POST /api/produtos ---
  describe('POST /api/produtos', () => {
    it('should create a new product when user has "admin" role', async () => {
      const response = await request(app)
        .post('/api/produtos')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nome: 'Seringa 5ml',
          descricao: 'Caixa com 100 unidades',
          quantidade: 200,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.nome).toBe('Seringa 5ml');
    });

    it('should return 403 Forbidden when user does not have permission', async () => {
      const response = await request(app)
        .post('/api/produtos')
        .set('Authorization', `Bearer ${leitorToken}`)
        .send({ nome: 'Tentativa Ilegal' });

      expect(response.status).toBe(403);
    });

    it('should return 401 Unauthorized when no token is provided', async () => {
      const response = await request(app)
        .post('/api/produtos')
        .send({ nome: 'Tentativa sem Token' });

      expect(response.status).toBe(401);
    });
  });

  // --- Testes para a rota GET /api/produtos ---
  describe('GET /api/produtos', () => {
    it('should return a list of products for any authenticated user', async () => {
      const response = await request(app)
        .get('/api/produtos')
        .set('Authorization', `Bearer ${leitorToken}`); // Usa o token do Leitor, que tem permissão

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0); // Deve haver pelo menos os produtos que criamos
    });

    it('should return a single product by id for any authenticated user', async () => {
      const response = await request(app)
        .get(`/api/produtos/${produtoTeste.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(produtoTeste.id);
      expect(response.body.nome).toBe('Gaze Estéril');
    });

    it('should return 401 Unauthorized when no token is provided', async () => {
      const response = await request(app).get('/api/produtos');
      expect(response.status).toBe(401);
    });
  });

  // --- Testes para a rota PUT /api/produtos/:id ---
  describe('PUT /api/produtos/:id', () => {
    it('should update a product when user has "admin" role', async () => {
      const response = await request(app)
        .put(`/api/produtos/${produtoTeste.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nome: 'Gaze Estéril (Atualizada)',
          quantidade: 125,
        });

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe('Gaze Estéril (Atualizada)');
      expect(response.body.quantidade).toBe(125);

      // Verificação extra no banco
      const productInDb = await Produto.findByPk(produtoTeste.id);
      expect(productInDb.nome).toBe('Gaze Estéril (Atualizada)');
    });

    it('should return 403 Forbidden when user does not have permission', async () => {
      const response = await request(app)
        .put(`/api/produtos/${produtoTeste.id}`)
        .set('Authorization', `Bearer ${leitorToken}`)
        .send({ nome: 'Tentativa Ilegal' });

      expect(response.status).toBe(403);
    });
  });

  // --- Testes para a rota DELETE /api/produtos/:id ---
  describe('DELETE /api/produtos/:id', () => {
    it('should return 403 Forbidden when user does not have permission', async () => {
      const response = await request(app)
        .delete(`/api/produtos/${produtoTeste.id}`)
        .set('Authorization', `Bearer ${leitorToken}`);

      expect(response.status).toBe(403);
    });

    it('should delete a product when user has "admin" role', async () => {
      const response = await request(app)
        .delete(`/api/produtos/${produtoTeste.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);// 200 No Content é uma resposta comum para DELETE

      // Verificação extra: confirma que o produto foi removido do banco
      const productInDb = await Produto.findByPk(produtoTeste.id);
      expect(productInDb).toBeNull();
    });

    it('should return 404 Not Found when trying to delete a non-existent product', async () => {
      const response = await request(app)
        .delete(`/api/produtos/99999`) // ID que não existe
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });
});