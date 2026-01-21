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

async function testCrudButtons() {
  try {
    console.log('🔍 Testando presença de botões CRUD...\n');

    // 1. Fazer login
    console.log('1️⃣ Fazendo login...');
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
      console.log('❌ Login falhou. Status:', loginRes.statusCode);
      console.log('Body:', loginRes.body.substring(0, 200));
      return;
    }

    const cookies = loginRes.headers['set-cookie'];
    if (!cookies) {
      console.log('❌ Nenhum cookie de sessão recebido');
      return;
    }
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
      console.log('❌ Falha ao buscar /equipamentos. Status:', equipRes.statusCode);
      return;
    }
    console.log('✅ Página carregada');

    // 3. Verificar presença de botões
    console.log('\n3️⃣ Verificando botões CRUD...\n');
    const html = equipRes.body;

    const checks = [
      { name: 'Botão "Novo Equipamento"', pattern: /Novo Equipamento/i },
      { name: 'Botão "Visualizar" (👁️)', pattern: /equipamentos\/visualizar/i },
      { name: 'Botão "Editar" (✏️)', pattern: /equipamentos\/editar/i },
      { name: 'Botão "Imprimir" (🖨️)', pattern: /equipamentos\/imprimir/i },
      { name: 'Botão "Excluir" (🗑️)', pattern: /equipamentos\/excluir/i },
      { name: 'Classe btn', pattern: /class="btn/i },
      { name: 'Classe btn-primary', pattern: /class="[^"]*btn-primary/i },
      { name: 'Classe btn-sm', pattern: /class="[^"]*btn-sm/i }
    ];

    let allFound = true;
    for (const check of checks) {
      const found = check.pattern.test(html);
      console.log(`   ${found ? '✅' : '❌'} ${check.name}`);
      if (!found) allFound = false;
    }

    // 4. Extrair e mostrar exemplo de botão
    console.log('\n4️⃣ Exemplo de HTML dos botões:\n');
    const btnMatch = html.match(/<a[^>]*class="[^"]*btn[^"]*"[^>]*>.*?<\/a>/i);
    if (btnMatch) {
      console.log('   ' + btnMatch[0].substring(0, 150) + '...');
    } else {
      console.log('   ❌ Nenhum botão <a class="btn"> encontrado no HTML');
    }

    // 5. Verificar se há estilos inline que possam ocultar
    console.log('\n5️⃣ Verificando estilos que podem ocultar botões:\n');
    const hidePatterns = [
      /display:\s*none/gi,
      /visibility:\s*hidden/gi,
      /opacity:\s*0/gi
    ];

    for (const pattern of hidePatterns) {
      const matches = html.match(pattern);
      if (matches) {
        console.log(`   ⚠️  Encontrado: ${matches.length}x ${pattern.source}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    if (allFound) {
      console.log('✅ TODOS OS BOTÕES ESTÃO NO HTML!');
      console.log('   O problema pode ser no CSS do navegador.');
      console.log('   Abra o navegador e pressione F12 > Console para ver erros.');
    } else {
      console.log('❌ ALGUNS BOTÕES NÃO FORAM ENCONTRADOS');
      console.log('   Verificar templates em views/equipamentos/');
    }

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n⚠️  Servidor não está rodando na porta 3000');
      console.log('   Execute: npm start');
    }
  }
}

testCrudButtons();
