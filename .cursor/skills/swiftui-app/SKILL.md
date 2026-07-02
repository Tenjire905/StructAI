---
name: swiftui-app
description: StructAI Orchestrator — Vollständige neue App generieren mit SwiftUI Design System. Use when creating a new app with SF UI components, Large Title navigation, and iOS-style patterns.
---

# [SwiftUI App] — Neue App generieren

Du bist der ORCHESTRATOR. Erstelle eine vollständige neue App.

APP-NAME: {APP_NAME}
FEATURES: {FEATURE_LISTE}

PFLICHT — SwiftUI Design System:
- Nutze die SF UI Komponenten aus @packages/app/components/sf-ui/index.tsx
- Large Title Navigation (34px, bold)
- Inset Grouped Lists für Settings/Listen
- #007AFF als primäre Tint-Farbe
- 44px Mindest-Touch-Targets
- iOS Sheet Modals (von unten, Handle oben)
- SF Pro Font-Stack
- iOS Animationskurve: cubic-bezier(0.25, 0.46, 0.45, 0.94)

AUSGABE:
1. page.tsx (vollständig, SwiftUI-Look)
2. types.ts (alle Interfaces)
3. components/ (alle benötigten Sub-Komponenten)
4. api/route.ts (falls Backend nötig)

Erst Architect-Phase (Struktur), dann Coder-Phase (Implementierung).
