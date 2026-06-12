# StructAI Orchestrator - Claude API Hybrid (Opus/Sonnet/Haiku pro Agent)
# Voraussetzung: $env:ANTHROPIC_API_KEY muss gesetzt sein (NIE hardcoden!)
#   einmalig pro Session:  $env:ANTHROPIC_API_KEY = "sk-ant-..."
#   oder dauerhaft:        [Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "sk-ant-...", "User")
#
# Usage: .\scripts\start-orchestrator-claude.ps1
#        .\scripts\start-orchestrator-claude.ps1 -FullRebuild
#        .\scripts\start-orchestrator-claude.ps1 -DryRun

param(
    [switch]$FullRebuild,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

if (-not $env:ANTHROPIC_API_KEY) {
    Write-Host "[X] ANTHROPIC_API_KEY ist nicht gesetzt." -ForegroundColor Red
    Write-Host '    Setze ihn mit:  $env:ANTHROPIC_API_KEY = "sk-ant-..."' -ForegroundColor Yellow
    exit 1
}

# ── LLM-Provider ──
$env:STRUCTAI_LLM_PROVIDER = "claude"

# ── OPUS 4.8 – Nur fuer kritisch-komplexe Architektur-Entscheidungen ──
$env:STRUCTAI_ARCHITECT_MODEL = "claude-opus-4-8"

# ── SONNET 4.6 – Kern-Code-Generierung und Debugging ──
$env:STRUCTAI_CODER_MODEL    = "claude-sonnet-4-6"
$env:STRUCTAI_DEBUGGER_MODEL = "claude-sonnet-4-6"

# ── HAIKU 4.5 – Review, Audit und statische Checks ──
$env:STRUCTAI_CRITIC_MODEL  = "claude-haiku-4-5-20251001"
$env:STRUCTAI_AUDITOR_MODEL = "claude-haiku-4-5-20251001"

# ── Eskalation: nach 3 erfolglosen Debug-Cycles auf Opus hochschalten ──
$env:STRUCTAI_CODER_ESCALATION_MODEL = "claude-opus-4-8"
$env:STRUCTAI_CODER_ESCALATION_CYCLE = "4"

# ── Pipeline ──
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
$env:STRUCTAI_TEMPLATE_FALLBACK = "true"
$env:STRUCTAI_CONSTANTS_TEMPLATE = "true"
$env:STRUCTAI_DRY_RUN = if ($DryRun) { "true" } else { "false" }
$env:STRUCTAI_FAST_PATH = if ($FullRebuild) { "false" } else { "true" }
$env:PYTHONIOENCODING = "utf-8"

if ($FullRebuild) {
    Write-Host "[!] Full Rebuild: Checkpoint wird geloescht, FAST_PATH=false" -ForegroundColor Yellow
    Remove-Item orchestrator.checkpoint.json -ErrorAction SilentlyContinue
}

Write-Host "StructAI Orchestrator (Claude Hybrid)" -ForegroundColor Cyan
Write-Host "   Architect:  $env:STRUCTAI_ARCHITECT_MODEL  (Opus - tiefes Reasoning)"
Write-Host "   Coder:      $env:STRUCTAI_CODER_MODEL  (Sonnet - Code-Qualitaet)"
Write-Host "   Debugger:   $env:STRUCTAI_DEBUGGER_MODEL"
Write-Host "   Critic:     $env:STRUCTAI_CRITIC_MODEL  (Haiku - regelbasiert)"
Write-Host "   Auditor:    $env:STRUCTAI_AUDITOR_MODEL"
Write-Host "   Eskalation: $env:STRUCTAI_CODER_ESCALATION_MODEL ab Cycle $env:STRUCTAI_CODER_ESCALATION_CYCLE"
Write-Host "   Fast Path:  $env:STRUCTAI_FAST_PATH | Dry Run: $env:STRUCTAI_DRY_RUN"
Write-Host ""
Write-Host "   Budget-Tipp: Anthropic Console -> Billing -> Usage Limits" -ForegroundColor DarkGray
Write-Host "   Hard Limit 20 USD, Notification 15 USD setzen!" -ForegroundColor DarkGray
Write-Host ""

py -3 orchestrator.py
exit $LASTEXITCODE
