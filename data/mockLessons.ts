export type LessonInfoStep = {
  type: 'info';
  title: string;
  body: string;
};

export type LessonChoiceStep = {
  type: 'choice';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type LessonStep = LessonInfoStep | LessonChoiceStep;

export type MockLesson = {
  id: string;
  title: string;
  orbsReward: number;
  steps: LessonStep[];
};

const PROMPT_BASICS_LESSONS: MockLesson[] = [
  {
    id: 'pb-1',
    title: 'Was ist ein Prompt?',
    orbsReward: 15,
    steps: [
      {
        type: 'info',
        title: 'Prompt = Anweisung an das Modell',
        body: 'Ein Prompt ist die Eingabe, mit der du ein Sprachmodell steuerst: Frage, Aufgabe, Kontext und Vorgaben in einem Paket. Gute Prompts reduzieren Raten und liefern reproduzierbare Ergebnisse. Denk daran als Gesprächspartner, der nur sieht, was du schreibst – nichts davon ist selbstverständlich.',
      },
      {
        type: 'choice',
        question: 'Was beschreibt einen Prompt am treffendsten?',
        options: [
          'Eine zufällige Frage an das Internet.',
          'Eine strukturierte Anweisung mit Kontext, Aufgabe und optionalen Vorgaben.',
          'Nur der Name des gewünschten Ausgabeformats.',
        ],
        correctIndex: 1,
        explanation:
          'Ein Prompt bündelt alles, was das Modell wissen und tun soll – nicht nur eine lose Frage.',
      },
      {
        type: 'choice',
        question: 'Warum lohnt sich bewusstes Prompting?',
        options: [
          'Weil Modelle ohne klare Anweisungen immer die beste Antwort erraten.',
          'Weil präzise Prompts weniger Nacharbeit und weniger Halluzinationen erzeugen.',
          'Weil längere Prompts automatisch bessere Scores im Prompt Lab liefern.',
        ],
        correctIndex: 1,
        explanation:
          'Klare Anweisungen senken Interpretationsspielraum – du musst seltener mehrfach nachjustieren.',
      },
    ],
  },
  {
    id: 'pb-2',
    title: 'Klare Anweisungen',
    orbsReward: 15,
    steps: [
      {
        type: 'info',
        title: 'Eindeutigkeit schlägt Höflichkeit',
        body: 'Formuliere Aufgaben als konkrete Handlungsanweisungen: „Analysiere…", „Liste…", „Vergleiche…". Vermeide vage Wörter wie „etwas", „gut" oder „besser" ohne Messkriterium. Eine klare Anweisung nennt die Aktion und das erwartete Ergebnis.',
      },
      {
        type: 'choice',
        question: 'Welche Anweisung ist am klarsten?',
        options: [
          'Mach mal was Nettes mit dem Text.',
          'Kürze den Text auf maximal 120 Wörter und behalte die drei Kernargumente bei.',
          'Verbessere den Text, wenn du Zeit hast.',
        ],
        correctIndex: 1,
        explanation:
          'Aktion (kürzen), Limit (120 Wörter) und Inhalt (drei Kernargumente) sind eindeutig benannt.',
      },
      {
        type: 'choice',
        question: 'Was macht „Schreib einen guten Bericht" problematisch?',
        options: [
          'Das Wort „Bericht" ist zu fachlich.',
          '„Gut" ist nicht messbar – Länge, Ton und Struktur fehlen.',
          'Berichte dürfen in Prompts nicht vorkommen.',
        ],
        correctIndex: 1,
        explanation:
          'Ohne Kriterien für „gut" entscheidet das Modell nach eigenem Maßstab.',
      },
    ],
  },
  {
    id: 'pb-3',
    title: 'Zieldefinition',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        title: 'Warum Ziele zählen',
        body: 'Ein Prompt ohne klares Ziel zwingt das Modell zum Raten. Je präziser du beschreibst, was am Ende herauskommen soll, desto näher liegt die erste Antwort an deinem Wunschergebnis. Formuliere das Ziel als erwartetes Ergebnis, nicht als vage Richtung.',
      },
      {
        type: 'choice',
        question: 'Welche Zieldefinition ist am präzisesten?',
        options: [
          'Schreib was über unser neues Produkt.',
          'Erstelle eine Produktbeschreibung mit 3 Absätzen: Nutzen, Funktionen, Call-to-Action – Zielgruppe sind Einkaufsleiter.',
          'Mach einen guten Text für die Website, gerne etwas länger.',
        ],
        correctIndex: 1,
        explanation:
          'Die zweite Variante definiert Format (3 Absätze), Inhalt (Nutzen, Funktionen, CTA) und Zielgruppe – das Modell muss nichts raten.',
      },
      {
        type: 'choice',
        question: 'Was fehlt in diesem Prompt? "Fasse den Bericht zusammen."',
        options: [
          'Nichts – der Prompt ist vollständig.',
          'Ziellänge, Zielgruppe und Format der Zusammenfassung.',
          'Eine freundliche Begrüßung an das Modell.',
        ],
        correctIndex: 1,
        explanation:
          'Ohne Ziellänge, Zielgruppe und Format entscheidet das Modell selbst – und trifft selten deine Erwartung.',
      },
    ],
  },
  {
    id: 'pb-4',
    title: 'Formatvorgaben',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        title: 'Format früh festlegen',
        body: 'Sag dem Modell, in welcher Form die Antwort kommen soll: Aufzählung, Tabelle, JSON, Fließtext, E-Mail. Formatvorgaben verhindern, dass du Inhalte nachträglich in eine andere Struktur überführen musst. Je konkreter das Schema, desto weniger Nachbearbeitung.',
      },
      {
        type: 'choice',
        question: 'Welche Formatvorgabe ist am nützlichsten?',
        options: [
          'Antworte irgendwie übersichtlich.',
          'Gib 5 Bulletpoints mit je maximal 15 Wörtern aus.',
          'Schreib so viel wie nötig, Format egal.',
        ],
        correctIndex: 1,
        explanation:
          'Anzahl, Struktur (Bulletpoints) und Längenlimit pro Punkt sind klar definiert.',
      },
      {
        type: 'choice',
        question: 'Wann lohnt sich ein explizites Ausgabeformat wie JSON?',
        options: [
          'Nur wenn du Code schreibst – sonst nie.',
          'Wenn die Antwort maschinell weiterverarbeitet oder geparst werden soll.',
          'JSON ist immer besser als Fließtext.',
        ],
        correctIndex: 1,
        explanation:
          'Strukturierte Formate erleichtern Automatisierung und Vergleichbarkeit zwischen Läufen.',
      },
    ],
  },
  {
    id: 'pb-5',
    title: 'Beispiele nutzen',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        title: 'Few-Shot: Zeigen statt erklären',
        body: 'Ein oder zwei Beispiele für Eingabe und gewünschte Ausgabe kalibrieren das Modell schneller als lange Regeln. Beispiele sollten repräsentativ sein und den gewünschten Stil, Ton und das Format abbilden. Platziere sie direkt vor der eigentlichen Aufgabe.',
      },
      {
        type: 'choice',
        question: 'Was macht ein gutes Prompt-Beispiel aus?',
        options: [
          'Es ist möglichst lang und enthält alle Edge Cases.',
          'Es zeigt Eingabe und Zielausgabe im gewünschten Stil und Format.',
          'Es ersetzt jede schriftliche Anweisung vollständig.',
        ],
        correctIndex: 1,
        explanation:
          'Beispiele demonstrieren das Zielbild – sie ersetzen aber nicht klare Aufgaben und Constraints.',
      },
      {
        type: 'choice',
        question: 'Du willst kurze Produktnamen im Stil „NovaLite". Was hilft am meisten?',
        options: [
          '„Erfinde kreative Namen."',
          'Zwei Beispielpaare (Briefing → Name) plus die neue Aufgabe.',
          '„Sei kreativ, aber nicht zu kreativ."',
        ],
        correctIndex: 1,
        explanation:
          'Konkrete Beispielpaare verankern Länge, Stil und Namensmuster besser als abstrakte Appelle.',
      },
    ],
  },
  {
    id: 'pb-6',
    title: 'Negativ-Anweisungen',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        title: 'Sag, was nicht passieren soll',
        body: 'Negativ-Anweisungen grenzen unerwünschtes Verhalten ein: keine Fachbegriffe, keine Emojis, kein Marketing-Sprech. Sie wirken am besten in Kombination mit positiven Vorgaben – sonst weiß das Modell nicht, was stattdessen gelten soll. Formuliere Verbote konkret, nicht pauschal.',
      },
      {
        type: 'choice',
        question: 'Welche Negativ-Anweisung ist am wirksamsten?',
        options: [
          'Mach nichts Falsches.',
          'Verwende keine Emojis, keine Ausrufezeichen und keine Superlative.',
          'Sei bitte vorsichtig.',
        ],
        correctIndex: 1,
        explanation:
          'Spezifische Verbote sind überprüfbar – vage Warnungen nicht.',
      },
      {
        type: 'choice',
        question: 'Was fehlt bei reiner Negativliste „Keine Bulletpoints, kein JSON"?',
        options: [
          'Eine positive Alternative, z. B. Fließtext in 2 Absätzen.',
          'Mehr Negativ-Regeln.',
          'Ein Beispiel für eine schlechte Antwort.',
        ],
        correctIndex: 0,
        explanation:
          'Ohne positives Zielformat bleibt unklar, welche Struktur stattdessen erwartet wird.',
      },
    ],
  },
  {
    id: 'pb-7',
    title: 'Prompt-Länge',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        title: 'So lang wie nötig, so kurz wie möglich',
        body: 'Längere Prompts sind nicht automatisch besser. Jeder Satz sollte Information oder Constraint liefern. Redundanz und Wiederholungen verwässern Prioritäten. Bei komplexen Aufgaben strukturiere lieber mit Abschnitten statt alles mehrfach zu betonen.',
      },
      {
        type: 'choice',
        question: 'Welcher Prompt ist effizienter strukturiert?',
        options: [
          'Dreimal wiederholte Bitte „Sei präzise" ohne weitere Details.',
          'Kontext in 2 Sätzen, Aufgabe in 1 Satz, 3 nummerierte Constraints.',
          'Ein Absatz mit 400 Wörtern ohne Überschriften.',
        ],
        correctIndex: 1,
        explanation:
          'Klare Abschnitte und nummerierte Constraints sind leichter zu befolgen als Wiederholungen.',
      },
      {
        type: 'choice',
        question: 'Wann lohnt sich ein längerer Prompt?',
        options: [
          'Immer – je länger, desto professioneller.',
          'Wenn viel Kontext, Beispiele oder widerspruchsfreie Regeln nötig sind.',
          'Nur bei Modellen ohne Kontextfenster.',
        ],
        correctIndex: 1,
        explanation:
          'Länge rechtfertigt sich durch Mehrwert: Kontext, Beispiele, präzise Regeln – nicht durch Fülltext.',
      },
    ],
  },
  {
    id: 'pb-8',
    title: 'Abschlussprojekt',
    orbsReward: 30,
    steps: [
      {
        type: 'info',
        title: 'Alles zusammenführen',
        body: 'In diesem Abschlussprojekt kombinierst du klare Anweisung, Zieldefinition, Format, optional Beispiele und Negativ-Regeln. Ein vollständiger Prompt-Grundlagen-Prompt liest sich wie ein kurzer Briefing-Bogen: Kontext → Aufgabe → Format → Constraints → Verbote.',
      },
      {
        type: 'choice',
        question: 'Welcher Prompt erfüllt die Grundlagen am vollständigsten?',
        options: [
          'Schreib einen Launch-Post für unser Produkt.',
          'Kontext: B2B-SaaS für HR. Aufgabe: LinkedIn-Post (max. 150 Wörter). Format: Hook, Nutzen, CTA. Keine Emojis, kein Hype.',
          'LinkedIn-Post, professionell, bitte gut.',
        ],
        correctIndex: 1,
        explanation:
          'Kontext, Aufgabe, Längenlimit, Struktur und Negativ-Regeln sind in einem kompakten Prompt vereint.',
      },
      {
        type: 'choice',
        question: 'Was würdest du an Prompt B zuerst ergänzen? B: „Liste 5 Risiken für unser Projekt."',
        options: [
          'Eine Bitte um Höflichkeit.',
          'Projektbeschreibung, Risiko-Kategorien und Format (z. B. Tabelle mit Eintrittswahrscheinlichkeit).',
          'Mehr Ausrufezeichen für Dringlichkeit.',
        ],
        correctIndex: 1,
        explanation:
          'Ohne Kontext und Format bleibt die Antwort zu generisch – genau das übst du in diesem Pfad zu vermeiden.',
      },
    ],
  },
];

