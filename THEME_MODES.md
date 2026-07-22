# THEME_MODES.md
### StructAI – Playful vs. Focus Modus. Gleiche Daten, gleiche Logik, unterschiedliche Hülle.

Grundprinzip für Cursor: **Es gibt nur EINEN Datenzustand pro Screen.** Der Modus verändert ausschließlich Darstellung (Farbintensität, Copy, Animation, Icon-Stil), niemals Inhalte, Werte oder Navigationsstruktur. Implementierung über einen `ThemeModeContext`, der ein Set von Override-Tokens auf die Basis-Tokens aus DESIGN_TOKENS.md legt.

---

## 1. Architektur-Vorgabe

```
ThemeModeContext liefert: {
  mode: 'playful' | 'focus',
  appearance: 'dark' | 'light',
  tokens: ResolvedTokens,
  copy: ResolvedCopy
}

ResolvedTokens = merge(APPEARANCE_PALETTE[appearance], MODE_OVERRIDES[mode])
ResolvedCopy   = merge(BASE_COPY, MODE_COPY[mode])
```

**Appearance (Hell/Dunkel) ist orthogonal zu Playful/Focus:** Appearance steuert Flächen/Text/Schatten; Mode steuert Density, Motion, Copy-Tonalität und Orb-Stil. Jede Komponente liest NUR aus `useThemeMode()`, nie direkt aus DESIGN_TOKENS.md-Werten fest verdrahtet. So bleibt ein Umschalten zur Laufzeit (Onboarding-Chip links, Profil-Umschalter) möglich, ohne App-Neustart.

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

---

## 7. Focus-Mode Rules v1 (Perplexity-Recherche, Stand: noch NICHT implementiert)

**Kontext:** Marktanalyse (Vergleich mit Notion/Linear/Arc/SAP-Fiori-Density-Konzepten sowie BYOK-Workspace-Tools wie NovaKit) ergab: Ein Pro-/Fokus-Modus wirkt nur dann glaubwürdig "ernst", wenn er sich auf **mehreren Ebenen gleichzeitig** unterscheidet – nicht nur Farbe/Sättigung. Reine Farbschema-Dimmung wird als kosmetisch wahrgenommen, nicht als echter Werkzeug-Modus. Das ist eine **Erweiterung** der bestehenden Regeln in Abschnitt 2, nicht deren Ersetzung – die Grundregel "nur Stil, nie Funktion/Daten" (Abschnitt 5) bleibt unverändert gültig.

Die folgenden 12 Regeln sind bereits gegen das bestehende Token-System aus `DESIGN_TOKENS.md` formuliert (keine neue Design-Sprache):

1. Focus nutzt systematisch kompaktere Dichte als Playful: gleiche Typografie-Skala, aber Spacing in den meisten Containern einen Schritt enger auf der Spacing-Skala (z. B. `space-4` statt `space-5`, `space-5` statt `space-6`). Ziel: höhere Informationsdichte, nicht kleinere Touch-Ziele.
2. Touch-Targets bleiben unverändert groß genug – Kompaktheit kommt über Außenabstände/Card-Padding/vertikale Zwischenräume, nie über schrumpfende Klickflächen.
3. Focus reduziert Radius im Kernlayout auf `radius-sm`/`radius-md`; `radius-lg`/`radius-xl` bleiben Playful vorbehalten, außer bei großen, bewusst ruhigen Flächen (z. B. Zertifikatskarten).
4. Focus bevorzugt klarere, härtere Flächen-/Sektionstrennung statt weicher, dekorativer Panels – mehr sichtbare Struktur, weniger "floating" UI.
5. Focus senkt Animationsfrequenz deutlich: nur `duration-instant`/`duration-fast` für Standardfeedback, `duration-medium` nur für echte Übergänge, `duration-celebration` nur für Pfadabschluss/Zertifikat. Playful darf mehr `medium`/`celebration` einsetzen.
6. Focus reduziert Sichtbarkeit des Orb-Companions auf die wirklich nötigen Stellen (Home-Header, Lektionsabschluss, Prompt Lab) – kein permanentes Präsenzsignal auf jedem Screen.
7. Focus nutzt stärkeres Textgewicht für Überschriften/Statuszeilen, aber insgesamt weniger Schriftstile – Hierarchie über Gewicht/Abstände, nicht über mehr Farbe/Deko.
8. Focus zeigt Rohdaten früher/sichtbarer: Scores, Fehlertypen, Modellnamen, Kostenhinweise, Fortschrittswerte gehören in die Primäransicht, nicht in versteckte Detailflächen.
9. Focus reduziert Sättigung der Akzentfarben (siehe Abschnitt 2 bestehende Tabelle), behält aber `accent-structure` (Cyan) exklusiv für echte Erfolgs-/Scoring-Momente.
10. Focus vermeidet Illustrationen, Konfetti und spielerische Mikro-Assets in Kernflächen – solche Elemente dürfen höchstens in klar begrenzten Abschlussmomenten auftreten, nie als dauerhafte Oberflächenlogik.
11. Focus darf dieselbe Struktur wie Playful behalten, aber die Wahrnehmung muss sich bei einem Wechsel SOFORT ändern: dichter, ruhiger, nüchterner, weniger emotional. Ist der Unterschied nicht auf den ersten Blick lesbar, ist er zu klein.
12. **Regel für neue Komponenten:** Erfüllt eine Komponente in Playful eine emotionale/dekorative Funktion, braucht die Focus-Version eine **neutrale, funktionsorientierte Entsprechung** – nicht nur eine gedämpfte Kopie. Das ist ein dauerhafter Mehraufwand für jede zukünftige Komponente, keine Einmal-Aktion.

**Umsetzungsstatus:** Bewusst zurückgestellt ("erst validieren, dann investieren") bis 5–8 qualitative Power-User-Interviews bestätigen, dass der aktuelle Zustand ("Playful, nur gedimmt") tatsächlich als unglaubwürdig wahrgenommen wird – das ist eine teure, schwer rückgängig zu machende Änderung über viele Screens hinweg. Nicht blockierend für andere Arbeit.
