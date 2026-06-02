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
```

## 3) Pipeline starten

```powershell
py -3 orchestrator.py
```

## 4) Was die Pipeline automatisch macht

- Preflight auf Modelle, `instructions.md` und Tooling
- Frontend-first Task-Reihenfolge
- Multi-Agent-Kette: Architect -> Coder -> Static Checks -> Critic -> Auditor -> Debugger-Loops
- Finale Quality-Gates (wenn `package.json` vorhanden): `typecheck`, `lint`, `test`, `expo doctor`
- Report-Ausgabe in `orchestrator.report.json`

## 5) Startfreigabe-Kriterium

Das System ist startbereit, wenn:
- keine fehlgeschlagenen Tasks im Report stehen
- alle ausgeführten Quality-Gates den Status `PROVED` haben

