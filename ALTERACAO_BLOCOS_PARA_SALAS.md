# 🔄 ALTERAÇÃO: Filtro de Blocos → Filtro de Salas

## ✅ Mudanças Realizadas

---

## 📋 **RESUMO**

O sistema foi atualizado para usar **SALAS** ao invés de **BLOCOS** nos filtros e estatísticas.

---

## 🔧 **ARQUIVOS MODIFICADOS**

### 1️⃣ **Backend (src/routes/equipamentos.js)**
- ✅ Alterado filtro de `bloco` para `sala`
- ✅ Query SQL agora busca por `sala = ?`
- ✅ Busca salas únicas no banco: `SELECT DISTINCT sala FROM equipamentos`
- ✅ Variável `blocos` renomeada para `salas`

### 2️⃣ **Frontend - Listagem (views/equipamentos/lista.ejs)**
- ✅ Dropdown "Todos os Blocos" → "Todas as Salas"
- ✅ Select name mudado de `bloco` para `sala`
- ✅ Loop percorre `salas` ao invés de `blocos`
- ✅ Valor selecionado compara com `sala`

### 3️⃣ **Backend - Dashboard (server.js)**
- ✅ Query SQL mudada de `GROUP BY bloco` para `GROUP BY sala`
- ✅ Variável `porBloco` renomeada para `porSala`
- ✅ Passa `porSala` para a view

### 4️⃣ **Frontend - Dashboard (views/dashboard.ejs)**
- ✅ Card estatístico: "Blocos Cadastrados" → "Salas Cadastradas"
- ✅ Ícone mudado de 🏢 para 🚪
- ✅ Seção "Equipamentos por Bloco" → "Equipamentos por Sala"
- ✅ Coluna da tabela "Bloco" → "Sala"
- ✅ Loop percorre `porSala` e exibe `item.sala`
- ✅ Últimos equipamentos mostram sala ao invés de bloco

### 5️⃣ **Documentação (NOVAS_FUNCIONALIDADES.md)**
- ✅ Atualizado texto de "blocos" para "salas" em todas as referências
- ✅ Exemplos atualizados
- ✅ Checklist atualizado

---

## 🎯 **COMPORTAMENTO ATUAL**

### **Dashboard:**
```
📦 Total de Equipamentos: X
🚪 Salas Cadastradas: Y
🏭 Empresas Cadastradas: Z

🚪 Equipamentos por Sala (Top 5):
- Sala 101: 5 equipamentos
- Sala 102: 3 equipamentos
- Sala 103: 2 equipamentos
```

### **Listagem com Filtros:**
```
🔍 Buscar: [Digite aqui...]
📍 [Todas as Salas ▼]
🏭 [Todas as Empresas ▼]
[Filtrar] [Limpar]
```

### **Exemplo de Filtro:**
```
URL: /equipamentos?sala=101&empresa=TI+Ltda

Resultado: Mostra apenas equipamentos da Sala 101 da Empresa TI Ltda
```

---

## 📊 **DIFERENÇAS ANTES/DEPOIS**

| Aspecto | ANTES (Blocos) | DEPOIS (Salas) |
|---------|----------------|----------------|
| Campo filtrado | `bloco` | `sala` |
| Query SQL | `WHERE bloco = ?` | `WHERE sala = ?` |
| Dropdown | "Todos os Blocos" | "Todas as Salas" |
| Card Dashboard | 🏢 Blocos Cadastrados | 🚪 Salas Cadastradas |
| Seção Dashboard | Equipamentos por Bloco | Equipamentos por Sala |
| Coluna Tabela | Bloco | Sala |
| Variável Backend | `porBloco` | `porSala` |

---

## ✅ **FUNCIONALIDADES MANTIDAS**

