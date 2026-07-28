# HAPTICS.md
### StructAI – Haptics Map v1.3 (verbindlich). Cursor MUSS diese Zuordnung nutzen, keine eigene Erfindung.

Herkunft: Perplexity-Recherche zu Haptic-Feedback-Praxis in Pro-Tools vs. gamifizierten Consumer-Apps, an StructAIs Interaktionsmomente angepasst.

**Kalibrierung v1.3 (Standalone-Beta):** Einzelne Impact/Notification-Pulse wirken auf vielen Geräten zu weich. **Alle semantischen Events** nutzen daher einen **Heavy-Impact-Burst ×5** (`HAPTIC_INTENSITY_MULTIPLIER = 5`, Gap ~38 ms) nach der Notification. Lektion/Pfad/Set stapeln zusätzlich weitere Bursts für klaren Peak.

**Aktueller Stand: Implementiert** (`lib/haptics.ts`, `expo-haptics`). Verdrahtet an: Lektions-Antwort richtig/falsch, Lektion/Pfad abgeschlossen, BYOK, Prompt-Lab, plus UI-Press auf `Button` / `PressableScale` / `FloatingTabBar` via `hapticUIPress()`.

---

## 1. Standard-Haptic-Typen (iOS/Android, keine eigenen erfinden)

```
Light Impact
Medium Impact
Heavy Impact
Success Notification
Warning Notification
Error Notification
Selection
```

## 2. Zuordnung pro Interaktionsmoment (v1.3 = 5× felt)

| Moment | Pattern |
|---|---|
| UI-Press (Button / Card / Tab) | `Heavy ×5` (`hapticUIPress`) |
| Richtige Antwort | `Success` + `Heavy ×5` |
| Falsche Antwort (Nutzerursache) | `Warning` + `Heavy ×5` |
| Lektion abgeschlossen | `Success` + `Heavy ×5` + Pause + `Heavy ×5` |
| Pfad abgeschlossen | `Success` + `Heavy ×5` + `Success` + `Heavy ×5` (+ Playful: weiterer Burst) |
| Orb / BYOK / Match / Categorize-Item / Lab Success | `Success` + `Heavy ×5` |
| Categorize Set complete | wie Lektion (doppelter Burst) |
| Lab Failure user | `Error` + `Heavy ×5` |
| Lab Failure network | `Warning` + `Heavy ×5` |

## 3. Technische Umsetzung

1. Nur `lib/haptics.ts` — nie `Haptics.*` direkt aus Komponenten.
2. Web = No-Op (`Platform.OS === 'web'`).
3. Fire-and-forget — nie await vor Navigation.
4. Intensität nur über `HAPTIC_INTENSITY_MULTIPLIER` / `heavyBurst` ändern.
