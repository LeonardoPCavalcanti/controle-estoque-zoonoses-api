// 1. A simulação (mock) do módulo de modelos é declarada ANTES de qualquer importação.
//    Isso garante que qualquer arquivo que importe '../models' receberá nossa versão falsa.
jest.mock('../models', () => ({
  Produto: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    // As funções 'update' e 'destroy' pertencem a uma instância, então as simulamos
    // quando criamos um mock da instância do produto.
  },
  // Incluímos os outros modelos para evitar erros de importação no controller
  Categoria: {},
  Fornecedor: {},
}));

// 2. Agora importamos os módulos que vamos usar.
const produtoController = require('../controllers/ProdutoController');
const { Produto } = require('../models');

// --- Início dos Testes ---

describe('Unit Tests for ProdutoController', () => {
  let req, res;

  // Reseta os mocks antes de cada teste para garantir isolamento
  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // --- Testes para a função 'listar' ---
  describe('listar', () => {
    it('should return a list of products and status 200', async () => {
      // Arrange: Preparamos o que a função do modelo deve retornar
      const mockProdutos = [{ id: 1, nome: 'Produto A' }, { id: 2, nome: 'Produto B' }];
      Produto.findAll.mockResolvedValue(mockProdutos);

      // Act: Executamos a função do controller
      await produtoController.listar(req, res);

      // Assert: Verificamos os resultados
      expect(Produto.findAll).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(mockProdutos);
    });
  });

  // --- Testes para a função 'buscarPorId' ---
  describe('buscarPorId', () => {
    it('should return a single product and status 200 if found', async () => {
      req.params.id = '1';
      const mockProduto = { id: 1, nome: 'Produto A' };
      Produto.findByPk.mockResolvedValue(mockProduto);

      await produtoController.buscarPorId(req, res);

      expect(Produto.findByPk).toHaveBeenCalledWith('1', expect.any(Object));
      expect(res.json).toHaveBeenCalledWith(mockProduto);
    });

    it('should return status 404 if product is not found', async () => {
      req.params.id = '99';
      Produto.findByPk.mockResolvedValue(null);

      await produtoController.buscarPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Produto não encontrado.' });
    });
  });

  // --- Testes para a função 'criar' ---
  describe('criar', () => {
    it('should create a product and return status 201', async () => {
      req.body = { nome: 'Novo Produto', quantidade: 10 };
      const produtoCriado = { id: 3, ...req.body };
      Produto.create.mockResolvedValue(produtoCriado);

      await produtoController.criar(req, res);

      expect(Produto.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(produtoCriado);
    });
  });

  // --- Testes para a função 'atualizar' ---
  describe('atualizar', () => {
    it('should update a product and return it with status 200', async () => {
      req.params.id = '1';
      req.body = { nome: 'Produto Atualizado' };
      // Criamos um mock de uma instância de produto que tem a função 'update'
      const mockProdutoInstancia = {
        update: jest.fn().mockResolvedValue(),
        id: 1,
        nome: 'Produto Original',
      };
      Produto.findByPk.mockResolvedValue(mockProdutoInstancia);

      await produtoController.atualizar(req, res);

      expect(Produto.findByPk).toHaveBeenCalledWith('1');
      expect(mockProdutoInstancia.update).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith(mockProdutoInstancia);
    });

    it('should return status 404 if product to update is not found', async () => {
      req.params.id = '99';
      Produto.findByPk.mockResolvedValue(null);

      await produtoController.atualizar(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Produto não encontrado.' });
    });
  });

  // --- Testes para a função 'deletar' ---
  describe('deletar', () => {
    it('should delete a product and return a success message with status 200', async () => {
      req.params.id = '1';
      const mockProdutoInstancia = {
        destroy: jest.fn().mockResolvedValue(),
      };
      Produto.findByPk.mockResolvedValue(mockProdutoInstancia);

      await produtoController.deletar(req, res);

      expect(Produto.findByPk).toHaveBeenCalledWith('1');
      expect(mockProdutoInstancia.destroy).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Produto deletado com sucesso.' });
    });

    it('should return status 404 if product to delete is not found', async () => {
      req.params.id = '99';
      Produto.findByPk.mockResolvedValue(null);

      await produtoController.deletar(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Produto não encontrado.' });
    });
  });
});