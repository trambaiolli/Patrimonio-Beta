// Script de teste de conexão MySQL
require('dotenv').config();
const mysql = require('mysql2/promise');

async function testarConexao() {
    console.log('🔍 Testando conexão com MySQL...\n');
    console.log('Configurações:');
    console.log(`   Host: ${process.env.DB_HOST}`);
    console.log(`   User: ${process.env.DB_USER}`);
    console.log(`   Password: ${'*'.repeat(process.env.DB_PASSWORD.length)}`);
    console.log(`   Database: ${process.env.DB_NAME}\n`);

    try {
        // Tentar conectar SEM especificar o banco
        console.log('1️⃣ Testando conexão básica ao MySQL...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });
        console.log('✅ Conexão básica ao MySQL estabelecida!\n');

        // Verificar se o banco existe
        console.log('2️⃣ Verificando se o banco "patrimonio_db" existe...');
        const [databases] = await connection.query('SHOW DATABASES LIKE "patrimonio_db"');
        
        if (databases.length === 0) {
            console.log('❌ Banco de dados "patrimonio_db" NÃO existe!');
            console.log('\n📝 SOLUÇÃO:');
            console.log('   Execute o arquivo db_init.sql no MySQL Workbench');
            console.log('   ou execute: node criar_banco.js\n');
            await connection.end();
            process.exit(1);
        } else {
            console.log('✅ Banco de dados "patrimonio_db" existe!\n');
        }

        // Verificar tabelas
        console.log('3️⃣ Verificando tabelas no banco...');
        await connection.query('USE patrimonio_db');
        const [tables] = await connection.query('SHOW TABLES');
        
        if (tables.length === 0) {
            console.log('❌ Não há tabelas no banco!');
            console.log('\n📝 SOLUÇÃO:');
            console.log('   Execute o arquivo db_init.sql no MySQL Workbench\n');
        } else {
            console.log(`✅ Encontradas ${tables.length} tabela(s):`);
            tables.forEach(table => {
                const tableName = Object.values(table)[0];
                console.log(`   - ${tableName}`);
            });
        }

        // Verificar usuário admin
        console.log('\n4️⃣ Verificando usuário admin...');
        const [users] = await connection.query('SELECT username FROM usuarios WHERE username = "admin"');
        
        if (users.length === 0) {
            console.log('❌ Usuário admin NÃO existe!');
            console.log('\n📝 SOLUÇÃO:');
            console.log('   Execute o arquivo db_init.sql no MySQL Workbench\n');
        } else {
            console.log('✅ Usuário admin encontrado!\n');
        }

        console.log('=' .repeat(60));
        console.log('✅ TUDO CONFIGURADO CORRETAMENTE!');
        console.log('   Você pode iniciar o servidor com: npm start');
        console.log('=' .repeat(60));

        await connection.end();

    } catch (error) {
        console.error('❌ ERRO:', error.message);
        console.error('\n📝 POSSÍVEIS SOLUÇÕES:');
        
        if (error.code === 'ECONNREFUSED') {
            console.error('   1. Certifique-se de que o MySQL está rodando');
            console.error('   2. Verifique a porta (padrão: 3306)');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('   1. Verifique o usuário no arquivo .env');
            console.error('   2. Verifique a senha no arquivo .env');
            console.error('   3. Teste no MySQL Workbench com as mesmas credenciais');
        } else {
            console.error(`   Código do erro: ${error.code}`);
        }
        
        process.exit(1);
    }
}

testarConexao();
