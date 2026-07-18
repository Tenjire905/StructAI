# HAPTICS.md
### StructAI – Haptics Map v1.1 (verbindlich). Cursor MUSS diese Zuordnung nutzen, keine eigene Erfindung.

Herkunft: Perplexity-Recherche zu Haptic-Feedback-Praxis in Pro-Tools vs. gamifizierten Consumer-Apps, an StructAIs Interaktionsmomente angepasst. Grundregel: **Haptics sind ein Präzisionsinstrument, kein Belohnungs-Dauerfeuer.** Wenn alles vibriert, verliert alles Bedeutung.

**Kalibrierung v1.1 (Expo Go, physisches Gerät):** Reines `Selection` / alleiniges `Success Notification` war auf dem Zielgerät kaum spürbar; der `Medium Impact`-Anteil beim Pfadabschluss war der erste klar fühlbare Moment. v1.1 hebt Alltagsmomente auf Light/Medium Impact (oft kombiniert mit Notification) und hält den Pfadabschluss als Peak.

**Aktueller Stand: Implementiert** (`lib/haptics.ts`, `expo-haptics`). Verdrahtet an: Lektions-Antwort richtig/falsch (`app/lektion/[id].tsx`, zentral über `evaluateGradedStep` für alle Step-Typen inkl. matching/categorize/error_finding), Lektion abgeschlossen, Pfad abgeschlossen, BYOK-Key hinzugefügt/getestet (`components/features/profile/ByokKeysManager.tsx`), Prompt-Lab-Vergleich erfolgreich/fehlgeschlagen (`components/features/ModelComparer.tsx`).

**Bewusst offen gelassen (Folge-Schritt, kein Bug):** Granulare Pro-Paar-Haptik bei Matching/Categorize ("Selection" pro erfolgreicher Einzelzuordnung, nicht erst beim Gesamt-Check) würde eine Änderung der bestehenden Interaktionslogik erfordern (aktuell wird Korrektheit erst beim "Prüfen"-Button ausgewertet, nicht pro Zuordnung) – das ist eine UX-Entscheidung, keine reine Haptik-Ergänzung, daher hier nicht ungefragt umgesetzt. Orb-Gewinn ist in diesem Codebase-Stand untrennbar an Lektionsabschluss gekoppelt (kein eigenständiges Gain-Event) – die Lektionsabschluss-Haptik deckt das ab, eine zusätzliche separate Orb-Haptik im selben Moment würde gegen die Overuse-Regel (Abschnitt 3) verstoßen.

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
| Richtige Antwort (Lektion) | `Light Impact` | `Medium Impact` |
| Falsche Antwort | `Warning Notification` + `Light Impact` (nur bei Nutzerursache) | gleich – nie strafend stärker als Medium |
| Lektion abgeschlossen | `Success Notification` + `Medium Impact` | gleich |
| Pfad abgeschlossen + Zertifikat | `Success Notification` + `Medium Impact` | `Success Notification` + `Heavy Impact` (Peak) |
| Orb-Gewinn | `Light Impact` | `Success Notification` + `Medium Impact` |
| BYOK-Key erfolgreich validiert | `Success Notification` + `Medium Impact` | gleich |
| Matching – Paar final korrekt verbunden | `Light Impact` – **nur beim finalen Match** | gleich |
| Categorize – Item korrekt zugeordnet | `Light Impact` pro Item; Set-Abschluss: `Success` + `Medium Impact` | gleich |
| Prompt-Lab-Vergleich: Nutzer-/Validierungsfehler | `Error Notification` + `Medium Impact` | gleich |
| Prompt-Lab-Vergleich: Netzwerk/Provider | `Warning Notification` + `Light Impact` | gleich |
| Prompt-Lab-Vergleich: erfolgreich | `Success Notification` + `Medium Impact` | gleich |

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