const STRUCTURE_LAB_LESSONS: MockLesson[] = [
  {
    id: 'sl-1',
    title: 'Warum Struktur zählt',
    orbsReward: 15,
    steps: [
      {
        type: 'info',
        title: 'Struktur schlägt Länge',
        body: 'Ein langer, unstrukturierter Prompt ist schwerer zu befolgen als ein kurzer mit klaren Abschnitten. Trenne Kontext, Aufgabe und Vorgaben visuell – zum Beispiel mit Überschriften oder Delimitern.',
      },
      {
        type: 'choice',
        question: 'Welches Element verbessert die Struktur eines Prompts am stärksten?',
        options: [
          'Mehr Höflichkeitsfloskeln.',
          'Klar getrennte Abschnitte für Kontext, Aufgabe und Constraints.',
          'Alles in einem einzigen langen Satz formulieren.',
        ],
        correctIndex: 1,
        explanation:
          'Getrennte Abschnitte helfen dem Modell, Anweisungen von Kontext zu unterscheiden und nichts zu übersehen.',
      },
    ],
  },
  {
    id: 'sl-2',
    title: 'Abschnitte & Delimiter',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        title: 'Visuelle Trennung hilft dem Modell',
        body: 'Nutze Überschriften (KONTEXT, AUFGABE, REGELN), XML-Tags oder Markdown-Überschriften, um Blöcke zu trennen. Delimiter wie --- oder ### machen Grenzen explizit. So „verliert" das Modell weniger Anweisungen in langem Fließtext.',
      },
      {
        type: 'choice',
        question: 'Welche Struktur ist für ein komplexes Briefing am klarsten?',
        options: [
          'Alles in einem Absatz ohne Zeilenumbrüche.',
          'Abschnitte mit Labels: ## Kontext, ## Aufgabe, ## Ausgabeformat.',
          'Nur Fettdruck im Fließtext ohne logische Reihenfolge.',
        ],
        correctIndex: 1,
        explanation:
          'Benannte Abschnitte schaffen eine feste Lesereihenfolge und reduzieren Übersehen von Regeln.',
      },
      {
        type: 'choice',
        question: 'Wozu dienen Delimiter wie --- zwischen Prompt-Teilen?',
        options: [
          'Sie machen den Prompt länger und damit intelligenter.',
          'Sie markieren Grenzen zwischen Kontext, Beispielen und Aufgabe.',
          'Sie ersetzen Constraints vollständig.',
        ],
        correctIndex: 1,
        explanation:
          'Delimiter sind visuelle Trennlinien – besonders hilfreich bei mehreren Beispielen oder Datenblöcken.',
      },
    ],
  },
  {
    id: 'sl-3',
    title: 'Constraints definieren',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        title: 'Constraints = messbare Grenzen',
        body: 'Constraints sind harte Vorgaben: Wortlimit, erlaubte Quellen, Pflichtfelder, verbotene Themen. Formuliere sie nummeriert und überprüfbar. „Kurz" ist kein Constraint – „maximal 80 Wörter" schon.',
      },
      {
        type: 'choice',
        question: 'Welche Formulierung ist ein echtes Constraint?',
        options: [
          'Bitte halte dich an den Punkt.',
          'Maximal 3 Sätze, keine Passive, Zielgruppe: Entwickler:innen.',
          'Schreib professionell.',
        ],
        correctIndex: 1,
        explanation:
          'Satzanzahl, Stilvorgabe und Zielgruppe sind konkret prüfbar.',
      },
      {
        type: 'choice',
        question: 'Warum nummerierte Constraints?',
        options: [
          'Nummern sind Deko – das Modell ignoriert sie.',
          'Sie machen Prioritäten und Vollständigkeit leichter prüfbar.',
          'Nur JSON-Prompts dürfen nummeriert sein.',
        ],
        correctIndex: 1,
        explanation:
          'Nummerierte Listen werden seltener unvollständig abgearbeitet als Regeln im Fließtext.',
      },
    ],
  },
  {
    id: 'sl-4',
    title: 'Prioritäten setzen',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        title: 'Nicht alles kann gleichzeitig #1 sein',
        body: 'Wenn Constraints kollidieren können, nenne die Rangfolge: „Ton ist wichtiger als Länge" oder „Faktentreue vor Kreativität". Prioritäten helfen dem Modell bei Trade-offs. Ohne sie gewinnt oft die zuletzt genannte Regel.',
      },
      {
        type: 'choice',
        question: 'Zwei Regeln: (A) max. 50 Wörter, (B) alle 4 Nutzenargumente nennen. Was fehlt?',
        options: [
          'Eine Prioritätsangabe, welche Regel bei Konflikt gewinnt.',
          'Mehr Höflichkeit.',
          'Ein längerer Kontextabschnitt ohne Bezug.',
        ],
        correctIndex: 0,
        explanation:
          'Ohne Priorität kann das Modell kürzen und Argumente weglassen oder umgekehrt – unvorhersehbar.',
      },
      {
        type: 'choice',
        question: 'Welche Prioritätsformulierung ist am klarsten?',
        options: [
          'Mach alles irgendwie ausgewogen.',
          'Bei Widerspruch: Faktentreue > Kürze > marketingfreundlicher Ton.',
          'Wichtig ist, dass es gut klingt.',
        ],
        correctIndex: 1,
        explanation:
          'Explizite Rangfolge bei Konflikten ist eine Kernkompetenz strukturierter Prompts.',
      },
    ],
  },
  {
    id: 'sl-5',
    title: 'Konflikte auflösen',
    orbsReward: 22,
    steps: [
      {
        type: 'info',
        title: 'Widersprüche erkennen, bevor das Modell rät',
        body: 'Typische Konflikte: sehr kurz UND sehr detailliert, kreativ UND strikt faktisch, viele Pflichtpunkte UND hartes Wortlimit. Löse sie durch Prioritäten, Stufen („erst Vollversion, dann Kürzung") oder Scope-Reduktion (weniger Pflichtfelder).',
      },
      {
        type: 'choice',
        question: 'Prompt verlangt „vollständige Analyse" und „max. 3 Bulletpoints". Beste Lösung?',
        options: [
          'Beides stehen lassen – das Modell findet schon einen Weg.',
          'Priorität setzen oder Pflichtfelder auf 3 Kernpunkte reduzieren.',
          'Nur das Wort „vollständig" fetter schreiben.',
        ],
        correctIndex: 1,
        explanation:
          'Widersprüchliche Constraints ohne Auflösung erzeugen zufällige Kompromisse.',
      },
      {
        type: 'choice',
        question: 'Welche Strategie löst „detilliert" vs. „max. 100 Wörter" elegant?',
        options: [
          'Zwei getrennte Prompts: erst Details sammeln, dann in zweitem Schritt kürzen.',
          'Längenlimit ignorieren.',
          '„Detailliert" streichen und nichts ersetzen.',
        ],
        correctIndex: 0,
        explanation:
          'Iterative Schritte sind oft besser als ein widersprüchlicher Einzelprompt.',
      },
    ],
  },
  {
    id: 'sl-6',
    title: 'Abschlussprojekt',
    orbsReward: 30,
    steps: [
      {
        type: 'info',
        title: 'Struktur-Prompt in der Praxis',
        body: 'Baue einen Prompt mit klar getrennten Abschnitten, nummerierten Constraints, Prioritäten bei Konflikten und ohne widersprüchliche Regeln. Ziel: eine Antwort, die du ohne Nachfragen in ein Dokument übernehmen könntest.',
      },
      {
        type: 'choice',
        question: 'Welcher Prompt zeigt reife Strukturarbeit?',
        options: [
          'Analysiere den Markt, aber nicht zu lang.',
          '## Kontext … ## Aufgabe … ## Constraints (1–4) … ## Priorität: Tiefe vor Kürze.',
          'Marktanalyse bitte, du kennst dich aus.',
        ],
        correctIndex: 1,
        explanation:
          'Abschnitte, nummerierte Constraints und explizite Priorität – das ist das Ziel dieses Pfads.',
      },
      {
        type: 'choice',
        question: 'Letzter Check: Was prüfst du vor dem Absenden?',
        options: [
          'Ob der Prompt mindestens 500 Wörter hat.',
          'Ob Constraints widersprüchlich sind und ob Prioritäten gesetzt sind.',
          'Ob mindestens drei Emojis enthalten sind.',
        ],
        correctIndex: 1,
        explanation:
          'Konflikt-Check und Prioritäten sind der Qualitätsanker für strukturierte Prompts.',
      },
    ],
  },
];

