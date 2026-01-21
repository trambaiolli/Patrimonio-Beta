Crie um aplicativo web completo em Node.js com Express e MySQL que atenda aos seguintes requisitos:

🔹 1. Banco de Dados (MySQL)
Crie um script SQL (db_init.sql) compatível com MySQL Workbench com duas tabelas:
equipamentos com as colunas exatamente como na planilha:
ni (VARCHAR(50), PRIMARY KEY)
tag (VARCHAR(100), NOT NULL)
descricao (VARCHAR(255), NOT NULL)
sala (VARCHAR(50), NULL)
local (VARCHAR(100), NULL)
bloco (VARCHAR(50), NULL)
emp (VARCHAR(100), NULL) — empresa
obs (TEXT, NULL)
usuarios para autenticação:
id (INT, AUTO_INCREMENT, PRIMARY KEY)
username (VARCHAR(50), UNIQUE, NOT NULL)
password (VARCHAR(255), NOT NULL — hash com bcrypt)
🔹 2. Backend (Node.js + Express)
Use as seguintes dependências no package.json:
json
12345678
Estrutura de pastas:
123456789
🔹 3. Autenticação
Implemente login com username e password
Armazene a sessão com express-session
Proteja todas as rotas de CRUD com middleware de autenticação (/middleware/auth.js)
Rota /login com formulário (GET) e processamento (POST)
Rota /logout para destruir a sessão
🔹 4. Funcionalidades CRUD para equipamentos
Listar: Rota GET /equipamentos (exibe todos os registros em tabela)
Criar: GET /equipamentos/novo (formulário) e POST /equipamentos
Editar: GET /equipamentos/editar/:ni e POST /equipamentos/editar/:ni
Excluir: POST /equipamentos/excluir/:ni
Todas as rotas acima devem exigir autenticação
🔹 5. Frontend Simples
Use EJS como engine de templates
Layout base com cabeçalho, menu de navegação e área de conteúdo
Estilização mínima com CSS embutido ou arquivo /public/style.css
Mensagens de feedback (sucesso/erro) após operações
🔹 6. Conexão com Banco de Dados
Use mysql2 com pool de conexões
Carregue credenciais do .env:
12345
Crie um arquivo /src/config/db.js para gerenciar a conexão
🔹 7. Segurança Básica
Use bcrypt para hashear senhas no cadastro de usuário (apenas admin inicial via script SQL)
Evite SQL injection usando prepared statements (mysql2)
Valide e sanitize entradas do usuário
Observação: Não implemente cadastro de novos usuários via interface — apenas um usuário inicial via script SQL (ex: username: admin, password: admin123 → hasheada).

Saída esperada: Um projeto pronto para rodar com npm install e node server.js, após configurar o MySQL localmente e executar db_init.sql.