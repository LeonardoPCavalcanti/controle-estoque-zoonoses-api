const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' }
});

let token = '';
let categoriaId, setorId, fornecedorId, produtoId;

async function runDemo() {
  try {
    console.log('🚀 Iniciando demo de requisições...\n');

    // 1. Registrar usuário (se ainda não existir)
    const usuarioPayload = {
      nome: 'Admin',
      email: 'admin@admin.com',
      senha: '123456',
      papel: 'admin'
    };

    console.log('📡 POST /usuarios/registrar');
    console.log('📦 Payload:', usuarioPayload);
    try {
      const res = await api.post('/usuarios/registrar', usuarioPayload);
      console.log('📥 Resposta:', res.status, res.data);
    } catch (err) {
      if (err.response?.status === 400) {
        console.log('❌ Usuário já cadastrado.');
      } else {
        throw err;
      }
    }

    // 2. Login
    console.log('\n📡 POST /usuarios/login');
    const loginRes = await api.post('/usuarios/login', {
      email: usuarioPayload.email,
      senha: usuarioPayload.senha
    });
    console.log('📥 Resposta:', loginRes.status, loginRes.data);
    token = loginRes.data.token;

    // Atualiza o header Authorization
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // 3. Criar categoria
    console.log('\n📡 POST /categorias');
    const catRes = await api.post('/categorias', { nome: 'Categoria Teste' });
    categoriaId = catRes.data.id;
    console.log('📥 Resposta:', catRes.status, catRes.data);

    // 4. Criar setor
    console.log('\n📡 POST /setores');
    const setorRes = await api.post('/setores', { nome: 'Setor Teste' });
    setorId = setorRes.data.id;
    console.log('📥 Resposta:', setorRes.status, setorRes.data);

    // 5. Criar fornecedor
    console.log('\n📡 POST /fornecedores');
    const fornRes = await api.post('/fornecedores', {
      nome: 'Fornecedor Teste',
      contato: '123456789'
    });
    fornecedorId = fornRes.data.id;
    console.log('📥 Resposta:', fornRes.status, fornRes.data);

    // 6. Criar produto
    console.log('\n📡 POST /produtos');
    const prodRes = await api.post('/produtos', {
      nome: 'Produto Teste',
      descricao: 'Descrição de teste',
      categoriaId,
      fornecedorId,
      setorId,
      quantidade: 10,
      validade: '2025-12-31'
    });
    produtoId = prodRes.data.id;
    console.log('📥 Resposta:', prodRes.status, prodRes.data);

    // 7. Listar produtos
    console.log('\n📡 GET /produtos');
    const produtos = await api.get('/produtos');
    console.log('📥 Resposta:', produtos.status, produtos.data);

    // ✅ Concluído
    console.log('\n✅ Requisições concluídas com sucesso!');

  } catch (err) {
    if (err.response) {
      console.error('❌ Erro:', err.response.status, err.response.data);
    } else {
      console.error('❌ Erro inesperado:', err.message);
    }
  } finally {
    // 🔁 Limpeza: deletar produto, fornecedor, setor, categoria
    try {
      if (produtoId) {
        console.log('\n🧹 DELETE /produtos/' + produtoId);
        await api.delete(`/produtos/${produtoId}`);
        console.log('✔ Produto deletado.');
      }

      if (fornecedorId) {
        console.log('🧹 DELETE /fornecedores/' + fornecedorId);
        await api.delete(`/fornecedores/${fornecedorId}`);
        console.log('✔ Fornecedor deletado.');
      }

      if (setorId) {
        console.log('🧹 DELETE /setores/' + setorId);
        await api.delete(`/setores/${setorId}`);
        console.log('✔ Setor deletado.');
      }

      if (categoriaId) {
        console.log('🧹 DELETE /categorias/' + categoriaId);
        await api.delete(`/categorias/${categoriaId}`);
        console.log('✔ Categoria deletada.');
      }

      console.log('\n🧼 Limpeza finalizada.');

    } catch (cleanupErr) {
      console.error('⚠ Erro durante a limpeza:', cleanupErr.response?.data || cleanupErr.message);
    }
  }
}

runDemo();