const CONTEXT_MASTERY_LESSONS: MockLesson[] = [
  {
    id: 'cm-1',
    title: 'Kontextfenster verstehen',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        title: 'Alles kostet Platz im Fenster',
        body: 'Das Kontextfenster ist das Arbeitsgedächtnis des Modells: Prompt, Beispiele, Dokumente und bisheriger Chat teilen sich denselben Platz. Relevantes nach vorne, Redundanz raus. Sehr lange Inputs können ältere Anweisungen verdrängen.',
      },
      {
        type: 'choice',
        question: 'Was passiert bei sehr langem Kontext am ehesten?',
        options: [
          'Das Modell wird automatisch schneller.',
          'Frühere Anweisungen oder Details können an Gewicht verlieren.',
          'Das Kontextfenster wächst unbegrenzt mit.',
        ],
        correctIndex: 1,
        explanation:
          'Bei begrenztem Fenster konkurrieren alle Teile – Priorisierung und Kürze matter.',
      },
      {
        type: 'choice',
        question: 'Welche Strategie schont das Kontextfenster?',
        options: [
          'Dieselbe Regel fünfmal wiederholen.',
          'Kompakte Zusammenfassung statt vollständiger Rohdatan.',
          'Alle Anhänge ungefiltert einfügen.',
        ],
        correctIndex: 1,
        explanation:
          'Destillierte Zusammenfassungen liefern Signal ohne unnötiges Token-Volumen.',
      },
    ],
  },
  {
    id: 'cm-2',
    title: 'Rollen zuweisen',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        title: 'Rolle setzt Erwartungsrahmen',
        body: 'Eine System- oder Rollenanweisung („Du bist erfahrene:r Editor:in…") kalibriert Ton, Tiefe und Risikoverhalten. Rollen sollten zur Aufgabe passen und konkret sein – nicht nur „Experte" ohne Domäne.',
      },
      {
        type: 'choice',
        question: 'Welche Rollenanweisung ist am nützlichsten?',
        options: [
          'Du bist sehr intelligent.',
          'Du bist technische Redakteur:in für DevOps-Tools, Zielgruppe: Junior-Entwickler:innen.',
          'Verhalte dich professionell.',
        ],
        correctIndex: 1,
        explanation:
          'Domäne, Output-Typ und Zielgruppe machen die Rolle steuerbar.',
      },
      {
        type: 'choice',
        question: 'Wofür brauchst du Rollen nicht?',
        options: [
          'Um Ton und Fachtiefe konsistent zu halten.',
          'Um mathematische Fakten zu erfinden, die du nicht prüfst.',
          'Um Antwortformat und Perspektive zu rahmen.',
        ],
        correctIndex: 1,
        explanation:
          'Rollen steuern Stil und Tiefe – sie ersetzen keine Faktenchecks.',
      },
    ],
  },
  {
    id: 'cm-3',
    title: 'Hintergrundwissen einbetten',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        title: 'Nur relevantes Wissen mitgeben',
        body: 'Betten Hintergrundwissen als kompakten Block ein: Produktfakten, Zielgruppe, Constraints aus dem Projekt. Markiere, was verbindlich ist („Gegeben:") vs. was recherchiert werden darf. Zu viel irrelevanter Kontext verwässert die Aufgabe.',
      },
      {
        type: 'choice',
        question: 'Wie bettest du Projektwissen am saubersten ein?',
        options: [
          'Unstrukturiert zwischen Aufgabe und Grußformel streuen.',
          'Abschnitt „Gegeben:" mit Bulletpoints, dann „Aufgabe:".',
          'Nur implizit erwähnen und hoffen.',
        ],
        correctIndex: 1,
        explanation:
          'Getrennte „Gegeben"-Blöcke machen Fakten für das Modell leicht auffindbar.',
      },
      {
        type: 'choice',
        question: 'Was gehört NICHT in den Pflicht-Kontext?',
        options: [
          'Verbindliche Produktfakten für den Text.',
          'Spekulationen, die du selbst noch nicht verifiziert hast, als Fakten.',
          'Zielgruppe und Tonvorgaben.',
        ],
        correctIndex: 1,
        explanation:
          'Ungeprüfte Spekulationen als „Gegeben" erzeugen Halluzinationen mit Autoritätsanstrich.',
      },
    ],
  },
  {
    id: 'cm-4',
    title: 'Ton & Stil steuern',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        title: 'Ton ist mehr als „freundlich"',
        body: 'Definiere Stil über konkrete Merkmale: Satzlänge, Du/Sie, Fachgrad, erlaubte Rhetorik. Ein Mini-Beispiel-Satz im Zielton ist oft effektiver als „schreib locker". Widersprich dem Ton nicht mit Beispielen in anderem Stil.',
      },
      {
        type: 'choice',
        question: 'Welche Stilvorgabe ist am präzisesten?',
        options: [
          'Bitte nett formulieren.',
          'Sie-Form, sachlich, max. 20 Wörter pro Satz, keine Metaphern.',
          'Modern und frisch.',
        ],
        correctIndex: 1,
        explanation:
          'Messbare Stilmerkmale sind reproduzierbar – vage Adjektive nicht.',
      },
      {
        type: 'choice',
        question: 'Du willst einen sachlichen Ton, lieferst aber ein lockeres Beispiel. Folge?',
        options: [
          'Das Modell ignoriert Beispiele immer.',
          'Das Beispiel kann den Ton übersteuern – Beispiel anpassen oder entfernen.',
          'Mehr Caps-Lock in den Regeln hilft.',
        ],
        correctIndex: 1,
        explanation:
          'Beispiele sind starke Signale – sie müssen zum gewünschten Stil passen.',
      },
    ],
  },
  {
    id: 'cm-5',
    title: 'Persona-Techniken',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        title: 'Persona = Rolle plus Verhaltensregeln',
        body: 'Eine Persona kombiniert Rolle, Zielgruppe, Tabus und Antwortmuster. Sie eignet sich für wiederkehrende Aufgaben (Support, Coaching, Review). Halte Personas kurz und widerspruchsfrei – zu viele Traits verwässern das Profil.',
      },
      {
        type: 'choice',
        question: 'Was unterscheidet eine Persona von einer Einzeil-Rolle?',
        options: [
          'Personas enthalten mehrere Verhaltensregeln und Grenzen für wiederholbare Szenarien.',
          'Personas funktionieren nur in ChatGPT.',
          'Es gibt keinen Unterschied.',
        ],
        correctIndex: 0,
        explanation:
          'Personas bündeln Rolle, Grenzen und typische Antwortmuster für Konsistenz.',
      },
      {
        type: 'choice',
        question: 'Welche Persona ist für Code-Review am klarsten?',
        options: [
          'Du bist nett und hilfsbereit.',
          'Senior-Dev, Fokus: Lesbarkeit & Tests, kein Rewrite ohne Begründung, Bullet-Feedback.',
          'Du magst sauberen Code.',
        ],
        correctIndex: 1,
        explanation:
          'Domäne, Fokus, Tabu und Output-Format machen die Persona operational.',
      },
    ],
  },
  {
    id: 'cm-6',
    title: 'Kontext-Overload vermeiden',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        title: 'Mehr Kontext ≠ bessere Antwort',
        body: 'Kontext-Overload entsteht durch irrelevante Anhänge, doppelte Informationen und widersprüchliche Quellen. Filter vor dem Prompt: Was muss das Modell wissen, um die Aufgabe zu lösen? Alles andere ist Rauschen.',
      },
      {
        type: 'choice',
        question: 'Welches Vorgehen reduziert Kontext-Overload?',
        options: [
          'Alle E-Mails des Jahres anhängen „zur Sicherheit".',
          'Kuratierte Auszüge plus explizite Liste der verbindlichen Fakten.',
          'Den Prompt verdoppeln, damit nichts verloren geht.',
        ],
        correctIndex: 1,
        explanation:
          'Kuration und explizite Faktenliste liefern Signal ohne Rauschen.',
      },
      {
        type: 'choice',
        question: 'Zwei Quellen widersprechen sich. Was tun?',
        options: [
          'Beide unkommentiert einfügen.',
          'Priorität benennen oder eine Quelle als verbindlich markieren.',
          'Das Modell soll einfach raten.',
        ],
        correctIndex: 1,
        explanation:
          'Widersprüchlicher Kontext ohne Auflösung erzeugt zufällige Antworten.',
      },
    ],
  },
  {
    id: 'cm-7',
    title: 'Abschlussprojekt',
    orbsReward: 30,
    steps: [
      {
        type: 'info',
        title: 'Kontext meisterhaft dosieren',
        body: 'Kombiniere kompakten Pflichtkontext, passende Rolle/Persona, klare Stilvorgaben und vermeide Overload. Der Prompt sollte lesbar bleiben: jeder Absatz hat einen Job.',
      },
      {
        type: 'choice',
        question: 'Welcher Prompt zeigt Kontext-Meisterschaft?',
        options: [
          'Hier 40 Seiten PDF, fass irgendwas zusammen.',
          'Rolle + 5 Bullet „Gegeben" + Aufgabe + Stil + max. Länge, PDF nur als 10-Zeilen-Summary.',
          'Fass zusammen, du weißt schon was wichtig ist.',
        ],
        correctIndex: 1,
        explanation:
          'Destillierter Kontext, Rolle und klare Aufgabe – ohne Fenster zu fluten.',
      },
      {
        type: 'choice',
        question: 'Finaler Check vor dem Absenden?',
        options: [
          'Ist jeder Kontextblock relevant und widerspruchsfrei?',
          'Ist der Prompt mindestens doppelt so lang wie die Aufgabe?',
          'Sind mindestens drei Rollen gleichzeitig gesetzt?',
        ],
        correctIndex: 0,
        explanation:
          'Relevanz und Widerspruchsfreiheit sind die Qualitätsgates für Kontext-Prompts.',
      },
    ],
  },
];

