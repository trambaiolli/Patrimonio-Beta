# Sistema de Gestão de Patrimônio

Sistema web completo para gerenciamento de equipamentos patrimoniais desenvolvido com Node.js, Express, MySQL e EJS.

## 🚀 Funcionalidades

- **Autenticação de usuários** com sessão
- **CRUD completo** de equipamentos (Criar, Ler, Atualizar, Deletar)
- **Busca e filtros** por NI, TAG, Descrição, Sala e Empresa
- **Exportação de dados** para CSV
- **Importação em massa** via arquivo CSV 📥
- **Impressão de etiquetas** individuais e listagens
- **Interface responsiva** e amigável
- **Segurança** com bcrypt para senhas e prepared statements
- **Mensagens de feedback** para operações

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL (versão 5.7 ou superior)
- MySQL Workbench (opcional, mas recomendado)

## 🔧 Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar banco de dados MySQL

Abra o MySQL Workbench ou MySQL CLI e execute o script `db_init.sql`:

```bash
mysql -u root -p < db_init.sql
```

Ou no MySQL Workbench:
- Abra o arquivo `db_init.sql`
- Execute o script (botão ⚡ ou Ctrl+Shift+Enter)

**IMPORTANTE:** Antes de executar o script SQL, você precisa gerar o hash correto da senha. Execute o seguinte comando:

```bash
node generate_hash.js
```

Copie o hash gerado e substitua no arquivo `db_init.sql` na linha do INSERT do usuário admin.

### 3. Configurar variáveis de ambiente

Copie o arquivo de exemplo:

```bash
copy .env.example .env
```

Edite o arquivo `.env` com suas credenciais do MySQL:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=patrimonio_db
SESSION_SECRET=sua_chave_secreta_aleatoria
```

## ▶️ Executar o aplicativo

### Modo de desenvolvimento (com auto-reload):

```bash
npm run dev
```

### Modo de produção:

```bash
npm start
```

O servidor estará rodando em: **http://localhost:3000**

## 🔐 Credenciais padrão

- **Usuário:** admin
- **Senha:** admin123

## 📁 Estrutura do Projeto

```
Patrimonio Beta/
├── server.js                 # Arquivo principal do servidor
├── package.json              # Dependências e scripts
├── .env                      # Variáveis de ambiente (criar manualmente)
├── .env.example              # Exemplo de variáveis de ambiente
├── db_init.sql               # Script de inicialização do banco
├── generate_hash.js          # Script para gerar hash de senha
├── dados.xlsx                # Planilha de dados original
├── public/
│   └── style.css             # Estilos CSS
├── src/
│   ├── config/
│   │   └── db.js             # Configuração do pool MySQL
│   ├── middleware/
│   │   └── auth.js           # Middleware de autenticação
│   └── routes/
│       ├── auth.js           # Rotas de autenticação
│       └── equipamentos.js   # Rotas CRUD de equipamentos
└── views/
    ├── login.ejs             # Página de login
    ├── layout.ejs            # Layout base
    └── equipamentos/
        ├── lista.ejs         # Listagem de equipamentos
        └── form.ejs          # Formulário de criar/editar
```

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MySQL2** - Driver MySQL com suporte a promises
- **EJS** - Template engine
- **bcrypt** - Hash de senhas
- **express-session** - Gerenciamento de sessões
- **dotenv** - Variáveis de ambiente
- **body-parser** - Parse de requisições

## 📝 Uso

### Autenticação

1. Acesse `http://localhost:3000`
2. Faça login com as credenciais padrão
3. Você será redirecionado para a lista de equipamentos

### Gerenciar Equipamentos

- **Listar:** Visualize todos os equipamentos na página inicial
- **Criar:** Clique em "+ Novo Equipamento"
- **Editar:** Clique em "Editar" na linha do equipamento
- **Excluir:** Clique em "Excluir" (com confirmação)

### Campos do Equipamento

- **NI** (obrigatório): Número de identificação único
- **TAG** (obrigatório): Tag do equipamento
- **Descrição** (obrigatório): Descrição do equipamento
- **Sala** (opcional): Número da sala
- **Local** (opcional): Localização específica
- **Bloco** (opcional): Bloco do prédio
- **Empresa** (opcional): Empresa responsável
- **Observações** (opcional): Notas adicionais

### Importação em Massa (CSV)

Para importar múltiplos equipamentos de uma vez:

1. **Acesse:** Clique em "📥 Importar CSV" na lista de equipamentos
2. **Prepare o arquivo:** Use o formato CSV com os campos especificados
3. **Faça o upload:** Arraste o arquivo ou clique para selecionar
4. **Verifique os resultados:** Confira estatísticas de sucessos, duplicados e erros

📖 **Documentação completa:** Consulte [IMPORT_CSV_GUIDE.md](IMPORT_CSV_GUIDE.md) para instruções detalhadas e exemplos.

💡 **Arquivo de exemplo:** Use `exemplo_importacao.csv` como modelo.

## 🔒 Segurança

- Senhas são hasheadas com bcrypt (salt rounds: 10)
- SQL injection prevenido com prepared statements
- Sessões configuradas com secret key
- Todas as rotas CRUD protegidas por autenticação
- Validação de entrada em todos os formulários

## 🐛 Solução de Problemas

### Erro de conexão com MySQL

- Verifique se o MySQL está rodando
- Confirme as credenciais no arquivo `.env`
- Verifique se o banco `patrimonio_db` foi criado

### Erro de autenticação

- Verifique se o hash da senha foi gerado corretamente
- Execute o script `generate_hash.js` novamente
- Atualize o arquivo `db_init.sql` com o novo hash

### Porta 3000 já em uso

Altere a porta no arquivo `.env`:

```env
PORT=3001
```

## 📄 Licença

ISC

## 👨‍💻 Autor

Sistema desenvolvido para gestão de patrimônio institucional.
