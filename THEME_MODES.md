# THEME_MODES.md
### StructAI – Playful vs. Focus Modus. Gleiche Daten, gleiche Logik, unterschiedliche Hülle.

Grundprinzip für Cursor: **Es gibt nur EINEN Datenzustand pro Screen.** Der Modus verändert ausschließlich Darstellung (Farbintensität, Copy, Animation, Icon-Stil), niemals Inhalte, Werte oder Navigationsstruktur. Implementierung über einen `ThemeModeContext`, der ein Set von Override-Tokens auf die Basis-Tokens aus DESIGN_TOKENS.md legt.

---

## 1. Architektur-Vorgabe

```
ThemeModeContext liefert: { mode: 'playful' | 'focus', tokens: ResolvedTokens, copy: ResolvedCopy }

ResolvedTokens = merge(BASE_TOKENS, MODE_OVERRIDES[mode])
ResolvedCopy   = merge(BASE_COPY, MODE_COPY[mode])
```

Jede Komponente liest NUR aus `useThemeMode()`, nie direkt aus DESIGN_TOKENS.md-Werten fest verdrahtet. So bleibt ein Umschalten zur Laufzeit (Einstellungen) möglich, ohne App-Neustart.

---

## 2. Visuelle Unterschiede

| Parameter | Playful | Focus |
|---|---|---|
| Sättigung Akzentfarben | 100% (volle accent-primary/accent-structure) | -15% Sättigung, etwas gedämpfter |
| Orb-Darstellung | Volle Illustration mit Glow-Animation | Reduziert auf schlichten Ring/Prozent-Indikator |
| Card-Radius | radius-xl (28px) bevorzugt | radius-lg (20px), kompakter |
| Animation-Intensität | spring-bouncy erlaubt bei Erfolg | ausschließlich spring-default, kürzere Distanzen |
| Streak-Darstellung | Badge-Icons mit Mini-Bounce beim Abhaken | Schlichte Checkmarks, kein Bounce |
| Sound-Feedback | An (dezente UI-Sounds bei Erfolg) | Aus (Standard) |
| Confetti/Celebration-Layer | Bei Meilensteinen aktiv | Nur dezenter Farb-Puls, kein Partikel-Effekt |
| Leaderboard-Sichtbarkeit | Standardmäßig eingeblendet | Standardmäßig ausgeblendet, opt-in |

---

## 3. Copy-Unterschiede (Tonalität, NICHT Inhalt)

Wichtig: Beide Varianten beschreiben denselben Sachverhalt – nur die Sprache ändert sich. Keine Variante darf weniger Information enthalten.

```
Beispiel – Score-Feedback nach einem Prompt:

playful: "🔥 Starker Prompt! Deine Struktur sitzt – noch mehr Constraints und du holst Top-Score."
focus:   "Score: 87/100. Struktur und Zieldefinition sind stark. Verbesserungspotenzial: präzisere Constraints."

Beispiel – Streak-Erinnerung:

playful: "Dein Orb wartet auf dich! Noch heute üben und die Serie retten."
focus:   "Tägliche Übung ausstehend. 4 Tage Serie aktiv."

Beispiel – Empty State (noch keine Lernpfade gestartet):

playful: "Bereit für dein erstes Abenteuer? Wähl deinen Lernpfad und leg los!"
focus:   "Wähle einen Lernpfad, um zu beginnen."
```

### Regel für Cursor
> "Jeder Text-String im UI existiert als Objekt `{ playful: string, focus: string }` in einer zentralen `copy.ts`-Datei, referenziert über einen Key. Niemals Copy direkt im JSX hardcoden."

---

## 4. Onboarding-Steuerung des Modus

Frage im Onboarding (siehe Produktkonzept, Abschnitt 9): "Wie würdest du gerne lernen?" mit zwei Optionen, visuell als Mini-Preview beider Modi dargestellt (kein reiner Text-Toggle) – der Nutzer sieht sofort, was ihn erwartet, bevor er wählt.

```
Cursor-Vorgabe: Baue diesen Auswahlscreen als zwei nebeneinander liegende Card-Previews,
die jeweils eine Miniatur des Home-Screens im entsprechenden Modus zeigen (kein Icon, kein Textlabel allein).
Auswahl setzt ThemeModeContext global und wird in Persistenz (MMKV) gespeichert.
```

Modus ist jederzeit in den Einstellungen wechselbar, nicht nur beim Onboarding.

---

## 5. Was sich NIEMALS zwischen den Modi unterscheiden darf

- Score-Werte, XP-Zahlen, Fortschrittsprozente (Zahlen sind immer identisch, nur anders eingerahmt)
- Navigationsstruktur (keine unterschiedlichen Screen-Flows je Modus)
- Verfügbare Funktionen (Focus-Modus ist keine "abgespeckte" Version, nur ruhiger dargestellt)
- Lerninhalte selbst (Lektionstext bleibt gleich, nur Feedback-Ton variiert)

### Regel für Cursor
> "Wenn du unsicher bist, ob ein Unterschied zwischen den Modi 'nur Stil' oder 'auch Funktion' ist: es darf NUR Stil sein. Bei jedem Zweifel: beide Modi müssen exakt dieselben Daten und Aktionen anbieten."

---

## 6. Technische Umsetzung – Reihenfolge für Cursor

1. `ThemeModeContext.tsx` mit Provider, State (playful/focus), Persistenz via MMKV
2. `tokens.ts`: BASE_TOKENS + MODE_OVERRIDES (playful, focus) + Resolver-Funktion
3. `copy.ts`: zentrale Copy-Objekte pro Screen/Komponente
4. `useThemeMode()`-Hook, der resolved tokens + copy zurückgibt
5. Erst danach: bestehende Komponenten aus Abschnitt "Basis-Komponenten" (siehe Cursor-Direktionsguide) auf den Hook umstellen, statt hardcodierte Werte
