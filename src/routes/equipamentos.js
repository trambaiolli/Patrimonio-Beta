const express = require('express');
const router = express.Router();
const db = require('../config/db');
const isAuthenticated = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar multer para upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `import_${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || path.extname(file.originalname).toLowerCase() === '.csv') {
            cb(null, true);
        } else {
            cb(new Error('Apenas arquivos CSV são permitidos'));
        }
    }
});

// Aplicar middleware de autenticação em todas as rotas
router.use(isAuthenticated);

// GET /equipamentos - Listar todos os equipamentos (com busca e filtros)
router.get('/', async (req, res) => {
    try {
        const search = req.query.search || '';
        const sala = req.query.sala || '';
        const empresa = req.query.empresa || '';
        
        let query = 'SELECT * FROM equipamentos WHERE 1=1';
        const params = [];

        // Busca geral (NI, TAG, Descrição)
        if (search) {
            query += ' AND (ni LIKE ? OR tag LIKE ? OR descricao LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        // Filtro por sala
        if (sala) {
            query += ' AND sala = ?';
            params.push(sala);
        }

        // Filtro por empresa
        if (empresa) {
            query += ' AND emp = ?';
            params.push(empresa);
        }

        query += ' ORDER BY ni';

        const [equipamentos] = await db.query(query, params);

        // Buscar salas e empresas únicos para os filtros
        const [salas] = await db.query('SELECT DISTINCT sala FROM equipamentos WHERE sala IS NOT NULL ORDER BY sala');
        const [empresas] = await db.query('SELECT DISTINCT emp FROM equipamentos WHERE emp IS NOT NULL ORDER BY emp');

        res.render('equipamentos/lista', {
            equipamentos,
            username: req.session.username,
            message: req.query.message || null,
            messageType: req.query.type || null,
            search,
            sala,
            empresa,
            salas: salas.map(s => s.sala),
            empresas: empresas.map(e => e.emp)
        });
    } catch (error) {
        console.error('Erro ao listar equipamentos:', error);
        res.status(500).send('Erro ao carregar equipamentos');
    }
});

// GET /equipamentos/visualizar/:ni - Visualizar detalhes do equipamento
router.get('/visualizar/:ni', async (req, res) => {
    const { ni } = req.params;

    try {
        const [rows] = await db.query('SELECT * FROM equipamentos WHERE ni = ?', [ni]);

        if (rows.length === 0) {
            return res.redirect('/equipamentos?message=Equipamento não encontrado&type=error');
        }

        res.render('equipamentos/visualizar', {
            equipamento: rows[0],
            username: req.session.username
        });
    } catch (error) {
        console.error('Erro ao buscar equipamento:', error);
        res.redirect('/equipamentos?message=Erro ao buscar equipamento&type=error');
    }
});

// GET /equipamentos/novo - Formulário de novo equipamento
router.get('/novo', (req, res) => {
    res.render('equipamentos/form', {
        equipamento: null,
        username: req.session.username,
        error: null
    });
});

// POST /equipamentos - Criar novo equipamento
router.post('/', async (req, res) => {
    const { ni, tag, descricao, sala, local, bloco, emp, obs } = req.body;

    try {
        // Validação básica
        if (!ni || !tag || !descricao) {
            return res.render('equipamentos/form', {
                equipamento: req.body,
                username: req.session.username,
                error: 'NI, TAG e Descrição são obrigatórios'
            });
        }

        // Inserir no banco
        await db.query(
            'INSERT INTO equipamentos (ni, tag, descricao, sala, local, bloco, emp, obs) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [ni, tag, descricao, sala || null, local || null, bloco || null, emp || null, obs || null]
        );

        res.redirect('/equipamentos?message=Equipamento criado com sucesso&type=success');
    } catch (error) {
        console.error('Erro ao criar equipamento:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.render('equipamentos/form', {
                equipamento: req.body,
                username: req.session.username,
                error: 'Já existe um equipamento com este NI'
            });
        }

        res.render('equipamentos/form', {
            equipamento: req.body,
            username: req.session.username,
            error: 'Erro ao criar equipamento'
        });
    }
});

// GET /equipamentos/editar/:ni - Formulário de edição
router.get('/editar/:ni', async (req, res) => {
    const { ni } = req.params;

    try {
        const [rows] = await db.query('SELECT * FROM equipamentos WHERE ni = ?', [ni]);

        if (rows.length === 0) {
            return res.redirect('/equipamentos?message=Equipamento não encontrado&type=error');
        }

        res.render('equipamentos/form', {
            equipamento: rows[0],
            username: req.session.username,
            error: null
        });
    } catch (error) {
        console.error('Erro ao buscar equipamento:', error);
        res.redirect('/equipamentos?message=Erro ao buscar equipamento&type=error');
    }
});

// POST /equipamentos/editar/:ni - Processar edição
router.post('/editar/:ni', async (req, res) => {
    const { ni } = req.params;
    const { tag, descricao, sala, local, bloco, emp, obs } = req.body;

    try {
        // Validação básica
        if (!tag || !descricao) {
            const [rows] = await db.query('SELECT * FROM equipamentos WHERE ni = ?', [ni]);
            return res.render('equipamentos/form', {
                equipamento: { ni, ...req.body },
                username: req.session.username,
                error: 'TAG e Descrição são obrigatórios'
            });
        }

        // Atualizar no banco
        const [result] = await db.query(
            'UPDATE equipamentos SET tag = ?, descricao = ?, sala = ?, local = ?, bloco = ?, emp = ?, obs = ? WHERE ni = ?',
            [tag, descricao, sala || null, local || null, bloco || null, emp || null, obs || null, ni]
        );

        if (result.affectedRows === 0) {
            return res.redirect('/equipamentos?message=Equipamento não encontrado&type=error');
        }

        res.redirect('/equipamentos?message=Equipamento atualizado com sucesso&type=success');
    } catch (error) {
        console.error('Erro ao atualizar equipamento:', error);
        res.redirect('/equipamentos?message=Erro ao atualizar equipamento&type=error');
    }
});

// POST /equipamentos/excluir/:ni - Excluir equipamento
router.post('/excluir/:ni', async (req, res) => {
    const { ni } = req.params;

    try {
        const [result] = await db.query('DELETE FROM equipamentos WHERE ni = ?', [ni]);

        if (result.affectedRows === 0) {
            return res.redirect('/equipamentos?message=Equipamento não encontrado&type=error');
        }

        res.redirect('/equipamentos?message=Equipamento excluído com sucesso&type=success');
    } catch (error) {
        console.error('Erro ao excluir equipamento:', error);
        res.redirect('/equipamentos?message=Erro ao excluir equipamento&type=error');
    }
});

// GET /equipamentos/exportar - Exportar para CSV
router.get('/exportar', async (req, res) => {
    try {
        const [equipamentos] = await db.query('SELECT * FROM equipamentos ORDER BY ni');

        // Criar CSV
        let csv = 'NI,TAG,Descrição,Sala,Local,Bloco,Empresa,Observações\n';
        
        equipamentos.forEach(equip => {
            csv += `"${equip.ni}","${equip.tag}","${equip.descricao}",`;
            csv += `"${equip.sala || ''}","${equip.local || ''}","${equip.bloco || ''}",`;
            csv += `"${equip.emp || ''}","${(equip.obs || '').replace(/"/g, '""')}"\n`;
        });

        // Definir headers para download
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename=equipamentos_${new Date().toISOString().split('T')[0]}.csv`);
        
        // Adicionar BOM para UTF-8
        res.write('\uFEFF');
        res.end(csv);
    } catch (error) {
        console.error('Erro ao exportar equipamentos:', error);
        res.redirect('/equipamentos?message=Erro ao exportar equipamentos&type=error');
    }
});

// GET /equipamentos/importar - Página de importação de CSV
router.get('/importar', (req, res) => {
    res.render('equipamentos/importar', {
        username: req.session.username,
        message: req.query.message || null,
        messageType: req.query.type || null,
        resultado: null
    });
});

// POST /equipamentos/importar - Processar importação de CSV
router.post('/importar', upload.single('csvFile'), async (req, res) => {
    if (!req.file) {
        return res.render('equipamentos/importar', {
            username: req.session.username,
            message: 'Nenhum arquivo foi enviado',
            messageType: 'error',
            resultado: null
        });
    }

    try {
        const filePath = req.file.path;
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        
        // Remover BOM se existir
        const content = fileContent.replace(/^\uFEFF/, '');
        
        // Dividir em linhas
        const lines = content.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
            fs.unlinkSync(filePath); // Remover arquivo
            return res.render('equipamentos/importar', {
                username: req.session.username,
                message: 'Arquivo CSV vazio ou inválido',
                messageType: 'error',
                resultado: null
            });
        }

        // Pular cabeçalho e processar linhas
        const dataLines = lines.slice(1);
        let sucessos = 0;
        let erros = 0;
        let duplicados = 0;
        const detalhesErros = [];

        for (const line of dataLines) {
            try {
                // Parser CSV simples considerando aspas
                const values = [];
                let currentValue = '';
                let insideQuotes = false;
                
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    
                    if (char === '"') {
                        if (insideQuotes && line[i + 1] === '"') {
                            currentValue += '"';
                            i++;
                        } else {
                            insideQuotes = !insideQuotes;
                        }
                    } else if (char === ',' && !insideQuotes) {
                        values.push(currentValue.trim());
                        currentValue = '';
                    } else {
                        currentValue += char;
                    }
                }
                values.push(currentValue.trim());

                // Validar quantidade de campos
                if (values.length < 3) {
                    erros++;
                    detalhesErros.push(`Linha ignorada (campos insuficientes): ${line.substring(0, 50)}...`);
                    continue;
                }

                const [ni, tag, descricao, sala, local, bloco, emp, obs] = values;

                // Validação de campos obrigatórios
                if (!ni || !tag || !descricao) {
                    erros++;
                    detalhesErros.push(`NI ${ni || 'vazio'}: campos obrigatórios faltando`);
                    continue;
                }

                // Verificar se já existe
                const [existing] = await db.query('SELECT ni FROM equipamentos WHERE ni = ?', [ni]);
                
                if (existing.length > 0) {
                    duplicados++;
                    continue;
                }

                // Inserir no banco
                await db.query(
                    'INSERT INTO equipamentos (ni, tag, descricao, sala, local, bloco, emp, obs) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [ni, tag, descricao, sala || null, local || null, bloco || null, emp || null, obs || null]
                );
                
                sucessos++;
            } catch (lineError) {
                erros++;
                detalhesErros.push(`Erro na linha: ${lineError.message}`);
            }
        }

        // Remover arquivo temporário
        fs.unlinkSync(filePath);

        // Renderizar resultado
        res.render('equipamentos/importar', {
            username: req.session.username,
            message: null,
            messageType: null,
            resultado: {
                total: dataLines.length,
                sucessos,
                erros,
                duplicados,
                detalhesErros: detalhesErros.slice(0, 10) // Limitar a 10 erros
            }
        });

    } catch (error) {
        console.error('Erro ao importar CSV:', error);
        
        // Remover arquivo se existir
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.render('equipamentos/importar', {
            username: req.session.username,
            message: 'Erro ao processar arquivo: ' + error.message,
            messageType: 'error',
            resultado: null
        });
    }
});

// GET /equipamentos/imprimir-lista - Imprimir resultados filtrados
router.get('/imprimir-lista', async (req, res) => {
    try {
        const search = req.query.search || '';
        const sala = req.query.sala || '';
        const empresa = req.query.empresa || '';
        
        let query = 'SELECT * FROM equipamentos WHERE 1=1';
        const params = [];

        // Aplicar os mesmos filtros da listagem
        if (search) {
            query += ' AND (ni LIKE ? OR tag LIKE ? OR descricao LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        if (sala) {
            query += ' AND sala = ?';
            params.push(sala);
        }

        if (empresa) {
            query += ' AND emp = ?';
            params.push(empresa);
        }

        query += ' ORDER BY ni';

        const [equipamentos] = await db.query(query, params);

        res.render('equipamentos/imprimir-lista', {
            equipamentos,
            search,
            sala,
            empresa,
            dataImpressao: new Date().toLocaleString('pt-BR')
        });
    } catch (error) {
        console.error('Erro ao gerar impressão:', error);
        res.redirect('/equipamentos?message=Erro ao gerar impressão&type=error');
    }
});

// GET /equipamentos/imprimir/:ni - Página de impressão de etiqueta
router.get('/imprimir/:ni', async (req, res) => {
    const { ni } = req.params;

    try {
        const [rows] = await db.query('SELECT * FROM equipamentos WHERE ni = ?', [ni]);

        if (rows.length === 0) {
            return res.redirect('/equipamentos?message=Equipamento não encontrado&type=error');
        }

        res.render('equipamentos/imprimir', {
            equipamento: rows[0]
        });
    } catch (error) {
        console.error('Erro ao gerar etiqueta:', error);
        res.redirect('/equipamentos?message=Erro ao gerar etiqueta&type=error');
    }
});

module.exports = router;
