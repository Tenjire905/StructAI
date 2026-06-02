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
- Contract-Dateien unter `orchestrator/contracts/` (z.B. Theme-Schema)
- Automatischer Template-Fallback unter `orchestrator/templates/` wenn LLM-Zyklen scheitern
  - Checkpoint ist task-signaturgebunden und selbstheilend:
    - Wenn sich die Task-Liste ändert, startet Resume sauber neu.
    - Wenn Dateien manuell gelöscht wurden, werden sie automatisch neu gebaut.

## 5) Startfreigabe-Kriterium

Das System ist startbereit, wenn:
- keine fehlgeschlagenen Tasks im Report stehen
- alle ausgeführten Quality-Gates den Status `PROVED` haben