const ITERATION_LOOPS_LESSONS: MockLesson[] = [
  {
    id: 'il-1',
    title: 'Erste Antwort bewerten',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        title: 'Erste Antwort = Entwurf, nicht Endprodukt',
        body: 'Bewerte die erste Antwort strukturiert: Was trifft das Ziel? Was fehlt? Was widerspricht Constraints? Notiere konkrete Abweichungen statt „gefällt mir nicht". So wird die nächste Iteration zielgerichtet.',
      },
      {
        type: 'choice',
        question: 'Welches Feedback ist am iterierbarsten?',
        options: [
          'Nochmal, aber besser.',
          'Abschnitt 2 fehlt CTA; Bullet 3 ist zu lang (>15 Wörter); Ton zu werblich.',
          'Das war okay.',
        ],
        correctIndex: 1,
        explanation:
          'Konkrete Abweichungen pro Constraint sind direkt in den nächsten Prompt übertragbar.',
      },
      {
        type: 'choice',
        question: 'Was solltest du zuerst prüfen?',
        options: [
          'Ob die Antwort Constraints und Zielformat erfüllt.',
          'Ob das Modell dich persönlich mag.',
          'Ob die Antwort die längste mögliche Variante ist.',
        ],
        correctIndex: 0,
        explanation:
          'Constraint-Check vor Geschmacksfragen – sonst optimierst du am falschen Problem.',
      },
    ],
  },
  {
    id: 'il-2',
    title: 'Gezielt nachsteuern',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        title: 'Delta statt Neustart',
        body: 'In Iterationen änderst du gezielt das Delta: „Behalte Struktur, kürze Abschnitt 2, ersetze Beispiel in Bullet 1". Vermeide komplett neue Prompts, wenn 80 % schon passen – du verlierst sonst gute Teile.',
      },
      {
        type: 'choice',
        question: 'Die Struktur passt, nur der Ton ist zu salopp. Beste Nachsteuerung?',
        options: [
          'Komplett neuen Prompt ohne Referenz schreiben.',
          '„Gleiche Gliederung beibehalten, Ton: Sie-Form, sachlich, keine Umgangssprache."',
          'Einfach nochmal senden.',
        ],
        correctIndex: 1,
        explanation:
          'Explizit behalten + gezielt ändern spart Kontext und Qualität.',
      },
      {
        type: 'choice',
        question: 'Was gehört in einen guten Follow-up-Prompt?',
        options: [
          'Referenz auf die vorherige Antwort plus präzise Änderungsliste.',
          'Nur „nochmal".',
          'Alle Regeln von null wiederholen ohne Bezug zur Antwort.',
        ],
        correctIndex: 0,
        explanation:
          'Referenz + Delta ist das Kernmuster iterativen Promptings.',
      },
    ],
  },
  {
    id: 'il-3',
    title: 'Varianten vergleichen',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        title: 'A/B auf Prompt-Ebene',
        body: 'Erzeuge Varianten mit gezielten Prompt-Unterschieden (z. B. mit/ohne Beispiel, enger/weiter Constraint). Vergleiche anhand derselben Kriterien – nicht Bauchgefühl allein. Dokumentiere, welche Prompt-Änderung welchen Effekt hatte.',
      },
      {
        type: 'choice',
        question: 'Was ist ein sauberer A/B-Test?',
        options: [
          'Zwei komplett verschiedene Aufgaben mit gleichem Modell.',
          'Gleiche Aufgabe, genau eine Prompt-Variable geändert, gleiche Bewertungskriterien.',
          'Zehn Variablen gleichzeitig ändern.',
        ],
        correctIndex: 1,
        explanation:
          'Eine Variable pro Test – sonst weißt du nicht, was gewirkt hat.',
      },
      {
        type: 'choice',
        question: 'Zwei Varianten: A mit Beispiel, B ohne. A gewinnt. Nächster Schritt?',
        options: [
          'Beispiel dauerhaft in den Standard-Prompt übernehmen und dokumentieren.',
          'Beispiel sofort wieder entfernen.',
          'Nie wieder testen.',
        ],
        correctIndex: 0,
        explanation:
          'Gewinner-Patterns in deine Prompt-Bibliothek übernehmen ist der Lernwert.',
      },
    ],
  },
  {
    id: 'il-4',
    title: 'Feedback-Schleifen',
    orbsReward: 22,
    steps: [
      {
        type: 'info',
        title: 'Stop-Kriterien definieren',
        body: 'Feedback-Schleifen brauchen ein Ende: max. N Iterationen oder klare Done-Kriterien (alle Constraints grün). Jede Runde: bewerten → Delta formulieren → erneut generieren. Stoppe, wenn Verbesserung marginal wird.',
      },
      {
        type: 'choice',
        question: 'Wann beendest du die Schleife am sinnvollsten?',
        options: [
          'Wenn alle definierten Done-Kriterien erfüllt sind.',
          'Erst nach mindestens 20 Runden.',
          'Sobald die erste Antwort da ist.',
        ],
        correctIndex: 0,
        explanation:
          'Done-Kriterien verhindern endlose Feintuning-Schleifen ohne Mehrwert.',
      },
      {
        type: 'choice',
        question: 'Was verhindert Schleifen-Drift?',
        options: [
          'Jede Runde den kompletten Prompt zufällig umschreiben.',
          'Jede Runde nur das dokumentierte Delta adressieren.',
          'Kein Feedback geben.',
        ],
        correctIndex: 1,
        explanation:
          'Fokussierte Deltas halten gute Teile stabil und verbessern gezielt.',
      },
    ],
  },
  {
    id: 'il-5',
    title: 'Abschlussprojekt',
    orbsReward: 30,
    steps: [
      {
        type: 'info',
        title: 'Vom Entwurf zum fertigen Output',
        body: 'Simuliere einen vollständigen Loop: Erstprompt → Bewertung → zwei gezielte Iterationen → Vergleich → Done. Dokumentiere Prompt-Version und Constraint-Score pro Stufe.',
      },
      {
        type: 'choice',
        question: 'Welcher Ablauf beschreibt gute Iterationspraxis?',
        options: [
          'Ein Prompt, eine Antwort, fertig – egal ob Constraints passen.',
          'Erstprompt → Constraint-Review → Delta-Follow-ups → Stop bei Done-Kriterien.',
          'Nur regenerieren ohne Feedback bis es zufällig passt.',
        ],
        correctIndex: 1,
        explanation:
          'Strukturierter Loop mit Stop-Kriterien ist das Ziel dieses Pfads.',
      },
      {
        type: 'choice',
        question: 'Was dokumentierst du für künftige Prompts?',
        options: [
          'Welche Prompt-Änderung welches Constraint-Problem gelöst hat.',
          'Nur die finale Antwort ohne Prompt-Historie.',
          'Die Uhrzeit des Requests.',
        ],
        correctIndex: 0,
        explanation:
          'Prompt-Deltas als Lernmaterial machen dich schneller bei ähnlichen Aufgaben.',
      },
    ],
  },
];

