require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../src/config/db');

(async () => {
  try {
    const username = 'admin';
    const defaultPassword = 'admin123';

    const [rows] = await db.query('SELECT * FROM usuarios WHERE username = ?', [username]);
    if (rows.length > 0) {
      console.log(`Usuário '${username}' já existe (id=${rows[0].id}).`);
      process.exit(0);
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(defaultPassword, saltRounds);

    const [result] = await db.query('INSERT INTO usuarios (username, password) VALUES (?, ?)', [username, hash]);

    console.log(`Usuário '${username}' criado com id=${result.insertId} e senha padrão '${defaultPassword}'.`);
    console.log('Por favor, faça login em /login com essas credenciais e depois altere a senha.');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao garantir usuário admin:', err);
    process.exit(2);
  }
})();
