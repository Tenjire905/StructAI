import type { CopyCatalog } from './types';

export const copyDe: CopyCatalog = {
  'tabs.home': {
    playful: 'Start',
    focus: 'Start',
  },
  'tabs.paths': {
    playful: 'Lernpfade',
    focus: 'Pfade',
  },
  'tabs.promptLab': {
    playful: 'Prompt-Werkstatt',
    focus: 'Werkstatt',
  },
  'tabs.profile': {
    playful: 'Profil',
    focus: 'Profil',
  },
  'home.greeting': {
    playful: 'Willkommen zurück, {{name}}!',
    focus: 'Guten Tag, {{name}}.',
  },
  'skillRank.eyebrow': {
    playful: 'Dein Rang',
    focus: 'Skill-Rang',
  },
  'skillRank.level': {
    playful: 'Lvl {{level}}',
    focus: 'Level {{level}}',
  },
  'skillRank.xpProgress': {
    playful: '{{current}} / {{next}} XP bis zum nächsten Level',
    focus: '{{current}} / {{next}} XP',
  },
  'skillRank.totalXp': {
    playful: '{{xp}} XP insgesamt — aus Lektionen und Orbs.',
    focus: 'Gesamt-XP: {{xp}} (Lektionen + Orbs).',
  },
  'skillRank.lessonXpGain': {
    playful: '+{{xp}} XP für deinen Rang',
    focus: '+{{xp}} XP',
  },
  'skillRank.rank.spark': {
    playful: 'Funke',
    focus: 'Einsteiger',
  },
  'skillRank.rank.builder': {
    playful: 'Builder',
    focus: 'Lehrling',
  },
  'skillRank.rank.craftsman': {
    playful: 'Handwerker',
    focus: 'Praktiker',
  },
  'skillRank.rank.specialist': {
    playful: 'Spezialist',
    focus: 'Spezialist',
  },
  'skillRank.rank.architect': {
    playful: 'Prompt-Architekt',
    focus: 'Architekt',
  },
  'home.continueLearning': {
    playful: 'Weiterlernen',
    focus: 'Aktuelle Lernpfade',
  },
  'home.dailyChallenge.eyebrow': {
    playful: 'Heutige Aufgabe',
    focus: 'Tageschallenge',
  },
  'home.dailyChallenge.title': {
    playful: 'Ein klarer Gewinn heute',
    focus: 'Eine fokussierte Übungseinheit',
  },
  'home.dailyChallenge.bodyFresh': {
    playful: 'Starte mit {{path}} — eine kurze Lektion, echte Praxis, sofortiges Feedback.',
    focus: 'Beginne {{path}}: eine Lektion, eine Practice-Schleife, klares Feedback.',
  },
  'home.dailyChallenge.bodyContinue': {
    playful: 'Weiter mit {{path}} — eine Lektion, ein Prompt, fertig.',
    focus: 'Nächster Schritt in {{path}}: eine Lektion mit klarem Checkpoint.',
  },
  'home.dailyChallenge.ctaFresh': {
    playful: 'Heutige Lektion starten',
    focus: 'Heutige Lektion starten',
  },
  'home.dailyChallenge.ctaContinue': {
    playful: 'Heutige Lektion machen',
    focus: 'Heutige Lektion fortsetzen',
  },
  'home.startHint': {
    playful: 'Starte mit den Prompt-Grundlagen — dein erster Schritt zum strukturierten Prompting.',
    focus: 'Starte mit den Prompt-Grundlagen — dein erster Schritt zum strukturierten Prompting.',
  },
  'home.startCta': {
    playful: 'Los geht\'s!',
    focus: 'Ersten Pfad öffnen',
  },
  'home.labPracticeHint': {
    playful: 'Mach aus dem heutigen Skill einen echten Prompt — score ihn im Prompt Lab.',
    focus: 'Übe den gerade benannten Skill im Prompt Lab.',
  },
  'home.labPracticeCta': {
    playful: 'Prompt Lab öffnen',
    focus: 'Im Prompt Lab üben',
  },
  'home.retryFailedCta': {
    playful: 'Erste offene Lektion wiederholen',
    focus: 'Zur ersten nicht bestandenen Lektion',
  },
  'home.retryFailedNone': {
    playful: 'Alle Lektionen geschafft — keine Wiederholung nötig',
    focus: 'Alle Lektionen abgeschlossen — keine Wiederholung erforderlich',
  },
  'home.retryFailedNoOpen': {
    playful: 'Keine falschen Lektionen — einfach weitermachen',
    focus: 'Keine offenen Fehler — normal fortsetzen',
  },
  'home.activityInsights.title': {
    playful: 'Deine Aktivität',
    focus: 'Aktivitätsübersicht',
  },
  'home.activityInsights.expandHint': {
    playful: 'Tippe, um deinen Orb-Verlauf als Grafik zu sehen',
    focus: 'Tippen, um den Orb-Verlauf als Diagramm anzuzeigen',
  },
  'home.activityInsights.collapseHint': {
    playful: 'Tippe, um wieder zur Wochenübersicht zu wechseln',
    focus: 'Tippen, um zur Wochenübersicht zurückzukehren',
  },
  'home.activityInsights.chartTitle': {
    playful: 'Orb-Tagebuch',
    focus: 'Tägliche Orb-Aktivität',
  },
  'home.activityInsights.period': {
    playful: 'Letzte {{days}} Tage',
    focus: 'Zeitraum: {{days}} Tage',
  },
  'home.activityInsights.productivityValue': {
    playful: '{{percent}} %',
    focus: '{{percent}} %',
  },
  'home.activityInsights.productivityWithGoal': {
    playful: 'Produktivität — im Schnitt {{goal}}-Orb-Tagesziele der letzten Tage',
    focus: 'Produktivität relativ zum Tagesziel ({{goal}} Orbs)',
  },
  'home.activityInsights.productivityNoGoal': {
    playful: 'Aktive Tage — lege ein Tagesziel über die Orbs oben fest',
    focus: 'Aktive Lerntage — Tagesziel über Orb-Anzeige festlegen',
  },
  'home.activityInsights.orbPeekA11y': {
    playful: '{{count}} Orbs an diesem Tag',
    focus: '{{count}} Orbs an diesem Tag',
  },
  'orbCounter.label': {
    playful: 'Energie-Orbs',
    focus: 'Orbs',
  },
  'orbCounter.dailyProgress': {
    playful: 'Heute {{current}}/{{goal}} Orbs',
    focus: 'Heute {{current}}/{{goal}}',
  },
  'orbCounter.openDailyGoalHint': {
    playful: 'Tippe, um dein Tagesziel anzupassen',
    focus: 'Tagesziel bearbeiten',
  },
  'dailyGoal.title': {
    playful: 'Wie viele Orbs willst du heute sammeln?',
    focus: 'Tagesziel festlegen',
  },
  'dailyGoal.subtitle': {
    playful:
      'Du bekommst Orbs als Belohnung für jede abgeschlossene Lektion. Wähle, wie viel du heute lernen möchtest — so passt du dein Tempo an deinen Tag an.',
    focus:
      'Orbs werden pro abgeschlossener Lektion vergeben. Legen Sie fest, wie viele Orbs Sie heute erreichen möchten und wie viel Zeit Sie investieren wollen.',
  },
  'dailyGoal.explanationTitle': {
    playful: 'Orbs = Lernfortschritt',
    focus: 'Orbs als Lernfortschritt',
  },
  'dailyGoal.explanationBody': {
    playful:
      'Jede Lektion bringt dir Orbs. Mehr Orbs bedeuten mehr Übung — aber du bestimmst das Tempo. Ein niedriges Tagesziel ist völlig okay.',
    focus:
      'Pro abgeschlossener Lektion erhalten Sie Orbs. Das Tagesziel steuert Ihr Lerntempo und Ihren Zeitaufwand — unabhängig vom Gesamtfortschritt.',
  },
  'dailyGoal.targetLabel': {
    playful: 'Dein Tagesziel',
    focus: 'Tagesziel in Orbs',
  },
  'dailyGoal.presetOrbs': {
    playful: '{{count}} Orbs',
    focus: '{{count}}',
  },
  'dailyGoal.notificationsTitle': {
    playful: 'Erinnerung am Abend',
    focus: 'Lern-Erinnerung',
  },
  'dailyGoal.notificationsBody': {
    playful:
      'Wir erinnern dich abends, falls du dein Tagesziel noch nicht erreicht hast — nur wenn du das erlaubst.',
    focus:
      'Optional: Benachrichtigung am Abend, wenn das Tagesziel noch nicht erreicht wurde.',
  },
  'dailyGoal.notificationsExpoGoHint': {
    playful:
      'Erinnerungen sind in Expo Go nicht verfügbar. In einem Development Build kannst du sie später aktivieren.',
    focus:
      'Benachrichtigungen sind in Expo Go nicht verfügbar. In einem Development Build können sie aktiviert werden.',
  },
  'dailyGoal.cta': {
    playful: 'Tagesziel speichern',
    focus: 'Tagesziel speichern',
  },
  'dailyGoal.saving': {
    playful: 'Wird gespeichert…',
    focus: 'Speichern…',
  },
  'dailyGoal.notificationTitle': {
    playful: 'StructAI',
    focus: 'StructAI',
  },
  'dailyGoal.notificationBody': {
    playful: 'Noch {{remaining}} Orbs bis zum Tagesziel — eine kurze Lektion zählt.',
    focus: 'Noch {{remaining}} Orbs bis zum Tagesziel.',
  },
  'dailyGoal.notificationBodySkill': {
    playful:
      'Komm zurück und nutze „{{skill}}“ — noch {{remaining}} Orbs bis zum Tagesziel.',
    focus: 'Komm zurück und übe „{{skill}}“. Noch {{remaining}} Orbs bis zum Tagesziel.',
  },
  'pathCard.chapters': {
    playful: 'Kapitel {{current}} von {{total}}',
    focus: 'Kap. {{current}}/{{total}}',
  },
  'pathCard.chaptersTotal': {
    playful: '{{total}} Kapitel warten auf dich',
    focus: '{{total}} Kapitel',
  },
  'paths.badgeNew': {
    playful: 'Neu',
    focus: 'Neu',
  },
  'paths.sectionActive': {
    playful: 'Deine aktiven Pfade',
    focus: 'In Bearbeitung',
  },
  'paths.sectionAvailable': {
    playful: 'Entdecke mehr',
    focus: 'Verfügbare Lernpfade',
  },
  'paths.sectionLocked': {
    playful: 'Noch verschlossen',
    focus: 'Gesperrte Pfade',
  },
  'paths.lockedBadge': {
    playful: 'Verschlossen',
    focus: 'Gesperrt',
  },
  'paths.lockedTitle': {
    playful: 'Dieser Pfad ist noch zu',
    focus: 'Pfad gesperrt',
  },
  'paths.lockedBody': {
    playful: 'Erst „{{path}}" abschließen — dann geht\'s hier weiter!',
    focus: 'Schließe zuerst „{{path}}" ab, um diesen Pfad freizuschalten.',
  },
  'paths.lockedCta': {
    playful: 'Zurück zu den Pfaden',
    focus: 'Zurück zu den Pfaden',
  },
  'paths.title.prompt_basics': {
    playful: 'Prompt-Grundlagen',
    focus: 'Prompt-Grundlagen',
  },
  'paths.title.structure_lab': {
    playful: 'Struktur-Werkstatt',
    focus: 'Strukturlabor',
  },
  'paths.title.context_mastery': {
    playful: 'Kontext meistern',
    focus: 'Kontextkompetenz',
  },
  'paths.title.iteration_loops': {
    playful: 'Iterations-Schleifen',
    focus: 'Iteration',
  },
  'paths.title.eval_scoring': {
    playful: 'Bewertung und Punkte',
    focus: 'Bewertungssystem',
  },
  'paths.title.prompt_mastery': {
    playful: 'Prompt-Meisterschaft',
    focus: 'Prompt-Meisterschaft',
  },
  'paths.emptyActive': {
    playful: 'Bereit für dein erstes Abenteuer? Wähle deinen Lernpfad und leg los!',
    focus: 'Wähle einen Lernpfad, um zu beginnen.',
  },
  'pathDetail.progressTitle': {
    playful: 'Dein Fortschritt',
    focus: 'Fortschritt',
  },
  'pathDetail.chapterListTitle': {
    playful: 'Deine Kapitel',
    focus: 'Kapitel',
  },
  'pathDetail.continueCta': {
    playful: 'Weiter geht es!',
    focus: 'Fortsetzen',
  },
  'pathDetail.startCta': {
    playful: 'Jetzt starten!',
    focus: 'Starten',
  },
  'pathDetail.notFound': {
    playful: 'Diesen Pfad kennen wir noch nicht.',
    focus: 'Lernpfad nicht gefunden.',
  },
  'lesson.stepLabel': {
    playful: 'Schritt {{current}} von {{total}}',
    focus: '{{current}}/{{total}}',
  },
  'lesson.depthBadgePlayful': {
    playful: 'Kürzer · Einfacher',
    focus: 'Kürzer · Einfacher',
  },
  'lesson.depthBadgeFocus': {
    playful: 'Vertiefung · Mehr Fragen',
    focus: 'Vertiefung · Mehr Fragen',
  },
  'lesson.depthInfoTitle': {
    playful: 'Dein Lernmodus',
    focus: 'Lernmodus',
  },
  'lesson.depthInfoBodyPlayful': {
    playful:
      'Im Verspielt-Modus sind Lektionen kürzer und einfacher — gleiches Lernziel, weniger Schritte und leichtere Sprache.',
    focus:
      'Im Verspielt-Modus sind Lektionen kürzer und einfacher — gleiches Lernziel, weniger Schritte und leichtere Sprache.',
  },
  'lesson.depthInfoBodyFocus': {
    playful:
      'Im Fokussiert-Modus gibt es mehr Vertiefung: längere Texte, mehr Fragen und anspruchsvollere Aufgaben.',
    focus:
      'Im Fokussiert-Modus gibt es mehr Vertiefung: längere Texte, mehr Fragen und anspruchsvollere Aufgaben.',
  },
  'lesson.depthInfoAgeRecommended': {
    playful:
      'Unter 15 Jahren empfehlen wir Verspielt besonders — du kannst den Modus jederzeit im Profil ändern.',
    focus:
      'Unter 15 Jahren wird Verspielt besonders empfohlen — einstellbar im Profil oder beim Onboarding.',
  },
  'lesson.depthInfoSettingsHint': {
    playful:
      'Der Modus kommt aus deinem Profil oder dem Onboarding — dort kannst du jederzeit wechseln.',
    focus:
      'Der Modus wird im Profil oder beim Onboarding festgelegt und ist dort jederzeit änderbar.',
  },
  'lesson.depthInfoAccessibilityHint': {
    playful: 'Tippe für eine kurze Erklärung zum Lernmodus.',
    focus: 'Tippen für Erklärung zum Lernmodus.',
  },
  'lesson.glossaryTapHint': {
    playful: 'Tippe für eine kurze Erklärung zu diesem Begriff.',
    focus: 'Tippen für eine kurze Erklärung zu diesem Begriff.',
  },
  'lesson.typeChoice': {
    playful: 'Auswahlfrage',
    focus: 'Auswahl',
  },
  'lesson.typeFillBlank': {
    playful: 'Lückentext',
    focus: 'Lücke',
  },
  'lesson.typeTrueFalse': {
    playful: 'Wahr oder falsch',
    focus: 'Wahr/Falsch',
  },
  'lesson.typeReorder': {
    playful: 'Reihenfolge',
    focus: 'Sortieren',
  },
  'lesson.typeMatching': {
    playful: 'Zuordnen',
    focus: 'Zuordnung',
  },
  'lesson.typeErrorFinding': {
    playful: 'Fehler finden',
    focus: 'Fehlerstelle',
  },
  'lesson.typeCategorize': {
    playful: 'Kategorien',
    focus: 'Kategorisieren',
  },
  'lesson.fillBlankInstruction': {
    playful: 'Füll die Lücke mit dem passenden Begriff.',
    focus: 'Lücke korrekt ausfüllen.',
  },
  'lesson.trueLabel': {
    playful: 'Wahr',
    focus: 'Wahr',
  },
  'lesson.falseLabel': {
    playful: 'Falsch',
    focus: 'Falsch',
  },
  'lesson.reorderHint': {
    playful: 'Bring die Schritte in die richtige Reihenfolge.',
    focus: 'Elemente korrekt anordnen.',
  },
  'lesson.matchingInstruction': {
    playful: 'Tippe links einen Begriff an, dann rechts die passende Definition.',
    focus: 'Begriff wählen, Definition zuordnen.',
  },
  'lesson.errorFindingInstruction': {
    playful: 'Tippe auf das Wort, das das Problem verursacht.',
    focus: 'Problematisches Segment antippen.',
  },
  'lesson.categorizeInstruction': {
    playful: 'Tippe ein Item an, dann die passende Kategorie.',
    focus: 'Item wählen, Kategorie zuordnen.',
  },
  'lesson.categorizePoolLabel': {
    playful: 'Noch offen',
    focus: 'Offen',
  },
  'lesson.perfectBonus': {
    playful: 'Perfekt! Bonus-Orbs eingesammelt.',
    focus: 'Perfekt. Bonus erhalten.',
  },
  'orb.speech.readingStart.a': {
    playful: 'Okay — ich bin dabei. Lies das hier.',
    focus: '',
  },
  'orb.speech.readingStart.b': {
    playful: 'Neue Seite! Lass uns das aufsaugen.',
    focus: '',
  },
  'orb.speech.readingStart.c': {
    playful: 'Augen hierauf — das zählt.',
    focus: '',
  },
  'orb.speech.reading.a': {
    playful: 'Hmm… sieh dir die Struktur an.',
    focus: '',
  },
  'orb.speech.reading.b': {
    playful: 'Interessant. Was ist der echte Job dieses Prompts?',
    focus: '',
  },
  'orb.speech.reading.c': {
    playful: 'Weiter — der Hinweis steckt in der Formulierung.',
    focus: '',
  },
  'orb.speech.practicing.a': {
    playful: 'Dein Zug. Wähl bewusst.',
    focus: '',
  },
  'orb.speech.practicing.b': {
    playful: 'Nicht hetzen — nimm die schärfste Option.',
    focus: '',
  },
  'orb.speech.practicing.c': {
    playful: 'Ich will eine klare Antwort. Los.',
    focus: '',
  },
  'orb.speech.correct.a': {
    playful: 'Ja! Das Denken sitzt.',
    focus: '',
  },
  'orb.speech.correct.b': {
    playful: 'Sauber — das ist das Muster.',
    focus: '',
  },
  'orb.speech.correct.c': {
    playful: 'Treffer. Merk dir das.',
    focus: '',
  },
  'orb.speech.wrong.a': {
    playful: 'Fast. Dreh den Winkel einmal.',
    focus: '',
  },
  'orb.speech.wrong.b': {
    playful: 'Nicht ganz — lies die Constraint nochmal.',
    focus: '',
  },
  'orb.speech.wrong.c': {
    playful: 'Knapp! Der Trick steckte in den Details.',
    focus: '',
  },
  'orb.speech.celebrating.a': {
    playful: 'Geschafft! Die Lektion gehört uns.',
    focus: '',
  },
  'orb.speech.celebrating.b': {
    playful: 'Boom — Fortschritt freigeschaltet.',
    focus: '',
  },
  'orb.speech.celebrating.c': {
    playful: 'Starke Runde. Weiter!',
    focus: '',
  },
  'orb.speech.lowEnergy.a': {
    playful: 'Hey — noch ein paar Orbs, dann lächelt das Tagesziel.',
    focus: '',
  },
  'orb.speech.lowEnergy.b': {
    playful: 'Ich bin etwas matt. Eine kurze Lektion hilft.',
    focus: '',
  },
  'orb.speech.lowEnergy.c': {
    playful: 'Energie-Check: uns fehlt noch ein Übungssieg.',
    focus: '',
  },
  'orb.speech.focus.correctTip.a': {
    playful: '',
    focus: 'Behalte das Muster — benenne den Job, bevor du schreibst.',
  },
  'orb.speech.focus.correctTip.b': {
    playful: '',
    focus: 'Gut. Als Nächstes eine Constraint schärfer setzen.',
  },
  'orb.speech.focus.correctTip.c': {
    playful: '',
    focus: 'Stark. Nutze diese Struktur beim nächsten Prompt.',
  },
  'orb.speech.focus.wrongTip.a': {
    playful: '',
    focus: 'Tipp: Rolle, Aufgabe und Format klar trennen.',
  },
  'orb.speech.focus.wrongTip.b': {
    playful: '',
    focus: 'Prüfe die Constraint, die die Antwort begrenzt hat.',
  },
  'orb.speech.focus.wrongTip.c': {
    playful: '',
    focus: 'Nächster Versuch: Welche Ausgabeform war gefordert?',
  },
  'orb.speech.focus.celebrating.a': {
    playful: '',
    focus: 'Lektion fertig. Nimm eine klare Regel mit.',
  },
  'orb.speech.focus.celebrating.b': {
    playful: '',
    focus: 'Erledigt. Notiere das Muster, das den Pass gebracht hat.',
  },
  'orb.speech.focus.lowEnergy.a': {
    playful: '',
    focus: 'Tagesziel niedrig — eine fokussierte Lektion schließt die Lücke.',
  },
  'orb.speech.focus.lowEnergy.b': {
    playful: '',
    focus: 'Tipp: Heute einen kurzen Übungsblock abschließen.',
  },
  'lesson.check': {
    playful: 'Antwort prüfen!',
    focus: 'Prüfen',
  },
  'lesson.next': {
    playful: 'Weiter geht es!',
    focus: 'Weiter',
  },
  'lesson.correctFeedback': {
    playful: 'Stark! Deine Antwort sitzt.',
    focus: 'Korrekt.',
  },
  'lesson.wrongFeedback': {
    playful: 'Noch nicht — so wirst du schärfer.',
    focus: 'Falsch — warum, dann nächstes Pattern.',
  },
  'lesson.hintLabel': {
    playful: 'Tipp:',
    focus: 'Tipp:',
  },
  'lesson.coachingWhyLabel': {
    playful: 'Warum das scheitert',
    focus: 'Warum das scheitert',
  },
  'lesson.coachingNextLabel': {
    playful: 'Was du als Nächstes tust',
    focus: 'Nächstes Pattern',
  },
  'lesson.coachingNextFromBeat': {
    playful: 'Beim nächsten Versuch bewusst {{term}} anwenden.',
    focus: 'Als Nächstes: {{term}} gezielt beim Retry anwenden.',
  },
  'lesson.coachingNextFallback': {
    playful: 'Lies nochmal das Warum — wähle dann die Option, die die Lücke schließt.',
    focus: 'Lies den Fehlergrund erneut, dann die Option, die ihn behebt.',
  },
  'lesson.learningBeatLabel': {
    playful: 'Merke dir',
    focus: 'Lernpunkt',
  },
  'lesson.completeTitle': {
    playful: 'Lektion geschafft!',
    focus: 'Lektion abgeschlossen.',
  },
  'lesson.orbsEarned': {
    playful: '+{{count}} Orbs für dich!',
    focus: '+{{count}} Orbs',
  },
  'lesson.practiceComplete': {
    playful: 'Übung abgeschlossen — keine Extra-Orbs.',
    focus: 'Wiederholt. Keine zusätzlichen Orbs.',
  },
  'sessionSkill.eyebrow': {
    playful: 'Das kannst du jetzt',
    focus: 'Skill gewonnen',
  },
  'sessionSkill.generic.name': {
    playful: 'Klarer prompten',
    focus: 'Klarer prompten',
  },
  'sessionSkill.generic.proof': {
    playful: 'Du hast ein konkretes Prompting-Muster geübt, das du bei der nächsten KI-Aufgabe nutzen kannst.',
    focus: 'Du hast ein wiederverwendbares Prompting-Muster für die nächste KI-Aufgabe geübt.',
  },
  'sessionSkill.comeBackTomorrow': {
    playful: 'Komm morgen wieder und nutze dieses Muster an einer echten Aufgabe — so bleibt es hängen.',
    focus: 'Komm morgen wieder und wende dieses Muster an einer echten Aufgabe an.',
  },
  'sessionSkill.pb-1.name': {
    playful: 'Erkennen, was ein Prompt wirklich ist',
    focus: 'Prompt als Aufgabenbrief definieren',
  },
  'sessionSkill.pb-1.proof': {
    playful: 'Du unterscheidest einen vagen Wunsch von einer nutzbaren Anweisung — der erste Schritt zu besseren KI-Antworten.',
    focus: 'Du unterscheidest einen vagen Wunsch von einer nutzbaren Anweisung an ein Modell.',
  },
  'sessionSkill.pb-2.name': {
    playful: 'Klare Anweisungen schreiben',
    focus: 'Klare Anweisungen schreiben',
  },
  'sessionSkill.pb-2.proof': {
    playful: 'Du ersetzt unklare Bitten durch direkte Anweisungen, denen das Modell folgen kann.',
    focus: 'Du ersetzt vage Bitten durch direkte, befolgbare Anweisungen.',
  },
  'sessionSkill.pb-3.name': {
    playful: 'Das Ziel zuerst festlegen',
    focus: 'Das Ziel zuerst festlegen',
  },
  'sessionSkill.pb-3.proof': {
    playful: 'Du benennst das gewünschte Ergebnis, bevor das Modell arbeitet.',
    focus: 'Du formulierst das gewünschte Ergebnis, bevor du den Prompt sendest.',
  },
  'sessionSkill.pb-4.name': {
    playful: 'Das Ausgabeformat festlegen',
    focus: 'Das Ausgabeformat festlegen',
  },
  'sessionSkill.pb-4.proof': {
    playful: 'Du forderst die Form der Antwort (Liste, Länge, Struktur), statt zu hoffen.',
    focus: 'Du spezifizierst Liste/Länge/Struktur statt auf eine brauchbare Form zu hoffen.',
  },
  'sessionSkill.pb-5.name': {
    playful: 'Mit Beispielen steuern',
    focus: 'Mit Beispielen steuern',
  },
  'sessionSkill.pb-5.proof': {
    playful: 'Du zeigst dem Modell, wie „gut“ aussieht, statt es nur zu beschreiben.',
    focus: 'Du nutzt Beispiele, damit das Modell dein gewünschtes Muster trifft.',
  },
  'sessionSkill.pb-6.name': {
    playful: 'Negative Constraints richtig nutzen',
    focus: 'Negative Constraints anwenden',
  },
  'sessionSkill.pb-6.proof': {
    playful: 'Du verbietest schlechte Muster, ohne das Modell raten zu lassen, was es stattdessen tun soll.',
    focus: 'Du kombinierst Verbote mit positiver Führung, damit das Modell weiß, was zu tun ist.',
  },
  'sessionSkill.pb-7.name': {
    playful: 'Prompts so kurz wie nötig halten',
    focus: 'Prompt-Länge richtig bemessen',
  },
  'sessionSkill.pb-7.proof': {
    playful: 'Du streichst Fülltext und behältst nur Kontext, Aufgabe und Constraints, die die Antwort ändern.',
    focus: 'Du kürzst Fülltext, sodass jede Zeile Kontext, Aufgabe oder Constraint liefert.',
  },
  'sessionSkill.pb-8.name': {
    playful: 'Ein vollständiges Basics-Briefing bauen',
    focus: 'Ein vollständiges Basics-Briefing bauen',
  },
  'sessionSkill.pb-8.proof': {
    playful: 'Du kombinierst Ziel, Format, Beispiele und Verbote zu einem kompakten Briefing.',
    focus: 'Du kombinierst Ziel, Format, Beispiele und Constraints zu einem Briefing.',
  },
  'sessionSkill.pb-9.name': {
    playful: 'Vage Wörter durch präzise ersetzen',
    focus: 'Präzise Formulierungen bevorzugen',
  },
  'sessionSkill.pb-9.proof': {
    playful: 'Du ersetzt „kurz“ / „gut“ durch messbare Grenzen, die das Modell treffen kann.',
    focus: 'Du ersetzt relative Wörter durch messbare Grenzen.',
  },
  'sessionSkill.pb-10.name': {
    playful: 'Dem Modell eine Aufgabe auf einmal geben',
    focus: 'Eine Aufgabe pro Prompt',
  },
  'sessionSkill.pb-10.proof': {
    playful: 'Du teilst Mehrfachbitten so, dass jeder Prompt eine klare Aufgabe hat.',
    focus: 'Du teilst Mehrfachbitten in eine klare Aufgabe pro Prompt.',
  },
  'sessionSkill.pb-11.name': {
    playful: 'Sagen, für wen die Antwort ist',
    focus: 'Zielgruppe festlegen',
  },
  'sessionSkill.pb-11.proof': {
    playful: 'Du benennst die Leserschaft, damit Ton und Tiefe passen.',
    focus: 'Du benennst die Zielgruppe, damit Ton und Tiefe zur Leserschaft passen.',
  },
  'sessionSkill.pb-12.name': {
    playful: 'Typische Anfängerfehler erkennen',
    focus: 'Typische Anfängerfehler erkennen',
  },
  'sessionSkill.pb-12.proof': {
    playful: 'Du erkennst fehlendes Ziel, Format oder Constraints, bevor du sendest.',
    focus: 'Du erkennst fehlendes Ziel, Format oder Constraints vor dem Senden.',
  },
  'firstSessionProof.brand': {
    playful: 'Dein erster Skill-Beweis',
    focus: 'Erster Skill-Beweis',
  },
  'firstSessionProof.headline': {
    playful: 'Sieh zu, wie ein vager Prompt besser wird — und benenne, was du gelernt hast.',
    focus: 'Kritik, Rewrite, Vergleich — dann den Skill benennen.',
  },
  'firstSessionProof.sub': {
    playful: 'Kein API-Key nötig. Der lokale Coach zeigt Qualität → Kritik → Rewrite in unter einer Minute.',
    focus: 'Nur lokaler Coach. Qualität, Kritik, Rewrite — kein BYOK nötig.',
  },
  'firstSessionProof.weakLabel': {
    playful: 'Vager Prompt',
    focus: 'Vager Prompt',
  },
  'firstSessionProof.improvedLabel': {
    playful: 'Umschriebener Prompt',
    focus: 'Umschriebener Prompt',
  },
  'firstSessionProof.scoreLabel': {
    playful: 'Coach-Score: {{score}}/100',
    focus: 'Score: {{score}}/100',
  },
  'firstSessionProof.critiqueBody': {
    playful: 'Zu vage: keine Rolle, keine Zielgruppe, kein Format, keine Länge. Das Modell muss raten.',
    focus: 'Rolle, Zielgruppe, Format und Länge fehlen — das Modell muss raten.',
  },
  'firstSessionProof.compareTitle': {
    playful: '{{before}} → {{after}} (+{{delta}})',
    focus: '{{before}} → {{after}} (+{{delta}})',
  },
  'firstSessionProof.skillName': {
    playful: 'Aus einer vagen Bitte ein brauchbares Briefing machen',
    focus: 'Aus einer vagen Bitte ein brauchbares Briefing machen',
  },
  'firstSessionProof.skillProof': {
    playful: 'Vor zehn Minuten hieß es „schreib etwas“. Jetzt siehst du, warum Struktur, Rolle und Constraints den Score ändern.',
    focus: 'Du kannst erklären, warum Rolle, Kontext und Constraints die Prompt-Qualität heben.',
  },
  'firstSessionProof.comeBackTomorrow': {
    playful: 'Morgen: nutze dieses Rewrite-Muster an einer echten Aufgabe — das ist dein Tag-2-Win.',
    focus: 'Morgen: wende dieses Rewrite-Muster an einer echten Aufgabe an.',
  },
  'firstSessionProof.ctaCritique': {
    playful: 'Kritik zeigen',
    focus: 'Kritik zeigen',
  },
  'firstSessionProof.ctaRewrite': {
    playful: 'Rewrite zeigen',
    focus: 'Rewrite zeigen',
  },
  'firstSessionProof.ctaCompare': {
    playful: 'Scores vergleichen',
    focus: 'Scores vergleichen',
  },
  'firstSessionProof.ctaSummary': {
    playful: 'Benennen, was ich gelernt habe',
    focus: 'Skill-Zusammenfassung',
  },
  'firstSessionProof.ctaDone': {
    playful: 'Weiter — Profil einrichten',
    focus: 'Weiter zum Profil',
  },
  'promptLab.learnedEyebrow': {
    playful: 'Du hast geübt',
    focus: 'Geübter Skill',
  },
  'promptLab.learnedImproved': {
    playful: 'Du hast diesen Entwurf um +{{delta}} verbessert — ein echter Skill-Gewinn, nicht nur eine Zahl.',
    focus: 'Entwurf um +{{delta}} verbessert. Gewinn: klarere Struktur und Constraints.',
  },
  'promptLab.learnedNext': {
    playful: 'Nächster Skill zum Festigen: {{skill}}',
    focus: 'Nächster Skill-Fokus: {{skill}}',
  },
  'promptLab.learnedComplete': {
    playful: 'Du triffst die Kern-Säulen — Rolle, Kontext, Format, Constraints.',
    focus: 'Kern-Säulen vorhanden: Rolle, Kontext, Format, Constraints.',
  },

  'promptLab.dictationStart': {
    playful: 'Prompt diktieren',
    focus: 'Prompt diktieren',
  },
  'promptLab.dictationStop': {
    playful: 'Diktat stoppen',
    focus: 'Diktat stoppen',
  },
  'promptLab.dictationListening': {
    playful: 'Ich höre zu… sprich deinen Prompt',
    focus: 'Zuhören… Prompt sprechen',
  },
  'promptLab.dictationPermission': {
    playful: 'Für Diktat brauche ich Mikrofon-Zugriff. Bitte in den Systemeinstellungen erlauben.',
    focus: 'Mikrofon-Berechtigung ist für Diktat nötig.',
  },
  'promptLab.dictationError': {
    playful: 'Diktat hakte — tipp aufs Mikro und nochmal.',
    focus: 'Diktat fehlgeschlagen. Mikro tippen und erneut versuchen.',
  },
  'promptLab.dictationUnavailable': {
    playful: 'Diktat braucht den StructAI Development Build (nicht Expo Go).',
    focus: 'Diktat erfordert einen StructAI Development Build — Expo Go hat kein Speech-Modul.',
  },
  'orb.voice.tapHint': {
    playful: 'Tipp den Orb, um ihn zu hören.',
    focus: 'Orb antippen für Voiceover.',
  },
  'orb.voice.tapA11y': {
    playful: 'Orb Voice abspielen',
    focus: 'Orb-Voiceover abspielen',
  },
  'orb.voice.needsDevBuild': {
    playful: 'Voice braucht den StructAI Development Build (nicht Expo Go).',
    focus: 'Voiceover erfordert einen StructAI Development Build.',
  },
  'orb.speech.onboarding.welcome': {
    playful: 'Hey! Ich bin dein Orb — dein lokaler Prompt-Coach. Kurz und klar, versprochen.',
    focus: 'Ich bin dein Orb-Coach. Wir üben klare Prompts — Schritt für Schritt.',
  },
  'orb.speech.onboarding.meetReady': {
    playful: 'Nur ein paar Fragen — dann legen wir los!',
    focus: 'Kurz ein paar Angaben — danach starten wir.',
  },
  'orb.speech.onboarding.mode': {
    playful: 'Wähl den Vibe — ich passe Tempo und Ton an. Skills bleiben gleich.',
    focus: 'Focus oder Playful: gleiche Skills, andere Dichte. Wähl was zu dir passt.',
  },
  'orb.speech.onboarding.modePlayful': {
    playful: 'Nice — Playful. Kurze Beats, mehr Energie. Ich bleib an deiner Seite.',
    focus: 'Playful gewählt: kürzere Schritte, gleiche Lernziele.',
  },
  'orb.speech.onboarding.modeFocus': {
    playful: 'Focus — clean und dicht. Ich halte den Ballast klein.',
    focus: 'Focus gewählt: knappe Tipps, volle Tiefe wenn du checkst.',
  },
  'orb.speech.onboarding.loop': {
    playful: 'So läuft’s: lernen → üben → besser werden. Bereit für den ersten Skill?',
    focus: 'Drei Schritte: lernen, üben, verbessern. Start wenn bereit.',
  },
  'orb.speech.onboarding.proof': {
    playful: 'Schau, wie der vage Prompt besser wird — das ist der Skill.',
    focus: 'Kritik → Rewrite → Vergleich. Das ist der Beweis.',
  },
  'orb.speech.onboarding.proofWeak': {
    playful: 'So startet’s oft: freundlich, aber zu vage. Merkst du die Lücken?',
    focus: 'Typischer Start: Absicht da, Struktur fehlt. Genau das fixen wir.',
  },
  'orb.speech.onboarding.proofCritique': {
    playful: 'Kurz checken: Ziel, Constraints, Format — was fehlt?',
    focus: 'Kritik-Pass: fehlende Teile benennen, nicht raten.',
  },
  'orb.speech.onboarding.proofRewrite': {
    playful: 'Jetzt der Rewrite — gleiche Idee, echte Struktur. Boom.',
    focus: 'Rewrite: gleiche Absicht, klare Struktur und Constraints.',
  },
  'orb.speech.onboarding.proofCompare': {
    playful: 'Vorher/nachher — der Score steigt, weil Struktur messbar ist.',
    focus: 'Vergleich: Struktur macht den Unterschied sichtbar.',
  },
  'orb.speech.onboarding.proofDone': {
    playful: 'Stark — du erkennst schwache Prompts und kannst sie fixen. Das ist der Skill.',
    focus: 'Du kannst aus einer vagen Bitte ein brauchbares Briefing machen.',
  },
  'orb.speech.onboarding.dailyGoal': {
    playful: 'Kleines Tagesziel setzen — ich erinner dich, ohne Stress.',
    focus: 'Wähl ein ehrliches Orb-Tagesziel. Streak bleibt sauber.',
  },
  'orb.speech.lessonComplete': {
    playful: 'Yes! Der Skill gehört dir — morgen wieder einsetzen.',
    focus: 'Lektion geschafft. Morgen dieses Muster an einer echten Aufgabe nutzen.',
  },
  'orb.speech.lessonRetry': {
    playful: 'Knapp! Lass uns die Schwachstellen nochmal üben — du schaffst das.',
    focus: 'Noch nicht. Fehlende Checks wiederholen und das Muster sichern.',
  },

  'lesson.backToPath': {
    playful: 'Zurück zum Pfad',
    focus: 'Zurück zum Pfad',
  },
  'lesson.continueNext': {
    playful: 'Weiter zur nächsten Lektion!',
    focus: 'Nächstes Kapitel',
  },
  'lesson.lockedTitle': {
    playful: 'Dieses Kapitel ist noch gesperrt',
    focus: 'Kapitel gesperrt',
  },
  'lesson.lockedBody': {
    playful: 'Schließe zuerst die vorherigen Kapitel ab, dann geht es hier weiter.',
    focus: 'Schließe zuerst die vorherigen Kapitel ab.',
  },
  'lesson.notFound': {
    playful: 'Diese Lektion gibt es noch nicht.',
    focus: 'Lektion nicht gefunden.',
  },
  'lesson.retryTitle': {
    playful: 'Noch nicht geschafft!',
    focus: 'Schwelle nicht erreicht.',
  },
  'lesson.retrySummary': {
    playful: '{{correct}} von {{total}} richtig — versuch\'s nochmal!',
    focus: '{{correct}}/{{total}} korrekt. Mindestens 60 % erforderlich.',
  },
  'lesson.retryPrimary': {
    playful: 'Nochmal versuchen',
    focus: 'Erneut versuchen',
  },
  'lesson.retrySecondary': {
    playful: 'Später weiter',
    focus: 'Später fortsetzen',
  },
  'profile.statsSection': {
    playful: 'Deine Erfolge',
    focus: 'Statistik',
  },
  'profile.modeSection': {
    playful: 'Wie willst du lernen?',
    focus: 'Darstellungsmodus',
  },
  'profile.modePlayful': {
    playful: 'Verspielt',
    focus: 'Verspielt',
  },
  'profile.modeFocus': {
    playful: 'Fokussiert',
    focus: 'Fokussiert',
  },
  'profile.modeDescription': {
    playful:
      'Verspielt: kürzere Texte und weniger Fragen. Fokussiert: mehr Vertiefung und Nachfragen – gleiches Lernziel.',
    focus:
      'Verspielt: kürzere Texte, weniger bewertete Schritte. Fokussiert: mehr Vertiefung – gleiches Lernziel.',
  },
  'profile.languageSection': {
    playful: 'Sprache',
    focus: 'Sprache',
  },
  'profile.languageDescription': {
    playful: 'Wähle die Sprache der Oberfläche. Deine Fortschritte bleiben gleich.',
    focus: 'Sprache der Oberfläche festlegen.',
  },
  'profile.languageDe': {
    playful: 'Deutsch',
    focus: 'Deutsch',
  },
  'profile.languageEn': {
    playful: 'Englisch',
    focus: 'Englisch',
  },
  'profile.languageFr': {
    playful: 'Französisch',
    focus: 'Französisch',
  },
  'profile.languageRu': {
    playful: 'Russisch',
    focus: 'Russisch',
  },
  'profile.byokSection': {
    playful: 'Dein KI-Schlüssel',
    focus: 'API-Schlüssel (BYOK)',
  },
  'profile.byokDescription': {
    playful:
      'Pro Anbieter ein eigener Schlüssel – alles bleibt sicher auf deinem Gerät und wird nie synchronisiert.',
    focus:
      'Pro Provider ein API-Schlüssel, verschlüsselt lokal (Secure Store). Keys werden nicht synchronisiert.',
  },
  'profile.byokPlaceholder': {
    playful: 'API-Schlüssel einfügen',
    focus: 'API-Schlüssel eingeben',
  },
  'profile.byokSave': {
    playful: 'Schlüssel speichern',
    focus: 'Speichern',
  },
  'profile.byokDelete': {
    playful: 'Schlüssel löschen',
    focus: 'Löschen',
  },
  'profile.byokSavedBadge': {
    playful: 'Sicher gespeichert',
    focus: 'Gespeichert',
  },
  'promptLab.inputLabel': {
    playful: 'Dein Prompt',
    focus: 'Prompt',
  },
  'promptLab.inputPlaceholder': {
    playful: 'Schreib deinen Prompt hier rein...',
    focus: 'Prompt eingeben...',
  },
  'promptLab.scoreButton': {
    playful: 'Bewerten lassen!',
    focus: 'Bewerten',
  },
  'promptLab.demoBanner': {
    playful: 'Demo-Modus: Ohne API-Schlüssel bewertet dich der lokale Übungs-Coach.',
    focus: 'Demo-Modus: lokale Bewertung ohne API-Schlüssel.',
  },
  'promptLab.addKeyCta': {
    playful: 'Schlüssel im Profil hinterlegen',
    focus: 'API-Schlüssel im Profil hinterlegen',
  },
  'promptLab.scoreTitle': {
    playful: 'Deine Auswertung',
    focus: 'Auswertung',
  },
  'promptLab.catStructure': {
    playful: 'Struktur',
    focus: 'Struktur',
  },
  'promptLab.catGoal': {
    playful: 'Ziel',
    focus: 'Zieldefinition',
  },
  'promptLab.catConstraints': {
    playful: 'Vorgaben',
    focus: 'Vorgaben',
  },
  'promptLab.feedbackStrong': {
    playful: 'Starker Prompt! Deine Struktur sitzt.',
    focus: 'Gesamtbewertung: stark.',
  },
  'promptLab.feedbackOkay': {
    playful: 'Solide! Da geht noch mehr.',
    focus: 'Gesamtbewertung: solide.',
  },
  'promptLab.feedbackWeak': {
    playful: 'Guter Start - lass uns das schärfen.',
    focus: 'Gesamtbewertung: ausbaufähig.',
  },
  'promptLab.hintStructure': {
    playful: 'Mehr Struktur: Trenn Kontext, Aufgabe und Vorgaben in Abschnitte.',
    focus: 'Verbesserungspotenzial: Kontext, Aufgabe und Vorgaben klar trennen.',
  },
  'promptLab.hintGoal': {
    playful: 'Sag dem Modell genauer, was am Ende rauskommen soll.',
    focus: 'Verbesserungspotenzial: erwartetes Ergebnis präziser definieren.',
  },
  'promptLab.hintConstraints': {
    playful: 'Mit praezisen Vorgaben holst du den Top-Score.',
    focus: 'Verbesserungspotenzial: präzisere Vorgaben (Länge, Format, Zielgruppe).',
  },
  'promptLab.historyTitle': {
    playful: 'Dein Bewertungsverlauf',
    focus: 'Bewertungsverlauf',
  },
  'promptLab.promptHistoryTitle': {
    playful: 'Deine bewerteten Prompts',
    focus: 'Zuletzt bewertete Prompts',
  },
  'promptLab.promptHistoryDescription': {
    playful: 'Tippe einen Prompt an, um ihn wieder in den Editor zu laden.',
    focus: 'Eintrag wählen, um den Prompt im Eingabefeld wiederzuverwenden.',
  },
  'promptLab.promptHistoryEmpty': {
    playful: 'Noch keine bewerteten Prompts — bewerte einen, um deine Spur zu starten.',
    focus: 'Noch keine bewerteten Prompts gespeichert.',
  },
  'promptLab.promptHistoryMissing': {
    playful: 'Älterer Eintrag — Prompt-Text wurde damals noch nicht gespeichert.',
    focus: 'Älterer Eintrag ohne gespeicherten Prompt-Text.',
  },
  'promptLab.promptHistoryScore': {
    playful: 'Score {{score}}',
    focus: '{{score}} / 100',
  },
  'promptLab.promptHistoryTapReuse': {
    playful: 'Tippen zum Wiederverwenden',
    focus: 'Wiederverwenden',
  },
  'promptLab.promptHistoryReuseHint': {
    playful: 'Lädt diesen Prompt in das Eingabefeld',
    focus: 'Lädt diesen Prompt in das Eingabefeld',
  },
  'promptLab.promptHistoryItemA11y': {
    playful: 'Bewerteter Prompt, Score {{score}}',
    focus: 'Bewerteter Prompt, Score {{score}}',
  },
  'promptLab.scoringInProgress': {
    playful: 'Wird bewertet...',
    focus: 'Bewertung läuft...',
  },
  'promptLab.liveBadge': {
    playful: 'Live-Bewertung: {{provider}}',
    focus: 'Live: {{provider}}',
  },
  'promptLab.fallbackInvalidKey': {
    playful: 'Dein Schlüssel wurde abgelehnt - diesmal hat der lokale Coach bewertet. Prüf den Schlüssel im Profil.',
    focus: 'API-Schlüssel abgelehnt. Lokale Bewertung verwendet. Schlüssel im Profil prüfen.',
  },
  'promptLab.fallbackQuota': {
    playful: 'Dein API-Guthaben ist aufgebraucht oder limitiert - der lokale Coach übernimmt.',
    focus: 'Kontingent oder Guthaben erschöpft. Lokale Bewertung verwendet.',
  },
  'promptLab.fallbackNetwork': {
    playful: 'Keine Verbindung zur KI - der lokale Coach übernimmt.',
    focus: 'API nicht erreichbar. Lokale Bewertung verwendet.',
  },
  'promptLab.fallbackGeneric': {
    playful: 'Die KI-Antwort war unbrauchbar - der lokale Coach übernimmt.',
    focus: 'API-Fehler. Lokale Bewertung verwendet.',
  },
  'promptLab.modeScore': {
    playful: 'Bewerten',
    focus: 'Bewertung',
  },
  'promptLab.modeCompare': {
    playful: 'Modelle vergleichen',
    focus: 'Modellvergleich',
  },
  'promptLab.detailHintsTitle': {
    playful: 'Konkrete Verbesserungsideen',
    focus: 'Konkrete Hinweise',
  },
  'promptLab.improvementPathTitle': {
    playful: 'Dein klarster nächster Schritt',
    focus: 'Primärer Verbesserungspfad',
  },
  'promptLab.improvementPathSecondary': {
    playful: 'Danach: {{tip}}',
    focus: 'Als Nächstes: {{tip}}',
  },
  'promptLab.improvementPathComplete': {
    playful: 'Stark — Rolle, Kontext, Format und Constraints sind drin.',
    focus: 'Alle Kern-Säulen vorhanden: Rolle, Kontext, Format, Constraints.',
  },
  'promptLab.missing.context': {
    playful: 'Deinem Prompt fehlt Kontext — welchen Hintergrund soll die KI nutzen?',
    focus: 'Fehlender Kontext: Hintergrund oder Quellenmaterial ergänzen.',
  },
  'promptLab.missing.role': {
    playful: 'Deinem Prompt fehlt eine Rolle — sag der KI, wer sie sein soll.',
    focus: 'Fehlende Rolle: klare Persona oder Haltung zuweisen.',
  },
  'promptLab.missing.format': {
    playful: 'Deinem Prompt fehlt ein Format — Stichpunkte, Absätze, Tabelle…?',
    focus: 'Fehlendes Format: Ausgabeform festlegen (Liste, Absätze, JSON, …).',
  },
  'promptLab.missing.constraints': {
    playful: 'Deinem Prompt fehlen Constraints — Länge, Zielgruppe oder Ton.',
    focus: 'Fehlende Constraints: harte Grenzen setzen (Länge, Zielgruppe, Ton).',
  },
  'promptLab.comparisonTitle': {
    playful: '+{{delta}} Punkte – das hat sich verbessert',
    focus: '+{{delta}} Punkte gegenüber dem vorherigen Entwurf',
  },
  'promptLab.demoWeakExample': {
    playful: 'Schwaches Beispiel laden',
    focus: 'Schwaches Beispiel',
  },
  'promptLab.demoImprovedExample': {
    playful: 'Verbesserte Version laden',
    focus: 'Verbesserte Version',
  },
  'modelComparer.description': {
    playful:
      'Ein Prompt, mehrere Modelle parallel — swipe durch die Antworten und vergleiche Tempo und Kosten.',
    focus:
      'Sendet einen Prompt parallel an 2–3 konfigurierte Provider und zeigt Antworten nebeneinander (horizontal scrollbar).',
  },
  'modelComparer.needTwoKeys': {
    playful: 'Leg mindestens zwei API-Schlüssel im Profil an, um Modelle zu vergleichen.',
    focus: 'Mindestens zwei Provider-Keys im Profil erforderlich.',
  },
  'modelComparer.modelPickerLabel': {
    playful: 'Modelle wählen (2–3)',
    focus: 'Modelle (2–3)',
  },
  'modelComparer.modelPickerHint': {
    playful: 'Mindestens zwei, höchstens drei Modelle gleichzeitig.',
    focus: 'Auswahl: mindestens 2, maximal 3 Modelle.',
  },
  'modelComparer.promptLabel': {
    playful: 'Dein Prompt',
    focus: 'Prompt',
  },
  'modelComparer.promptPlaceholder': {
    playful: 'Schreib deinen Prompt für alle Modelle...',
    focus: 'Prompt für alle gewählten Modelle...',
  },
  'modelComparer.compareButton': {
    playful: 'Parallel vergleichen',
    focus: 'Vergleichen',
  },
  'modelComparer.comparing': {
    playful: 'Modelle antworten...',
    focus: 'Vergleich läuft...',
  },
  'modelComparer.resultsTitle': {
    playful: 'Antworten im Vergleich',
    focus: 'Ergebnisse',
  },
  'modelComparer.copyA11y': {
    playful: 'Antwort kopieren',
    focus: 'Antwort in die Zwischenablage kopieren',
  },
  'modelComparer.copiedA11y': {
    playful: 'Kopiert',
    focus: 'Antwort kopiert',
  },
  'modelComparer.latencyBadge': {
    playful: '{{seconds}} s',
    focus: '{{seconds}} s',
  },
  'modelComparer.costBadge': {
    playful: 'ca. {{cost}}',
    focus: '≈ {{cost}}',
  },
  'modelComparer.errorBadge': {
    playful: 'Fehler',
    focus: 'Fehler',
  },
  'modelComparer.errorInvalidKey': {
    playful: 'Schlüssel abgelehnt — prüf den Key im Profil.',
    focus: 'Ungültiger API-Schlüssel.',
  },
  'modelComparer.errorQuota': {
    playful: 'Kontingent oder Guthaben erschöpft.',
    focus: 'Rate-Limit oder Kontingent erschöpft.',
  },
  'modelComparer.errorNetwork': {
    playful: 'Netzwerkfehler oder Timeout.',
    focus: 'Netzwerkfehler / Timeout.',
  },
  'modelComparer.errorGeneric': {
    playful: 'Dieses Modell konnte nicht antworten.',
    focus: 'Modell-Antwort fehlgeschlagen.',
  },
  'modelComparer.insightMoreExpensiveSlightlyDetailed': {
    playful: '{{costMultiplier}}× teurer, aber nur {{detailPercent}}% ausführlicher als die anderen.',
    focus: '{{costMultiplier}}× teurer, nur {{detailPercent}}% mehr Text als die anderen Modelle.',
  },
  'modelComparer.insightMoreExpensiveMuchDetailed': {
    playful: '{{costMultiplier}}× teurer und {{detailPercent}}% ausführlicher als die anderen.',
    focus: '{{costMultiplier}}× teurer bei {{detailPercent}}% mehr Antworttext.',
  },
  'modelComparer.insightMoreExpensiveShorter': {
    playful: '{{costMultiplier}}× teurer bei {{detailPercent}}% kürzerer Antwort.',
    focus: '{{costMultiplier}}× teurer, Antwort {{detailPercent}}% kürzer als die anderen.',
  },
  'modelComparer.insightMoreExpensiveSimilarDetail': {
    playful: '{{costMultiplier}}× teurer bei ähnlicher Antwortlänge.',
    focus: '{{costMultiplier}}× teurer, Textlänge nahe am Durchschnitt.',
  },
  'modelComparer.insightCheaperMoreDetailed': {
    playful: '{{costMultiplier}}× günstiger und {{detailPercent}}% ausführlicher.',
    focus: '{{costMultiplier}}× günstiger bei {{detailPercent}}% mehr Text.',
  },
  'modelComparer.insightCheaperShorter': {
    playful: '{{costMultiplier}}× günstiger, dafür {{detailPercent}}% kürzer.',
    focus: '{{costMultiplier}}× günstiger, Antwort {{detailPercent}}% kürzer.',
  },
  'modelComparer.insightCheaperSimilarDetail': {
    playful: '{{costMultiplier}}× günstiger bei ähnlicher Antwortlänge.',
    focus: '{{costMultiplier}}× günstiger, Textlänge nahe am Durchschnitt.',
  },
  'modelComparer.insightFaster': {
    playful: '{{speedMultiplier}}× schneller — Kosten und Länge ähnlich wie die anderen.',
    focus: '{{speedMultiplier}}× schneller bei vergleichbaren Kosten und Textlänge.',
  },
  'modelComparer.insightSlower': {
    playful: '{{speedMultiplier}}× langsamer — Kosten und Länge ähnlich wie die anderen.',
    focus: '{{speedMultiplier}}× langsamer bei vergleichbaren Kosten und Textlänge.',
  },
  'modelComparer.insightSimilar': {
    playful: 'Kosten, Tempo und Länge liegen nah am Durchschnitt der anderen Modelle.',
    focus: 'Kosten, Latenz und Textlänge nahe am Mittelwert der anderen Modelle.',
  },
  'modelComparer.spendingWarningDaily': {
    playful: 'Hinweis: Dein Tageslimit für geschätzte API-Kosten ist erreicht (nur Schätzung, keine Garantie).',
    focus: 'Tageslimit für geschätzte API-Kosten erreicht (clientseitige Schätzung, unverbindlich).',
  },
  'modelComparer.spendingWarningMonthly': {
    playful: 'Hinweis: Dein Monatslimit für geschätzte API-Kosten ist erreicht (nur Schätzung, keine Garantie).',
    focus: 'Monatslimit für geschätzte API-Kosten erreicht (clientseitige Schätzung, unverbindlich).',
  },
  'modelComparer.spendingWarningBoth': {
    playful: 'Hinweis: Tages- und Monatslimit für geschätzte API-Kosten erreicht (nur Schätzung).',
    focus: 'Tages- und Monatslimit für geschätzte API-Kosten erreicht (Schätzung, unverbindlich).',
  },
  'profile.spendingLimitSection': {
    playful: 'Ausgaben-Wächter',
    focus: 'Ausgabenlimit (BYOK)',
  },
  'profile.spendingLimitDescription': {
    playful: 'Setz ein Tages- oder Monatslimit für geschätzte API-Kosten — wir warnen dich lokal, bevor es unbemerkt teuer wird.',
    focus: 'Optionales Tages-/Monatslimit für geschätzte BYOK-Kosten mit lokaler Warnung.',
  },
  'profile.spendingLimitDisclaimer': {
    playful: 'Nur eine grobe Schätzung auf deinem Gerät — keine echte Abrechnung, keine Garantie.',
    focus: 'Clientseitige Kostenschätzung ohne Abrechnungsgarantie; dient nur als Orientierung.',
  },
  'profile.spendingLimitDailyLabel': {
    playful: 'Tageslimit (USD, optional)',
    focus: 'Tageslimit USD (optional)',
  },
  'profile.spendingLimitMonthlyLabel': {
    playful: 'Monatslimit (USD, optional)',
    focus: 'Monatslimit USD (optional)',
  },
  'profile.spendingLimitPlaceholder': {
    playful: 'z. B. 1.00',
    focus: 'z. B. 1.00',
  },
  'profile.spendingLimitSave': {
    playful: 'Limit speichern',
    focus: 'Speichern',
  },
  'profile.spendingLimitUsageToday': {
    playful: 'Heute geschätzt: {{amount}}',
    focus: 'Heute (Schätzung): {{amount}}',
  },
  'profile.spendingLimitUsageMonth': {
    playful: 'Diesen Monat geschätzt: {{amount}}',
    focus: 'Monat (Schätzung): {{amount}}',
  },
  'profile.spendingLimitWarningDaily': {
    playful: 'Tageslimit erreicht (Schätzung)',
    focus: 'Tageslimit erreicht (Schätzung)',
  },
  'profile.spendingLimitWarningMonthly': {
    playful: 'Monatslimit erreicht (Schätzung)',
    focus: 'Monatslimit erreicht (Schätzung)',
  },
  'profile.spendingLimitWarningBoth': {
    playful: 'Tages- und Monatslimit erreicht (Schätzung)',
    focus: 'Tages- und Monatslimit erreicht (Schätzung)',
  },
  'profile.byokChecking': {
    playful: 'Prüfe deinen Schlüssel...',
    focus: 'Schlüssel wird geprüft...',
  },
  'profile.byokValidBadge': {
    playful: 'Funktioniert ({{provider}})',
    focus: 'Aktiv ({{provider}})',
  },
  'profile.byokInvalidError': {
    playful: 'Der Schlüssel wurde abgelehnt - bitte prüf ihn nochmal.',
    focus: 'Schlüssel ungültig. Bitte prüfen.',
  },
  'profile.byokUnverifiedBadge': {
    playful: 'Gespeichert - noch nicht geprüft',
    focus: 'Gespeichert (ungeprüft)',
  },
  'profile.byokTest': {
    playful: 'Schlüssel testen',
    focus: 'Testen',
  },
  'profile.byokConfiguredCount': {
    playful: '{{count}} Anbieter verbunden',
    focus: '{{count}} Provider konfiguriert',
  },
  'profile.accountSection': {
    playful: 'Dein Konto',
    focus: 'Konto',
  },
  'profile.accountDescription': {
    playful: 'Du bist angemeldet. Abmelden beendet nur die Sitzung auf diesem Gerät.',
    focus: 'Angemeldet. Abmelden beendet die Sitzung auf diesem Gerät.',
  },
  'profile.signOut': {
    playful: 'Abmelden',
    focus: 'Abmelden',
  },
  'profile.privacySection': {
    playful: 'Datenschutz & Nutzung',
    focus: 'Datenschutz',
  },
  'profile.analyticsDisclosure': {
    playful: 'StructAI erfasst fünf selbst gehostete Nutzungsereignisse. Bei Gästen bleiben sie anonym, nach der Anmeldung werden sie dem Konto zugeordnet. Prompts und API-Schlüssel senden wir dabei nie mit.',
    focus: 'Fünf selbst gehostete Nutzungsereignisse messen den Aktivierungs-Funnel. Gast-Ereignisse sind anonym; angemeldete Ereignisse enthalten die Nutzer-ID. Prompt-Inhalte und API-Schlüssel werden nicht erfasst.',
  },
  'profile.guestDisplayName': {
    playful: 'Gast',
    focus: 'Gast',
  },
  'profile.resetSection': {
    playful: 'Zurücksetzen & neu starten',
    focus: 'Daten & Reset',
  },
  'profile.resetSectionDescription': {
    playful: 'Frisch starten oder testen? Wähle, was gelöscht werden soll.',
    focus: 'Nur Lernfortschritt zurücksetzen oder alle lokalen Kontodaten löschen und Onboarding neu starten.',
  },
  'profile.resetProgressCta': {
    playful: 'Gesamten Fortschritt zurücksetzen',
    focus: 'Gesamten Lernfortschritt zurücksetzen',
  },
  'profile.deleteAccountCta': {
    playful: 'Alles löschen & Onboarding neu',
    focus: 'Kontodaten löschen & Onboarding neu starten',
  },
  'profile.resetCancel': {
    playful: 'Abbrechen',
    focus: 'Abbrechen',
  },
  'profile.resetProgressConfirmTitle': {
    playful: 'Allen Fortschritt zurücksetzen?',
    focus: 'Gesamten Lernfortschritt zurücksetzen?',
  },
  'profile.resetProgressConfirmBody': {
    playful: 'Lektionen, Pfade, Orbs und Streaks werden gelöscht. Du bleibst angemeldet und behältst Einstellungen.',
    focus: 'Löscht Lektionen, Pfade, Orbs und Streaks. Konto und Einstellungen bleiben.',
  },
  'profile.resetProgressConfirmAction': {
    playful: 'Fortschritt zurücksetzen',
    focus: 'Fortschritt zurücksetzen',
  },
  'profile.deleteAccountConfirmTitle': {
    playful: 'Wirklich alles löschen?',
    focus: 'Kontodaten löschen?',
  },
  'profile.deleteAccountConfirmBodyGuest': {
    playful: 'Fortschritt, Name, Keys und Einstellungen weg — danach landest du im Onboarding.',
    focus: 'Löscht allen lokalen Fortschritt und Profildaten und öffnet das Onboarding.',
  },
  'profile.deleteAccountConfirmBodySignedIn': {
    playful: 'Fortschritt (inkl. Cloud), Abmeldung und Onboarding von vorn.',
    focus: 'Löscht Lerndaten (lokal + Cloud-Fortschritt), meldet dich ab und öffnet das Onboarding.',
  },
  'profile.deleteAccountConfirmAction': {
    playful: 'Löschen & neu starten',
    focus: 'Löschen & neu starten',
  },
  'profile.deleteAccountFootnoteGuest': {
    playful: 'Kompletter Wipe — du siehst wieder die Welcome-Screens.',
    focus: 'Vollständiger lokaler Wipe führt zurück zum Onboarding.',
  },
  'profile.deleteAccountFootnoteSignedIn': {
    playful: 'Cloud-Fortschritt weg und Abmeldung. Auth-E-Mail löschen ggf. über Support.',
    focus: 'Entfernt Sync-Fortschritt und beendet die Session. Auth-Identität ggf. nur über Support löschbar.',
  },
  'profile.guestAccountDescription': {
    playful: 'Du nutzt StructAI ohne Konto. Fortschritt bleibt auf diesem Gerät – Anmeldung sichert ihn geräteübergreifend.',
    focus: 'Gastmodus. Fortschritt lokal auf diesem Gerät; Anmeldung für Sync über Geräte.',
  },
  'guest.saveProgressHint': {
    playful: 'Dein Fortschritt liegt nur auf diesem Gerät. Mit Konto sicherst du ihn und kannst später synchronisieren.',
    focus: 'Fortschritt ist nur lokal gespeichert. Anmeldung ermöglicht Sync über Geräte.',
  },
  'guest.saveProgressCta': {
    playful: 'Fortschritt sichern – jetzt anmelden',
    focus: 'Fortschritt sichern – jetzt anmelden',
  },
  'auth.headline': {
    playful: 'Willkommen bei StructAI',
    focus: 'Bei StructAI anmelden',
  },
  'auth.subheadline': {
    playful: 'Melde dich an, damit dein Fortschritt später sicher gespeichert werden kann.',
    focus: 'Melden Sie sich an, um Ihren Lernfortschritt zu sichern.',
  },
  'auth.signInTab': {
    playful: 'Anmelden',
    focus: 'Anmelden',
  },
  'auth.signUpTab': {
    playful: 'Registrieren',
    focus: 'Registrieren',
  },
  'auth.emailPlaceholder': {
    playful: 'E-Mail-Adresse',
    focus: 'E-Mail',
  },
  'auth.passwordPlaceholder': {
    playful: 'Passwort (mind. 6 Zeichen)',
    focus: 'Passwort (min. 6 Zeichen)',
  },
  'auth.signInCta': {
    playful: 'Jetzt anmelden',
    focus: 'Anmelden',
  },
  'auth.signInLoading': {
    playful: 'Anmeldung läuft…',
    focus: 'Anmeldung…',
  },
  'auth.signUpCta': {
    playful: 'Konto erstellen',
    focus: 'Registrieren',
  },
  'auth.signUpLoading': {
    playful: 'Registrierung läuft…',
    focus: 'Registrierung…',
  },
  'auth.signUpHint': {
    playful: 'Nach der Registrierung prüf bitte dein Postfach, falls eine Bestätigung nötig ist.',
    focus: 'Bei E-Mail-Bestätigung bitte Posteingang prüfen.',
  },
  'auth.signUpConfirmEmail': {
    playful: 'Account erstellt! Bitte bestätige deine E-Mail, dann kannst du dich anmelden.',
    focus: 'Registrierung erfolgreich. E-Mail bestätigen, danach anmelden.',
  },
  'auth.dividerOr': {
    playful: 'oder',
    focus: 'oder',
  },
  'auth.googleCta': {
    playful: 'Mit Google fortfahren',
    focus: 'Mit Google anmelden',
  },
  'auth.googleLoading': {
    playful: 'Google-Anmeldung…',
    focus: 'Google…',
  },
  'auth.errorGeneric': {
    playful: 'Das hat leider nicht geklappt. Bitte versuch es nochmal.',
    focus: 'Anmeldung fehlgeschlagen. Bitte erneut versuchen.',
  },
  'auth.errorInvalidCredentials': {
    playful: 'E-Mail oder Passwort stimmen nicht.',
    focus: 'Ungültige Anmeldedaten.',
  },
  'auth.errorEmailNotConfirmed': {
    playful: 'Bitte bestätige zuerst deine E-Mail-Adresse.',
    focus: 'E-Mail-Adresse noch nicht bestätigt.',
  },
  'auth.errorUserExists': {
    playful: 'Für diese E-Mail gibt es schon ein Konto.',
    focus: 'Konto existiert bereits.',
  },
  'auth.errorWeakPassword': {
    playful: 'Das Passwort erfüllt die Anforderungen nicht.',
    focus: 'Passwortanforderungen nicht erfüllt.',
  },
  'auth.errorNotConfigured': {
    playful: 'Supabase ist noch nicht konfiguriert.',
    focus: 'Supabase-Konfiguration fehlt.',
  },
  'auth.errorOAuthCancelled': {
    playful: 'Google-Anmeldung abgebrochen.',
    focus: 'Google-Anmeldung abgebrochen.',
  },
  'auth.errorOAuthFailed': {
    playful: 'Google-Anmeldung konnte nicht abgeschlossen werden. Prüfe die Redirect-URL in Supabase.',
    focus: 'Google-Anmeldung fehlgeschlagen. Redirect-URL in Supabase prüfen.',
  },
  'auth.configMissingTitle': {
    playful: 'Backend noch nicht verbunden',
    focus: 'Backend nicht konfiguriert',
  },
  'auth.configMissingBody': {
    playful: 'Setze EXPO_PUBLIC_SUPABASE_URL und EXPO_PUBLIC_SUPABASE_ANON_KEY in deiner .env.',
    focus: 'EXPO_PUBLIC_SUPABASE_URL und EXPO_PUBLIC_SUPABASE_ANON_KEY in .env setzen.',
  },
  'onboarding.welcomeHeadline': {
    playful: 'Bessere Prompts schreiben. KI-Antworten beurteilen.',
    focus: 'Bessere Prompts schreiben. KI-Antworten beurteilen.',
  },
  'onboarding.welcomeSub': {
    playful:
      'StructAI bringt dir bei, bessere Prompts zu schreiben und KI-Antworten zu beurteilen – mit kurzen Lektionen, Live-Bewertung und einem BYOK Prompt Lab.',
    focus:
      'StructAI bringt dir bei, bessere Prompts zu schreiben und KI-Antworten zu beurteilen – mit kurzen Lektionen, Live-Bewertung und einem BYOK Prompt Lab.',
  },
  'onboarding.welcomeCta': {
    playful: "Los geht's!",
    focus: "Los geht's",
  },
  'onboarding.skip': {
    playful: 'Überspringen',
    focus: 'Überspringen',
  },
  'onboarding.introNext': {
    playful: 'Weiter',
    focus: 'Weiter',
  },
  'onboarding.languagePickerA11y': {
    playful: 'Sprache wählen',
    focus: 'Sprache wählen',
  },
  'onboarding.languagePickerCloseA11y': {
    playful: 'Sprachmenü schließen',
    focus: 'Sprachmenü schließen',
  },
  'onboarding.languagePickerTitle': {
    playful: 'Sprache',
    focus: 'Sprache',
  },
  'onboarding.introSignIn': {
    playful: 'Anmelden',
    focus: 'Anmelden',
  },
  'onboarding.introSlide1Value': {
    playful: 'Schreibe bessere Prompts — und sieh den Score steigen.',
    focus: 'Bessere Prompts schreiben. Struktur messbar verbessern.',
  },
  'onboarding.introSlide2Value': {
    playful: 'Steige auf mit kurzen Lektionen und Orbs.',
    focus: 'Kurze Lektionen, Orbs, klarer Fortschritt.',
  },
  'onboarding.introSlide3Value': {
    playful: 'Dein Orb-Coach bleibt lokal an deiner Seite.',
    focus: 'Lokaler Orb-Coach mit Tipps — ohne Voiceover.',
  },
  'onboarding.introVisual.scoreLabel': {
    playful: 'Prompt-Score',
    focus: 'Prompt-Score',
  },
  'onboarding.introVisual.scoreNav': {
    playful: 'Prompt Lab',
    focus: 'Prompt Lab',
  },
  'onboarding.introVisual.scoreFeedback': {
    playful: 'Starke Struktur — Ziel und Format sitzen.',
    focus: 'Struktur und Zieldefinition klar. Format präzise.',
  },
  'onboarding.introVisual.scoreCta': {
    playful: 'Nochmal scoren',
    focus: 'Erneut bewerten',
  },
  'onboarding.introVisual.scoreChip1': {
    playful: 'Struktur',
    focus: 'Struktur',
  },
  'onboarding.introVisual.scoreChip2': {
    playful: 'Ziel',
    focus: 'Ziel',
  },
  'onboarding.introVisual.scoreChip3': {
    playful: 'Format',
    focus: 'Format',
  },
  'onboarding.introVisual.pathTitle': {
    playful: 'Dein Lernpfad',
    focus: 'Lernpfad',
  },
  'onboarding.introVisual.pathHome': {
    playful: 'Home',
    focus: 'Home',
  },
  'onboarding.introVisual.pathSection': {
    playful: 'Weiterlernen',
    focus: 'Aktuelle Pfade',
  },
  'onboarding.introVisual.pathCard1': {
    playful: 'Prompt-Grundlagen',
    focus: 'Prompt-Grundlagen',
  },
  'onboarding.introVisual.pathCard2': {
    playful: 'Antworten beurteilen',
    focus: 'Antworten beurteilen',
  },
  'onboarding.introVisual.pathCard3': {
    playful: 'Prompt Lab Praxis',
    focus: 'Prompt Lab Praxis',
  },
  'onboarding.introVisual.pathMeta': {
    playful: 'Kapitel 3 von 6',
    focus: 'Kapitel 3 von 6',
  },
  'onboarding.introVisual.pathOrbs': {
    playful: '+ Orbs freischalten',
    focus: 'Orbs freischalten',
  },
  'onboarding.introVisual.coachBubble': {
    playful: 'Kurz checken: Was fehlt dem Prompt noch?',
    focus: 'Prüfe Ziel, Constraints und Format.',
  },
  'onboarding.introVisual.coachCaption': {
    playful: 'Orb · lokaler Coach',
    focus: 'Orb · lokaler Coach',
  },
  'onboarding.introVisual.coachStep': {
    playful: 'Schritt 2 von 4',
    focus: '2/4',
  },
  'onboarding.introVisual.coachPromptLabel': {
    playful: 'Dein Prompt',
    focus: 'Prompt',
  },
  'onboarding.introVisual.coachPromptBody': {
    playful: 'Schreib einen klaren Prompt mit Ziel und Format…',
    focus: 'Ziel, Constraints und Ausgabeformat angeben.',
  },
  'onboarding.introVisual.coachCheck': {
    playful: 'Prüfen',
    focus: 'Prüfen',
  },
  'onboarding.meetCta': {
    playful: 'Klingt gut!',
    focus: 'Weiter',
  },
  'onboarding.meetReadyCta': {
    playful: 'Los geht\'s!',
    focus: 'Weiter',
  },
  'onboarding.modeQuestion': {
    playful: 'Wie würdest du gerne lernen?',
    focus: 'Wie würdest du gerne lernen?',
  },
  'onboarding.modeHint': {
    playful: 'Beide zeigen dieselben Inhalte - du kannst jederzeit in den Einstellungen wechseln.',
    focus: 'Identische Inhalte und Funktionen. Jederzeit in den Einstellungen änderbar.',
  },
  'onboarding.modeCta': {
    playful: 'Weiter',
    focus: 'Weiter',
  },
  'onboarding.loopTitle': {
    playful: 'So funktioniert StructAI',
    focus: 'Lernablauf in drei Schritten',
  },
  'onboarding.loopStep1': {
    playful: 'Wähle einen Lernpfad mit klarer Kapitelstruktur.',
    focus: 'Lernpfad wählen: Thema und Reihenfolge der Kapitel festlegen.',
  },
  'onboarding.loopStep2': {
    playful: 'Spiele Lektionen mit kurzen Übungen Schritt für Schritt durch.',
    focus: 'Lektion abschließen: Übungen in kurzen Schritten bearbeiten.',
  },
  'onboarding.loopStep3': {
    playful: 'Sammle Orbs und schalte das nächste Kapitel frei.',
    focus: 'Orbs verdienen und das nächste Kapitel freischalten.',
  },
  'onboarding.loopCta': {
    playful: 'Erste Lektion starten!',
    focus: 'Erste Lektion starten',
  },
  'onboarding.loopHomeCta': {
    playful: 'Erst mal zur Übersicht',
    focus: 'Zur Startseite',
  },
  'onboarding.profileTitle': {
    playful: 'Fast geschafft — wer bist du?',
    focus: 'Profil vervollständigen',
  },
  'onboarding.profileSubtitle': {
    playful: 'Du hast deine erste Lektion gemeistert! Sag uns kurz, wie du heißt — dann passen wir StructAI an dich an.',
    focus: 'Erste Lektion abgeschlossen. Bitte Name und Alter angeben, damit wir den Lernmodus empfehlen können.',
  },
  'onboarding.profileNameLabel': {
    playful: 'Dein Name',
    focus: 'Anzeigename',
  },
  'onboarding.profileNamePlaceholder': {
    playful: 'Wie sollen wir dich nennen?',
    focus: 'Anzeigename eingeben',
  },
  'onboarding.profileAgeLabel': {
    playful: 'Dein Alter',
    focus: 'Alter',
  },
  'onboarding.profileAgePlaceholder': {
    playful: 'z. B. 14',
    focus: 'Alter in Jahren',
  },
  'onboarding.profileAgeDisclaimer': {
    playful: 'Dein Alter nutzen wir nur für die Modus-Empfehlung — nicht für schwerere oder leichtere Aufgaben.',
    focus: 'Das Alter wird ausschließlich für die Modus-Empfehlung verwendet, nicht zur Manipulation des Gameplays.',
  },
  'onboarding.profileAgeInvalid': {
    playful: 'Bitte gib ein Alter zwischen 1 und 120 ein.',
    focus: 'Bitte ein gültiges Alter zwischen 1 und 120 eingeben.',
  },
  'onboarding.profileAuthSection': {
    playful: 'Fortschritt sichern',
    focus: 'Konto verknüpfen',
  },
  'onboarding.profileAuthHint': {
    playful: 'Optional: Melde dich an, damit dein Fortschritt erhalten bleibt. Du landest danach wieder hier.',
    focus: 'Optional: Mit Google oder E-Mail anmelden. Nach der Anmeldung kehren Sie zu diesem Schritt zurück.',
  },
  'onboarding.profileModeSection': {
    playful: 'Wähle deinen Modus',
    focus: 'Lernmodus wählen',
  },
  'onboarding.profileModeHintRecommended': {
    playful: 'Für dein Alter empfehlen wir Playful — einfachere Aufgaben und leichteres Verständnis. Focus bleibt jederzeit wählbar.',
    focus: 'Für dieses Alter wird Playful empfohlen: einfachere Aufgaben und leichteres Verständnis. Focus bleibt wählbar.',
  },
  'onboarding.profileModeHintNeutral': {
    playful: 'Beide Modi sind gleichwertig — wähle, was zu dir passt.',
    focus: 'Beide Modi stehen gleichberechtigt zur Verfügung.',
  },
  'onboarding.profileModeHintCarried': {
    playful: 'Deine frühere Wahl ist vorausgewählt — passe sie hier bei Bedarf an.',
    focus: 'Ihre zuvor gewählte Einstellung ist vorausgewählt und kann hier angepasst werden.',
  },
  'onboarding.profilePlayfulBadge': {
    playful: 'Empfohlen',
    focus: 'Empfohlen',
  },
  'onboarding.profilePlayfulRecommendCopy': {
    playful: 'Einfachere Aufgaben, leichteres Verständnis',
    focus: 'Einfachere Aufgaben, leichteres Verständnis',
  },
  'onboarding.profileCta': {
    playful: 'Los geht\'s!',
    focus: 'Profil speichern und starten',
  },
  'onboarding.profileSaving': {
    playful: 'Wird gespeichert…',
    focus: 'Speichern…',
  },
  'onboarding.profileSaveError': {
    playful: 'Speichern hat nicht geklappt — bitte nochmal versuchen.',
    focus: 'Profil konnte nicht gespeichert werden. Bitte erneut versuchen.',
  },
  'onboarding.previewPathTitle': {
    playful: 'Prompt-Grundlagen',
    focus: 'Prompt-Grundlagen',
  },
  'statBlock.completedLessons': {
    playful: 'Abgeschlossene Lektionen',
    focus: 'Lektionen abgeschlossen',
  },
  'statBlock.currentStreak': {
    playful: 'Aktuelle Serie',
    focus: 'Serie (Tage)',
  },
  'streakTracker.title': {
    playful: 'Deine Woche',
    focus: 'Wochenfortschritt',
  },
  'streakTracker.weekdayMon': {
    playful: 'Mo',
    focus: 'Mo',
  },
  'streakTracker.weekdayTue': {
    playful: 'Di',
    focus: 'Di',
  },
  'streakTracker.weekdayWed': {
    playful: 'Mi',
    focus: 'Mi',
  },
  'streakTracker.weekdayThu': {
    playful: 'Do',
    focus: 'Do',
  },
  'streakTracker.weekdayFri': {
    playful: 'Fr',
    focus: 'Fr',
  },
  'streakTracker.weekdaySat': {
    playful: 'Sa',
    focus: 'Sa',
  },
  'streakTracker.weekdaySun': {
    playful: 'So',
    focus: 'So',
  },
  'celebration.lessonComplete': {
    playful: 'Lektion geschafft!',
    focus: 'Lektion abgeschlossen.',
  },
  'celebration.orbGain': {
    playful: '+{{count}} Orbs für dich!',
    focus: '+{{count}} Orbs',
  },
  'celebration.streakMilestone': {
    playful: 'Volle Woche - deine Serie hält!',
    focus: '7-Tage-Meilenstein erreicht.',
  },
  'celebration.pathComplete': {
    playful: 'Lernpfad geschafft: {{path}}!',
    focus: 'Lernpfad abgeschlossen: {{path}}.',
  },
  'celebration.capstoneComplete': {
    playful: 'Abschlussprojekt geschafft!',
    focus: 'Abschlussprojekt bestanden.',
  },
  'celebration.sectionMilestone': {
    playful: 'Kapitel geschafft!',
    focus: 'Meilenstein erreicht.',
  },
  'capstoneIncomplete.title': {
    playful: 'Pfad fast geschafft — noch nicht vollständig',
    focus: 'Pfad abgeschlossen — noch nicht vollständig',
  },
  'capstoneIncomplete.subtitle': {
    playful:
      'Das Abschlussprojekt ist geschafft. Für den nächsten Pfad fehlen noch {{missing}} von {{total}} Lektionen.',
    focus:
      'Das Abschlussprojekt ist bestanden. Für die Freischaltung des nächsten Pfads fehlen noch {{missing}} von {{total}} Lektionen.',
  },
  'capstoneIncomplete.statCompleted': {
    playful: 'Bestanden',
    focus: 'Abgeschlossen',
  },
  'capstoneIncomplete.statSkipped': {
    playful: 'Übersprungen',
    focus: 'Übersprungen/fehlend',
  },
  'capstoneIncomplete.lockHint': {
    playful: 'Der nächste Pfad bleibt gesperrt, bis alle Lektionen bestanden sind.',
    focus: 'Der nächste Pfad bleibt gesperrt, bis alle Lektionen bestanden sind.',
  },
  'capstoneIncomplete.openMissingCta': {
    playful: 'Zu den offenen Lektionen',
    focus: 'Zu den offenen Lektionen',
  },
  'capstoneIncomplete.backToPath': {
    playful: 'Zurück zum Pfad',
    focus: 'Zurück zum Pfad',
  },
  'sectionMilestone.title': {
    playful: 'Kapitel abgeschlossen!',
    focus: 'Abschlussprojekt geschafft',
  },
  'sectionMilestone.subtitle': {
    playful: 'Gut gemacht — weiter mit dem nächsten Abschnitt.',
    focus: 'Du hast einen wichtigen Meilenstein erreicht.',
  },
  'sectionMilestone.continueCta': {
    playful: 'Zum nächsten Kapitel',
    focus: 'Weiter',
  },
  'sectionMilestone.backToPath': {
    playful: 'Zurück zum Pfad',
    focus: 'Zurück zum Pfad',
  },
  'pathPreview.lockedHint': {
    playful: 'Noch gesperrt — erst alle Lektionen dieses Pfads bestehen.',
    focus: 'Noch gesperrt — erst alle Lektionen dieses Pfads bestehen.',
  },
  'pathCompletion.titleFull': {
    playful: 'Lernpfad vollständig abgeschlossen!',
    focus: 'Pfad vollständig abgeschlossen',
  },
  'pathCompletion.subtitleFull': {
    playful:
      'Alle {{total}} Kapitel von „{{path}}“ bestanden. Dein Zertifikat ist bereit und der nächste Pfad ist freigeschaltet.',
    focus:
      'Alle Lektionen bestanden. Dein Zertifikat ist bereit und der nächste Pfad ist freigeschaltet.',
  },
  'pathCompletion.statCompleted': {
    playful: 'Kapitel bestanden',
    focus: 'Lektionen bestanden',
  },
  'pathCompletion.statCertificate': {
    playful: 'Zertifikat',
    focus: 'Zertifikat verfügbar',
  },
  'pathCompletion.startNextPathCta': {
    playful: 'Weiter zu {{path}}',
    focus: 'Nächsten Pfad starten: {{path}}',
  },
  'pathCompletion.title': {
    playful: 'Lernpfad komplett!',
    focus: 'Lernpfad abgeschlossen',
  },
  'pathCompletion.subtitle': {
    playful: 'Du hast alle {{total}} Kapitel von „{{path}}“ bestanden.',
    focus: 'Alle {{total}} Kapitel von „{{path}}“ erfolgreich abgeschlossen.',
  },
  'pathCompletion.certificateHint': {
    playful: 'Dein Zertifikat kannst du dir hier bald holen.',
    focus: 'Zertifikat-Export folgt in Kürze an dieser Stelle (G2).',
  },
  'pathCompletion.backToPaths': {
    playful: 'Zurück zu den Lernpfaden',
    focus: 'Zur Lernpfad-Übersicht',
  },
  'certificate.badge': {
    playful: 'Prompt-Skill-Zertifikat',
    focus: 'Skill-Zertifikat',
  },
  'certificate.awardedTo': {
    playful: 'Erarbeitet von',
    focus: 'Inhaber',
  },
  'certificate.completedOn': {
    playful: 'Abgeschlossen am',
    focus: 'Abschlussdatum',
  },
  'certificate.brandTagline': {
    playful: 'Bessere Prompts. Schärferes Urteil über KI.',
    focus: 'Prompt-Skill · Verifizierter Pfadabschluss',
  },
  'certificate.skillLabel': {
    playful: 'Skill freigeschaltet',
    focus: 'Nachgewiesener Skill',
  },
  'certificate.skill.prompt_basics': {
    playful: 'Klare, zielgerichtete Prompts mit Struktur schreiben.',
    focus: 'Klare, zielgerichtete Prompt-Struktur',
  },
  'certificate.skill.structure_lab': {
    playful: 'Prompts mit Rolle, Constraints und Format bauen.',
    focus: 'Rolle, Constraints und Ausgabeformat steuern',
  },
  'certificate.skill.context_mastery': {
    playful: 'Der KI den richtigen Kontext geben — ohne sie zu überfluten.',
    focus: 'Kontextauswahl und Grounding',
  },
  'certificate.skill.iteration_loops': {
    playful: 'Prompts iterieren, bis die Ausgabe trägt.',
    focus: 'Prompt-Iteration und Verfeinerung',
  },
  'certificate.skill.eval_scoring': {
    playful: 'KI-Antworten beurteilen — und schwache erkennen.',
    focus: 'Output-Bewertung und Kritik',
  },
  'certificate.skill.prompt_mastery': {
    playful: 'Fortgeschrittene Prompts unter echten Constraints designen.',
    focus: 'Fortgeschrittenes Prompt-Design unter Constraints',
  },
  'certificate.skill.generic': {
    playful: 'Einen StructAI-Prompting-Pfad abgeschlossen.',
    focus: 'StructAI-Prompting-Pfad abgeschlossen',
  },
  'certificate.evidence': {
    playful: '{{completed}} / {{total}} Kapitel abgeschlossen',
    focus: '{{completed}} von {{total}} Kapiteln abgeschlossen',
  },
  'certificate.credentialLabel': {
    playful: 'Credential-ID',
    focus: 'Credential-ID',
  },
  'certificate.share': {
    playful: 'Skill-Win teilen',
    focus: 'Zertifikat exportieren',
  },
  'certificate.sharing': {
    playful: 'Wird vorbereitet…',
    focus: 'Export läuft…',
  },
  'certificate.shareDialogTitle': {
    playful: '{{name}} kann jetzt: {{skill}}',
    focus: '{{name}} — {{skill}}',
  },
  'pathCompletion.identityLine': {
    playful: 'Das darfst du teilen: {{skill}}',
    focus: 'Credential: {{skill}}',
  },
  'certificate.shareUnavailable': {
    playful: 'Teilen ist auf diesem Gerät gerade nicht möglich.',
    focus: 'Zertifikat-Export auf diesem Gerät nicht verfügbar.',
  },
  'certificate.download': {
    playful: 'Zertifikat herunterladen',
    focus: 'Als Bild speichern',
  },
  'certificate.shareWebUnavailable': {
    playful:
      'Download klappt gerade nicht. Teilen geht in der StructAI-App auf dem Handy — im Browser normalerweise per „Zertifikat herunterladen“.',
    focus:
      'Download fehlgeschlagen. Native Freigabe ist in der iOS/Android-App verfügbar; im Browser sollte der PNG-Export starten.',
  },
  'profile.certificatesSection': {
    playful: 'Deine Zertifikate',
    focus: 'Abschlusszertifikate',
  },
  'profile.certificatesDescription': {
    playful: 'Skill-Wins hier ansehen. Export und Teilen sind Pro.',
    focus: 'Abgeschlossene Pfade — Vorschau frei; Export ist Pro.',
  },
  'pro.planSection': {
    playful: 'Dein Plan',
    focus: 'Plan',
  },
  'pro.planEyebrow': {
    playful: 'Zugang',
    focus: 'Zugang',
  },
  'pro.planFree': {
    playful: 'Free',
    focus: 'Free',
  },
  'pro.planPro': {
    playful: 'Pro',
    focus: 'Pro',
  },
  'pro.planBodyFree': {
    playful:
      'Free: alle Lektionen + lokaler Lab-Coach. Pro: Live-KI-Bewertung und Zertifikat-Export ab {{monthly}}/Monat oder {{yearly}}/Jahr.',
    focus:
      'Free: Lektionen + lokaler Lab. Pro: Live-KI-Bewertung + Zertifikat-Export — ab {{monthly}}/Monat oder {{yearly}}/Jahr.',
  },
  'pro.planBodyPro': {
    playful: 'Pro ist auf diesem Gerät aktiv: Live-Lab-Bewertung und Zertifikat-Export sind freigeschaltet.',
    focus: 'Pro aktiv. Live-Lab-Bewertung und Zertifikat-Export auf diesem Gerät freigeschaltet.',
  },
  'pro.previewUnlockCta': {
    playful: 'Pro-Preview testen',
    focus: 'Pro-Preview aktivieren',
  },
  'pro.previewLockCta': {
    playful: 'Zurück zu Free',
    focus: 'Zurück zu Free',
  },
  'pro.gateTitle': {
    playful: 'Pro-Feature',
    focus: 'Pro',
  },
  'pro.gateCertificateBody': {
    playful: 'Zertifikat-Export ist Pro — Preise siehst du auf dem Pro-Screen.',
    focus: 'Zertifikat-Export ist Pro. Paywall öffnen für Preise.',
  },
    'pro.gateLabBody': {
    playful:
      'Dein API-Key allein ist nicht Pro. Live-KI-Bewertungen sind Pro — lokales Coach-Scoring bleibt gratis.',
    focus:
      'Ein API-Key ist nicht Pro. Live-Grades sind Pro; lokales Coach-Scoring bleibt gratis. Öffne Pro für geplante Preise.',
  },
  'pro.certificateCta': {
    playful: 'Mit Pro exportieren',
    focus: 'Export (Pro)',
  },
  'pro.openPlanCta': {
    playful: 'Pro-Pläne ansehen',
    focus: 'Pro ansehen',
  },
  'pro.openPaywallCta': {
    playful: 'Pro-Pläne & Preise',
    focus: 'Pro-Preise ansehen',
  },
  'pro.paywall.brand': {
    playful: 'StructAI Pro',
    focus: 'StructAI Pro',
  },
  'pro.paywall.headline': {
    playful: 'Skill beweisen. Mit echten Modellen bewerten.',
    focus: 'Live-Bewertung und teilbarer Skill-Nachweis.',
  },
  'pro.paywall.sub': {
    playful:
      'Lernen bleibt Free. Upgrade, wenn du Live-KI-Scoring im Prompt Lab und exportierbare Zertifikate willst.',
    focus:
      'Lektionen bleiben Free. Pro schaltet Live-Lab-Bewertung (dein Key) und Zertifikat-Export nach Pfadabschluss frei.',
  },
  'pro.paywall.compareFeature': {
    playful: 'Was du bekommst',
    focus: 'Enthalten',
  },
  'pro.paywall.benefitLessons': {
    playful: 'Alle Lernpfade & tägliche Praxis',
    focus: 'Alle Lernpfade und tägliche Praxis',
  },
  'pro.paywall.benefitLabLocal': {
    playful: 'Lokaler Prompt-Lab-Coach',
    focus: 'Lokaler Prompt-Lab-Coach',
  },
  'pro.paywall.benefitLabLive': {
    playful: 'Live-KI-Bewertung mit deinem API-Key',
    focus: 'Live-KI-Bewertung (BYOK)',
  },
  'pro.paywall.benefitCertificates': {
    playful: 'Zertifikate exportieren & teilen',
    focus: 'Zertifikat-Export und Teilen',
  },
  'pro.paywall.included': {
    playful: 'Ja',
    focus: 'Ja',
  },
  'pro.paywall.excluded': {
    playful: '—',
    focus: '—',
  },
  'pro.paywall.periodMonthly': {
    playful: 'Monatlich',
    focus: 'Monatlich',
  },
  'pro.paywall.periodYearly': {
    playful: 'Jährlich',
    focus: 'Jährlich',
  },
  'pro.paywall.bestValue': {
    playful: 'Bester Preis',
    focus: 'Bester Preis',
  },
  'pro.paywall.monthlyHint': {
    playful: 'Jederzeit kündbar',
    focus: 'Monatliche Abrechnung',
  },
  'pro.paywall.yearlyHint': {
    playful: 'Ca. {{monthly}}/Monat',
    focus: '{{monthly}}/Monat effektiv',
  },
    'pro.paywall.cta': {
    playful: 'Pro auf diesem Gerät testen (Vorschau)',
    focus: 'Pro-Vorschau auf diesem Gerät aktivieren',
  },
  'pro.paywall.ctaBusy': {
    playful: 'Vorschau wird aktiviert…',
    focus: 'Vorschau wird aktiviert…',
  },
  'pro.paywall.billingFootnote': {
    playful:
      'Preise oben sind geplant. App-Store-/Play-Abrechnung ist noch nicht live (Block H). Dieser Button schaltet nur eine lokale Pro-Vorschau frei — es wird nichts berechnet.',
    focus:
      'Preise sind geplant, noch nicht abrechenbar (Block H). CTA aktiviert nur eine lokale Pro-Vorschau — keine Store-Zahlung.',
  },
  'pro.paywall.dismiss': {
    playful: 'Nicht jetzt',
    focus: 'Nicht jetzt',
  },
};
