const bcrypt = require('bcrypt');

// Gerar hash para a senha padrão 'admin123'
const password = 'admin123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('Erro ao gerar hash:', err);
        return;
    }
    
    console.log('='.repeat(60));
    console.log('Hash gerado com sucesso!');
    console.log('='.repeat(60));
    console.log('\nSenha original:', password);
    console.log('\nHash bcrypt:');
    console.log(hash);
    console.log('\n' + '='.repeat(60));
    console.log('Copie o hash acima e cole no arquivo db_init.sql');
    console.log('na linha do INSERT INTO usuarios');
    console.log('='.repeat(60));
});
