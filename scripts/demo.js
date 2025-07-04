const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // ajuste conforme necessário
  validateStatus: () => true // evita que erros 4xx/5xx travem o script
});

let token = '';

// Utilitário para exibir a requisição e a resposta
async function makeRequest(method, url, data = null, auth = false) {
  console.log(`\n🔹 ${method.toUpperCase()} ${url}`);
  if (data) console.log(`📤 Payload:`, data);

  try {
    const response = await api.request({
      method,
      url,
      data,
      headers: auth ? { Authorization: `Bearer ${token}` } : {}
    });

    console.log(`✅ Status: ${response.status}`);
    console.log(`📥 Resposta:`, response.data);
    return response.data;
  } catch (err) {
    console.error('❌ Erro:', err.message);
  }
}

(async () => {
  // 1. Criar usuário admin (se necessário, senão faça login com um já existente)
  await makeRequest('post', '/usuarios', {
    nome: 'Admin',
    email: 'admin@admin.com',
    senha: '123456',
    papel: 'admin'
  });

  // 2. Login
  const login = await makeRequest('post', '/usuarios/login', {
    email: 'admin@admin.com',
    senha: '123456'
  });

  token = login.token;

  // 3. Criar categoria
  const categoria = await makeRequest('post', '/categorias', {
    nome: 'Medicamentos'
  }, true);

  // 4. Criar fornecedor
  const fornecedor = await makeRequest('post', '/fornecedores', {
    nome: 'Fornecedor A',
    cnpj: '12345678000100',
    contato: '12345678',
    email: 'fornecedor@example.com'
  }, true);

  // 5. Criar setor
  const setor = await makeRequest('post', '/setores', {
    nome: 'Laboratório',
    descricao: 'Setor de testes'
  }, true);

  // 6. Criar produto
  await makeRequest('post', '/produtos', {
    nome: 'Produto Teste',
    descricao: 'Descrição do produto',
    unidade: 'cx',
    validade: '2025-12-31',
    quantidade: 100,
    CategoriumId: categoria.id,
    FornecedorId: fornecedor.id,
    SetorId: setor.id
  }, true);
})();
