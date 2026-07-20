import type { CopyCatalog } from './types';

export const copyFr: CopyCatalog = {
  'tabs.home': {
    playful: 'Accueil',
    focus: 'Accueil',
  },
  'tabs.paths': {
    playful: 'Parcours',
    focus: 'Parcours',
  },
  'tabs.promptLab': {
    playful: 'Atelier de prompts',
    focus: 'Atelier',
  },
  'tabs.profile': {
    playful: 'Profil',
    focus: 'Profil',
  },
  'home.greeting': {
    playful: 'Bon retour, {{name}} !',
    focus: 'Bonjour, {{name}}.',
  },
  'skillRank.eyebrow': {
    playful: 'Ton rang',
    focus: 'Rang de competence',
  },
  'skillRank.level': {
    playful: 'Niv. {{level}}',
    focus: 'Niveau {{level}}',
  },
  'skillRank.xpProgress': {
    playful: '{{current}} / {{next}} XP vers le niveau suivant',
    focus: '{{current}} / {{next}} XP',
  },
  'skillRank.totalXp': {
    playful: '{{xp}} XP au total — lecons et Orbs.',
    focus: 'XP total : {{xp}} (lecons + Orbs).',
  },
  'skillRank.lessonXpGain': {
    playful: '+{{xp}} XP vers ton rang',
    focus: '+{{xp}} XP',
  },
  'skillRank.rank.spark': {
    playful: 'Etincelle',
    focus: 'Novice',
  },
  'skillRank.rank.builder': {
    playful: 'Builder',
    focus: 'Apprenti',
  },
  'skillRank.rank.craftsman': {
    playful: 'Artisan',
    focus: 'Praticien',
  },
  'skillRank.rank.specialist': {
    playful: 'Specialiste',
    focus: 'Specialiste',
  },
  'skillRank.rank.architect': {
    playful: 'Architecte de prompts',
    focus: 'Architecte',
  },
  'home.continueLearning': {
    playful: 'Continuer a apprendre',
    focus: 'Parcours actifs',
  },
  'home.dailyChallenge.eyebrow': {
    playful: 'Mission du jour',
    focus: 'Defi du jour',
  },
  'home.dailyChallenge.title': {
    playful: 'Une victoire claire aujourd’hui',
    focus: 'Une session de pratique concentree',
  },
  'home.dailyChallenge.bodyFresh': {
    playful: 'Commence avec {{path}} — une lecon courte, vraie pratique, feedback immediat.',
    focus: 'Debutez {{path}} : une lecon, une boucle de pratique, un feedback clair.',
  },
  'home.dailyChallenge.bodyContinue': {
    playful: 'Continue {{path}} — une lecon, un prompt, c’est fait.',
    focus: 'Prochaine etape dans {{path}} : une lecon avec un checkpoint clair.',
  },
  'home.dailyChallenge.ctaFresh': {
    playful: 'Lancer la lecon du jour',
    focus: 'Commencer la lecon du jour',
  },
  'home.dailyChallenge.ctaContinue': {
    playful: 'Faire la lecon du jour',
    focus: 'Continuer la lecon du jour',
  },
  'home.startHint': {
    playful: 'Commence par les bases du prompt — ta premiere etape vers un prompting structure.',
    focus: 'Commencez par les bases du prompt — votre premiere etape vers un prompting structure.',
  },
  'home.startCta': {
    playful: 'C\'est parti !',
    focus: 'Ouvrir le premier parcours',
  },
  'home.labPracticeHint': {
    playful: 'Transforme la compétence d’aujourd’hui en vrai prompt — note-le dans Prompt Lab.',
    focus: 'Transforme la compétence d’aujourd’hui en vrai prompt — note-le dans Prompt Lab.',
  },
  'home.labPracticeCta': {
    playful: 'Ouvrir Prompt Lab',
    focus: 'Ouvrir Prompt Lab',
  },
  'home.retryFailedCta': {
    playful: 'Reprendre la premiere lecon ouverte',
    focus: 'Aller a la premiere lecon non reussie',
  },
  'home.retryFailedNone': {
    playful: 'Toutes les lecons sont faites — pas de reprise necessaire',
    focus: 'Toutes les lecons sont terminees — aucune reprise requise',
  },
  'home.retryFailedNoOpen': {
    playful: 'Aucune lecon en echec — continue normalement',
    focus: 'Aucune erreur ouverte — poursuivre normalement',
  },
  'home.activityInsights.title': {
    playful: 'Ton activite',
    focus: 'Apercu d\'activite',
  },
  'home.activityInsights.expandHint': {
    playful: 'Touche pour voir ton historique d\'orbs en graphique',
    focus: 'Toucher pour ouvrir le graphique d\'activite des orbs',
  },
  'home.activityInsights.collapseHint': {
    playful: 'Touche pour revenir a la vue hebdomadaire',
    focus: 'Toucher pour revenir a la vue hebdomadaire',
  },
  'home.activityInsights.chartTitle': {
    playful: 'Journal d\'orbs',
    focus: 'Activite quotidienne des orbs',
  },
  'home.activityInsights.period': {
    playful: '{{days}} derniers jours',
    focus: 'Periode : {{days}} jours',
  },
  'home.activityInsights.productivityValue': {
    playful: '{{percent}} %',
    focus: '{{percent}} %',
  },
  'home.activityInsights.productivityWithGoal': {
    playful: 'Productivite vs objectif quotidien de {{goal}} orbs',
    focus: 'Productivite par rapport a l\'objectif quotidien ({{goal}} orbs)',
  },
  'home.activityInsights.productivityNoGoal': {
    playful: 'Jours actifs — fixe un objectif via les orbs en haut',
    focus: 'Jours actifs — objectif quotidien via le compteur d\'orbs',
  },
  'home.activityInsights.orbPeekA11y': {
    playful: '{{count}} orbs ce jour-la',
    focus: '{{count}} orbs ce jour-la',
  },
  'orbCounter.label': {
    playful: "Orbs d'energie",
    focus: 'Orbs',
  },
  'orbCounter.dailyProgress': {
    playful: "Aujourd'hui {{current}}/{{goal}} orbs",
    focus: "Aujourd'hui {{current}}/{{goal}}",
  },
  'orbCounter.openDailyGoalHint': {
    playful: 'Appuyer pour ajuster ton objectif du jour',
    focus: "Modifier l'objectif du jour",
  },
  'dailyGoal.title': {
    playful: "Combien d'orbs veux-tu aujourd'hui ?",
    focus: 'Definir un objectif du jour',
  },
  'dailyGoal.subtitle': {
    playful:
      "Tu gagnes des orbs pour chaque lecon terminee. Choisis combien tu veux apprendre aujourd'hui — adapte ton rythme a ta journee.",
    focus:
      "Les orbs sont attribues par lecon terminee. Definissez combien vous voulez en collecter aujourd'hui et combien de temps investir.",
  },
  'dailyGoal.explanationTitle': {
    playful: 'Orbs = progression',
    focus: 'Orbs comme progression',
  },
  'dailyGoal.explanationBody': {
    playful:
      'Chaque lecon rapporte des orbs. Plus d\'orbs, plus de pratique — mais tu choisis le rythme. Un petit objectif du jour, c\'est ok.',
    focus:
      'Chaque lecon terminee rapporte des orbs. L\'objectif du jour regle le rythme et le temps — independamment de la progression globale.',
  },
  'dailyGoal.targetLabel': {
    playful: 'Ton objectif du jour',
    focus: 'Objectif du jour en orbs',
  },
  'dailyGoal.presetOrbs': {
    playful: '{{count}} orbs',
    focus: '{{count}}',
  },
  'dailyGoal.notificationsTitle': {
    playful: 'Rappel du soir',
    focus: 'Rappel d\'apprentissage',
  },
  'dailyGoal.notificationsBody': {
    playful:
      "On peut te rappeler le soir si tu n'as pas encore atteint ton objectif — seulement si tu l'autorises.",
    focus:
      "Notification optionnelle le soir si l'objectif du jour n'est pas encore atteint.",
  },
  'dailyGoal.notificationsExpoGoHint': {
    playful:
      'Les rappels ne sont pas disponibles dans Expo Go. Tu pourras les activer dans un development build.',
    focus:
      'Les notifications ne sont pas disponibles dans Expo Go. Elles peuvent etre activees dans un development build.',
  },
  'dailyGoal.cta': {
    playful: "Enregistrer l'objectif",
    focus: "Enregistrer l'objectif",
  },
  'dailyGoal.saving': {
    playful: 'Enregistrement…',
    focus: 'Enregistrement…',
  },
  'dailyGoal.notificationTitle': {
    playful: 'StructAI',
    focus: 'StructAI',
  },
  'dailyGoal.notificationBody': {
    playful: 'Encore {{remaining}} orbs pour l objectif du jour — une courte lecon compte.',
    focus: 'Il reste {{remaining}} orbs pour l objectif du jour.',
  },
  'dailyGoal.notificationBodySkill': {
    playful: 'Reviens pratiquer « {{skill}} » — encore {{remaining}} orbes pour l’objectif du jour.',
    focus: 'Reviens pratiquer « {{skill}} » — encore {{remaining}} orbes pour l’objectif du jour.',
  },
  'pathCard.chapters': {
    playful: 'Chapitre {{current}} sur {{total}}',
    focus: 'Chap. {{current}}/{{total}}',
  },
  'pathCard.chaptersTotal': {
    playful: '{{total}} chapitres t attendent',
    focus: '{{total}} chapitres',
  },
  'paths.badgeNew': {
    playful: 'Nouveau',
    focus: 'Nouveau',
  },
  'paths.sectionActive': {
    playful: 'Tes parcours en cours',
    focus: 'En cours',
  },
  'paths.sectionAvailable': {
    playful: 'Decouvre-en plus',
    focus: 'Parcours disponibles',
  },
  'paths.sectionLocked': {
    playful: 'Encore verrouillés',
    focus: 'Parcours verrouillés',
  },
  'paths.lockedBadge': {
    playful: 'Verrouillé',
    focus: 'Verrouillé',
  },
  'paths.lockedTitle': {
    playful: 'Ce parcours est encore fermé',
    focus: 'Parcours verrouillé',
  },
  'paths.lockedBody': {
    playful: 'Termine d\'abord « {{path}} » — ensuite tu pourras continuer ici !',
    focus: 'Terminez d\'abord « {{path}} » pour débloquer ce parcours.',
  },
  'paths.lockedCta': {
    playful: 'Retour aux parcours',
    focus: 'Retour aux parcours',
  },
  'paths.title.prompt_basics': {
    playful: 'Bases du prompt',
    focus: 'Bases du prompt',
  },
  'paths.title.structure_lab': {
    playful: 'Atelier de structure',
    focus: 'Labo structure',
  },
  'paths.title.context_mastery': {
    playful: 'Maitrise du contexte',
    focus: 'Maitrise du contexte',
  },
  'paths.title.iteration_loops': {
    playful: 'Boucles d iteration',
    focus: 'Iterations',
  },
  'paths.title.eval_scoring': {
    playful: 'Evaluation et score',
    focus: 'Systeme de score',
  },
  'paths.title.prompt_mastery': {
    playful: 'Maîtrise du prompt',
    focus: 'Maîtrise du prompt',
  },
  'paths.emptyActive': {
    playful: 'Pret pour ta premiere aventure ? Choisis un parcours et lance-toi !',
    focus: 'Choisis un parcours pour commencer.',
  },
  'pathDetail.progressTitle': {
    playful: 'Ton progression',
    focus: 'Progression',
  },
  'pathDetail.chapterListTitle': {
    playful: 'Tes chapitres',
    focus: 'Chapitres',
  },
  'pathDetail.continueCta': {
    playful: 'On continue !',
    focus: 'Continuer',
  },
  'pathDetail.startCta': {
    playful: 'Demarrer maintenant !',
    focus: 'Demarrer',
  },
  'pathDetail.notFound': {
    playful: 'Ce parcours est encore inconnu.',
    focus: 'Parcours introuvable.',
  },
  'lesson.stepLabel': {
    playful: 'Etape {{current}} sur {{total}}',
    focus: '{{current}}/{{total}}',
  },
  'lesson.depthBadgePlayful': {
    playful: 'Plus court · Plus simple',
    focus: 'Plus court · Plus simple',
  },
  'lesson.depthBadgeFocus': {
    playful: 'Approfondi · Plus de questions',
    focus: 'Approfondi · Plus de questions',
  },
  'lesson.depthInfoTitle': {
    playful: 'Ton mode d\'apprentissage',
    focus: 'Mode d\'apprentissage',
  },
  'lesson.depthInfoBodyPlayful': {
    playful:
      'En mode Ludique, les lecons sont plus courtes et plus simples — meme objectif, moins d\'etapes et un langage plus leger.',
    focus:
      'En mode Ludique, les lecons sont plus courtes et plus simples — meme objectif, moins d\'etapes et un langage plus leger.',
  },
  'lesson.depthInfoBodyFocus': {
    playful:
      'En mode Concentre, tu as plus de profondeur : textes plus longs, plus de questions et des taches plus exigeantes.',
    focus:
      'En mode Concentre, tu as plus de profondeur : textes plus longs, plus de questions et des taches plus exigeantes.',
  },
  'lesson.depthInfoAgeRecommended': {
    playful:
      'Avant 15 ans, le mode Ludique est fortement recommande — modifiable a tout moment dans le Profil.',
    focus:
      'Avant 15 ans, le mode Ludique est fortement recommande — reglage dans le Profil ou a l\'onboarding.',
  },
  'lesson.depthInfoSettingsHint': {
    playful:
      'Le mode vient de ton Profil ou de l\'onboarding — tu peux le changer la a tout moment.',
    focus:
      'Le mode est defini dans le Profil ou a l\'onboarding et peut y etre modifie a tout moment.',
  },
  'lesson.depthInfoAccessibilityHint': {
    playful: 'Appuie pour une breve explication du mode.',
    focus: 'Appuyer pour l\'explication du mode.',
  },
  'lesson.glossaryTapHint': {
    playful: 'Appuie pour une breve explication de ce terme.',
    focus: 'Appuyer pour une breve explication de ce terme.',
  },
  'lesson.typeChoice': {
    playful: 'Question a choix',
    focus: 'Choix',
  },
  'lesson.typeFillBlank': {
    playful: 'Texte a trous',
    focus: 'Texte a trou',
  },
  'lesson.typeTrueFalse': {
    playful: 'Vrai ou faux',
    focus: 'Vrai/Faux',
  },
  'lesson.typeReorder': {
    playful: 'Remise en ordre',
    focus: 'Ordre',
  },
  'lesson.typeMatching': {
    playful: 'Associer',
    focus: 'Association',
  },
  'lesson.typeErrorFinding': {
    playful: 'Trouver l erreur',
    focus: 'Erreur',
  },
  'lesson.typeCategorize': {
    playful: 'Categories',
    focus: 'Classer',
  },
  'lesson.fillBlankInstruction': {
    playful: 'Complete le blanc avec le meilleur terme.',
    focus: 'Remplir le blanc correctement.',
  },
  'lesson.trueLabel': {
    playful: 'Vrai',
    focus: 'Vrai',
  },
  'lesson.falseLabel': {
    playful: 'Faux',
    focus: 'Faux',
  },
  'lesson.reorderHint': {
    playful: 'Remets les etapes dans le bon ordre.',
    focus: 'Placer les elements dans le bon ordre.',
  },
  'lesson.matchingInstruction': {
    playful: 'Touche un terme a gauche, puis sa definition a droite.',
    focus: 'Choisir un terme, puis associer la definition.',
  },
  'lesson.errorFindingInstruction': {
    playful: 'Touche le mot qui cause le probleme.',
    focus: 'Toucher le segment problematique.',
  },
  'lesson.categorizeInstruction': {
    playful: 'Touche un item, puis sa categorie.',
    focus: 'Choisir un item, puis assigner la categorie.',
  },
  'lesson.categorizePoolLabel': {
    playful: 'Encore ouvert',
    focus: 'Ouvert',
  },
  'lesson.perfectBonus': {
    playful: 'Parfait ! Bonus d Orbs debloque.',
    focus: 'Parfait. Bonus obtenu.',
  },
  'orb.speech.readingStart.a': {
    playful: 'Ok — je suis avec toi. Lis ca.',
    focus: '',
  },
  'orb.speech.readingStart.b': {
    playful: 'Nouvelle page ! On absorbe.',
    focus: '',
  },
  'orb.speech.readingStart.c': {
    playful: 'Les yeux ici — ca compte.',
    focus: '',
  },
  'orb.speech.reading.a': {
    playful: 'Hmm… regarde la structure.',
    focus: '',
  },
  'orb.speech.reading.b': {
    playful: 'Interessant. Quel est le vrai job de ce prompt ?',
    focus: '',
  },
  'orb.speech.reading.c': {
    playful: 'Continue — l indice est dans le libelle.',
    focus: '',
  },
  'orb.speech.practicing.a': {
    playful: 'A toi. Choisis avec intention.',
    focus: '',
  },
  'orb.speech.practicing.b': {
    playful: 'Sans te presser — prends l option la plus nette.',
    focus: '',
  },
  'orb.speech.practicing.c': {
    playful: 'Je veux une reponse propre. Vas-y.',
    focus: '',
  },
  'orb.speech.correct.a': {
    playful: 'Oui ! Ce raisonnement tient.',
    focus: '',
  },
  'orb.speech.correct.b': {
    playful: 'Pile — c est le schema.',
    focus: '',
  },
  'orb.speech.correct.c': {
    playful: 'Beau tir. Garde ca.',
    focus: '',
  },
  'orb.speech.wrong.a': {
    playful: 'Presque. Change d angle une fois.',
    focus: '',
  },
  'orb.speech.wrong.b': {
    playful: 'Pas tout a fait — relis la contrainte.',
    focus: '',
  },
  'orb.speech.wrong.c': {
    playful: 'Pas loin ! Le piege etait dans les details.',
    focus: '',
  },
  'orb.speech.celebrating.a': {
    playful: 'Tu l as fait ! Cette lecon est a nous.',
    focus: '',
  },
  'orb.speech.celebrating.b': {
    playful: 'Boom — progression debloquee.',
    focus: '',
  },
  'orb.speech.celebrating.c': {
    playful: 'Belle serie. On continue !',
    focus: '',
  },
  'orb.speech.lowEnergy.a': {
    playful: 'Hey — encore quelques Orbs et l objectif sourit.',
    focus: '',
  },
  'orb.speech.lowEnergy.b': {
    playful: 'Je suis un peu faible. Une courte lecon aide.',
    focus: '',
  },
  'orb.speech.lowEnergy.c': {
    playful: 'Check energie : il nous faut une petite victoire.',
    focus: '',
  },
  'orb.speech.focus.correctTip.a': {
    playful: '',
    focus: 'Garde ce schema — nomme le job avant d ecrire.',
  },
  'orb.speech.focus.correctTip.b': {
    playful: '',
    focus: 'Bien. Ensuite, durcis une contrainte.',
  },
  'orb.speech.focus.correctTip.c': {
    playful: '',
    focus: 'Solide. Reutilise cette structure au prochain prompt.',
  },
  'orb.speech.focus.wrongTip.a': {
    playful: '',
    focus: 'Astuce : separe role, tache et format.',
  },
  'orb.speech.focus.wrongTip.b': {
    playful: '',
    focus: 'Revérifie la contrainte qui limitait la reponse.',
  },
  'orb.speech.focus.wrongTip.c': {
    playful: '',
    focus: 'Essai suivant : quelle forme de sortie etait exigee ?',
  },
  'orb.speech.focus.celebrating.a': {
    playful: '',
    focus: 'Lecon terminee. Emporte une regle claire.',
  },
  'orb.speech.focus.celebrating.b': {
    playful: '',
    focus: 'Fait. Note le schema qui a valu la reussite.',
  },
  'orb.speech.focus.lowEnergy.a': {
    playful: '',
    focus: 'Objectif bas — une lecon concentree reduit l ecart.',
  },
  'orb.speech.focus.lowEnergy.b': {
    playful: '',
    focus: 'Astuce : termine un court bloc de pratique aujourd hui.',
  },
  'lesson.check': {
    playful: 'Verifier la reponse !',
    focus: 'Verifier',
  },
  'lesson.next': {
    playful: 'On y va !',
    focus: 'Suivant',
  },
  'lesson.correctFeedback': {
    playful: 'Top ! Ta reponse est juste.',
    focus: 'Correct.',
  },
  'lesson.wrongFeedback': {
    playful: 'Pas encore — voici comment corriger.',
    focus: 'Incorrect — pourquoi, puis le prochain schema.',
  },
  'lesson.hintLabel': {
    playful: 'Conseil :',
    focus: 'Conseil :',
  },
  'lesson.coachingWhyLabel': {
    playful: 'Pourquoi ca echoue',
    focus: 'Pourquoi ca echoue',
  },
  'lesson.coachingNextLabel': {
    playful: 'Que faire ensuite',
    focus: 'Prochain schema',
  },
  'lesson.coachingNextFromBeat': {
    playful: 'Au prochain essai, applique {{term}} volontairement.',
    focus: 'Ensuite : appliquez {{term}} consciemment au retry.',
  },
  'lesson.coachingNextFallback': {
    playful: 'Relis le pourquoi, puis choisis l option qui ferme l ecart.',
    focus: 'Relisez la cause, puis choisissez l option qui la corrige.',
  },
  'lesson.learningBeatLabel': {
    playful: 'Retiens',
    focus: 'Point cle',
  },
  'lesson.completeTitle': {
    playful: 'Lecon terminee !',
    focus: 'Lecon terminee.',
  },
  'lesson.orbsEarned': {
    playful: '+{{count}} Orbs pour toi !',
    focus: '+{{count}} Orbs',
  },
  'lesson.practiceComplete': {
    playful: 'Entrainement termine — pas d\'Orbs en plus.',
    focus: 'Repetee. Aucun Orbe supplementaire.',
  },
  'sessionSkill.eyebrow': {
    playful: 'Tu peux faire ca maintenant',
    focus: 'Competence acquise',
  },
  'sessionSkill.generic.name': {
    playful: 'Des prompts plus clairs',
    focus: 'Des prompts plus clairs',
  },
  'sessionSkill.generic.proof': {
    playful: 'Tu as pratiqué un schéma de prompting concret, réutilisable pour ta prochaine tâche IA.',
    focus: 'Tu as pratiqué un schéma de prompting réutilisable pour ta prochaine tâche IA.',
  },
  'sessionSkill.comeBackTomorrow': {
    playful: 'Reviens demain et réutilise ce schéma sur une vraie tâche — c’est comme ça que ça reste.',
    focus: 'Reviens demain et applique ce schéma sur une vraie tâche.',
  },
  'sessionSkill.pb-1.name': {
    playful: 'Voir ce qu’est vraiment un prompt',
    focus: 'Définir un prompt comme un brief',
  },
  'sessionSkill.pb-1.proof': {
    playful: 'Tu distingues un souhait vague d’une instruction utilisable — première étape vers de meilleures réponses.',
    focus: 'Tu distingues un souhait vague d’une instruction utilisable pour un modèle.',
  },
  'sessionSkill.pb-2.name': {
    playful: 'Écrire des instructions claires',
    focus: 'Écrire des instructions claires',
  },
  'sessionSkill.pb-2.proof': {
    playful: 'Tu remplaces les demandes floues par des instructions directes que le modèle peut suivre.',
    focus: 'Tu remplaces les demandes vagues par des instructions directes et suivables.',
  },
  'sessionSkill.pb-3.name': {
    playful: 'Définir l’objectif d’abord',
    focus: 'Définir l’objectif d’abord',
  },
  'sessionSkill.pb-3.proof': {
    playful: 'Tu nommes le résultat voulu avant de demander au modèle de travailler.',
    focus: 'Tu énonces le résultat voulu avant d’envoyer le prompt.',
  },
  'sessionSkill.pb-4.name': {
    playful: 'Préciser le format de sortie',
    focus: 'Préciser le format de sortie',
  },
  'sessionSkill.pb-4.proof': {
    playful: 'Tu demandes la forme de la réponse (liste, longueur, structure) au lieu d’espérer.',
    focus: 'Tu spécifies liste/longueur/structure au lieu d’espérer une forme utile.',
  },
  'sessionSkill.pb-5.name': {
    playful: 'Guider avec des exemples',
    focus: 'Guider avec des exemples',
  },
  'sessionSkill.pb-5.proof': {
    playful: 'Tu montres au modèle à quoi ressemble « bien » au lieu de seulement le décrire.',
    focus: 'Tu utilises des exemples pour que le modèle suive le schéma voulu.',
  },
  'sessionSkill.pb-6.name': {
    playful: 'Bien utiliser les contraintes négatives',
    focus: 'Appliquer des contraintes négatives',
  },
  'sessionSkill.pb-6.proof': {
    playful: 'Tu interdis les mauvais schémas sans laisser le modèle inventer la suite.',
    focus: 'Tu combines interdictions et guidance positive pour que le modèle sache quoi faire.',
  },
  'sessionSkill.pb-7.name': {
    playful: 'Garder les prompts aussi courts que possible',
    focus: 'Bien doser la longueur du prompt',
  },
  'sessionSkill.pb-7.proof': {
    playful: 'Tu coupes le remplissage et ne gardes que contexte, tâche et contraintes utiles.',
    focus: 'Tu retires le remplissage pour que chaque ligne ajoute contexte, tâche ou contrainte.',
  },
  'sessionSkill.pb-8.name': {
    playful: 'Assembler un brief basics complet',
    focus: 'Assembler un brief basics complet',
  },
  'sessionSkill.pb-8.proof': {
    playful: 'Tu combines objectif, format, exemples et interdits en un brief compact.',
    focus: 'Tu combines objectif, format, exemples et contraintes en un brief.',
  },
  'sessionSkill.pb-9.name': {
    playful: 'Remplacer les mots vagues par des mots précis',
    focus: 'Préférer un libellé précis',
  },
  'sessionSkill.pb-9.proof': {
    playful: 'Tu remplaces « court » / « bien » par des limites mesurables.',
    focus: 'Tu remplaces les mots relatifs par des limites mesurables.',
  },
  'sessionSkill.pb-10.name': {
    playful: 'Donner une seule tâche à la fois',
    focus: 'Une tâche par prompt',
  },
  'sessionSkill.pb-10.proof': {
    playful: 'Tu sépares les multi-demandes pour que chaque prompt ait un job clair.',
    focus: 'Tu sépares les multi-demandes en une tâche claire par prompt.',
  },
  'sessionSkill.pb-11.name': {
    playful: 'Nommer pour qui est la réponse',
    focus: 'Préciser le public',
  },
  'sessionSkill.pb-11.proof': {
    playful: 'Tu nommes le lecteur pour que ton et profondeur correspondent.',
    focus: 'Tu nommes le public pour que ton et profondeur correspondent.',
  },
  'sessionSkill.pb-12.name': {
    playful: 'Repérer les erreurs débutantes courantes',
    focus: 'Repérer les erreurs débutantes courantes',
  },
  'sessionSkill.pb-12.proof': {
    playful: 'Tu détectes l’objectif, le format ou les contraintes manquants avant d’envoyer.',
    focus: 'Tu détectes l’objectif, le format ou les contraintes manquants avant l’envoi.',
  },
  'firstSessionProof.brand': {
    playful: 'Ta premiere preuve de skill',
    focus: 'Premiere preuve de skill',
  },
  'firstSessionProof.headline': {
    playful: 'Vois un prompt vague s ameliorer — puis nomme ce que tu as appris.',
    focus: 'Critique, rewrite, compare — puis nomme le skill.',
  },
  'firstSessionProof.sub': {
    playful: 'Pas de cle API. Le coach local montre qualite → critique → rewrite en moins d une minute.',
    focus: 'Coach local seulement. Qualite, critique, rewrite — pas de BYOK.',
  },
  'firstSessionProof.weakLabel': {
    playful: 'Prompt vague',
    focus: 'Prompt vague',
  },
  'firstSessionProof.improvedLabel': {
    playful: 'Prompt reecrit',
    focus: 'Prompt reecrit',
  },
  'firstSessionProof.scoreLabel': {
    playful: 'Score coach : {{score}}/100',
    focus: 'Score : {{score}}/100',
  },
  'firstSessionProof.critiqueBody': {
    playful: 'Trop vague : pas de role, pas d audience, pas de format, pas de longueur. Le modele doit deviner.',
    focus: 'Role, audience, format et longueur manquent — le modele doit deviner.',
  },
  'firstSessionProof.compareTitle': {
    playful: '{{before}} → {{after}} (+{{delta}})',
    focus: '{{before}} → {{after}} (+{{delta}})',
  },
  'firstSessionProof.skillName': {
    playful: 'Transformer une demande vague en brief utilisable',
    focus: 'Transformer une demande vague en brief utilisable',
  },
  'firstSessionProof.skillProof': {
    playful: 'Il y a dix minutes c etait « ecris quelque chose ». Maintenant tu vois pourquoi structure, role et contraintes changent le score.',
    focus: 'Tu peux expliquer pourquoi role, contexte et contraintes ameliorent la qualite du prompt.',
  },
  'firstSessionProof.comeBackTomorrow': {
    playful: 'Demain : réutilise ce schéma de rewrite sur une vraie tâche — c’est ton win du jour 2.',
    focus: 'Demain : réutilise ce schéma de rewrite sur une vraie tâche — c’est ton win du jour 2.',
  },
  'firstSessionProof.ctaCritique': {
    playful: 'Montrer la critique',
    focus: 'Montrer la critique',
  },
  'firstSessionProof.ctaRewrite': {
    playful: 'Montrer un rewrite',
    focus: 'Montrer le rewrite',
  },
  'firstSessionProof.ctaCompare': {
    playful: 'Comparer les scores',
    focus: 'Comparer les scores',
  },
  'firstSessionProof.ctaSummary': {
    playful: 'Nommer ce que j ai appris',
    focus: 'Resume du skill',
  },
  'firstSessionProof.ctaDone': {
    playful: 'Continuer — configurer mon profil',
    focus: 'Continuer vers le profil',
  },
  'promptLab.learnedEyebrow': {
    playful: 'Tu as pratique',
    focus: 'Skill pratique',
  },
  'promptLab.learnedImproved': {
    playful: 'Tu as ameliore ce brouillon de +{{delta}} — un vrai gain de skill, pas seulement un chiffre.',
    focus: 'Brouillon ameliore de +{{delta}}. Gain : structure et contraintes plus claires.',
  },
  'promptLab.learnedNext': {
    playful: 'Prochain skill a verrouiller : {{skill}}',
    focus: 'Prochain focus skill : {{skill}}',
  },
  'promptLab.learnedComplete': {
    playful: 'Tu touches les piliers cles — role, contexte, format, contraintes.',
    focus: 'Piliers cles presents : role, contexte, format, contraintes.',
  },

  'promptLab.dictationStart': {
    playful: 'Dicter le prompt',
    focus: 'Dicter le prompt',
  },
  'promptLab.dictationStop': {
    playful: 'Arrêter la dictée',
    focus: 'Arrêter la dictée',
  },
  'promptLab.dictationListening': {
    playful: 'J’écoute… dis ton prompt',
    focus: 'Écoute… dicte ton prompt',
  },
  'promptLab.dictationPermission': {
    playful: 'Le micro est nécessaire pour dicter. Active-le dans les réglages.',
    focus: 'L’accès micro est requis pour la dictée.',
  },
  'promptLab.dictationError': {
    playful: 'Dictée en panne — retape sur le micro.',
    focus: 'Échec de la dictée. Réessaie avec le micro.',
  },
  'promptLab.dictationUnavailable': {
    playful: 'La dictée nécessite le development build StructAI (pas Expo Go).',
    focus: 'La dictée exige un development build StructAI — Expo Go n’a pas le module speech.',
  },
  'orb.voice.tapHint': {
    playful: 'Touche l’Orb pour l’entendre.',
    focus: 'Toucher l’Orb pour le voiceover.',
  },
  'orb.voice.tapA11y': {
    playful: 'Lire la voix de l’Orb',
    focus: 'Lire le voiceover de l’Orb',
  },
  'orb.voice.needsDevBuild': {
    playful: 'La voix nécessite le development build StructAI (pas Expo Go).',
    focus: 'Le voiceover exige un development build StructAI.',
  },
  'orb.speech.onboarding.welcome': {
    playful: 'Salut ! Je suis ton Orb — ton coach prompt local. Court et clair, promis.',
    focus: 'Je suis ton coach Orb. On pratique des prompts clairs — pas à pas.',
  },
  'orb.speech.onboarding.meetReady': {
    playful: 'Juste quelques questions — et on y va !',
    focus: 'Quelques infos rapides — puis on commence.',
  },
  'orb.speech.onboarding.mode': {
    playful: 'Choisis l’ambiance — j’adapte rythme et ton. Les skills restent les mêmes.',
    focus: 'Focus ou Playful : mêmes compétences, densité différente. À toi de choisir.',
  },
  'orb.speech.onboarding.modePlayful': {
    playful: 'Nice — Playful. Beats courts, plus d’énergie. Je reste avec toi.',
    focus: 'Playful choisi : étapes plus courtes, mêmes objectifs.',
  },
  'orb.speech.onboarding.modeFocus': {
    playful: 'Focus — net et dense. Je garde le bruit bas.',
    focus: 'Focus choisi : tips sobres, profondeur au check.',
  },
  'orb.speech.onboarding.loop': {
    playful: 'Le loop : apprendre → pratiquer → progresser. Prêt pour le premier skill ?',
    focus: 'Trois temps : apprendre, pratiquer, améliorer. Lance quand tu veux.',
  },
  'orb.speech.onboarding.proof': {
    playful: 'Regarde ce prompt vague s’améliorer — c’est le skill.',
    focus: 'Critique → rewrite → comparer. C’est la preuve.',
  },
  'orb.speech.onboarding.proofWeak': {
    playful: 'Souvent ça commence ainsi : sympa, mais trop vague. Tu vois les trous ?',
    focus: 'Départ typique : l’intention est là, la structure manque. On corrige ça.',
  },
  'orb.speech.onboarding.proofCritique': {
    playful: 'Check rapide : but, contraintes, format — qu’est-ce qui manque ?',
    focus: 'Passe critique : nomme les pièces manquantes, ne devine pas.',
  },
  'orb.speech.onboarding.proofRewrite': {
    playful: 'Maintenant le rewrite — même idée, vraie structure. Boom.',
    focus: 'Rewrite : même intention, structure et contraintes claires.',
  },
  'orb.speech.onboarding.proofCompare': {
    playful: 'Avant/après — le score monte parce que la structure se mesure.',
    focus: 'Comparaison : la structure rend la différence visible.',
  },
  'orb.speech.onboarding.proofDone': {
    playful: 'Top — tu repères un prompt faible et tu le corriges. C’est le skill.',
    focus: 'Tu peux transformer une demande vague en brief utile.',
  },
  'orb.speech.onboarding.dailyGoal': {
    playful: 'Fixe un petit objectif du jour — je te rappelle, sans stress.',
    focus: 'Choisis un objectif d’orbes honnête. Streak propre.',
  },
  'orb.speech.lessonComplete': {
    playful: 'Yes ! Ce skill est à toi — réutilise-le demain.',
    focus: 'Leçon réussie. Réapplique ce schéma demain sur une vraie tâche.',
  },
  'orb.speech.lessonRetry': {
    playful: 'Presque ! On reprend les points faibles — tu vas y arriver.',
    focus: 'Pas encore. Réessaie les checks manqués pour verrouiller le schéma.',
  },

  'lesson.backToPath': {
    playful: 'Retour au parcours',
    focus: 'Retour au parcours',
  },
  'lesson.continueNext': {
    playful: 'Vers la prochaine lecon !',
    focus: 'Chapitre suivant',
  },
  'lesson.lockedTitle': {
    playful: 'Ce chapitre est encore verrouille',
    focus: 'Chapitre verrouille',
  },
  'lesson.lockedBody': {
    playful: 'Termine d abord les chapitres precedents pour continuer ici.',
    focus: 'Termine d abord les chapitres precedents.',
  },
  'lesson.notFound': {
    playful: 'Cette lecon n existe pas encore.',
    focus: 'Lecon introuvable.',
  },
  'lesson.retryTitle': {
    playful: 'Pas encore reussi !',
    focus: 'Seuil non atteint.',
  },
  'lesson.retrySummary': {
    playful: '{{correct}} sur {{total}} correct — reessaie !',
    focus: '{{correct}}/{{total}} correct. Minimum 60 % requis.',
  },
  'lesson.retryPrimary': {
    playful: 'Reessayer',
    focus: 'Reessayer',
  },
  'lesson.retrySecondary': {
    playful: 'Plus tard',
    focus: 'Continuer plus tard',
  },
  'profile.statsSection': {
    playful: 'Tes reussites',
    focus: 'Statistiques',
  },
  'profile.modeSection': {
    playful: 'Comment veux-tu apprendre ?',
    focus: 'Mode d affichage',
  },
  'profile.modePlayful': {
    playful: 'Ludique',
    focus: 'Ludique',
  },
  'profile.modeFocus': {
    playful: 'Concentration',
    focus: 'Concentration',
  },
  'profile.modeDescription': {
    playful:
      'Mode ludique : textes plus courts et moins de questions. Mode concentre : plus de profondeur — meme objectif.',
    focus:
      'Mode ludique : moins d etapes notees. Mode concentre : plus de profondeur — meme objectif.',
  },
  'profile.languageSection': {
    playful: 'Langue',
    focus: 'Langue',
  },
  'profile.languageDescription': {
    playful: 'Choisis la langue de l interface. Ta progression reste intacte.',
    focus: 'Definir la langue de l interface.',
  },
  'profile.languageDe': {
    playful: 'Allemand',
    focus: 'Allemand',
  },
  'profile.languageEn': {
    playful: 'Anglais',
    focus: 'Anglais',
  },
  'profile.languageFr': {
    playful: 'Francais',
    focus: 'Francais',
  },
  'profile.languageRu': {
    playful: 'Russe',
    focus: 'Russe',
  },
  'profile.byokSection': {
    playful: 'Ta cle IA',
    focus: 'Cle API (BYOK)',
  },
  'profile.byokDescription': {
    playful:
      'Une cle par fournisseur — tout reste sur ton appareil et n est jamais synchronise.',
    focus:
      'Une cle API par provider, chiffree localement (Secure Store). Les cles ne sont pas synchronisees.',
  },
  'profile.byokPlaceholder': {
    playful: 'Coller la cle API',
    focus: 'Saisir la cle API',
  },
  'profile.byokSave': {
    playful: 'Enregistrer la cle',
    focus: 'Enregistrer',
  },
  'profile.byokDelete': {
    playful: 'Supprimer la cle',
    focus: 'Supprimer',
  },
  'profile.byokSavedBadge': {
    playful: 'Bien gardee',
    focus: 'Enregistree',
  },
  'promptLab.inputLabel': {
    playful: 'Ton prompt',
    focus: 'Prompt',
  },
  'promptLab.inputPlaceholder': {
    playful: 'Ecris ton prompt ici...',
    focus: 'Saisir le prompt...',
  },
  'promptLab.scoreButton': {
    playful: 'Lancer l evaluation !',
    focus: 'Evaluer',
  },
  'promptLab.demoBanner': {
    playful: 'Mode demo : sans cle API, le coach local t evalue.',
    focus: 'Mode demo : evaluation locale sans cle API.',
  },
  'promptLab.addKeyCta': {
    playful: 'Ajouter la cle dans le profil',
    focus: 'Ajouter la cle API dans le profil',
  },
  'promptLab.scoreTitle': {
    playful: 'Ton bilan',
    focus: 'Evaluation',
  },
  'promptLab.catStructure': {
    playful: 'Structure',
    focus: 'Structure',
  },
  'promptLab.catGoal': {
    playful: 'Objectif',
    focus: 'Definition de l objectif',
  },
  'promptLab.catConstraints': {
    playful: 'Contraintes',
    focus: 'Contraintes',
  },
  'promptLab.feedbackStrong': {
    playful: 'Excellent prompt ! Ta structure est solide.',
    focus: 'Evaluation globale : solide.',
  },
  'promptLab.feedbackOkay': {
    playful: 'Solide ! On peut encore mieux faire.',
    focus: 'Evaluation globale : correcte.',
  },
  'promptLab.feedbackWeak': {
    playful: 'Bon debut - affinons-le.',
    focus: 'Evaluation globale : a ameliorer.',
  },
  'promptLab.hintStructure': {
    playful: 'Ajoute de la structure : separe contexte, tache et contraintes.',
    focus: 'Piste d amelioration : distinguer clairement contexte, tache et contraintes.',
  },
  'promptLab.hintGoal': {
    playful: 'Dis plus precisement au modele ce que tu attends.',
    focus: 'Piste d amelioration : definir plus precisement le resultat attendu.',
  },
  'promptLab.hintConstraints': {
    playful: 'Ajoute des contraintes nettes pour viser le score max.',
    focus: 'Piste d amelioration : contraintes plus precises (longueur, format, public).',
  },
  'promptLab.historyTitle': {
    playful: 'Ton historique de scores',
    focus: 'Historique des scores',
  },
  'promptLab.promptHistoryTitle': {
    playful: 'Tes prompts evalues',
    focus: 'Prompts evalues recents',
  },
  'promptLab.promptHistoryDescription': {
    playful: 'Touche un prompt pour le recharger dans l editeur.',
    focus: 'Selectionnez une entree pour reutiliser ce prompt.',
  },
  'promptLab.promptHistoryEmpty': {
    playful: 'Aucun prompt evalue pour l instant — evalue-en un pour commencer.',
    focus: 'Aucun prompt evalue enregistre.',
  },
  'promptLab.promptHistoryMissing': {
    playful: 'Ancienne entree — le texte du prompt n etait pas encore enregistre.',
    focus: 'Entree legacy sans texte de prompt enregistre.',
  },
  'promptLab.promptHistoryScore': {
    playful: 'Score {{score}}',
    focus: '{{score}} / 100',
  },
  'promptLab.promptHistoryTapReuse': {
    playful: 'Toucher pour reutiliser',
    focus: 'Reutiliser',
  },
  'promptLab.promptHistoryReuseHint': {
    playful: 'Charge ce prompt dans le champ de saisie',
    focus: 'Charge ce prompt dans le champ de saisie',
  },
  'promptLab.promptHistoryItemA11y': {
    playful: 'Prompt evalue, score {{score}}',
    focus: 'Prompt evalue, score {{score}}',
  },
  'promptLab.scoringInProgress': {
    playful: 'Evaluation en cours...',
    focus: 'Evaluation...',
  },
  'promptLab.liveBadge': {
    playful: 'Evaluation en direct : {{provider}}',
    focus: 'Direct : {{provider}}',
  },
  'promptLab.fallbackInvalidKey': {
    playful: 'Ta cle a ete refusee - le coach local a pris le relais. Verifie-la dans ton profil.',
    focus: 'Cle API refusee. Evaluation locale utilisee. Verifier la cle dans le profil.',
  },
  'promptLab.fallbackQuota': {
    playful: 'Ton quota API est epuise ou limite - le coach local prend le relais.',
    focus: 'Quota ou credit epuise. Evaluation locale utilisee.',
  },
  'promptLab.fallbackNetwork': {
    playful: 'Pas de connexion a l IA - le coach local prend le relais.',
    focus: 'API inaccessible. Evaluation locale utilisee.',
  },
  'promptLab.fallbackGeneric': {
    playful: 'La reponse IA etait inutilisable - le coach local prend le relais.',
    focus: 'Erreur API. Evaluation locale utilisee.',
  },
  'promptLab.modeScore': {
    playful: 'Evaluer',
    focus: 'Evaluation',
  },
  'promptLab.modeCompare': {
    playful: 'Comparer les modeles',
    focus: 'Comparaison',
  },
  'promptLab.detailHintsTitle': {
    playful: 'Pistes concretes d amelioration',
    focus: 'Conseils precis',
  },
  'promptLab.improvementPathTitle': {
    playful: 'Ton prochain geste le plus clair',
    focus: 'Chemin d amelioration principal',
  },
  'promptLab.improvementPathSecondary': {
    playful: 'Ensuite : {{tip}}',
    focus: 'Ensuite : {{tip}}',
  },
  'promptLab.improvementPathComplete': {
    playful: 'Bien — role, contexte, format et contraintes sont couverts.',
    focus: 'Tous les piliers presents : role, contexte, format, contraintes.',
  },
  'promptLab.missing.context': {
    playful: 'Il manque du contexte — quel arriere-plan l IA doit-elle utiliser ?',
    focus: 'Contexte manquant : ajoutez des faits ou sources a utiliser.',
  },
  'promptLab.missing.role': {
    playful: 'Il manque un role — dis a l IA qui elle doit etre.',
    focus: 'Role manquant : assignez une persona ou une posture claire.',
  },
  'promptLab.missing.format': {
    playful: 'Il manque un format — puces, paragraphes, tableau… ?',
    focus: 'Format manquant : precisez la forme de sortie (liste, JSON, …).',
  },
  'promptLab.missing.constraints': {
    playful: 'Il manque des contraintes — longueur, public ou ton.',
    focus: 'Contraintes manquantes : limites dures (longueur, public, ton).',
  },
  'promptLab.comparisonTitle': {
    playful: '+{{delta}} points — voici ce qui s est ameliore',
    focus: '+{{delta}} points par rapport au brouillon precedent',
  },
  'promptLab.demoWeakExample': {
    playful: 'Charger un exemple faible',
    focus: 'Exemple faible',
  },
  'promptLab.demoImprovedExample': {
    playful: 'Charger la version amelioree',
    focus: 'Version amelioree',
  },
  'modelComparer.description': {
    playful:
      'Un prompt, plusieurs modeles en parallele — fais defiler les reponses et compare vitesse et cout.',
    focus:
      'Envoie un prompt en parallele a 2–3 providers configures et affiche les reponses cote a cote (scroll horizontal).',
  },
  'modelComparer.needTwoKeys': {
    playful: 'Ajoute au moins deux cles API dans le profil pour comparer.',
    focus: 'Au moins deux cles provider requises dans le profil.',
  },
  'modelComparer.modelPickerLabel': {
    playful: 'Choisir les modeles (2–3)',
    focus: 'Modeles (2–3)',
  },
  'modelComparer.modelPickerHint': {
    playful: 'Au moins deux, au plus trois modeles.',
    focus: 'Selection : min. 2, max. 3 modeles.',
  },
  'modelComparer.promptLabel': {
    playful: 'Ton prompt',
    focus: 'Prompt',
  },
  'modelComparer.promptPlaceholder': {
    playful: 'Ecris le prompt pour tous les modeles...',
    focus: 'Prompt pour tous les modeles selectionnes...',
  },
  'modelComparer.compareButton': {
    playful: 'Comparer en parallele',
    focus: 'Comparer',
  },
  'modelComparer.comparing': {
    playful: 'Les modeles repondent...',
    focus: 'Comparaison en cours...',
  },
  'modelComparer.resultsTitle': {
    playful: 'Reponses comparees',
    focus: 'Resultats',
  },
  'modelComparer.copyA11y': {
    playful: 'Copier cette reponse',
    focus: 'Copier la reponse dans le presse-papiers',
  },
  'modelComparer.copiedA11y': {
    playful: 'Copie',
    focus: 'Reponse copiee',
  },
  'modelComparer.latencyBadge': {
    playful: '{{seconds}} s',
    focus: '{{seconds}} s',
  },
  'modelComparer.costBadge': {
    playful: 'env. {{cost}}',
    focus: '≈ {{cost}}',
  },
  'modelComparer.errorBadge': {
    playful: 'Erreur',
    focus: 'Erreur',
  },
  'modelComparer.errorInvalidKey': {
    playful: 'Cle refusee — verifie-la dans le profil.',
    focus: 'Cle API invalide.',
  },
  'modelComparer.errorQuota': {
    playful: 'Quota ou credit epuise.',
    focus: 'Rate-limit ou quota epuise.',
  },
  'modelComparer.errorNetwork': {
    playful: 'Erreur reseau ou timeout.',
    focus: 'Erreur reseau / timeout.',
  },
  'modelComparer.errorGeneric': {
    playful: 'Ce modele n a pas pu repondre.',
    focus: 'Reponse du modele echouee.',
  },
  'modelComparer.insightMoreExpensiveSlightlyDetailed': {
    playful: '{{costMultiplier}}× plus cher, mais seulement {{detailPercent}}% plus detaille que les autres.',
    focus: '{{costMultiplier}}× plus cher, seulement {{detailPercent}}% de texte en plus.',
  },
  'modelComparer.insightMoreExpensiveMuchDetailed': {
    playful: '{{costMultiplier}}× plus cher et {{detailPercent}}% plus detaille que les autres.',
    focus: '{{costMultiplier}}× plus cher avec {{detailPercent}}% de texte en plus.',
  },
  'modelComparer.insightMoreExpensiveShorter': {
    playful: '{{costMultiplier}}× plus cher avec une reponse {{detailPercent}}% plus courte.',
    focus: '{{costMultiplier}}× plus cher, reponse {{detailPercent}}% plus courte.',
  },
  'modelComparer.insightMoreExpensiveSimilarDetail': {
    playful: '{{costMultiplier}}× plus cher pour une longueur de reponse similaire.',
    focus: '{{costMultiplier}}× plus cher, longueur proche de la moyenne.',
  },
  'modelComparer.insightCheaperMoreDetailed': {
    playful: '{{costMultiplier}}× moins cher et {{detailPercent}}% plus detaille.',
    focus: '{{costMultiplier}}× moins cher avec {{detailPercent}}% de texte en plus.',
  },
  'modelComparer.insightCheaperShorter': {
    playful: '{{costMultiplier}}× moins cher, mais {{detailPercent}}% plus court.',
    focus: '{{costMultiplier}}× moins cher, reponse {{detailPercent}}% plus courte.',
  },
  'modelComparer.insightCheaperSimilarDetail': {
    playful: '{{costMultiplier}}× moins cher pour une longueur similaire.',
    focus: '{{costMultiplier}}× moins cher, longueur proche de la moyenne.',
  },
  'modelComparer.insightFaster': {
    playful: '{{speedMultiplier}}× plus rapide — cout et longueur similaires.',
    focus: '{{speedMultiplier}}× plus rapide, cout et texte comparables.',
  },
  'modelComparer.insightSlower': {
    playful: '{{speedMultiplier}}× plus lent — cout et longueur similaires.',
    focus: '{{speedMultiplier}}× plus lent, cout et texte comparables.',
  },
  'modelComparer.insightSimilar': {
    playful: 'Cout, vitesse et longueur proches de la moyenne des autres modeles.',
    focus: 'Cout, latence et longueur proches du milieu des autres modeles.',
  },
  'modelComparer.spendingWarningDaily': {
    playful: 'Info : limite journaliere de depense estimee atteinte (estimation seulement).',
    focus: 'Limite journaliere de depense estimee atteinte (estimation locale, non garantie).',
  },
  'modelComparer.spendingWarningMonthly': {
    playful: 'Info : limite mensuelle de depense estimee atteinte (estimation seulement).',
    focus: 'Limite mensuelle de depense estimee atteinte (estimation locale, non garantie).',
  },
  'modelComparer.spendingWarningBoth': {
    playful: 'Info : limites journaliere et mensuelle atteintes (estimation seulement).',
    focus: 'Limites journaliere et mensuelle atteintes (estimation non garantie).',
  },
  'profile.spendingLimitSection': {
    playful: 'Garde-fou depenses',
    focus: 'Limite de depense (BYOK)',
  },
  'profile.spendingLimitDescription': {
    playful: 'Fixe une limite jour/mois pour les couts API estimes — alerte locale avant la surprise.',
    focus: 'Limite optionnelle jour/mois pour depenses BYOK estimees avec alerte locale.',
  },
  'profile.spendingLimitDisclaimer': {
    playful: 'Estimation grossiere sur ton appareil — pas une facture reelle, sans garantie.',
    focus: 'Estimation client sans garantie de facturation ; orientation uniquement.',
  },
  'profile.spendingLimitDailyLabel': {
    playful: 'Limite journaliere (USD, optionnel)',
    focus: 'Limite journaliere USD (optionnel)',
  },
  'profile.spendingLimitMonthlyLabel': {
    playful: 'Limite mensuelle (USD, optionnel)',
    focus: 'Limite mensuelle USD (optionnel)',
  },
  'profile.spendingLimitPlaceholder': {
    playful: 'ex. 1.00',
    focus: 'ex. 1.00',
  },
  'profile.spendingLimitSave': {
    playful: 'Enregistrer la limite',
    focus: 'Enregistrer',
  },
  'profile.spendingLimitUsageToday': {
    playful: 'Estime aujourd hui : {{amount}}',
    focus: 'Aujourd hui (estimation) : {{amount}}',
  },
  'profile.spendingLimitUsageMonth': {
    playful: 'Estime ce mois : {{amount}}',
    focus: 'Mois (estimation) : {{amount}}',
  },
  'profile.spendingLimitWarningDaily': {
    playful: 'Limite journaliere atteinte (estimation)',
    focus: 'Limite journaliere atteinte (estimation)',
  },
  'profile.spendingLimitWarningMonthly': {
    playful: 'Limite mensuelle atteinte (estimation)',
    focus: 'Limite mensuelle atteinte (estimation)',
  },
  'profile.spendingLimitWarningBoth': {
    playful: 'Limites journaliere et mensuelle atteintes (estimation)',
    focus: 'Limites journaliere et mensuelle atteintes (estimation)',
  },
  'profile.byokChecking': {
    playful: 'Verification de ta cle...',
    focus: 'Verification de la cle...',
  },
  'profile.byokValidBadge': {
    playful: 'Fonctionne ({{provider}})',
    focus: 'Active ({{provider}})',
  },
  'profile.byokInvalidError': {
    playful: 'La cle a ete refusee - merci de la verifier.',
    focus: 'Cle invalide. Merci de verifier.',
  },
  'profile.byokUnverifiedBadge': {
    playful: 'Enregistree - pas encore verifiee',
    focus: 'Enregistree (non verifiee)',
  },
  'profile.byokTest': {
    playful: 'Tester la cle',
    focus: 'Tester',
  },
  'profile.byokConfiguredCount': {
    playful: '{{count}} fournisseurs connectes',
    focus: '{{count}} providers configures',
  },
  'profile.accountSection': {
    playful: 'Ton compte',
    focus: 'Compte',
  },
  'profile.accountDescription': {
    playful: 'Tu es connecte. La deconnexion termine seulement la session sur cet appareil.',
    focus: 'Connecte. La deconnexion termine la session sur cet appareil.',
  },
  'profile.signOut': {
    playful: 'Se deconnecter',
    focus: 'Se deconnecter',
  },
  'profile.privacySection': {
    playful: 'Confidentialite et usage',
    focus: 'Confidentialite',
  },
  'profile.analyticsDisclosure': {
    playful: 'StructAI enregistre cinq evenements d usage auto-heberges. Ceux des invites restent anonymes ; apres connexion, ils sont lies au compte. Les prompts et cles API ne sont jamais inclus.',
    focus: 'Cinq evenements d usage auto-heberges mesurent le parcours d activation. Les evenements invites sont anonymes ; ceux des comptes incluent l identifiant utilisateur. Aucun prompt ni cle API n est collecte.',
  },
  'profile.guestDisplayName': {
    playful: 'Invite',
    focus: 'Invite',
  },
  'profile.resetSection': {
    playful: 'Reinitialiser et recommencer',
    focus: 'Donnees et reset',
  },
  'profile.resetSectionDescription': {
    playful: 'Besoin d un nouveau depart ? Choisis ce qu il faut effacer.',
    focus: 'Reinitialiser seulement la progression, ou tout effacer localement et relancer l onboarding.',
  },
  'profile.resetProgressCta': {
    playful: 'Reinitialiser toute la progression',
    focus: 'Reinitialiser toute la progression',
  },
  'profile.deleteAccountCta': {
    playful: 'Tout supprimer et relancer l onboarding',
    focus: 'Supprimer les donnees et relancer l onboarding',
  },
  'profile.resetCancel': {
    playful: 'Annuler',
    focus: 'Annuler',
  },
  'profile.resetProgressConfirmTitle': {
    playful: 'Reinitialiser toute la progression ?',
    focus: 'Reinitialiser toute la progression ?',
  },
  'profile.resetProgressConfirmBody': {
    playful: 'Lecons, parcours, orbs et series seront effaces. Tu restes connecte avec tes reglages.',
    focus: 'Efface lecons, parcours, orbs et series. Compte et preferences conserves.',
  },
  'profile.resetProgressConfirmAction': {
    playful: 'Reinitialiser',
    focus: 'Reinitialiser',
  },
  'profile.deleteAccountConfirmTitle': {
    playful: 'Tout supprimer ?',
    focus: 'Supprimer les donnees du compte ?',
  },
  'profile.deleteAccountConfirmBodyGuest': {
    playful: 'Progression, nom, cles et reglages partis — puis retour a l onboarding.',
    focus: 'Supprime progression et profil locaux, puis ouvre l onboarding.',
  },
  'profile.deleteAccountConfirmBodySignedIn': {
    playful: 'Progression (y compris cloud), deconnexion, puis onboarding.',
    focus: 'Supprime les donnees d apprentissage (local + cloud), deconnecte et ouvre l onboarding.',
  },
  'profile.deleteAccountConfirmAction': {
    playful: 'Supprimer et recommencer',
    focus: 'Supprimer et recommencer',
  },
  'profile.deleteAccountFootnoteGuest': {
    playful: 'Effacement complet — tu reverras les ecrans d accueil.',
    focus: 'Effacement local complet : retour a l onboarding.',
  },
  'profile.deleteAccountFootnoteSignedIn': {
    playful: 'Progression cloud retiree et deconnexion. Suppression e-mail auth via support si besoin.',
    focus: 'Retire la progression sync et termine la session. Identite auth parfois seulement via support.',
  },
  'profile.guestAccountDescription': {
    playful: 'Tu utilises StructAI sans compte. La progression reste sur cet appareil — connecte-toi pour synchroniser.',
    focus: 'Mode invite. Progression locale sur cet appareil ; connexion pour sync entre appareils.',
  },
  'guest.saveProgressHint': {
    playful: 'Ta progression est seulement sur cet appareil. Un compte permet de synchroniser et de la sauvegarder.',
    focus: 'Progression stockee localement. Connexion pour sync entre appareils.',
  },
  'guest.saveProgressCta': {
    playful: 'Sauvegarder la progression – se connecter',
    focus: 'Sauvegarder la progression – se connecter',
  },
  'auth.headline': {
    playful: 'Bienvenue sur StructAI',
    focus: 'Connexion a StructAI',
  },
  'auth.subheadline': {
    playful: 'Connecte-toi pour que ta progression puisse etre sauvegardee plus tard.',
    focus: 'Connectez-vous pour securiser votre progression.',
  },
  'auth.signInTab': {
    playful: 'Connexion',
    focus: 'Connexion',
  },
  'auth.signUpTab': {
    playful: 'Inscription',
    focus: 'Inscription',
  },
  'auth.emailPlaceholder': {
    playful: 'Adresse e-mail',
    focus: 'E-mail',
  },
  'auth.passwordPlaceholder': {
    playful: 'Mot de passe (min. 6 caracteres)',
    focus: 'Mot de passe (min. 6 car.)',
  },
  'auth.signInCta': {
    playful: 'Se connecter',
    focus: 'Connexion',
  },
  'auth.signInLoading': {
    playful: 'Connexion…',
    focus: 'Connexion…',
  },
  'auth.signUpCta': {
    playful: 'Creer un compte',
    focus: 'Inscription',
  },
  'auth.signUpLoading': {
    playful: 'Inscription…',
    focus: 'Inscription…',
  },
  'auth.signUpHint': {
    playful: 'Apres inscription, verifie ta boite mail si une confirmation est requise.',
    focus: 'Verifiez votre boite mail si une confirmation est requise.',
  },
  'auth.signUpConfirmEmail': {
    playful: 'Compte cree ! Confirme ton e-mail, puis connecte-toi.',
    focus: 'Inscription reussie. Confirmer e-mail, puis connexion.',
  },
  'auth.dividerOr': {
    playful: 'ou',
    focus: 'ou',
  },
  'auth.googleCta': {
    playful: 'Continuer avec Google',
    focus: 'Se connecter avec Google',
  },
  'auth.googleLoading': {
    playful: 'Connexion Google…',
    focus: 'Google…',
  },
  'auth.errorGeneric': {
    playful: 'Une erreur est survenue. Reessaie.',
    focus: 'Echec de connexion. Reessayez.',
  },
  'auth.errorInvalidCredentials': {
    playful: 'E-mail ou mot de passe incorrect.',
    focus: 'Identifiants invalides.',
  },
  'auth.errorEmailNotConfirmed': {
    playful: 'Confirme d abord ton adresse e-mail.',
    focus: 'Adresse e-mail non confirmee.',
  },
  'auth.errorUserExists': {
    playful: 'Un compte existe deja pour cet e-mail.',
    focus: 'Compte deja existant.',
  },
  'auth.errorWeakPassword': {
    playful: 'Le mot de passe ne respecte pas les exigences.',
    focus: 'Exigences de mot de passe non respectees.',
  },
  'auth.errorNotConfigured': {
    playful: 'Supabase n est pas encore configure.',
    focus: 'Configuration Supabase manquante.',
  },
  'auth.errorOAuthCancelled': {
    playful: 'Connexion Google annulee.',
    focus: 'Connexion Google annulee.',
  },
  'auth.errorOAuthFailed': {
    playful: 'Connexion Google impossible. Verifie la redirect URL dans Supabase.',
    focus: 'Echec Google. Verifier redirect URL Supabase.',
  },
  'auth.configMissingTitle': {
    playful: 'Backend pas encore connecte',
    focus: 'Backend non configure',
  },
  'auth.configMissingBody': {
    playful: 'Definis EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY dans ton .env.',
    focus: 'Definir EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY dans .env.',
  },
  'onboarding.welcomeHeadline': {
    playful: 'Ecris de meilleurs prompts. Juge les reponses IA.',
    focus: 'Ecris de meilleurs prompts. Juge les reponses IA.',
  },
  'onboarding.welcomeSub': {
    playful:
      'StructAI t apprend a ecrire de meilleurs prompts et a juger les reponses IA grace a de courtes lecons, un scoring en direct et un Prompt Lab BYOK.',
    focus:
      'StructAI t apprend a ecrire de meilleurs prompts et a juger les reponses IA grace a de courtes lecons, un scoring en direct et un Prompt Lab BYOK.',
  },
  'onboarding.welcomeCta': {
    playful: "C'est parti !",
    focus: "C'est parti",
  },
  'onboarding.skip': {
    playful: 'Passer',
    focus: 'Passer',
  },
  'onboarding.introNext': {
    playful: 'Continuer',
    focus: 'Continuer',
  },
  'onboarding.introSignIn': {
    playful: 'Se connecter',
    focus: 'Se connecter',
  },
  'onboarding.introSlide1Value': {
    playful: 'Ecris de meilleurs prompts — et vois le score monter.',
    focus: 'Ecris de meilleurs prompts. Rends la structure mesurable.',
  },
  'onboarding.introSlide2Value': {
    playful: 'Monte de niveau avec de courtes lecons et des Orbs.',
    focus: 'Courtes lecons, Orbs, progression claire.',
  },
  'onboarding.introSlide3Value': {
    playful: 'Ton coach Orb reste local a tes cotes.',
    focus: 'Coach Orb local avec des conseils — sans voiceover.',
  },
  'onboarding.introVisual.scoreLabel': {
    playful: 'Score prompt',
    focus: 'Score prompt',
  },
  'onboarding.introVisual.scoreChip1': {
    playful: 'Structure',
    focus: 'Structure',
  },
  'onboarding.introVisual.scoreChip2': {
    playful: 'Objectif',
    focus: 'Objectif',
  },
  'onboarding.introVisual.scoreChip3': {
    playful: 'Format',
    focus: 'Format',
  },
  'onboarding.introVisual.pathTitle': {
    playful: 'Ton parcours',
    focus: 'Parcours',
  },
  'onboarding.introVisual.pathOrbs': {
    playful: '+ Debloquer des Orbs',
    focus: 'Debloquer des Orbs',
  },
  'onboarding.introVisual.coachBubble': {
    playful: 'Petit conseil — je reste avec toi.',
    focus: 'Conseil coach court a tes cotes.',
  },
  'onboarding.introVisual.coachCaption': {
    playful: 'Orb · coach local',
    focus: 'Orb · coach local',
  },
  'onboarding.meetCta': {
    playful: 'Ca marche !',
    focus: 'Continuer',
  },
  'onboarding.meetReadyCta': {
    playful: "C'est parti !",
    focus: 'Continuer',
  },
  'onboarding.modeQuestion': {
    playful: 'Comment veux-tu apprendre ?',
    focus: 'Comment veux-tu apprendre ?',
  },
  'onboarding.modeHint': {
    playful: 'Les deux modes montrent le meme contenu - tu peux changer dans les reglages a tout moment.',
    focus: 'Contenu et fonctions identiques. Modifiable a tout moment dans les reglages.',
  },
  'onboarding.modeCta': {
    playful: 'Continuer',
    focus: 'Continuer',
  },
  'onboarding.loopTitle': {
    playful: 'Comment StructAI fonctionne',
    focus: 'La boucle d\'apprentissage en trois étapes',
  },
  'onboarding.loopStep1': {
    playful: 'Choisis un parcours avec une structure de chapitres claire.',
    focus: 'Choisir un parcours : définir le thème et l\'ordre des chapitres.',
  },
  'onboarding.loopStep2': {
    playful: 'Avance dans les leçons avec de courtes exercices, étape par étape.',
    focus: 'Terminer une leçon : traiter des exercices courts en séquence.',
  },
  'onboarding.loopStep3': {
    playful: 'Gagne des Orbs et débloque le chapitre suivant.',
    focus: 'Gagner des Orbs et débloquer le chapitre suivant.',
  },
  'onboarding.loopCta': {
    playful: 'Commencer la premiere lecon !',
    focus: 'Commencer la premiere lecon',
  },
  'onboarding.loopHomeCta': {
    playful: 'Voir l\'apercu d\'abord',
    focus: 'Aller a l\'accueil',
  },
  'onboarding.profileTitle': {
    playful: 'Presque fini — qui es-tu ?',
    focus: 'Completer le profil',
  },
  'onboarding.profileSubtitle': {
    playful: 'Tu as termine ta premiere lecon ! Dis-nous comment tu t\'appelles pour personnaliser StructAI.',
    focus: 'Premiere lecon terminee. Indiquez votre nom et votre age pour recommander un mode d\'apprentissage.',
  },
  'onboarding.profileNameLabel': {
    playful: 'Ton prenom',
    focus: 'Nom affiche',
  },
  'onboarding.profileNamePlaceholder': {
    playful: 'Comment doit-on t\'appeler ?',
    focus: 'Saisir le nom affiche',
  },
  'onboarding.profileAgeLabel': {
    playful: 'Ton age',
    focus: 'Age',
  },
  'onboarding.profileAgePlaceholder': {
    playful: 'ex. 14',
    focus: 'Age en annees',
  },
  'onboarding.profileAgeDisclaimer': {
    playful: 'Ton age sert uniquement a recommander un mode — pas a rendre les exercices plus faciles ou difficiles.',
    focus: 'L\'age sert uniquement a la recommandation de mode, pas a manipuler la difficulte du gameplay.',
  },
  'onboarding.profileAgeInvalid': {
    playful: 'Entre un age entre 1 et 120.',
    focus: 'Veuillez saisir un age valide entre 1 et 120.',
  },
  'onboarding.profileAuthSection': {
    playful: 'Sauvegarder ta progression',
    focus: 'Lier un compte',
  },
  'onboarding.profileAuthHint': {
    playful: 'Optionnel : connecte-toi pour garder ta progression. Tu reviendras ici ensuite.',
    focus: 'Optionnel : connexion Google ou e-mail. Vous reviendrez a cette etape apres authentification.',
  },
  'onboarding.profileModeSection': {
    playful: 'Choisis ton mode',
    focus: 'Choisir le mode d\'apprentissage',
  },
  'onboarding.profileModeHintRecommended': {
    playful: 'Pour ton age, Playful est recommande — exercices plus simples et comprehension plus facile. Focus reste disponible.',
    focus: 'Pour cet age, Playful est recommande : exercices plus simples et comprehension plus facile. Focus reste selectable.',
  },
  'onboarding.profileModeHintNeutral': {
    playful: 'Les deux modes sont equivalents — choisis celui qui te convient.',
    focus: 'Les deux modes sont disponibles sans preference.',
  },
  'onboarding.profileModeHintCarried': {
    playful: 'Ton choix precedant est preselectionne — ajuste-le ici si besoin.',
    focus: 'Votre choix precedent est preselectionne et peut etre ajuste ici.',
  },
  'onboarding.profilePlayfulBadge': {
    playful: 'Recommande',
    focus: 'Recommande',
  },
  'onboarding.profilePlayfulRecommendCopy': {
    playful: 'Exercices plus simples, comprehension plus facile',
    focus: 'Exercices plus simples, comprehension plus facile',
  },
  'onboarding.profileCta': {
    playful: 'C\'est parti !',
    focus: 'Enregistrer le profil et commencer',
  },
  'onboarding.profileSaving': {
    playful: 'Enregistrement…',
    focus: 'Enregistrement…',
  },
  'onboarding.profileSaveError': {
    playful: 'Enregistrement impossible — reessaie.',
    focus: 'Le profil n\'a pas pu etre enregistre. Veuillez reessayer.',
  },
  'onboarding.previewPathTitle': {
    playful: 'Bases du prompt',
    focus: 'Bases du prompt',
  },
  'statBlock.completedLessons': {
    playful: 'Lecons terminees',
    focus: 'Lecons terminees',
  },
  'statBlock.currentStreak': {
    playful: 'Serie actuelle',
    focus: 'Serie (jours)',
  },
  'streakTracker.title': {
    playful: 'Ta semaine',
    focus: 'Progression hebdomadaire',
  },
  'streakTracker.weekdayMon': {
    playful: 'Lun',
    focus: 'Lun',
  },
  'streakTracker.weekdayTue': {
    playful: 'Mar',
    focus: 'Mar',
  },
  'streakTracker.weekdayWed': {
    playful: 'Mer',
    focus: 'Mer',
  },
  'streakTracker.weekdayThu': {
    playful: 'Jeu',
    focus: 'Jeu',
  },
  'streakTracker.weekdayFri': {
    playful: 'Ven',
    focus: 'Ven',
  },
  'streakTracker.weekdaySat': {
    playful: 'Sam',
    focus: 'Sam',
  },
  'streakTracker.weekdaySun': {
    playful: 'Dim',
    focus: 'Dim',
  },
  'celebration.lessonComplete': {
    playful: 'Lecon terminee !',
    focus: 'Lecon terminee.',
  },
  'celebration.orbGain': {
    playful: '+{{count}} Orbs pour toi !',
    focus: '+{{count}} Orbs',
  },
  'celebration.streakMilestone': {
    playful: 'Semaine complete - ta serie continue !',
    focus: 'Jalon de 7 jours atteint.',
  },
  'celebration.pathComplete': {
    playful: 'Parcours termine : {{path}} !',
    focus: 'Parcours d\'apprentissage termine : {{path}}.',
  },
  'celebration.capstoneComplete': {
    playful: 'Projet final reussi !',
    focus: 'Projet final valide.',
  },
  'celebration.sectionMilestone': {
    playful: 'Chapitre termine !',
    focus: 'Jalon atteint.',
  },
  'capstoneIncomplete.title': {
    playful: 'Parcours presque fini — pas encore complet',
    focus: 'Parcours termine — pas encore complet',
  },
  'capstoneIncomplete.subtitle': {
    playful:
      'Projet final reussi. Il reste {{missing}} lecons sur {{total}} pour debloquer le parcours suivant.',
    focus:
      'Projet final valide. Il reste {{missing}} lecons sur {{total}} pour debloquer le parcours suivant.',
  },
  'capstoneIncomplete.statCompleted': {
    playful: 'Reussies',
    focus: 'Terminees',
  },
  'capstoneIncomplete.statSkipped': {
    playful: 'Passees',
    focus: 'Passees/manquantes',
  },
  'capstoneIncomplete.lockHint': {
    playful: 'Le parcours suivant reste verrouille tant que toutes les lecons ne sont pas reussies.',
    focus: 'Le parcours suivant reste verrouille tant que toutes les lecons ne sont pas reussies.',
  },
  'capstoneIncomplete.openMissingCta': {
    playful: 'Voir les lecons ouvertes',
    focus: 'Voir les lecons ouvertes',
  },
  'capstoneIncomplete.backToPath': {
    playful: 'Retour au parcours',
    focus: 'Retour au parcours',
  },
  'sectionMilestone.title': {
    playful: 'Chapitre termine !',
    focus: 'Projet final reussi',
  },
  'sectionMilestone.subtitle': {
    playful: 'Bien joue — continue avec la section suivante.',
    focus: 'Tu as atteint un jalon important.',
  },
  'sectionMilestone.continueCta': {
    playful: 'Chapitre suivant',
    focus: 'Continuer',
  },
  'sectionMilestone.backToPath': {
    playful: 'Retour au parcours',
    focus: 'Retour au parcours',
  },
  'pathPreview.lockedHint': {
    playful: 'Toujours verrouille — reussis d\'abord toutes les lecons de ce parcours.',
    focus: 'Toujours verrouille — reussis d\'abord toutes les lecons de ce parcours.',
  },
  'pathCompletion.titleFull': {
    playful: 'Parcours entierement termine !',
    focus: 'Parcours entierement termine',
  },
  'pathCompletion.subtitleFull': {
    playful:
      'Les {{total}} chapitres de « {{path}} » sont reussis. Ton certificat est pret et le parcours suivant est debloque.',
    focus:
      'Toutes les lecons reussies. Ton certificat est pret et le parcours suivant est debloque.',
  },
  'pathCompletion.statCompleted': {
    playful: 'Chapitres reussis',
    focus: 'Lecons reussies',
  },
  'pathCompletion.statCertificate': {
    playful: 'Certificat',
    focus: 'Certificat disponible',
  },
  'pathCompletion.startNextPathCta': {
    playful: 'Continuer vers {{path}}',
    focus: 'Demarrer le parcours suivant : {{path}}',
  },
  'pathCompletion.title': {
    playful: 'Parcours complete !',
    focus: 'Parcours d\'apprentissage termine',
  },
  'pathCompletion.subtitle': {
    playful: 'Tu as reussi les {{total}} chapitres de « {{path}} ».',
    focus: 'Les {{total}} chapitres de « {{path}} » ont ete termines avec succes.',
  },
  'pathCompletion.certificateHint': {
    playful: 'Ton certificat sera bientot disponible ici.',
    focus: 'L\'export du certificat sera ajoute ici prochainement (G2).',
  },
  'pathCompletion.backToPaths': {
    playful: 'Retour aux parcours',
    focus: 'Retour a la vue d\'ensemble',
  },
  'certificate.badge': {
    playful: 'Certificat de competence prompt',
    focus: 'Certificat de competence',
  },
  'certificate.awardedTo': {
    playful: 'Obtenu par',
    focus: 'Titulaire',
  },
  'certificate.completedOn': {
    playful: 'Termine le',
    focus: 'Date de fin',
  },
  'certificate.brandTagline': {
    playful: 'Meilleurs prompts. Jugement IA plus net.',
    focus: 'Competence prompt · Parcours verifie',
  },
  'certificate.skillLabel': {
    playful: 'Competence debloquee',
    focus: 'Competence demontree',
  },
  'certificate.skill.prompt_basics': {
    playful: 'Ecrire des prompts clairs, structures et orientes objectif.',
    focus: 'Structure de prompt claire et orientee objectif',
  },
  'certificate.skill.structure_lab': {
    playful: 'Construire des prompts avec role, contraintes et format.',
    focus: 'Controle role, contraintes et format de sortie',
  },
  'certificate.skill.context_mastery': {
    playful: 'Donner le bon contexte a l IA sans la noyer.',
    focus: 'Selection de contexte et ancrage',
  },
  'certificate.skill.iteration_loops': {
    playful: 'Iterer les prompts jusqu a ce que la sortie tienne.',
    focus: 'Iteration et affinage de prompts',
  },
  'certificate.skill.eval_scoring': {
    playful: 'Juger les reponses IA — et detecter les faibles.',
    focus: 'Evaluation et critique de sorties',
  },
  'certificate.skill.prompt_mastery': {
    playful: 'Designer des prompts avances sous vraies contraintes.',
    focus: 'Design avance de prompts sous contraintes',
  },
  'certificate.skill.generic': {
    playful: 'Parcours StructAI de prompting termine.',
    focus: 'Parcours StructAI de prompting termine',
  },
  'certificate.evidence': {
    playful: '{{completed}} / {{total}} chapitres termines',
    focus: '{{completed}} sur {{total}} chapitres termines',
  },
  'certificate.credentialLabel': {
    playful: 'ID credential',
    focus: 'ID credential',
  },
  'certificate.share': {
    playful: 'Partager ta competence',
    focus: 'Exporter le certificat',
  },
  'certificate.sharing': {
    playful: 'Preparation…',
    focus: 'Export en cours…',
  },
  'certificate.shareDialogTitle': {
    playful: '{{name}} sait maintenant : {{skill}}',
    focus: '{{name}} — {{skill}}',
  },
  'pathCompletion.identityLine': {
    playful: 'A partager : {{skill}}',
    focus: 'Credential : {{skill}}',
  },
  'certificate.shareUnavailable': {
    playful: 'Le partage n\'est pas disponible sur cet appareil.',
    focus: 'Export du certificat indisponible sur cet appareil.',
  },
  'certificate.download': {
    playful: 'Telecharger le certificat',
    focus: 'Enregistrer en image',
  },
  'certificate.shareWebUnavailable': {
    playful:
      'Le telechargement a echoue. Le partage natif est disponible dans l\'app StructAI sur mobile — dans le navigateur, utilise « Telecharger le certificat ».',
    focus:
      'Echec du telechargement. Partage natif dans l\'app iOS/Android ; le navigateur doit enregistrer un PNG.',
  },
  'profile.certificatesSection': {
    playful: 'Tes certificats',
    focus: 'Certificats de fin',
  },
  'profile.certificatesDescription': {
    playful: 'Vois tes skill wins ici. Export et partage sont Pro.',
    focus: 'Parcours termines — apercu gratuit ; export Pro.',
  },
  'pro.planSection': {
    playful: 'Ton plan',
    focus: 'Plan',
  },
  'pro.planEyebrow': {
    playful: 'Acces',
    focus: 'Acces',
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
      'Free : toutes les lecons + coach Lab local. Pro : notes IA live et export certificats a partir de {{monthly}}/mois ou {{yearly}}/an.',
    focus:
      'Free : lecons + Lab local. Pro : notes IA live + export certificats — a partir de {{monthly}}/mois ou {{yearly}}/an.',
  },
  'pro.planBodyPro': {
    playful: 'Pro est actif sur cet appareil : notes Lab live et export de certificats debloques.',
    focus: 'Pro actif. Notes Lab live et export certificats debloques sur cet appareil.',
  },
  'pro.previewUnlockCta': {
    playful: 'Essayer l apercu Pro',
    focus: 'Activer l apercu Pro',
  },
  'pro.previewLockCta': {
    playful: 'Revenir a Free',
    focus: 'Revenir a Free',
  },
  'pro.gateTitle': {
    playful: 'Fonction Pro',
    focus: 'Pro',
  },
  'pro.gateCertificateBody': {
    playful: 'L export de certificat est Pro — vois les prix sur l ecran Pro.',
    focus: 'Export certificat = Pro. Ouvre la paywall pour les prix.',
  },
    'pro.gateLabBody': {
    playful:
      'Ta clé API seule n’est pas Pro. Les notes IA live sont Pro — le coach local reste gratuit.',
    focus:
      'Une clé API n’est pas Pro. Les notes live sont Pro ; le coach local reste gratuit. Ouvre Pro pour les prix prévus.',
  },
  'pro.certificateCta': {
    playful: 'Exporter avec Pro',
    focus: 'Exporter (Pro)',
  },
  'pro.openPlanCta': {
    playful: 'Voir les offres Pro',
    focus: 'Voir Pro',
  },
  'pro.openPaywallCta': {
    playful: 'Voir plans et prix Pro',
    focus: 'Voir les prix Pro',
  },
  'pro.paywall.brand': {
    playful: 'StructAI Pro',
    focus: 'StructAI Pro',
  },
  'pro.paywall.headline': {
    playful: 'Prouve ton skill. Note avec de vrais modeles.',
    focus: 'Notes live et preuve de skill partageable.',
  },
  'pro.paywall.sub': {
    playful:
      'Apprendre reste Free. Passe a Pro pour le scoring IA live dans le Prompt Lab et des certificats exportables.',
    focus:
      'Les lecons restent Free. Pro debloque les notes Lab live (ta cle) et l export de certificats apres un parcours.',
  },
  'pro.paywall.compareFeature': {
    playful: 'Ce que tu obtiens',
    focus: 'Inclus',
  },
  'pro.paywall.benefitLessons': {
    playful: 'Tous les parcours et la pratique quotidienne',
    focus: 'Tous les parcours et la pratique quotidienne',
  },
  'pro.paywall.benefitLabLocal': {
    playful: 'Coach Prompt Lab local',
    focus: 'Coach Prompt Lab local',
  },
  'pro.paywall.benefitLabLive': {
    playful: 'Notes IA live avec ta cle API',
    focus: 'Notes IA live (BYOK)',
  },
  'pro.paywall.benefitCertificates': {
    playful: 'Exporter et partager les certificats',
    focus: 'Export et partage de certificats',
  },
  'pro.paywall.included': {
    playful: 'Oui',
    focus: 'Oui',
  },
  'pro.paywall.excluded': {
    playful: '—',
    focus: '—',
  },
  'pro.paywall.periodMonthly': {
    playful: 'Mensuel',
    focus: 'Mensuel',
  },
  'pro.paywall.periodYearly': {
    playful: 'Annuel',
    focus: 'Annuel',
  },
  'pro.paywall.bestValue': {
    playful: 'Meilleur prix',
    focus: 'Meilleur prix',
  },
  'pro.paywall.monthlyHint': {
    playful: 'Resiliable a tout moment',
    focus: 'Facturation mensuelle',
  },
  'pro.paywall.yearlyHint': {
    playful: 'Environ {{monthly}}/mois',
    focus: '{{monthly}}/mois equivalent',
  },
    'pro.paywall.cta': {
    playful: 'Essayer Pro sur cet appareil (aperçu)',
    focus: 'Activer l’aperçu Pro sur cet appareil',
  },
  'pro.paywall.ctaBusy': {
    playful: 'Activation de l’aperçu…',
    focus: 'Activation de l’aperçu…',
  },
  'pro.paywall.billingFootnote': {
    playful:
      'Les prix ci-dessus sont prévus. La facturation App Store / Play n’est pas encore live (Block H). Ce bouton active seulement un aperçu Pro local — tu ne seras pas facturé.',
    focus:
      'Les prix sont prévus, pas encore facturés (Block H). Le CTA active seulement un aperçu Pro local — pas de paiement store.',
  },
  'pro.paywall.dismiss': {
    playful: 'Pas maintenant',
    focus: 'Pas maintenant',
  },
};
