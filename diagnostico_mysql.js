// Diagnóstico completo do MySQL
require('dotenv').config();

console.log('🔍 DIAGNÓSTICO DO MYSQL\n');
console.log('═'.repeat(60));

// 1. Verificar variáveis de ambiente
console.log('\n1️⃣ VARIÁVEIS DE AMBIENTE (.env):');
console.log(`   DB_HOST: ${process.env.DB_HOST || '❌ NÃO DEFINIDO'}`);
console.log(`   DB_PORT: ${process.env.DB_PORT || '⚠️  NÃO DEFINIDO (usará 3306)'}`);
console.log(`   DB_USER: ${process.env.DB_USER || '❌ NÃO DEFINIDO'}`);
console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '✅ DEFINIDO (' + '*'.repeat(process.env.DB_PASSWORD.length) + ')' : '❌ NÃO DEFINIDO'}`);
console.log(`   DB_NAME: ${process.env.DB_NAME || '❌ NÃO DEFINIDO'}`);

// 2. Tentar diferentes configurações
console.log('\n2️⃣ TESTANDO CONEXÕES:\n');

const configs = [
    { host: 'localhost', port: 3306, name: 'localhost:3306' },
    { host: '127.0.0.1', port: 3306, name: '127.0.0.1:3306' },
    { host: 'localhost', port: 3307, name: 'localhost:3307' },
    { host: '127.0.0.1', port: 3307, name: '127.0.0.1:3307' },
];

async function testarConfigs() {
    const mysql = require('mysql2/promise');
    
    for (const config of configs) {
        try {
            process.stdout.write(`   Testando ${config.name}... `);
            const conn = await mysql.createConnection({
                host: config.host,
                port: config.port,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                connectTimeout: 2000
            });
            console.log('✅ SUCESSO!');
            
            // Verificar banco
            const [dbs] = await conn.query('SHOW DATABASES LIKE "patrimonio_db"');
            if (dbs.length > 0) {
                console.log(`      ✅ Banco "patrimonio_db" existe nesta conexão!`);
                console.log(`\n✨ SOLUÇÃO ENCONTRADA!`);
                console.log(`   Use estas configurações no .env:`);
                console.log(`   DB_HOST=${config.host}`);
                console.log(`   DB_PORT=${config.port}\n`);
            }
            
            await conn.end();
            return true;
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                console.log('❌ Conexão recusada');
            } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
                console.log('⚠️  Acesso negado (senha incorreta)');
            } else if (error.errno === 'ETIMEDOUT') {
                console.log('⏱️  Timeout');
            } else {
                console.log(`❌ ${error.code || error.message}`);
            }
        }
    }
    
    return false;
}

async function verificarServico() {
    console.log('\n3️⃣ VERIFICANDO SERVIÇO MYSQL:\n');
    
    const { execSync } = require('child_process');
    
    try {
        const result = execSync('sc query MySQL80', { encoding: 'utf8' });
        if (result.includes('RUNNING')) {
            console.log('   ✅ Serviço MySQL80 está RODANDO');
        } else {
            console.log('   ❌ Serviço MySQL80 NÃO está rodando');
            console.log('   💡 Inicie o serviço: net start MySQL80');
        }
    } catch (error) {
        console.log('   ❌ Não foi possível verificar o serviço');
    }
}

async function main() {
    await verificarServico();
    const sucesso = await testarConfigs();
    
    if (!sucesso) {
        console.log('\n❌ NENHUMA CONEXÃO FOI BEM-SUCEDIDA!\n');
        console.log('📝 SOLUÇÕES POSSÍVEIS:');
        console.log('   1. Verifique se o MySQL está rodando:');
        console.log('      - Abra o MySQL Workbench');
        console.log('      - Tente conectar com as mesmas credenciais');
        console.log('   ');
        console.log('   2. Verifique a senha no arquivo .env');
        console.log('      - Senha atual: ' + process.env.DB_PASSWORD);
        console.log('   ');
        console.log('   3. Reinicie o MySQL como administrador:');
        console.log('      - Abra PowerShell como Admin');
        console.log('      - Execute: Restart-Service MySQL80');
        console.log('   ');
        console.log('   4. Verifique o arquivo my.ini do MySQL');
        console.log('      - Procure por "port=" para ver a porta configurada');
    }
    
    console.log('\n' + '═'.repeat(60));
}

main().catch(console.error);
