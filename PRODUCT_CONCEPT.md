# PRODUCT_CONCEPT.md
### StructAI – Produktkonzept, Positionierung, Geschäftslogik (aus Claude- und Perplexity-Sparring rekonstruiert)

Dieses Dokument hält die Business-/Produktentscheidungen fest, die NICHT im Code sichtbar sind, aber jede zukünftige Feature-Entscheidung prägen sollen. Es ergänzt `PROJECT_CONTEXT.md` (technischer/historischer Überblick), `DESIGN_TOKENS.md` und `THEME_MODES.md` (visuelle Regeln).

---

## 1. Kernpositionierung (aktueller Stand – ersetzt frühere Annahme)

> **Wichtig:** Eine frühere Zielgruppen-Idee ("vier Altersgruppen", u. a. explizit 35+ als Zielgruppe für Icon-/Emoji-Regeln in `DESIGN_TOKENS.md`) wurde **verworfen**. Falls Regeltexte im Repo noch mit Alters-Framing begründet sind, ist die Begründung veraltet – der Regel-Inhalt selbst (z. B. "keine Emoji-UI") bleibt gültig, aber aus einem anderen Grund.

**Aktuelle, verbindliche Positionierung:**
- Einzige Kernzielgruppe: **Prompt-Power-User** – Menschen, die bereits regelmäßig mit KI-Modellen arbeiten und strukturierter/kostenbewusster damit arbeiten wollen. Keine Altersfrage.
- **Playful/Focus sind keine Zielgruppen-Segmentierung**, sondern eine persönliche Stil-Präferenz *innerhalb* dieser einen Kernzielgruppe.
- Markenversprechen: **"Werde nachweislich besser im Umgang mit KI."**
- StructAI darf nie als generisches "Lern-Prompts-wie-ein-Spiel"-Produkt wirken – Ziel ist ein glaubwürdiges, ernstes Werkzeug mit optional spielerischer Oberfläche, nicht ein Lernspiel mit KI-Thema.
- Vergleichsmarkt sind nicht andere Lern-Apps, sondern auch BYOK-Workspace-Tools (Perpendo, NovaKit) – deren Nutzer erwarten Kontrolle, Klarheit, Vertrauen, keine Belohnungsmechanik.

## 2. BYOK-Philosophie (Auflösung des ursprünglichen Widerspruchs)

Ursprünglicher Investoren-Einwand: Wenn Nutzer ihren eigenen API-Key mitbringen, wofür zahlen sie dann noch für Premium? Auflösung:
- BYOK ist kein technisches Detail, sondern **Teil des Wertversprechens selbst**: Kostenkontrolle, Modellfreiheit, kein Vendor-Lock-in – nicht "Zwang", sondern Verkaufsargument für genau die Power-User-Zielgruppe.
- API-Keys verlassen **niemals das Gerät** (lokal in Secure Storage, kein Server-Sync) – das ist eine harte Regel, kein Implementierungsdetail.
- Monetarisierung (Block H, Zahlungsinfrastruktur) ist **bewusst zurückgestellt**, bis die Content-Tiefe stimmt. Eine Paywall vor ausreichender Tiefe gilt als schädlich für Vertrauen und Conversion.

### Aktivierungsengpass BYOK → gelöst (bereits im Code umgesetzt, Block K)
Größtes identifiziertes Risiko: Ein BYOK-Setup-Zwang VOR dem ersten Aha-Moment tötet Aktivierung. Empfohlener und umgesetzter Flow (siehe `feature/schritt-k1-gastmodus` u. a., bereits in `develop`/`main`):
1. Sofortiger lokaler Demo-Einstieg **ohne** Key (Gastmodus, lokale Prompt-Heuristik).
2. Kurze, nutzenorientierte BYOK-Erklärung (Kostenkontrolle, Modellfreiheit).
3. Provider-Auswahl.
4. Key einfügen.
5. Sofortige Validierung (Test-Call).
6. Sichtbares Erfolgssignal, danach Feature-Freischaltung.

Dieser Flow ist **kein Bildungs-Onboarding**, sondern ein Vertrauensaufbau-Flow – Nutzer sollen so schnell wie möglich in einen funktionierenden Zustand kommen, nicht belehrt werden.

## 3. Content-Strategie

- Content-Tiefe hat Priorität vor Monetarisierung.
- Reihenfolge der Lernpfade (Priorität in dieser Reihenfolge, siehe `data/mockPaths.ts`):
  1. Prompt-Grundlagen (`prompt-basics`, `pb`) – Einstiegspunkt, höchste Priorität. **Status: 45/45 Lektionen fertig.**
  2. Struktur & Constraints (`structure-lab`, `sl`) – **Status: 35/35 Lektionen fertig** (Batches 1–4 auf `develop`, Ziel erreicht).
  3. Iteratives Verfeinern (`il`)
  4. Kontext & Rollen (`cm` – Context Mastery)
  5. Prompts bewerten (`es`)
  (Für Pfade 3–5 siehe `PROJECT_CONTEXT.md` Abschnitt 5 für aktuellen Ausbaustand.)
