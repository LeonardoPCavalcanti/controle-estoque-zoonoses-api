const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');

beforeAll(async () => {
  await sequelize.sync(); // sincroniza antes dos testes
});

afterAll(async () => {
  await sequelize.close(); // fecha conexão ao final
});

describe('Testes da API de Categoria', () => {
  it('Deve criar uma nova categoria', async () => {
    const res = await request(app).post('/api/categorias').send({
      nome: 'Categoria Teste'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe('Categoria Teste');
  });

  it('Deve listar categorias existentes', async () => {
    const res = await request(app).get('/api/categorias');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
