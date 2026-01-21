# 🚀 Guia Rápido de Inicialização

## Passo a Passo para Rodar o Sistema

### 1️⃣ Configurar o Banco de Dados MySQL

Você precisa ter o MySQL instalado e rodando. Depois:

**Opção A - MySQL Workbench:**
1. Abra o MySQL Workbench
2. Conecte-se ao seu servidor MySQL
3. Abra o arquivo `db_init.sql` (File > Open SQL Script)
4. Execute o script (clique no ícone ⚡ ou pressione Ctrl+Shift+Enter)

**Opção B - Linha de Comando:**
```bash
mysql -u root -p < db_init.sql
```

### 2️⃣ Configurar as Credenciais do Banco

Edite o arquivo `.env` e altere a senha do MySQL:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql_aqui
DB_NAME=patrimonio_db
SESSION_SECRET=minha_chave_secreta_super_segura_2025
PORT=3000
```

### 3️⃣ Iniciar o Servidor

Execute o comando:

```bash
npm start
```

Ou para modo desenvolvimento com auto-reload:

```bash
npm run dev
```

### 4️⃣ Acessar o Sistema

Abra seu navegador e acesse:

```
http://localhost:3000
```

### 5️⃣ Fazer Login

Use as credenciais padrão:
- **Usuário:** admin
- **Senha:** admin123

---

## ✅ Checklist de Instalação

- [ ] MySQL instalado e rodando
- [ ] Dependências instaladas (`npm install` - já foi executado)
- [ ] Script `db_init.sql` executado no MySQL
- [ ] Arquivo `.env` configurado com senha do MySQL
- [ ] Servidor iniciado com `npm start`
- [ ] Navegador aberto em `http://localhost:3000`
- [ ] Login realizado com sucesso

---

## 🆘 Problemas Comuns

### Erro: "Cannot connect to MySQL"
- Verifique se o MySQL está rodando
- Confirme a senha no arquivo `.env`
- Teste a conexão no MySQL Workbench

### Erro: "Database 'patrimonio_db' doesn't exist"
- Execute o script `db_init.sql` novamente

### Erro: "Port 3000 already in use"
- Altere a porta no arquivo `.env` para 3001 ou outra porta disponível

### Erro de Login
- Verifique se o script SQL foi executado corretamente
- Execute: `node generate_hash.js` para gerar novo hash se necessário

---

## 📞 Comandos Úteis

```bash
# Instalar dependências
npm install

# Iniciar servidor
npm start

# Iniciar em modo desenvolvimento
npm run dev

# Gerar novo hash de senha
node generate_hash.js

# Ver estrutura do projeto
tree /F
```

---

## 🎯 Próximos Passos

Após iniciar o sistema com sucesso:

1. ✅ Faça login no sistema
2. ✅ Explore a lista de equipamentos (3 exemplos já cadastrados)
3. ✅ Crie um novo equipamento
4. ✅ Edite um equipamento existente
5. ✅ Exclua um equipamento de teste
6. ✅ Faça logout e login novamente

Pronto! O sistema está funcionando! 🎉
