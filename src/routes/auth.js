const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

// GET /login - Exibir formulário de login
router.get('/login', (req, res) => {
    if (req.session.userId) {
        return res.redirect('/equipamentos');
    }
    res.render('login', { error: null });
});

// POST /login - Processar login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Validação básica
        if (!username || !password) {
            return res.render('login', { error: 'Usuário e senha são obrigatórios' });
        }

        // Buscar usuário no banco
        const [rows] = await db.query('SELECT * FROM usuarios WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.render('login', { error: 'Usuário ou senha inválidos' });
        }

        const user = rows[0];

        // Verificar senha
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.render('login', { error: 'Usuário ou senha inválidos' });
        }

        // Criar sessão
        req.session.userId = user.id;
        req.session.username = user.username;

        res.redirect('/equipamentos');
    } catch (error) {
        console.error('Erro no login:', error);
        res.render('login', { error: 'Erro ao processar login' });
    }
});

// GET /logout - Destruir sessão
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao destruir sessão:', err);
        }
        res.redirect('/login');
    });
});

module.exports = router;
