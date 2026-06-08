# StructAI

> **Master Prompting. Build Real Intelligence.**

StructAI ist die führende mobile Prompting-Akademie (Duolingo-Prinzip für Prompts) – gamifiziertes Lernen + Praxis im integrierten **Prompt Lab**, inklusive BYOK-API-Key-Management und lokaler Persistenz.

## 🎯 Vision

Drei spezialisierte Lernpfade, ein Prompt-Lab mit Echtzeit-Scoring, ModelComparer und Energie-Orb-System. Free mit 5-Orb-Limit, Premium mit unbegrenzter Energie und High-End-Modellen.

## 🏗️ Architektur

Strikte **Feature-Sliced Design (FSD)** Struktur:

```
src/
├── app/                  # Expo Router (Root-Layout, Tabs, Screens)
│   ├── _layout.tsx
│   ├── index.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── akademie.tsx
│       ├── lab.tsx
│       └── profil.tsx
├── features/             # Isolierte Feature-Module (keine Cross-Imports!)
│   ├── Gamification/     # XP, Level, Streak, Energie-Orbs
│   ├── PromptLab/        # Optimizer API
│   └── APIKeyManager/    # BYOK via expo-secure-store
├── processes/            # Feature-übergreifende Workflows
│   └── promptLab/
│       └── runPromptComparison.ts
└── shared/               # Logikfreie, wiederverwendbare Bausteine
    ├── theme/            # Design-Tokens (colors, typography)
    └── ui/               # PressableCard, GradientButton

backend/                  # Stubs für spätere Server-Anbindung
├── src/
│   ├── types/contracts.ts
│   └── health/healthcheck.ts
```

## 🎨 Design

- **Dark Mode First** mit Glassmorphismus (borderRadius 16–24, subtile Borders, Gradients)
- **SwiftUI-Look & Feel** mit haptischem Press-Feedback (`scale: 0.97` via `Animated`)
- **Theme-Tokens zentral** in `src/shared/theme/*` – keine Hex/rgba hardcoden
- **Markenfarben:** Everyday `#007AFF` · Code `#00E5FF` · Visual `#FF007F`

## 🛠️ Tech-Stack

- **Framework:** React Native + Expo (SDK 52, Router v4)
- **State:** Zustand mit `persist` (AsyncStorage)
- **Sicherheit:** `expo-secure-store` für BYOK
- **Animationen:** `react-native-reanimated`, `expo-linear-gradient`, `lottie-react-native`
- **Sprache:** 100% TypeScript (`strict: true`, kein `any`)

## 🤖 Multi-Agent Build Pipeline

Dieses Repo enthält eine **autonome Multi-Agent-Pipeline** (`orchestrator.py`), die den gesamten Code per LLM generiert, prüft und in Iterationen debuggt:

- **Architect** (Plan) → **Coder** (Code) → **Static Checks** → **Critic** (Regel-Audit) → **Auditor** (Integrationsrisiko) → **Debugger** (Fix-Loop)
- Lokale Modelle: `qwen3-coder:30b` (Coder), `gemma4` (Critic/Debugger/Architect/Auditor)
- Quality-Gates am Ende: `tsc --noEmit`, `expo doctor`
- Verträge unter `orchestrator/contracts/` (Theme, Produkt, Screens, Design, Backend)
- Templates unter `orchestrator/templates/` (Fast-Path)
- Checkpoint/Resume in `orchestrator.checkpoint.json`

### Pipeline starten

```powershell
# Voraussetzung: Ollama läuft lokal mit qwen3-coder:30b + gemma4
py -3 orchestrator.py
```

Details siehe `PIPELINE_RUNBOOK.md`.

## 📋 Code-Gesetzbuch

Bindend für alle Agenten und Contributors – siehe `instructions.md`:

- **FSD-Import-Gesetz:** Features dürfen niemals untereinander importieren
- **Keine `any`, keine TODOs, keine Platzhalter** – Code muss vom ersten Commit an 100% lauffähig sein
- **Try-catch-Pflicht** für alle async-Funktionen
- **Theme-Token-Pflicht:** Farben NUR via `theme.colors.*`
- **`validateStoreLogic()`** Pflicht für jeden Zustand-Store
- **Named Exports** bevorzugt, **Default Exports** nur bei Expo-Router-Screens/Layouts

## 📁 Wichtige Dateien

| Datei | Zweck |
|---|---|
| `instructions.md` | Code-Gesetzbuch (bindend) |
| `MainAppScript.md` | Produkt-Vision & Architektur-Übersicht |
| `PIPELINE_RUNBOOK.md` | Pipeline-Bedienungsanleitung |
| `orchestrator.tasks.json` | Task-Queue für den Build |
| `orchestrator/contracts/*.contract.md` | Bindende Verträge (Theme, Produkt, Screens, Design, Backend) |
| `orchestrator.templates.json` | Fast-Path-Templates |

## 🚦 Status

Siehe `orchestrator.report.json` für den aktuellen Build-Status aller 17 Tasks.

## ⚖️ Lizenz

Privat – alle Rechte vorbehalten.
