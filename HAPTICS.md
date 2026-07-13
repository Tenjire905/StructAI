# HAPTICS.md
### StructAI – Haptics Map v1 (verbindlich). Cursor MUSS diese Zuordnung nutzen, keine eigene Erfindung.

Herkunft: Perplexity-Recherche zu Haptic-Feedback-Praxis in Pro-Tools vs. gamifizierten Consumer-Apps, an StructAIs Interaktionsmomente angepasst. Grundregel: **Haptics sind ein Präzisionsinstrument, kein Belohnungs-Dauerfeuer.** Wenn alles vibriert, verliert alles Bedeutung.

Aktueller Stand: **Noch nicht implementiert.** Dies ist die Spezifikation für die Umsetzung (`expo-haptics`).

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

## 2. Zuordnung pro Interaktionsmoment

| Moment | Focus | Playful |
|---|---|---|
| Richtige Antwort (Lektion) | `Selection` oder sehr leichtes `Light Impact` | `Light Impact`, etwas wärmeres Belohnungsgefühl |
| Falsche Antwort | Nur bei echter Nutzerursache: `Warning Notification`, zurückhaltend. Sonst keine Haptik. | Wie Focus, maximal leicht verständnisvoll – nie strafend |
| Lektion abgeschlossen | `Success Notification` oder kurzes `Medium Impact` | gleich |
| Pfad abgeschlossen + Zertifikat | `Success Notification` + `Medium Impact` | `Success Notification` + optional `Medium`–`Heavy Impact` |
| Orb-Gewinn | `Light Impact` oder **gar keine** Haptik (stilles Fortschrittssignal) | `Success Notification` oder `Medium Impact` |
| BYOK-Key erfolgreich validiert | `Success Notification` | `Success Notification` (identisch – kritischer Vertrauensmoment, kein Modus-Unterschied) |
| Matching – Paar final korrekt verbunden | `Selection` oder `Light Impact` – **nur beim finalen Match, nicht bei jedem Zwischenschritt/Drag** | gleich |
| Categorize – Item korrekt zugeordnet | `Selection` pro Item; einmalig `Success Notification` bei Abschluss des gesamten Sets | gleich |
| Prompt-Lab-Demo-Vergleich: Fehler durch Nutzerursache/Validierungsfehler | `Error Notification` | gleich |
| Prompt-Lab-Demo-Vergleich: Fehler durch Netzwerk/Provider | **Keine Haptik**, höchstens sehr leichtes `Warning Notification` | gleich |
| Prompt-Lab-Demo-Vergleich: erfolgreich beendet | `Success Notification` | gleich |

## 3. Explizite Verbote (Overuse vermeiden)

- **Keine** Haptik bei: Screen-Wechsel, Laden, reinem Anzeigen von Fortschritt, jeder kleinen Statusänderung.
- **Keine** Haptik bei: Scrollen, einfachem Tab-Wechsel, passivem Anzeigen von Daten.
- **Keine** Haptik bei Matching/Categorize-Zwischenschritten (nur beim tatsächlichen erfolgreichen Abschluss einer Einheit).
- Focus nutzt durchgängig zurückhaltendere Ausprägungen als Playful (siehe Tabelle) – nie stärkere.

## 4. Technische Umsetzung – Vorgabe für Cursor

1. Zentrale Utility `lib/haptics.ts` mit einer Funktion pro semantischem Ereignis (nicht pro Impact-Typ direkt aufrufen aus Komponenten) – z. B. `hapticCorrectAnswer(mode)`, `hapticLessonComplete()`, `hapticPathComplete()`, `hapticByokValidated()`, `hapticMatchSuccess(mode)`, `hapticCategorizeItemCorrect(mode)`, `hapticPromptLabError(cause)`. Die Funktion entscheidet intern anhand des `ThemeModeContext`-Modus (Playful/Focus), welcher native Haptic-Typ ausgelöst wird – Komponenten rufen nur das semantische Ereignis auf, nie `Haptics.impactAsync(...)` direkt.
2. Web-Kompatibilität: `expo-haptics` ist auf Web ein No-Op – die Utility muss auf Web-Plattform sicher keine Fehler werfen (Guard über `Platform.OS !== 'web'` oder try/catch, je nachdem was `expo-haptics` selbst schon abfängt).
3. Kein Haptic-Aufruf darf eine UI-Interaktion blockieren oder verzögern – immer "fire and forget", nie awaited vor einem Folge-Schritt.
4. Bei Unsicherheit, ob ein neuer Interaktionsmoment eine Haptik rechtfertigt: NICHT hinzufügen, ohne Rückfrage – die Liste in Abschnitt 2 ist die vollständige, aktuell freigegebene Menge.
