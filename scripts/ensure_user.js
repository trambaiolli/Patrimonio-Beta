// Uso: node scripts/ensure_user.js <usuario> <senha> [admin|visitante]
require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../src/config/db');

(async () => {
  const [username, password, role = 'admin'] = process.argv.slice(2);
  if (!username || !password || !['admin', 'visitante'].includes(role)) {
    console.error(
      'Uso: node scripts/ensure_user.js <usuario> <senha> [admin|visitante]'
    );
    process.exit(1);
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const [rows] = await db.query(
      'SELECT id FROM usuarios WHERE username = ?',
      [username]
    );

    if (rows.length > 0) {
      await db.query(
        'UPDATE usuarios SET password = ?, role = ? WHERE id = ?',
        [hash, role, rows[0].id]
      );
      console.log(`Usuário '${username}' atualizado (${role}).`);
    } else {
      await db.query(
        'INSERT INTO usuarios (username, password, role) VALUES (?, ?, ?)',
        [username, hash, role]
      );
      console.log(`Usuário '${username}' criado (${role}).`);
    }
    process.exit(0);
  } catch (err) {
    console.error('Erro ao criar/atualizar usuário:', err);
    process.exit(2);
  }
})();
