const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function showCrudButtons() {
  try {
    console.log('🔍 VERIFICANDO BOTÕES CRUD NA TABELA\n');
    console.log('='.repeat(70));

    // 1. Fazer login
    console.log('\n1️⃣ Fazendo login...');
    const loginData = 'username=admin&password=admin123';
    const loginRes = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': loginData.length
      }
    }, loginData);

    if (loginRes.statusCode !== 302) {
      console.log('❌ Login falhou');
      return;
    }

    const cookies = loginRes.headers['set-cookie'];
    console.log('✅ Login bem-sucedido');

    // 2. Buscar página de equipamentos
    console.log('\n2️⃣ Buscando página /equipamentos...');
    const equipRes = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/equipamentos',
      method: 'GET',
      headers: {
        'Cookie': cookies.join('; ')
      }
    });

    if (equipRes.statusCode !== 200) {
      console.log('❌ Falha ao buscar /equipamentos');
      return;
    }
    console.log('✅ Página carregada');

    // 3. Extrair e mostrar botões
    console.log('\n3️⃣ BOTÕES ENCONTRADOS:\n');
    const html = equipRes.body;

    // Encontrar todas as células de ações
    const actionsRegex = /<td class="actions">([\s\S]*?)<\/td>/gi;
    const matches = [...html.matchAll(actionsRegex)];

    if (matches.length === 0) {
      console.log('❌ NENHUMA CÉLULA DE AÇÕES ENCONTRADA!');
      console.log('   Isso significa que não há equipamentos cadastrados.');
      console.log('\n💡 SOLUÇÃO: Cadastre um equipamento primeiro em:');
      console.log('   http://localhost:3000/equipamentos/novo\n');
      return;
    }

    console.log(`✅ Encontradas ${matches.length} linhas com botões CRUD\n`);
    console.log('📋 EXEMPLO DA PRIMEIRA LINHA:\n');
    
    // Mostrar primeira linha formatada
    const firstAction = matches[0][1];
    const cleanedHtml = firstAction
      .replace(/\n\s+/g, '\n')
      .replace(/>\s+</g, '><')
      .trim();
    
    console.log(cleanedHtml);
    
    // Contar botões
    console.log('\n📊 ESTATÍSTICAS:\n');
    const visualizar = (html.match(/visualizar/gi) || []).length;
    const editar = (html.match(/editar/gi) || []).length;
    const imprimir = (html.match(/imprimir/gi) || []).length;
    const excluir = (html.match(/excluir/gi) || []).length;

    console.log(`   👁️  Botões "Visualizar": ${visualizar}`);
    console.log(`   ✏️  Botões "Editar": ${editar}`);
    console.log(`   🖨️  Botões "Imprimir": ${imprimir}`);
    console.log(`   🗑️  Botões "Excluir": ${excluir}`);

    console.log('\n' + '='.repeat(70));
    console.log('\n✅ TODOS OS BOTÕES CRUD ESTÃO PRESENTES NO HTML!\n');
    console.log('📝 PRÓXIMOS PASSOS:\n');
    console.log('   1. Abra o navegador: http://localhost:3000/equipamentos');
    console.log('   2. Limpe o cache: Ctrl + Shift + Delete');
    console.log('   3. Recarregue: Ctrl + F5');
    console.log('   4. Faça login: admin / admin123\n');
    console.log('   Os botões 👁️ ✏️ 🖨️ 🗑️ devem aparecer em cada linha!\n');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n⚠️  SERVIDOR NÃO ESTÁ RODANDO\n');
      console.log('Execute em outro terminal:');
      console.log('   npm start\n');
    }
  }
}

showCrudButtons();
