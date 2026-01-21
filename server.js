const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração de sessão
app.use(session({
    secret: process.env.SESSION_SECRET || 'sua_chave_secreta_super_segura',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 horas
    }
}));

// Rotas
const authRoutes = require('./src/routes/auth');
const equipamentosRoutes = require('./src/routes/equipamentos');

app.use('/', authRoutes);
app.use('/equipamentos', equipamentosRoutes);

// Rota raiz - dashboard ou login
app.get('/', async (req, res) => {
    if (req.session.userId) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

// Rota de dashboard
app.get('/dashboard', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    try {
        const db = require('./src/config/db');
        
        // Estatísticas
        const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM equipamentos');
        const [porSala] = await db.query('SELECT sala, COUNT(*) as total FROM equipamentos WHERE sala IS NOT NULL GROUP BY sala ORDER BY total DESC LIMIT 5');
        const [porEmpresa] = await db.query('SELECT emp, COUNT(*) as total FROM equipamentos WHERE emp IS NOT NULL GROUP BY emp ORDER BY total DESC LIMIT 5');
        const [ultimos] = await db.query('SELECT * FROM equipamentos ORDER BY ni DESC LIMIT 5');

        res.render('dashboard', {
            username: req.session.username,
            total,
            porSala,
            porEmpresa,
            ultimos
        });
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        res.redirect('/equipamentos');
    }
});

// Tratamento de erros 404
app.use((req, res) => {
    res.status(404).send('Página não encontrada');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log('Pressione Ctrl+C para parar o servidor');
});