const EVAL_SCORING_LESSONS: MockLesson[] = [
  {
    id: 'es-1',
    title: 'Bewertungskriterien',
    orbsReward: 18,
    steps: [
      {
        type: 'info',
        title: 'Erst Kriterien, dann Urteil',
        body: 'Bevor du „gut" oder „schlecht" sagst, definiere Kriterien: Struktur, Zieltreue, Constraints, Faktentreue, Ton. Gewichte sie nach Projektziel. Ohne Kriterien ist jeder Score willkürlich.',
      },
      {
        type: 'choice',
        question: 'Welches Kriterienset passt zu einem Support-Antwort-Prompt?',
        options: [
          'Nur „klingt freundlich".',
          'Korrektheit, Lösungsschritte, Ton, Länge, keine verbotenen Versprechen.',
          'Anzahl der Fachwörter.',
        ],
        correctIndex: 1,
        explanation:
          'Domänenspezifische, prüfbare Kriterien statt vager Gesamteindruck.',
      },
      {
        type: 'choice',
        question: 'Warum Kriterien vor dem Prompt festlegen?',
        options: [
          'Damit du später objektiver iterieren und vergleichen kannst.',
          'Damit das Modell automatisch langsamer antwortet.',
          'Kriterien sind nur für Prüfungen relevant.',
        ],
        correctIndex: 0,
        explanation:
          'Kriterien sind dein Messgerät – für Iteration, A/B und Team-Review.',
      },
    ],
  },
  {
    id: 'es-2',
    title: 'Score-Systeme',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        title: 'Skalen mit Bedeutung',
        body: 'Ein Score ohne Rubrik ist wertlos. Definiere pro Stufe, was zählt (z. B. 80+ = alle Pflicht-Constraints erfüllt). StructAI nutzt Struktur, Ziel und Constraints – analog solltest du Teilscores transparent machen.',
      },
      {
        type: 'choice',
        question: 'Was macht ein Score-System brauchbar?',
        options: [
          'Eine Zahl ohne Erklärung.',
          'Teilscores mit klaren Schwellen und Begründung pro Dimension.',
          'Nur der höchste je gesehene Wert.',
        ],
        correctIndex: 1,
        explanation:
          'Teilscores + Rubrik erklären, wo der Prompt noch Lücken hat.',
      },
      {
        type: 'choice',
        question: 'Prompt Lab zeigt Struktur 90, Constraints 40. Was ist die Konsequenz?',
        options: [
          'Gesamtscore ignorieren, Constraints gezielt nachschärfen.',
          'Prompt komplett verwerfen ohne Analyse.',
          'Nur den Struktur-Score feiern.',
        ],
        correctIndex: 0,
        explanation:
          'Teilscores zeigen die Hebel – hier: Constraints verbessern.',
      },
    ],
  },
  {
    id: 'es-3',
    title: 'Blindstellen erkennen',
    orbsReward: 20,
    steps: [
      {
        type: 'info',
        title: 'Was du nicht prüfst, gewinnt',
        body: 'Typische Blindstellen: ungeprüfte Fakten, fehlende Edge Cases, bias durch Beispiele, zu enge Constraints. Nutze Checklisten und zweite Leser:innen (oder ein Review-Prompt) für Bereiche außerhalb deiner Aufmerksamkeit.',
      },
      {
        type: 'choice',
        question: 'Welche Blindstelle ist am häufigsten?',
        options: [
          'Zu viele Emojis in Code-Prompts.',
          'Faktische Behauptungen ohne Quelle oder Prüfschritt.',
          'Zu kurze Überschriften.',
        ],
        correctIndex: 1,
        explanation:
          'Ungeprüfte Fakten sehen oft plausibel aus – deshalb extra prüfen.',
      },
      {
        type: 'choice',
        question: 'Wie findest du Blindstellen systematisch?',
        options: [
          'Checkliste gegen alle Constraints + separates Review mit „Was könnte fehlen?"',
          'Nur die erste Zeile lesen.',
          'Blindstellen gibt es nicht bei guten Modellen.',
        ],
        correctIndex: 0,
        explanation:
          'Checkliste + explizite Review-Frage deckt Lücken auf, die Bauchgefühl übersieht.',
      },
    ],
  },
  {
    id: 'es-4',
    title: 'Vergleichstests',
    orbsReward: 22,
    steps: [
      {
        type: 'info',
        title: 'Gleiche Inputs, gleiche Kriterien',
        body: 'Vergleichstests stellen Prompt- oder Modellvarianten unter gleichen Bedingungen: identische Aufgabe, gleicher Kontext, gleiche Bewertungsrubrik. So isolierst du den Effekt der Prompt-Änderung.',
      },
      {
        type: 'choice',
        question: 'Was invalidiert einen Vergleichstest?',
        options: [
          'Gleiche Aufgabe, unterschiedliche Bewertungskriterien pro Variante.',
          'Gleiche Rubrik für alle Varianten.',
          'Dokumentierte Prompt-Unterschiede.',
        ],
        correctIndex: 0,
        explanation:
          'Unterschiedliche Kriterien machen Scores zwischen Varianten nicht vergleichbar.',
      },
      {
        type: 'choice',
        question: 'Du vergleichst zwei Prompts über 5 Testfälle. Was wählst du?',
        options: [
          'Den Prompt mit dem höheren Durchschnitt bei gleicher Rubrik.',
          'Den kürzeren Prompt ohne Score.',
          'Den zufällig zuerst getesteten.',
        ],
        correctIndex: 0,
        explanation:
          'Mehrere Testfälle + gleiche Rubrik = belastbarer Vergleich.',
      },
    ],
  },
  {
    id: 'es-5',
    title: 'Automatisierte Checks',
    orbsReward: 22,
    steps: [
      {
        type: 'info',
        title: 'Maschinell Prüfbares automatisieren',
        body: 'Automatisiere Checks für harte Regeln: Wortanzahl, JSON-Validität, Pflichtfelder, verbotene Wörter. Weiche Kriterien (Ton, Argumentationsqualität) bleiben manuell oder modellbasiert – aber mit derselben Rubrik.',
      },
      {
        type: 'choice',
        question: 'Was eignet sich am besten für automatische Checks?',
        options: [
          'Ob der Text „inspirierend" wirkt.',
          'Ob JSON parsebar ist und alle Pflichtkeys enthält.',
          'Ob der Autor zufrieden ist.',
        ],
        correctIndex: 1,
        explanation:
          'Strukturelle, binäre Checks sind ideal für Automatisierung.',
      },
      {
        type: 'choice',
        question: 'Automatischer Check schlägt fehl: Länge 220 Wörter, Limit 150. Nächster Schritt?',
        options: [
          'Constraint-Verletzung als Iterations-Delta zurück in den Prompt.',
          'Check ignorieren, wenn der Text gut klingt.',
          'Limit nachträglich erhöhen ohne Dokumentation.',
        ],
        correctIndex: 0,
        explanation:
          'Failed Checks sind präzise Feedback für die nächste Prompt-Iteration.',
      },
    ],
  },
  {
    id: 'es-6',
    title: 'Abschlussprojekt',
    orbsReward: 30,
    steps: [
      {
        type: 'info',
        title: 'Prompt-Qualität messbar machen',
        body: 'Definiere Rubrik, erhebe Teilscores, führe einen Vergleichstest durch und markiere Blindstellen. Ziel: du kannst begründen, warum Prompt A besser ist als B – nicht nur „gefällt mir".',
      },
      {
        type: 'choice',
        question: 'Welcher Abschluss-Workflow ist am reifsten?',
        options: [
          'Einmal prompten, Bauchgefühl, fertig.',
          'Rubrik → 3 Testfälle → Teilscores → Vergleich → dokumentierte Prompt-Wahl.',
          'Nur den höchsten Prompt-Lab-Score ohne Begründung.',
        ],
        correctIndex: 1,
        explanation:
          'Messbarkeit + Vergleich + Dokumentation – das ist Bewertungskompetenz.',
      },
      {
        type: 'choice',
        question: 'Was liefert der größte Langzeitnutzen?',
        options: [
          'Eine wiederverwendbare Rubrik und Prompt-Versionen mit Score-Historie.',
          'Einmalig perfekter Text ohne Methodik.',
          'Möglichst viele verschiedene Rubriken ohne Muster.',
        ],
        correctIndex: 0,
        explanation:
          'Wiederverwendbare Bewertungs-Assets beschleunigen jeden künftigen Prompt.',
      },
    ],
  },
];

export const MOCK_LESSONS: MockLesson[] = [
  ...PROMPT_BASICS_LESSONS,
  ...STRUCTURE_LAB_LESSONS,
  ...CONTEXT_MASTERY_LESSONS,
  ...ITERATION_LOOPS_LESSONS,
  ...EVAL_SCORING_LESSONS,
];

export function getMockLesson(id: string): MockLesson | undefined {
  return MOCK_LESSONS.find((lesson) => lesson.id === id);
}

export function getAllMockLessonIds(): string[] {
  return MOCK_LESSONS.map((lesson) => lesson.id);
}
