# StructAI Orchestrator - optimiert fuer RTX 3060 Ti (16 GB VRAM)
# Usage: .\scripts\start-orchestrator.ps1
#        .\scripts\start-orchestrator.ps1 -FullRebuild

param(
    [switch]$FullRebuild
)

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

# Ollama starten falls nicht aktiv
if (-not (Get-Process ollama -ErrorAction SilentlyContinue)) {
    Start-Process "$env:LOCALAPPDATA\Programs\Ollama\Ollama.exe"
    Start-Sleep -Seconds 4
}

# Modell-Stack (3060 Ti 16 GB)
$env:STRUCTAI_CODER_MODEL = "qwen2.5-coder:7b"
$env:STRUCTAI_ARCHITECT_MODEL = "gemma4"
$env:STRUCTAI_CRITIC_MODEL = "gemma4"
$env:STRUCTAI_DEBUGGER_MODEL = "gemma4"
$env:STRUCTAI_AUDITOR_MODEL = "gemma4"

# Pipeline
$env:STRUCTAI_MAX_CYCLES = "7"
$env:STRUCTAI_DEBUG_PASSES = "3"
$env:STRUCTAI_COOLDOWN_SECONDS = "2"
$env:STRUCTAI_TASKS_CONFIG = "orchestrator.tasks.json"
$env:STRUCTAI_BUILD_REPORT = "orchestrator.report.json"
$env:STRUCTAI_CHECKPOINT_PATH = "orchestrator.checkpoint.json"
$env:STRUCTAI_STRICT_MODE = "true"
$env:STRUCTAI_MODEL_CALL_RETRIES = "3"
$env:STRUCTAI_MODEL_RETRY_BASE_SECONDS = "1.5"
$env:STRUCTAI_QUALITY_GATE_TIMEOUT_SECONDS = "300"
$env:STRUCTAI_DRY_RUN = "false"
$env:STRUCTAI_TEMPLATE_FALLBACK = "true"
$env:STRUCTAI_CONSTANTS_TEMPLATE = "true"
$env:STRUCTAI_FAST_PATH = if ($FullRebuild) { "false" } else { "true" }
$env:PYTHONIOENCODING = "utf-8"

if ($FullRebuild) {
    Write-Host "[!] Full Rebuild: Checkpoint wird geloescht, FAST_PATH=false" -ForegroundColor Yellow
    Remove-Item orchestrator.checkpoint.json -ErrorAction SilentlyContinue
}

Write-Host "StructAI Orchestrator" -ForegroundColor Cyan
Write-Host "   Coder:     $env:STRUCTAI_CODER_MODEL"
Write-Host "   Architect: $env:STRUCTAI_ARCHITECT_MODEL"
Write-Host "   Fast Path: $env:STRUCTAI_FAST_PATH"
Write-Host ""

py -3 orchestrator.py
