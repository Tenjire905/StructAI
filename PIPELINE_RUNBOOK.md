# StructAI Pipeline Runbook

## 1) Lokale Modelle prüfen

Stelle sicher, dass diese Ollama-Modelle lokal vorhanden sind:
- `qwen3-coder:30b`
- `gemma4`

## 2) Empfohlene Environment-Variablen (PowerShell)

```powershell
$env:STRUCTAI_CODER_MODEL="qwen3-coder:30b"
$env:STRUCTAI_ARCHITECT_MODEL="gemma4"
$env:STRUCTAI_CRITIC_MODEL="gemma4"
$env:STRUCTAI_DEBUGGER_MODEL="gemma4"
$env:STRUCTAI_AUDITOR_MODEL="gemma4"
$env:STRUCTAI_MAX_CYCLES="7"
$env:STRUCTAI_DEBUG_PASSES="3"
$env:STRUCTAI_COOLDOWN_SECONDS="2"
$env:STRUCTAI_TASKS_CONFIG="orchestrator.tasks.json"
$env:STRUCTAI_BUILD_REPORT="orchestrator.report.json"
$env:STRUCTAI_CHECKPOINT_PATH="orchestrator.checkpoint.json"
$env:STRUCTAI_STRICT_MODE="true"
$env:STRUCTAI_MODEL_CALL_RETRIES="3"
$env:STRUCTAI_MODEL_RETRY_BASE_SECONDS="1.5"
$env:STRUCTAI_QUALITY_GATE_TIMEOUT_SECONDS="300"
$env:STRUCTAI_DRY_RUN="false"
$env:STRUCTAI_TEMPLATE_FALLBACK="true"
$env:STRUCTAI_FAST_PATH="true"   # Template-Dateien überspringen LLM-Pipeline
```

## 3) Pipeline starten

```powershell
py -3 orchestrator.py
```

### Optional: Nur Validierung (ohne Modell-Calls/Datei-Generierung)

```powershell
$env:STRUCTAI_DRY_RUN="true"
py -3 orchestrator.py
```

## 4) Was die Pipeline automatisch macht

- Preflight auf Modelle, `instructions.md` und Tooling
- Frontend-first Task-Reihenfolge
- Multi-Agent-Kette: Architect -> Coder -> Static Checks -> Critic -> Auditor -> Debugger-Loops
- Finale Quality-Gates (wenn `package.json` vorhanden): `typecheck`, `lint`, `test`, `expo doctor`
- Report-Ausgabe in `orchestrator.report.json`
- Checkpoint/Resume in `orchestrator.checkpoint.json` (bereits erfolgreiche Dateien werden beim nächsten Run übersprungen)
- Dependency-Kontext: existierende `depends_on`-Dateien werden in Coder/Debugger/Architect-Prompts injiziert
- Contract-Dateien unter `orchestrator/contracts/`:
  - `theme.contract.md` – Farben/Typografie
  - `product.contract.md` – **StructAI** Produkt (MainAppScript, kein Fremd-Branding)
  - `design-reference.contract.md` – UI-Muster aus Referenzbildern (`assets/`)
  - `screens.contract.md` – Tab-Screens Akademie / Prompt Lab / Profil
  - `backend.contract.md` – API-Stubs
- Automatischer Template-Fallback unter `orchestrator/templates/` (Fast-Path: validierte Dateien spiegeln nach `src/`)

### Templates aktualisieren (nach manuellen Fixes)

```powershell
# Alle validierten Quellen nach orchestrator/templates/ kopieren
$paths = @(
  'src\shared\theme\colors.ts','src\shared\theme\typography.ts','src\shared\theme\index.ts',
  'src\shared\ui\PressableCard.tsx','src\shared\ui\GradientButton.tsx',
  'src\features\Gamification\model\types.ts','src\features\Gamification\model\store.ts',
  'src\features\PromptLab\api\optimizer.ts','src\features\APIKeyManager\model\secureKeyStore.ts',
  'src\processes\promptLab\runPromptComparison.ts',
  'src\app\_layout.tsx','src\app\index.tsx','src\app\(tabs)\_layout.tsx',
  'src\app\(tabs)\akademie.tsx','src\app\(tabs)\lab.tsx','src\app\(tabs)\profil.tsx',
  'backend\src\types\contracts.ts','backend\src\health\healthcheck.ts'
)
foreach ($p in $paths) {
  $dest = Join-Path 'orchestrator\templates' $p
  New-Item -ItemType Directory -Path (Split-Path $dest -Parent) -Force | Out-Null
  Copy-Item $p $dest -Force
}
```
  - Checkpoint ist task-signaturgebunden und selbstheilend:
    - Wenn sich die Task-Liste ändert, startet Resume sauber neu.
    - Wenn Dateien manuell gelöscht wurden, werden sie automatisch neu gebaut.

## 5) Startfreigabe-Kriterium

Das System ist startbereit, wenn:
- keine fehlgeschlagenen Tasks im Report stehen
- alle ausgeführten Quality-Gates den Status `PROVED` haben

