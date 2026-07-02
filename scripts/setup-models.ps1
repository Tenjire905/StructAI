# StructAI - Ollama-Modelle einrichten (3060 Ti 16 GB)
# Usage: .\scripts\setup-models.ps1
#        .\scripts\setup-models.ps1 -RemoveOld

param(
    [switch]$RemoveOld
)

$ErrorActionPreference = "Stop"

if (-not (Get-Process ollama -ErrorAction SilentlyContinue)) {
    Write-Host "Starte Ollama..." -ForegroundColor Yellow
    Start-Process "$env:LOCALAPPDATA\Programs\Ollama\Ollama.exe"
    Start-Sleep -Seconds 5
}

Write-Host "[*] Lade optimale Modelle..." -ForegroundColor Cyan
ollama pull qwen2.5-coder:7b
ollama pull gemma4

Write-Host ""
Write-Host "[OK] Installierte Modelle:" -ForegroundColor Green
ollama list

if ($RemoveOld) {
    Write-Host ""
    Write-Host "[*] Entferne qwen3-coder:30b (~18 GB)..." -ForegroundColor Yellow
    ollama rm qwen3-coder:30b
    Write-Host "[OK] Altes Modell entfernt." -ForegroundColor Green
    ollama list
} else {
    Write-Host ""
    Write-Host "Tipp: Altes Modell loeschen mit:" -ForegroundColor DarkGray
    Write-Host "  ollama rm qwen3-coder:30b" -ForegroundColor DarkGray
    Write-Host "  oder: .\scripts\setup-models.ps1 -RemoveOld" -ForegroundColor DarkGray
}
