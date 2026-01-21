# Guia de Importação de CSV

## 📥 Funcionalidade de Importação de Equipamentos

Este sistema permite importar equipamentos em massa através de arquivos CSV (Comma-Separated Values).

## 🚀 Como Usar

1. **Acesse a página de importação:**
   - Na lista de equipamentos, clique no botão "📥 Importar CSV"

2. **Prepare seu arquivo CSV:**
   - O arquivo deve estar no formato CSV (valores separados por vírgula)
   - Use codificação UTF-8 para garantir acentos corretos
   - A primeira linha deve conter o cabeçalho

3. **Formato do arquivo:**

### Campos do CSV

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| NI | Sim | Número de Identificação (único) |
| TAG | Sim | Etiqueta/TAG do equipamento |
| Descrição | Sim | Descrição do equipamento |
| Sala | Não | Sala onde está localizado |
| Local | Não | Localização específica |
| Bloco | Não | Bloco/Prédio |
| Empresa | Não | Empresa responsável |
| Observações | Não | Observações gerais |

### Exemplo de Arquivo CSV

```csv
NI,TAG,Descrição,Sala,Local,Bloco,Empresa,Observações
"001","TAG001","Notebook Dell Inspiron 15","101","Mesa 1","Bloco A","TI","Em bom estado"
"002","TAG002","Monitor LG 24 polegadas","102","Mesa 2","Bloco A","Administrativo","Monitor secundário"
"003","TAG003","Mouse Logitech MX Master","101","Mesa 1","Bloco A","TI","Sem fio"
"004","TAG004","Teclado Mecânico Keychron","103","Mesa 3","Bloco B","Desenvolvimento",""
```

## 📋 Regras de Importação

### Validações
- **Campos obrigatórios:** NI, TAG e Descrição devem estar preenchidos
- **Duplicados:** Equipamentos com NI já existente no banco serão ignorados
- **Formato:** O arquivo deve ter pelo menos 2 linhas (cabeçalho + dados)

### Tratamento de Dados
- Aspas duplas nos valores são suportadas
- Campos vazios são permitidos (exceto os obrigatórios)
- Linhas com campos insuficientes são ignoradas
- Caracteres especiais e acentuação são preservados

## 💡 Dicas

### Como criar um arquivo CSV modelo
1. Exporte os dados atuais usando o botão "📊 Exportar CSV"
2. Use este arquivo como base para suas importações
3. Edite no Excel, LibreOffice ou editor de texto

### Usando o Excel
1. Crie ou abra sua planilha
2. Vá em "Arquivo" > "Salvar Como"
3. Escolha o formato "CSV UTF-8 (Delimitado por vírgulas)"
4. Salve o arquivo

### Usando o LibreOffice Calc
1. Crie ou abra sua planilha
2. Vá em "Arquivo" > "Salvar Como"
3. Escolha o formato "Texto CSV (.csv)"
4. Na janela de opções:
   - Conjunto de caracteres: Unicode (UTF-8)
   - Separador de campo: vírgula (,)
   - Delimitador de texto: aspas (")

### Usando Editor de Texto
- Certifique-se de salvar com codificação UTF-8
- Use vírgulas para separar os campos
- Use aspas duplas para valores que contenham vírgulas ou quebras de linha

## ⚠️ Problemas Comuns

### "Arquivo CSV vazio ou inválido"
- Verifique se o arquivo tem pelo menos o cabeçalho e uma linha de dados
- Certifique-se de que o arquivo está no formato CSV correto

### "Campos obrigatórios faltando"
- Verifique se todas as linhas têm NI, TAG e Descrição preenchidos
- Confira se não há linhas vazias no meio do arquivo

### "Duplicados ignorados"
- O sistema não sobrescreve equipamentos existentes
- Se quiser atualizar, primeiro exclua o equipamento antigo

### Acentos/Caracteres especiais aparecem errados
- Salve o arquivo com codificação UTF-8
- No Excel, use "CSV UTF-8" em vez de "CSV" simples

## 📊 Resultados da Importação

Após o upload, o sistema mostrará:
- **Total de linhas:** Número de linhas processadas no arquivo
- **Importados:** Quantidade de equipamentos inseridos com sucesso
- **Duplicados:** Equipamentos ignorados por já existirem (mesmo NI)
- **Erros:** Linhas com problemas de validação ou formato

Se houver erros, os primeiros 10 serão detalhados para facilitar a correção.

## 🔒 Segurança

- Apenas arquivos CSV são aceitos
- O arquivo é processado no servidor e depois removido
- A importação requer autenticação (login)
- Todos os dados são validados antes da inserção no banco

## 📞 Suporte

Se encontrar problemas durante a importação:
1. Verifique o formato do arquivo CSV
2. Confira se todos os campos obrigatórios estão preenchidos
3. Tente exportar um arquivo de exemplo e use-o como modelo
4. Verifique os detalhes dos erros mostrados após a importação
