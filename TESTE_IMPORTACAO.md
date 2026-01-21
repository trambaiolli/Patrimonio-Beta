# 🧪 Guia Rápido de Teste - Importação CSV

## ⚡ Teste Rápido (5 minutos)

### 1. Iniciar o Servidor
```powershell
cd "c:\Users\suporte\Desktop\Patrimonio Beta"
npm start
```

### 2. Fazer Login
- Acesse: http://localhost:3000
- Usuário: `admin`
- Senha: `admin123`

### 3. Acessar Importação
- Clique em "Equipamentos" no menu
- Clique no botão "📥 Importar CSV"

### 4. Testar Importação
- Use o arquivo `exemplo_importacao.csv` (já está na pasta do projeto)
- Arraste o arquivo para a área de upload ou clique para selecionar
- Clique em "🚀 Iniciar Importação"

### 5. Verificar Resultados
- Veja as estatísticas:
  - ✅ 5 linhas processadas
  - ✅ 5 equipamentos importados
  - ✅ 0 duplicados
  - ✅ 0 erros
- Clique em "Ver Equipamentos Importados"

### 6. Testar Duplicados
- Volte para "📥 Importar CSV"
- Importe o mesmo arquivo novamente
- Agora verá:
  - ✅ 5 linhas processadas
  - ✅ 0 equipamentos importados
  - ✅ 5 duplicados (todos já existem)
  - ✅ 0 erros

## 🎯 Checklist de Testes

### ✅ Testes Básicos
- [ ] Upload de arquivo CSV válido
- [ ] Visualização de estatísticas
- [ ] Equipamentos aparecem na lista
- [ ] Detecção de duplicados funciona
- [ ] Interface responsiva

### ✅ Testes de Validação
- [ ] Tentar upload sem arquivo (deve dar erro)
- [ ] Tentar upload de arquivo .txt (deve rejeitar)
- [ ] CSV com campos faltando (deve listar erros)
- [ ] CSV vazio (deve dar erro)

### ✅ Testes de Interface
- [ ] Drag and drop funciona
- [ ] Botão de upload funciona
- [ ] Nome do arquivo aparece após seleção
- [ ] Instruções estão visíveis
- [ ] Exemplo de CSV está formatado

## 📝 Criar Seu Próprio CSV de Teste

### Método 1: Excel
1. Abra o Excel
2. Crie as colunas: NI, TAG, Descrição, Sala, Local, Bloco, Empresa, Observações
3. Preencha algumas linhas
4. Salvar Como → CSV UTF-8 (Delimitado por vírgulas)

### Método 2: Notepad
Crie um arquivo .csv com este conteúdo:
```csv
NI,TAG,Descrição,Sala,Local,Bloco,Empresa,Observações
"100","TAG100","Seu Equipamento","100","Mesa 1","A","TI","Teste manual"
```

## 🐛 Testes de Erro

### Teste 1: CSV Inválido
Crie um arquivo com apenas o cabeçalho:
```csv
NI,TAG,Descrição,Sala,Local,Bloco,Empresa,Observações
```
**Resultado esperado:** Erro "Arquivo CSV vazio ou inválido"

### Teste 2: Campos Obrigatórios Faltando
```csv
NI,TAG,Descrição,Sala,Local,Bloco,Empresa,Observações
"200","","Sem TAG","100","","","",""
```
**Resultado esperado:** 1 erro - "campos obrigatórios faltando"

### Teste 3: Caracteres Especiais
```csv
NI,TAG,Descrição,Sala,Local,Bloco,Empresa,Observações
"300","TAG300","Equipamento com acentuação: ãõüç","100","Localização especial","Bloco Ñ","Empresário Ltda.","Observação com 'aspas' e, vírgulas"
```
**Resultado esperado:** Importado com sucesso, caracteres preservados

## 📊 Validar Dados Importados

### Na Lista de Equipamentos:
1. Use o filtro de busca com "TEST" para ver os equipamentos de teste
2. Clique em "Visualizar" em um equipamento
3. Verifique se todos os campos foram importados corretamente
4. Teste edição de um equipamento importado
5. Teste exclusão de um equipamento importado

### No Banco de Dados (MySQL):
```sql
USE patrimonio_db;
SELECT * FROM equipamentos WHERE ni LIKE 'TEST%';
```

## 🔄 Teste de Volume

### Criar arquivo com muitos registros (opcional):
Você pode duplicar as linhas do `exemplo_importacao.csv` mudando o NI:
```csv
NI,TAG,Descrição,Sala,Local,Bloco,Empresa,Observações
"TEST001","TAG001","Equipamento 1","201","Local 1","A","TI","Obs 1"
"TEST002","TAG002","Equipamento 2","202","Local 2","A","TI","Obs 2"
...
"TEST100","TAG100","Equipamento 100","300","Local 100","C","TI","Obs 100"
```

**Resultado esperado:** Sistema deve processar todos sem travamentos

## 🧹 Limpar Dados de Teste

### Opção 1: Via Interface
- Vá para a lista de equipamentos
- Use o filtro de busca: "TEST"
- Exclua os equipamentos de teste um por um

### Opção 2: Via SQL (mais rápido)
```sql
USE patrimonio_db;
DELETE FROM equipamentos WHERE ni LIKE 'TEST%';
```

## ✨ Funcionalidades Extras para Testar

### 1. Exportar e Reimportar
- Exporte os dados atuais via "📊 Exportar CSV"
- Abra o arquivo exportado
- Edite alguns dados
- Mude os NIs para não duplicar
- Reimporte o arquivo modificado

### 2. Teste de Concorrência
- Abra duas abas do navegador
- Importe arquivos diferentes simultaneamente
- Verifique se ambos processam corretamente

### 3. Impressão de Importados
- Após importar, clique em "🖨️ Imprimir Lista"
- Verifique se os equipamentos importados aparecem

## 📞 Reportar Problemas

Se encontrar algum problema durante os testes:

1. **Verifique o console do navegador (F12)**
   - Procure por erros JavaScript

2. **Verifique o terminal do servidor**
   - Procure por erros Node.js

3. **Verifique o arquivo importado**
   - Confirme que está em UTF-8
   - Verifique se não há caracteres estranhos

4. **Teste com o arquivo de exemplo**
   - Se o exemplo funciona, o problema é no seu arquivo

## 🎉 Teste Bem-Sucedido!

Se todos os testes passaram:
- ✅ A funcionalidade está pronta para uso em produção
- ✅ O sistema aceita arquivos CSV corretamente
- ✅ As validações estão funcionando
- ✅ A interface está responsiva
- ✅ Os dados são importados com integridade

---

**Tempo estimado de todos os testes:** 15-20 minutos  
**Última atualização:** Dezembro 2025
