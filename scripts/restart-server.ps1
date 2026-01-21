# Script para limpar processos Node e reiniciar servidor

Write-Host "`n🔧 LIMPANDO PROCESSOS NODE E REINICIANDO SERVIDOR`n" -ForegroundColor Cyan
Write-Host "=" -NoNewline -ForegroundColor Gray
Write-Host ("=" * 60) -ForegroundColor Gray

# 1. Parar todos os jobs PowerShell
Write-Host "`n1️⃣ Parando jobs PowerShell..." -ForegroundColor Yellow
Get-Job | Stop-Job
Get-Job | Remove-Job
Write-Host "   ✅ Jobs limpos" -ForegroundColor Green

# 2. Matar processos node rodando na porta 3000
Write-Host "`n2️⃣ Verificando processos na porta 3000..." -ForegroundColor Yellow
$processes = netstat -ano | Select-String ":3000 " | Select-String "LISTENING"
if ($processes) {
    $processes | ForEach-Object {
        $line = $_.Line
        $pid = ($line -split '\s+')[-1]
        if ($pid -match '^\d+$') {
            Write-Host "   Matando processo PID: $pid" -ForegroundColor Yellow
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
    Write-Host "   ✅ Processos encerrados" -ForegroundColor Green
    Start-Sleep -Seconds 1
} else {
    Write-Host "   ℹ️  Nenhum processo na porta 3000" -ForegroundColor Gray
}

# 3. Verificar se porta está livre
Write-Host "`n3️⃣ Verificando se porta 3000 está livre..." -ForegroundColor Yellow
$check = netstat -ano | Select-String ":3000 " | Select-String "LISTENING"
if ($check) {
    Write-Host "   ⚠️  Porta ainda ocupada, tentando novamente..." -ForegroundColor Red
    Start-Sleep -Seconds 2
    $check2 = netstat -ano | Select-String ":3000 " | Select-String "LISTENING"
    if ($check2) {
        Write-Host "   ❌ Não foi possível liberar a porta 3000" -ForegroundColor Red
        Write-Host "   Por favor, reinicie o computador ou use outra porta" -ForegroundColor Yellow
        exit 1
    }
}
Write-Host "   ✅ Porta 3000 livre" -ForegroundColor Green

# 4. Iniciar servidor
Write-Host "`n4️⃣ Iniciando servidor..." -ForegroundColor Yellow
Write-Host "`n" + ("=" * 62) -ForegroundColor Gray
Write-Host ""

# Iniciar servidor no mesmo terminal
Set-Location "d:\Web\Patrimonio Beta"
node server.js
