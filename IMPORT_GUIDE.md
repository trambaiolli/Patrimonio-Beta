# 📊 Guia de Importação de Dados do Excel

## Como Importar Dados da Planilha dados.xlsx

Se você já tem dados na planilha `dados.xlsx`, pode importá-los automaticamente para o banco de dados.

---

## 🚀 Passo a Passo

### 1️⃣ Instalar Biblioteca de Excel

Primeiro, instale a biblioteca necessária:

```powershell
npm install xlsx
```

### 2️⃣ Verificar a Estrutura do Excel

Certifique-se de que sua planilha tem as seguintes colunas (pode ter nomes em maiúsculas ou minúsculas):

| Coluna (nome esperado) | Obrigatório |
|------------------------|-------------|
| ni ou NI               | ✅ Sim      |
| tag ou TAG             | ✅ Sim      |
| descricao ou DESCRICAO | ✅ Sim      |
| sala ou SALA           | ❌ Não      |
| local ou LOCAL         | ❌ Não      |
| bloco ou BLOCO         | ❌ Não      |
| emp ou EMP ou empresa  | ❌ Não      |
| obs ou OBS             | ❌ Não      |

**Exemplo de estrutura:**

| NI    | TAG    | DESCRICAO           | SALA | LOCAL      | BLOCO   | EMP        | OBS           |
|-------|--------|---------------------|------|------------|---------|------------|---------------|
| NI001 | TAG001 | Computador Desktop  | 101  | Lab A      | Bloco 1 | TI Ltda    | Bom estado    |
| NI002 | TAG002 | Projetor            | 102  | Sala 2     | Bloco 1 | AV SA      | Manutenção    |

### 3️⃣ Executar a Importação

```powershell
node importar_excel.js
```

### 4️⃣ Verificar os Resultados

O script mostrará:
- ✓ Registros importados com sucesso
- ✗ Erros encontrados
- ⚠️ Registros inválidos ou duplicados

**Exemplo de saída:**

```
📂 Lendo arquivo dados.xlsx...
✓ 150 registros encontrados no Excel

🔄 Iniciando importação...

✓ Importado: NI001 - TAG001
✓ Importado: NI002 - TAG002
✓ Importado: NI003 - TAG003
...

============================================================
✅ Importação concluída!
   Total de registros: 150
   Importados com sucesso: 148
   Erros/Duplicatas: 2
============================================================
```

---

## 🔄 Importação Manual via MySQL

Se preferir não usar o script Node.js, você pode importar manualmente:

### Opção A - Converter Excel para CSV

1. Abra `dados.xlsx` no Excel
2. Salvar Como → CSV (delimitado por vírgula)
3. Salve como `dados.csv`

### Opção B - Importar CSV no MySQL Workbench

1. Abra o MySQL Workbench
2. Conecte ao banco `patrimonio_db`
3. Clique com botão direito na tabela `equipamentos`
4. Selecione "Table Data Import Wizard"
5. Escolha o arquivo `dados.csv`
6. Mapeie as colunas corretamente
7. Execute a importação

### Opção C - Comando SQL no MySQL

```sql
USE patrimonio_db;

LOAD DATA LOCAL INFILE 'c:/Users/suporte/Desktop/Patrimonio Beta/dados.csv'
INTO TABLE equipamentos
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(ni, tag, descricao, @sala, @local, @bloco, @emp, @obs)
SET 
    sala = NULLIF(@sala, ''),
    local = NULLIF(@local, ''),
    bloco = NULLIF(@bloco, ''),
    emp = NULLIF(@emp, ''),
    obs = NULLIF(@obs, '');
```

---

## 📋 Limpeza de Dados Antes da Importação

Se quiser limpar todos os dados antes de importar novamente:

```sql
USE patrimonio_db;
DELETE FROM equipamentos;
```

⚠️ **CUIDADO:** Isso apaga TODOS os equipamentos!

---

## 🛠️ Solução de Problemas

### Erro: "Biblioteca xlsx não instalada"

Execute:
```powershell
npm install xlsx
```

### Erro: "Arquivo dados.xlsx não encontrado"

Verifique se o arquivo está na pasta raiz do projeto:
```powershell
ls dados.xlsx
```

### Erro: "Campos obrigatórios faltando"

Certifique-se de que o Excel tem as colunas: `ni`, `tag` e `descricao`

### Duplicatas não são importadas

O script usa `INSERT IGNORE` que pula registros com NI duplicado. Para forçar atualização, modifique para:

```javascript
// No arquivo importar_excel.js, troque:
'INSERT IGNORE INTO equipamentos...'

// Por:
'INSERT INTO equipamentos ... ON DUPLICATE KEY UPDATE tag=VALUES(tag), descricao=VALUES(descricao)...'
```

---

## 📊 Verificar Dados Importados

Após a importação, verifique no navegador:

1. Acesse: http://localhost:3000
2. Faça login (admin/admin123)
3. Veja a lista de equipamentos importados

Ou via MySQL:

```sql
USE patrimonio_db;
SELECT COUNT(*) as total FROM equipamentos;
SELECT * FROM equipamentos LIMIT 10;
```

---

## 🔄 Script Completo para Reimportar

Se quiser limpar tudo e reimportar do zero:

```powershell
# 1. Limpar dados existentes (via MySQL)
# Execute no MySQL Workbench:
# DELETE FROM equipamentos;

# 2. Reinstalar biblioteca se necessário
npm install xlsx

# 3. Executar importação
node importar_excel.js

# 4. Verificar no navegador
Start-Process "http://localhost:3000/equipamentos"
```

---

## ✅ Checklist de Importação

- [ ] Arquivo `dados.xlsx` existe na pasta do projeto
- [ ] Biblioteca xlsx instalada (`npm install xlsx`)
- [ ] MySQL rodando e banco criado
- [ ] Servidor parado antes da importação
- [ ] Excel tem as colunas corretas (ni, tag, descricao)
- [ ] Script executado: `node importar_excel.js`
- [ ] Dados verificados no navegador

---

## 💡 Dicas

1. **Backup:** Antes de importar, faça backup do banco:
   ```sql
   mysqldump -u root -p patrimonio_db > backup.sql
   ```

2. **Teste:** Teste com poucos registros primeiro

3. **Limpeza:** Remova linhas vazias do Excel antes de importar

4. **Encoding:** Se tiver caracteres especiais, salve o Excel com UTF-8

---

**Pronto! Seus dados do Excel estarão no sistema! 🎉**
