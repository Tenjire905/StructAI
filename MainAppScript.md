# MASTER SPECIFICATION & ARCHITECT DOCUMENT: STRUCTAI

## 1. DIE VISION & DAS PRODUKT
* **Name:** StructAI
* **Slogan:** „Master Prompting. Build Real Intelligence.“
* **Konzept:** Die führende mobile Prompting-Akademie (ähnlich wie Duolingo für Sprachen). Sie verwandelt alltägliche Nutzer, Entwickler und Creator in KI-Power-User durch gamifiziertes Lernen und sofort anwendbares Praxis-Training im integrierten "Prompt-Lab".
* **Monetarisierung (Freemium):** - *Free Version:* Eingeschränkte Nutzung durch lokales Energie-Limit (Max. 5 Orbs). Zugriff auf Basis-Modelle (Gemini Flash, Grok) via standardmäßigem Backend oder BYOK.
  - *Premium (4,99€/Monat | 39€/Jahr | 99€ Lifetime):* Unbegrenzte Energie, Zugriff auf High-End-Modelle (GPT-4o, Claude 3.7, Grok 4), erweiterter AI Coach, voller ModelComparer, Cloud-Sync.

---

## 2. KERN-FEATURES (ANFORDERUNGSPROFIL)
* **Drei Spezialisierte Lernpfade:**
  - Everyday Mastery (Akzent: Elektrisches Blau) – Alltags-Prompting.
  - Code & Development (Akzent: Neon-Cyan) – Technisches & Entwickler-Prompting.
  - Visual Creation (Akzent: Vibrant-Pink) – Bildprompting & KI-Design.
* **Das Prompt-Lab:**
  - *Echtzeit-Scoring:* Logische Bewertung (0-100) basierend auf Struktur, Kontext, Rollenverteilung und Beispielen.
  - *One-Click Optimizer:* Automatische Verbesserung des Benutzer-Prompts mit einer animierten Before/After-Gegenüberstellung.
  - *ModelComparer:* Parallele API-Abfragen (Promise.all) an verschiedene KIs mit nebeneinanderliegender, scrollbarer Spalten-Ansicht.
* **Gamification-Engine:**
  - Streak-System (Tägliche Nutzung mit flüssiger 60-FPS-Feueranimation).
  - XP-System, Level-Aufstiege, tägliche Challenges und ein zeitbasiertes Energie-System (Regeneration von 1 Orb alle 30 Minuten).
* **API Key Management (BYOK):**
  - "Bring Your Own Key"-Infrastruktur. Nutzer können eigene API-Schlüssel hinterlegen, um Kosten für den Betreiber auf 0 € zu drücken.

---

## 3. DER 0€ HYBRID-TECH-STACK
* **Framework:** React Native + Expo (Expo Router für natives Tab-Routing).
* **Daten-Persistenz:** Komplett lokal auf dem Gerät über `Zustand` mit der `persist` (AsyncStorage) Middleware. Keine teuren Server- oder Datenbank-Fixkosten.
* **Sicherheit:** Verschlüsselte Ablage aller Benutzer-API-Keys ausschließlich auf dem Gerät im `Expo SecureStore` (Keine Übertragung an externe Server).
* **Cloud-Infrastruktur:** Deployment über Expo EAS (Free Tier) und GitHub Actions für automatisierte Code-Pipelines.

---

## 4. ARCHITEKTUR-GESETZ (FEATURE-SLICED DESIGN - FSD)
Der gesamte Code MUSS sich strikt ohne Ausnahme in die Feature-Sliced-Struktur unter `src/` gliedern, um Technical Debt zu verhindern:
1. `src/app/` -> Globale Konfigurationen (Root-Router, globale Provider, App-Einstiegspunkt).
2. `src/processes/` -> Feature-übergreifende Workflows (z.B. komplexe Lernpfad-Validierungen).
3. `src/features/` -> Isolierte, funktionale Module. Jedes Feature besitzt intern nur `ui/`, `model/` (Logik/Zustand) und `api/`.
   - *Module:* `PromptLab`, `Gamification`, `Lernpfade`, `Paywall`, `APIKeyManager`.
4. `src/shared/` -> Logikfreie, wiederverwendbare Hilfsmittel (UI-Komponenten, Custom-Hooks, Themes, Speicher-Wrapper).
* **STRIKTES IMPORT-VERBOT:** Features dürfen niemals untereinander importieren (`features/A` darf nicht aus `features/B` importieren). Übergreifende Logik gehört in `shared/` oder `processes/`.

---

## 5. DESIGN-RICHTLINIEN (STRIKTES SWIFTUI LOOK & FEEL)
Obwohl plattformübergreifend gebaut, MUSS die App die Ästhetik einer hochglanzpolierten, nativen iOS-App besitzen:
* **Formen:** Konsequenter Einsatz stark abgerundeter Ecken (`borderRadius: 16` bis `24`) für Karten und interaktive Elemente.
* **Haptik & Physisches Feedback:** Jedes `Pressable` MUSS bei Berührung sofort minimal mitskalieren (`scale: 0.97` via `react-native-reanimated` oder nativem `Animated`), um physisches, elastisches Button-Feedback zu geben.
* **Tiefenwirkung & Kontrast:** Tiefschwarzer/dunkelblauer Premium-Hintergrund (`#0F172A` oder `#020617`). Nutzung feiner, semitransparenten Rahmen (`borderWidth: 1`, `borderColor: 'rgba(255,255,255,0.08)'`) für edlen Glassmorphismus.
* **Farben-Einklang:** - Everyday Mastery -> `#007AFF` (Elektrisches Blau)
  - Code & Development -> `#00E5FF` (Neon-Cyan)
  - Visual Creation -> `#FF007F` (Vibrant-Pink)

---

## 6. ANTI-TECHNICAL-DEBT & CODE-QUALITÄTS-VERORDNUNG
* **100% Ausprogrammiert:** Absolute Null-Toleranz für Platzhalter, unvollständige Funktionen oder Kommentare wie `// TODO: Logik später einbauen`. Jede generierte Datei muss sofort lauffähig und vollständig sein.
* **Strikte Typisierung:** 100% reines TypeScript. Die Verwendung von `any` ist absolut verboten. Jede Server-Antwort, jedes Objekt und jede Komponenten-Prop benötigt ein klares Interface.
* **Ausnahmslose Crash-Sicherheit:** Jeder asynchrone Prozess und jede API-Abfrage MUSS in robuste `try-catch`-Blöcke gewrapped sein. Fehler werden abgefangen und dem Nutzer über ein elegantes, SwiftUI-artiges Banner-UI präsentiert, anstatt die App abstürzen zu lassen.
* **Globale Konsistenz:** Export-Stile (Named Exports bevorzugt) und Namenskonventionen müssen über alle Dateien hinweg absolut identisch und harmonisch sein. New Code darf niemals bestehenden Code brechen.