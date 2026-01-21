#!/usr/bin/env pwsh
# Script de inicialização do Sistema de Patrimônio

Clear-Host

Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Sistema de Gestão de Patrimônio - Inicialização ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "🔍 Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Node.js não encontrado! Por favor, instale o Node.js." -ForegroundColor Red
    exit 1
}

# Verificar npm
Write-Host "🔍 Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "   ✓ npm instalado: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ npm não encontrado!" -ForegroundColor Red
    exit 1
}

# Verificar arquivo .env
Write-Host "🔍 Verificando configuração..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "   ✓ Arquivo .env encontrado" -ForegroundColor Green
} else {
    Write-Host "   ⚠ Arquivo .env não encontrado! Copiando do exemplo..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "   → Por favor, edite o arquivo .env com suas credenciais do MySQL" -ForegroundColor Cyan
}

# Verificar node_modules
Write-Host "🔍 Verificando dependências..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   ✓ Dependências instaladas" -ForegroundColor Green
} else {
    Write-Host "   ⚠ Instalando dependências..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 INFORMAÇÕES IMPORTANTES:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   🌐 URL: http://localhost:3000" -ForegroundColor White
Write-Host "   👤 Usuário: admin" -ForegroundColor White
Write-Host "   🔑 Senha: admin123" -ForegroundColor White
Write-Host ""
Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  ATENÇÃO:" -ForegroundColor Red
Write-Host "   1. Certifique-se de que o MySQL está rodando" -ForegroundColor Yellow
Write-Host "   2. Execute o script db_init.sql no MySQL Workbench" -ForegroundColor Yellow
Write-Host "   3. Configure o arquivo .env com suas credenciais" -ForegroundColor Yellow
Write-Host ""
Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Perguntar se deseja continuar
$resposta = Read-Host "Deseja iniciar o servidor agora? (S/N)"

if ($resposta -eq "S" -or $resposta -eq "s") {
    Write-Host ""
    Write-Host "🚀 Iniciando servidor..." -ForegroundColor Green
    Write-Host "   Pressione Ctrl+C para parar o servidor" -ForegroundColor Gray
    Write-Host ""
    
    # Iniciar o servidor
    npm start
} else {
    Write-Host ""
    Write-Host "👋 Para iniciar manualmente, execute: npm start" -ForegroundColor Cyan
    Write-Host ""
}
