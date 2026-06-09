---
name: ecosystem-mindmap
description: StructAI Ecosystem Mindmap — kanonische Nordstern-Referenz für Vision, 4 Blöcke, Roadmap und Prioritäten. Use at the start of any StructAI task, when scoping features, reviewing architecture, or when unsure if work aligns with project goals.
---

# StructAI Ecosystem Mindmap

## Pflicht vor größeren Aufgaben

1. **Bild lesen:** `assets/StructAI Ecosystem Mindmap.png` (kanonische Quelle)
2. **Ergänzend:** `STRUCTAI_MASTER_ANALYSIS_AND_PROMPT.md` Teil A–C bei Detailfragen

Die Mindmap ist **kein Wunschzettel**, sondern **Pflichtenheft in Bildform**.

---

## Zentrum

**StructAI Ecosystem** — AI-Powered Learning, Creation & Community

Geschlossenes Ökosystem für AI-Kompetenz, Software-Generierung und kontinuierliche Innovation.

---

## 1. CORE: ORCHESTRATOR (kritisch — Phase 1)

**Ziel:** Automatisierte, zuverlässige Software-Generierung via Multi-Agent-System.

### 1.1 Agent System
| Agent | Rolle |
|-------|-------|
| Architect | Planung & Struktur |
| Coder | Implementierung |
| Critic | Qualität & Best Practices |
| Auditor | Security & Risiko |
| Debugger | Fehler beheben |

### 1.2 Execution Layer
- LLM Backend (Claude primary)
- Prompt Routing
- Context Management
- Model Fallback

### 1.3 Contract System
- UI Contracts
- Theme Contracts
- Backend Contracts (APIs, Daten)
- Screen Contracts

### 1.4 Quality Gates
- TypeScript Check
- Expo Doctor
- Linting
- Critic Agent Rules

### 1.5 Output
- Vollständige Apps
- Wiederverwendbare Features
- Debugged Iterations

### 1.6 Orchestrator Infrastructure
- Task Queue
- Checkpoints (Resume)
- Logging / Observability
- Error Handling
- Versioning
- Security Layer (Sandbox, Secrets)

### Orchestrator Priority (Phase 1)
- Agenten stabil & deterministisch
- Contracts vollständig
- Quality Gates 100 % zuverlässig
- Debug-Loop bulletproof

---

## 2. PRODUCT LAYER: STRUCTAI APP

**Ziel:** User verstehen & nutzen AI effektiv.

### 2.1 Learning System
- Prompting Courses
- Skill Trees
- Progression (XP, Levels)

### 2.2 Prompt Lab
- Prompt Testing
- Model Comparison
- Real-time Scoring

### 2.3 Gamification
- Energy Orbs (Limits, Regeneration)
- Streaks
- Rewards

### 2.4 BYOK Layer
- Secure API Key Storage (`expo-secure-store`)
- Usage Tracking

### 2.5 Weitere Module
- Profile
- Achievements
- Settings
- Offline Support

---

## 3. DISTRIBUTION / COMMUNITY LAYER

**Ziel:** Awareness & Community rund um AI News.

### 3.1 Content Feed
- AI News
- Model Releases
- Tool Updates
- Agent Demos

### 3.2 Community Layer
- Discussions
- Comments
- Creator Profiles
- Follow System

### 3.3 Learning Bridge
- „Explain to me"
- Deep Dives
- Mini Tutorials
- Verbindung Feed → App

### 3.4 Activation Layer
- „Use in StructAI" Buttons
- Prompt Imports
- Agent Launching

---

## 4. ECOSYSTEM LOOP (Kern des Systems)

```
Input (AI Trends, User Questions, Community Feedback)
  → Transformation (User lernt via StructAI, Orchestrator erstellt Software)
    → Output (Tools, Prompts, Apps, Workflows)
      → Feedback Loop (Community bewertet → Orchestrator iteriert)
        → Better Versions → ständige Optimierung
```

---

## ROADMAP / PRIORITÄTEN

| Phase | Fokus |
|-------|-------|
| **Phase 1 (JETZT)** | Orchestrator bulletproof — Agenten, Contracts, Claude, Quality Gates |
| Phase 2 | Output Stabilization — reproduzierbare App-Generierung, Logging, Failure Recovery |
| Phase 3 | StructAI App Expansion — Reproduzierbarkeit, Learning Bridge, BYOK |
| Phase 4 | Community / Feed Launch — News-Plattform MVP, Growth |

---

## RISIKEN & HERAUSFORDERUNGEN

**Technisch:** LLM Reliability, Orchestrator Complexity, Code Errors, Scaling, Data Security

**Produkt/Markt:** User Retention, Competition, schnelle Marktveränderungen, Monetarisierung

**Scaling:** Kosten bei hoher Nutzung, Model Limits, Datenmenge, Community Moderation

---

## ERFOLGSFAKTOREN

- Stabile Orchestrator-Foundation
- Klare Contracts
- Echte User-Probleme lösen
- Geschlossener Learn- & Build-Loop
- Community als Growth Engine

---

## Abgleich mit Codebase

| Mindmap-Block | Code-Pfad |
|---------------|-----------|
| Orchestrator | `orchestrator.py`, `orchestrator/contracts/`, `packages/orchestrator/` |
| StructAI App | `src/app/`, `src/features/`, `src/processes/`, `src/shared/` |
| Community | `packages/community/` (später) |
| BYOK | `src/features/APIKeyManager/` |
| Gamification | `src/features/Gamification/` |
| Prompt Lab | `src/features/PromptLab/` |

---

## Entscheidungsregel

Bei jeder Aufgabe fragen:
1. Welcher Mindmap-Block?
2. Welche Roadmap-Phase?
3. Blockiert das Phase 1 (Orchestrator)?

Wenn Antwort ≠ aktuelle Phase → nicht umsetzen ohne explizite Freigabe.