- Lernziel-Regeln: Jede Lektion hat ein klares Lernziel; falsche Antworten müssen echte Denkfehler abbilden (keine absurden Distraktoren); Erklärungen müssen den Lerneffekt transportieren, nicht nur "richtig/falsch" sagen; der Step-Typ folgt dem Lernziel, nie umgekehrt.
- **Harte Prozessregel nach einem Vorfall (sl-11):** Bei Content-Ingestion durch Cursor werden Inhalte **exakt** aus der Quelle übernommen. Bei unvollständiger/fehlender Quelle wird die Lücke explizit gemeldet – niemals eigenständig Lerninhalte nachdichten, auch nicht "im Sinne des Schemas".

## 4. Feature-Nicht-Ziele (bewusst ausgeschlossen)

- Kein generischer KI-Chat.
- Keine kindliche Gamification.
- Keine unnötigen Social-Features.
- Keine Team-/B2B-Features vor Launch.
- Kein Drag-and-Drop für Matching/Categorize – **tap-basiert**, weil Drag-and-Drop in Listen erfahrungsgemäß die meisten Scroll-Konflikte/Bugs verursacht.
- Keine Zahlungsinfrastruktur, solange Content-Tiefe nicht ausreicht.
- Keine Features, die die ernste Power-User-Positionierung schwächen.

## 5. Qualitätsmaßstab "Release-Ready"

Die App gilt erst als reif, wenn:
- Die Positionierung innerhalb von Sekunden klar ist.
- Der Unterschied Playful/Focus für den Nutzer nachvollziehbar ist.
- Focus sich wie ein echtes Werkzeug anfühlt (nicht wie "Playful, nur gedimmt" – siehe `THEME_MODES.md`, Abschnitt "Focus-Mode Rules v1").
- Lernfluss, Prompt Lab und ModelComparer echten Produktwert vermitteln.
- BYOK-Onboarding einfach, vertrauensbildend, nicht blockierend ist.
- Haptics gezielt wirken, nicht störend (siehe `HAPTICS.md`).
- Der Orb-Companion unterstützt, ohne zu dominieren.
- Das Layout durchgängig dem Token-System folgt.

## 6. Offene strategische Fäden (Stand dieser Analyse)

1. **Focus-Modus-Eigenständigkeit** – Perplexity-Recherche bestätigt: aktuelles Focus-Konzept ("Playful, nur gedimmt") ist wahrscheinlich nicht überzeugend genug für Power-User. Konkrete Regeln liegen bereits vor (`THEME_MODES.md`, "Focus-Mode Rules v1"), Umsetzung ist **bewusst zurückgestellt**, bis 5–8 Power-User-Interviews das Ausmaß bestätigen (teure, schwer rückgängig zu machende Änderung – "erst validieren, dann investieren").
2. **Haptic Feedback** – **implementiert** (siehe `HAPTICS.md`, "Haptics Map v1"). Wurde priorisiert VOR dem Focus-Redesign, weil additiv/reversibel/risikoarm.
3. **Content-Ausbau restliche Pfade** (il, cm, es) – noch nicht auf Zielumfang.
4. **Zahlungsinfrastruktur (Block H)** – bewusst zurückgestellt. **P3.2 Framing existiert:** Free = alle Lektionen + lokaler Lab-Coach; Pro = Live-KI-Bewertung (BYOK remote) + Zertifikat-Export. Soft-Gates + lokaler Pro-Preview-Toggle — noch kein IAP/StoreKit.

## 7. Team-Logik (Rollenverteilung)

- **Gründer:** trifft alle finalen Entscheidungen, insbesondere Merges nach `main`/`develop` und Freigaben.
- **Claude (historisch):** technischer Koordinator, übersetzte Strategie in konkrete Cursor-Prompts. Diese Rolle übernimmt zunehmend Cursor selbst direkt (siehe `PROJECT_CONTEXT.md`), da Cursor ohnehin den vollen Code- und Repo-Kontext sieht.
- **Cursor:** Setzt technische Schritte um, hält sich an Token-System und dokumentierte Regeln, meldet Abweichungen/Lücken statt zu improvisieren.
- **Perplexity:** Strategischer Sparringspartner – Marktrecherche mit Belegen, kritischer Gegenpart (nicht Bestätiger), Positionierungs-Check. Bewertet nicht technische Machbarkeit.
