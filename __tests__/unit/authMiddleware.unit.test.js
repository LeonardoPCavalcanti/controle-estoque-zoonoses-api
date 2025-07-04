// 1. A simulação (mock) da biblioteca 'jsonwebtoken' é declarada ANTES de qualquer importação.
jest.mock('jsonwebtoken');

// 2. Agora, importamos os módulos que vamos usar.
const autenticarToken = require('../../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

// Descreve a suíte de testes para o authMiddleware
describe('Unit Tests for authMiddleware', () => {
  let req, res, next;

  // A função 'beforeEach' roda antes de CADA teste para garantir um ambiente limpo.
  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });


  // --- Cenário 1: O Caminho Feliz ---
  it('should call next() and attach user to req if a valid token is provided', () => {
    // --- ARRANGE (Preparação) ---
    req.headers['authorization'] = 'Bearer token_valido';
    const mockUsuario = { id: 1, papel: 'admin' };

    // Simulamos a função 'verify'. Ela recebe 3 argumentos: token, secret e o callback.
    // Nossa simulação executa o callback, passando 'null' para o erro e o nosso
    // 'mockUsuario' como o payload decodificado.
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, mockUsuario);
    });

    // --- ACT (Ação) ---
    autenticarToken(req, res, next);

    // --- ASSERT (Verificação) ---
    // Verificamos se 'jwt.verify' foi chamado corretamente
    expect(jwt.verify).toHaveBeenCalledWith('token_valido', process.env.SECRET, expect.any(Function));
    // Verificamos se o usuário foi anexado à requisição
    expect(req.usuario).toBe(mockUsuario);
    // Verificamos se a requisição pode continuar
    expect(next).toHaveBeenCalledTimes(1);
  });


  // --- Cenário 2: Falha por Falta de Token ---
  it('should return 401 Unauthorized if no token is provided', () => {
    autenticarToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensagem: 'Token não fornecido.' });
    expect(next).not.toHaveBeenCalled();
  });


  // --- Cenário 3: Falha por Token Inválido ---
  it('should return 403 Forbidden if token is invalid', () => {
    // --- ARRANGE (Preparação) ---
    req.headers['authorization'] = 'Bearer token_invalido';
    const erroJwt = new Error('Token verification failed');

    // Simulamos o 'verify' para chamar o callback com um erro.
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(erroJwt, null);
    });

    // --- ACT (Ação) ---
    autenticarToken(req, res, next);

    // --- ASSERT (Verificação) ---
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ mensagem: 'Token inválido.' });
    expect(next).not.toHaveBeenCalled();
  });
});