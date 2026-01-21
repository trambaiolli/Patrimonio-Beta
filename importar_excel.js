// Script opcional para importar dados do Excel para o MySQL
// Requer a instalação de: npm install xlsx

const fs = require('fs');
const db = require('./src/config/db');

// IMPORTANTE: Instale a biblioteca xlsx primeiro:
// npm install xlsx

async function importarDados() {
    try {
        // Verificar se o arquivo existe
        if (!fs.existsSync('./dados.xlsx')) {
            console.error('❌ Arquivo dados.xlsx não encontrado!');
            process.exit(1);
        }

        // Importar biblioteca xlsx
        let xlsx;
        try {
            xlsx = require('xlsx');
        } catch (err) {
            console.error('❌ Biblioteca xlsx não instalada!');
            console.log('Execute: npm install xlsx');
            process.exit(1);
        }

        console.log('📂 Lendo arquivo dados.xlsx...');
        
        // Ler o arquivo Excel
        const workbook = xlsx.readFile('./dados.xlsx');
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Converter para JSON
        const dados = xlsx.utils.sheet_to_json(worksheet);
        
        console.log(`✓ ${dados.length} registros encontrados no Excel`);
        console.log('\n🔄 Iniciando importação...\n');

        let importados = 0;
        let erros = 0;

        // Importar cada registro
        for (const item of dados) {
            try {
                // Mapear os campos (ajuste conforme necessário baseado no seu Excel)
                const ni = item.ni || item.NI || item.Ni;
                const tag = item.tag || item.TAG || item.Tag;
                const descricao = item.descricao || item.DESCRICAO || item.Descricao || item.descrição;
                const sala = item.sala || item.SALA || item.Sala || null;
                const local = item.local || item.LOCAL || item.Local || null;
                const bloco = item.bloco || item.BLOCO || item.Bloco || null;
                const emp = item.emp || item.EMP || item.Emp || item.empresa || item.EMPRESA || null;
                const obs = item.obs || item.OBS || item.Obs || item.observações || null;

                // Validar campos obrigatórios
                if (!ni || !tag || !descricao) {
                    console.log(`⚠️  Registro inválido (faltam campos obrigatórios): ${JSON.stringify(item)}`);
                    erros++;
                    continue;
                }

                // Inserir no banco (usando INSERT IGNORE para evitar duplicatas)
                await db.query(
                    'INSERT IGNORE INTO equipamentos (ni, tag, descricao, sala, local, bloco, emp, obs) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [ni, tag, descricao, sala, local, bloco, emp, obs]
                );

                importados++;
                console.log(`✓ Importado: ${ni} - ${tag}`);

            } catch (error) {
                console.error(`✗ Erro ao importar registro: ${error.message}`);
                erros++;
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log(`✅ Importação concluída!`);
        console.log(`   Total de registros: ${dados.length}`);
        console.log(`   Importados com sucesso: ${importados}`);
        console.log(`   Erros/Duplicatas: ${erros}`);
        console.log('='.repeat(60));

    } catch (error) {
        console.error('❌ Erro na importação:', error);
    } finally {
        process.exit(0);
    }
}

// Executar importação
importarDados();
