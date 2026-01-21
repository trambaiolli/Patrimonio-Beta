# 🪟 Guia para Windows PowerShell

## Comandos para Executar no Windows

### 📋 Pré-requisitos
- ✅ Node.js instalado
- ✅ MySQL instalado e rodando
- ✅ Dependências já instaladas (npm install já foi executado)

---

## 🚀 Passo a Passo Rápido

### 1️⃣ Configurar o Banco de Dados

**Opção A - MySQL Workbench (RECOMENDADO):**
1. Abra o MySQL Workbench
2. Conecte ao servidor MySQL local
3. File → Open SQL Script → Selecione `db_init.sql`
4. Clique no ícone de raio ⚡ para executar

**Opção B - PowerShell:**
```powershell
# Navegue até a pasta do projeto
cd "c:\Users\suporte\Desktop\Patrimonio Beta"

# Execute o script SQL (substitua 'root' e a senha se necessário)
Get-Content db_init.sql | mysql -u root -p
```

### 2️⃣ Configurar o Arquivo .env

Abra o arquivo `.env` no VS Code ou Notepad e altere a senha do MySQL:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=SUA_SENHA_MYSQL_AQUI
DB_NAME=patrimonio_db
SESSION_SECRET=minha_chave_secreta_super_segura_2025
PORT=3000
```

### 3️⃣ Iniciar o Servidor

No PowerShell, execute:

```powershell
# Certifique-se de estar na pasta do projeto
cd "c:\Users\suporte\Desktop\Patrimonio Beta"

# Iniciar o servidor
npm start
```

Você verá:
```
Servidor rodando em http://localhost:3000
Pressione Ctrl+C para parar o servidor
```

### 4️⃣ Acessar no Navegador

Abra seu navegador (Chrome, Edge, Firefox) e acesse:

```
http://localhost:3000
```

### 5️⃣ Fazer Login

Use as credenciais:
- **Usuário:** admin
- **Senha:** admin123

---

## 🔧 Comandos Úteis no PowerShell

```powershell
# Ver a versão do Node.js instalada
node --version

# Ver a versão do npm instalada
npm --version

# Listar os arquivos do projeto
dir

# Ver conteúdo de um arquivo
Get-Content .env

# Instalar dependências (se necessário)
npm install

# Iniciar em modo desenvolvimento (com auto-reload)
npm run dev

# Parar o servidor
# Pressione Ctrl+C

# Limpar o terminal
cls

# Abrir o VS Code na pasta atual
code .

# Abrir o navegador direto no endereço
Start-Process "http://localhost:3000"
```

---

## 🛠️ Script PowerShell Completo de Inicialização

Copie e cole este script no PowerShell para iniciar tudo de uma vez:

```powershell
# Script de inicialização do Sistema de Patrimônio

Write-Host "🚀 Iniciando Sistema de Patrimônio..." -ForegroundColor Green

# Navegar para a pasta
cd "c:\Users\suporte\Desktop\Patrimonio Beta"

# Verificar Node.js
Write-Host "`n📦 Verificando Node.js..." -ForegroundColor Cyan
node --version

# Verificar MySQL
Write-Host "`n🗄️  Verifique se o MySQL está rodando!" -ForegroundColor Yellow

# Iniciar servidor
Write-Host "`n🌐 Iniciando servidor..." -ForegroundColor Cyan
Write-Host "Acesse: http://localhost:3000" -ForegroundColor Green
Write-Host "Usuário: admin | Senha: admin123`n" -ForegroundColor Yellow

npm start
```

Salve como `iniciar.ps1` e execute:
```powershell
.\iniciar.ps1
```

---

## 🆘 Solução de Problemas Windows

### Erro: "Não é possível executar scripts"

Se você ver este erro ao tentar executar scripts PowerShell, execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Erro: MySQL não reconhecido

Adicione o MySQL ao PATH do Windows:
1. Painel de Controle → Sistema → Configurações avançadas
2. Variáveis de Ambiente
3. Editar PATH
4. Adicionar: `C:\Program Files\MySQL\MySQL Server 8.0\bin`

### Porta 3000 já em uso

Descubra qual processo está usando:
```powershell
netstat -ano | findstr :3000
```

Mate o processo (substitua PID pelo número mostrado):
```powershell
taskkill /PID <numero_do_pid> /F
```

Ou altere a porta no `.env`:
```env
PORT=3001
```

### Verificar se o MySQL está rodando

```powershell
# Ver serviços do MySQL
Get-Service | Where-Object {$_.Name -like "*mysql*"}

# Iniciar o serviço MySQL
net start MySQL80
```

---

## 📂 Abrir Arquivos do Projeto

```powershell
# Abrir o projeto no VS Code
code "c:\Users\suporte\Desktop\Patrimonio Beta"

# Abrir arquivo específico
notepad .env

# Abrir pasta no Explorer
explorer .
```

---

## 🧪 Testar a Aplicação

Após iniciar o servidor, teste estas URLs no navegador:

1. **Página inicial:** http://localhost:3000
2. **Login:** http://localhost:3000/login
3. **Equipamentos:** http://localhost:3000/equipamentos (após login)

---

## 📝 Atalhos de Teclado no PowerShell

- `Ctrl + C` - Parar o servidor
- `Ctrl + L` ou `cls` - Limpar a tela
- `Tab` - Auto-completar comandos
- `↑` e `↓` - Navegar no histórico de comandos
- `Ctrl + R` - Buscar no histórico

---

## ✅ Checklist Final

Antes de começar a usar:

- [ ] MySQL instalado e serviço rodando
- [ ] Script `db_init.sql` executado com sucesso
- [ ] Arquivo `.env` configurado com senha do MySQL
- [ ] Servidor iniciado sem erros (`npm start`)
- [ ] Navegador aberto em http://localhost:3000
- [ ] Login realizado com admin/admin123

---

## 🎯 Tudo Pronto!

Se seguiu todos os passos acima, seu sistema de patrimônio está rodando! 🎉

Qualquer dúvida, consulte:
- 📖 `README.md` - Documentação completa
- 🚀 `QUICK_START.md` - Guia rápido
- 📊 `PROJECT_SUMMARY.md` - Resumo do projeto

---

**Bom uso! 🚀**
