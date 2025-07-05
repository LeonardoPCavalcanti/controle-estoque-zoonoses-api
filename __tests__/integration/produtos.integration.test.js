const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../../app');
const { sequelize } = require('../../models');
const { Usuario, Produto, Categoria, Fornecedor, Setor } = require('../../models');

describe('Integration Tests for /api/produtos Routes', () => {
  let adminToken;
  let leitorToken;
  let produtoTeste;
  let categoria;
  let fornecedor;
  let setor;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

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

    categoria = await Categoria.create({ nome: 'Medicamentos' });
    fornecedor = await Fornecedor.create({ nome: 'Fornecedor A', contato: '123456789' });
    setor = await Setor.create({ nome: 'Setor Teste' });

    produtoTeste = await Produto.create({
      nome: 'Gaze Estéril',
      descricao: 'Pacote com 50 unidades',
      quantidade: 150,
      CategoriaId: categoria.id,
      FornecedorId: fornecedor.id,
      SetorId: setor.id
    });

    const loginAdmin = await request(app)
      .post('/api/usuarios/login')
      .send({ email: 'admin@teste.com', senha: 'admin123' });
    adminToken = loginAdmin.body.token;

    const loginLeitor = await request(app)
      .post('/api/usuarios/login')
      .send({ email: 'leitor@teste.com', senha: 'admin123' });
    leitorToken = loginLeitor.body.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/produtos', () => {
    it('should create a new product when user has "admin" role', async () => {
      const response = await request(app)
        .post('/api/produtos')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nome: 'Seringa 5ml',
          descricao: 'Caixa com 100 unidades',
          quantidade: 200,
          categoriaId: categoria.id,
          fornecedorId: fornecedor.id,
          setorId: setor.id
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.nome).toBe('Seringa 5ml');
    });

    it('should return 403 Forbidden when user does not have permission', async () => {
      const response = await request(app)
        .post('/api/produtos')
        .set('Authorization', `Bearer ${leitorToken}`)
        .send({
          nome: 'Tentativa Ilegal',
          categoriaId: categoria.id,
          fornecedorId: fornecedor.id,
          setorId: setor.id
        });

      expect(response.status).toBe(403);
    });

    it('should return 401 Unauthorized when no token is provided', async () => {
      const response = await request(app)
        .post('/api/produtos')
        .send({
          nome: 'Tentativa sem Token',
          categoriaId: categoria.id,
          fornecedorId: fornecedor.id,
          setorId: setor.id
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/produtos', () => {
    it('should return a list of products for any authenticated user', async () => {
      const response = await request(app)
        .get('/api/produtos')
        .set('Authorization', `Bearer ${leitorToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
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

  describe('PUT /api/produtos/:id', () => {
    it('should update a product when user has "admin" role', async () => {
      const response = await request(app)
        .put(`/api/produtos/${produtoTeste.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nome: 'Gaze Estéril (Atualizada)',
          quantidade: 125,
          categoriaId: categoria.id,
          fornecedorId: fornecedor.id,
          setorId: setor.id
        });

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe('Gaze Estéril (Atualizada)');
      expect(response.body.quantidade).toBe(125);

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

      expect(response.status).toBe(200);

      const productInDb = await Produto.findByPk(produtoTeste.id);
      expect(productInDb).toBeNull();
    });

    it('should return 404 Not Found when trying to delete a non-existent product', async () => {
      const response = await request(app)
        .delete(`/api/produtos/99999`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });
});