- ✅ Busca por NI, TAG, Descrição continua funcionando
- ✅ Filtro por Empresa continua funcionando
- ✅ Exportação CSV continua com todas as colunas (incluindo sala E bloco)
- ✅ Visualização detalhada mostra sala E bloco
- ✅ Formulário de cadastro/edição tem sala E bloco
- ✅ Impressão de etiqueta mostra sala E bloco

---

## 📝 **OBSERVAÇÕES IMPORTANTES**

### ⚠️ **Campos no Banco de Dados**

O banco de dados MySQL **ainda contém AMBOS os campos**:
- `sala` - usado para filtros e estatísticas
- `bloco` - ainda disponível mas não usado nos filtros

**Estrutura da tabela:**
```sql
CREATE TABLE equipamentos (
    ni VARCHAR(50) PRIMARY KEY,
    tag VARCHAR(100) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    sala VARCHAR(50) NULL,        -- ✅ AGORA USADO NOS FILTROS
    local VARCHAR(100) NULL,
    bloco VARCHAR(50) NULL,       -- ℹ️ AINDA EXISTE, MAS NÃO FILTRA
    emp VARCHAR(100) NULL,
    obs TEXT NULL
);
```

### ✅ **Vantagens desta Mudança**

1. **Mais Granular:** Salas são mais específicas que blocos
2. **Melhor Localização:** Facilita encontrar equipamentos
3. **Filtros Mais Úteis:** Salas são mais relevantes no dia a dia
4. **Mantém Flexibilidade:** Bloco ainda existe nos dados

---

## 🔄 **SE QUISER VOLTAR PARA BLOCOS**

Basta reverter as mudanças:

```javascript
// Em equipamentos.js
const sala = req.query.sala || '';  // ← Mudar para: const bloco = req.query.bloco || '';
query += ' AND sala = ?';           // ← Mudar para: query += ' AND bloco = ?';
const [salas] = await db.query('SELECT DISTINCT sala...');  // ← Mudar para bloco

// Em server.js
const [porSala] = await db.query('... GROUP BY sala...');  // ← Mudar para bloco

// Nas views
<select name="sala">                // ← Mudar para: <select name="bloco">
```

---

## 🧪 **COMO TESTAR**

### 1. Acesse o Dashboard:
```
http://localhost:3000/dashboard
```
- ✅ Verificar card "Salas Cadastradas"
- ✅ Verificar seção "Equipamentos por Sala"

### 2. Acesse Equipamentos:
```
http://localhost:3000/equipamentos
```
- ✅ Verificar dropdown "Todas as Salas"
- ✅ Selecionar uma sala e filtrar
- ✅ Verificar resultados

### 3. Teste Combinado:
```
http://localhost:3000/equipamentos?sala=101&empresa=TI%20Ltda
```
- ✅ Deve mostrar apenas equipamentos da Sala 101 da empresa TI Ltda

### 4. Teste Busca + Filtro:
```
Buscar: "Computador"
Filtro Sala: 101
Filtro Empresa: TI Ltda
```
- ✅ Deve combinar todos os filtros

---

## ✅ **STATUS ATUAL**

- ✅ Filtros funcionando com SALAS
- ✅ Dashboard mostrando estatísticas por SALAS
- ✅ Busca e outros filtros mantidos
- ✅ Servidor reiniciado e rodando
- ✅ Documentação atualizada

**URL:** http://localhost:3000
**Login:** admin / admin123

---

## 📊 **EXEMPLO DE DADOS**

Se você tem os dados de exemplo:
```
NI001 - Sala 101 - Bloco 1
NI002 - Sala 102 - Bloco 1
NI003 - Sala 103 - Bloco 2
```

**Filtro por Sala:**
- Sala 101 → Mostra NI001
- Sala 102 → Mostra NI002
- Sala 103 → Mostra NI003

**Dashboard mostrará:**
- Sala 101: 1 equipamento
- Sala 102: 1 equipamento
- Sala 103: 1 equipamento

---

**✅ Alteração concluída com sucesso!**

**📅 Data:** 14 de dezembro de 2025
