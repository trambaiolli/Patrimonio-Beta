require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../src/config/db');

(async () => {
  try {
    const username = 'visitante';
    const password = process.argv[2] || 'visitante123';

    const [cols] = await db.query("SHOW COLUMNS FROM usuarios LIKE 'role'");
    if (cols.length === 0) {
      await db.query(
        "ALTER TABLE usuarios ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'admin'"
      );
      console.log("Coluna 'role' criada em usuarios.");
    }

    const hash = await bcrypt.hash(password, 10);
    const [rows] = await db.query(
      'SELECT id FROM usuarios WHERE username = ?',
      [username]
    );

    if (rows.length > 0) {
      await db.query(
        "UPDATE usuarios SET password = ?, role = 'visitante' WHERE id = ?",
        [hash, rows[0].id]
      );
      console.log(`Usuário '${username}' atualizado (somente leitura).`);
    } else {
      await db.query(
        "INSERT INTO usuarios (username, password, role) VALUES (?, ?, 'visitante')",
        [username, hash]
      );
      console.log(`Usuário '${username}' criado (somente leitura).`);
    }
    console.log(`Senha: ${password}`);
    process.exit(0);
  } catch (err) {
    console.error('Erro ao criar usuário visitante:', err);
    process.exit(2);
  }
})();
