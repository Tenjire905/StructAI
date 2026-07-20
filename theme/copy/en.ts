import type { CopyCatalog } from './types';

export const copyEn: CopyCatalog = {
  'tabs.home': {
    playful: 'Home',
    focus: 'Home',
  },
  'tabs.paths': {
    playful: 'Learning Paths',
    focus: 'Paths',
  },
  'tabs.promptLab': {
    playful: 'Prompt Lab',
    focus: 'Lab',
  },
  'tabs.profile': {
    playful: 'Profile',
    focus: 'Profile',
  },
  'home.greeting': {
    playful: 'Welcome back, {{name}}!',
    focus: 'Good day, {{name}}.',
  },
  'skillRank.eyebrow': {
    playful: 'Your rank',
    focus: 'Skill rank',
  },
  'skillRank.level': {
    playful: 'Lv {{level}}',
    focus: 'Level {{level}}',
  },
  'skillRank.xpProgress': {
    playful: '{{current}} / {{next}} XP to next level',
    focus: '{{current}} / {{next}} XP',
  },
  'skillRank.totalXp': {
    playful: '{{xp}} XP earned overall — from lessons and Orbs.',
    focus: 'Total XP: {{xp}} (lessons + Orbs).',
  },
  'skillRank.lessonXpGain': {
    playful: '+{{xp}} XP toward your rank',
    focus: '+{{xp}} XP',
  },
  'skillRank.rank.spark': {
    playful: 'Spark',
    focus: 'Novice',
  },
  'skillRank.rank.builder': {
    playful: 'Builder',
    focus: 'Apprentice',
  },
  'skillRank.rank.craftsman': {
    playful: 'Craftsman',
    focus: 'Practitioner',
  },
  'skillRank.rank.specialist': {
    playful: 'Specialist',
    focus: 'Specialist',
  },
  'skillRank.rank.architect': {
    playful: 'Prompt Architect',
    focus: 'Architect',
  },
  'home.continueLearning': {
    playful: 'Keep learning',
    focus: 'Current learning paths',
  },
  'home.dailyChallenge.eyebrow': {
    playful: 'Today’s job',
    focus: 'Daily challenge',
  },
  'home.dailyChallenge.title': {
    playful: 'One clear win today',
    focus: 'One focused practice session',
  },
  'home.dailyChallenge.bodyFresh': {
    playful: 'Start with {{path}} — one short lesson, real practice, instant feedback.',
    focus: 'Begin {{path}}: one lesson, one practice loop, clear feedback.',
  },
  'home.dailyChallenge.bodyContinue': {
    playful: 'Continue {{path}} — one lesson, one practice prompt, done.',
    focus: 'Next step in {{path}}: one lesson with a clear checkpoint.',
  },
  'home.dailyChallenge.ctaFresh': {
    playful: 'Start today’s lesson',
    focus: 'Start today’s lesson',
  },
  'home.dailyChallenge.ctaContinue': {
    playful: 'Do today’s lesson',
    focus: 'Continue today’s lesson',
  },
  'home.startHint': {
    playful: 'Start with Prompt Basics — your first step toward structured prompting.',
    focus: 'Start with Prompt Basics — your first step toward structured prompting.',
  },
  'home.startCta': {
    playful: 'Let\'s go!',
    focus: 'Open first path',
  },
  'home.labPracticeHint': {
    playful: 'Turn today’s skill into a real prompt — score it in Prompt Lab.',
    focus: 'Practice the skill you just named in Prompt Lab.',
  },
  'home.labPracticeCta': {
    playful: 'Open Prompt Lab',
    focus: 'Practice in Prompt Lab',
  },
  'home.retryFailedCta': {
    playful: 'Retry first open lesson',
    focus: 'Go to first failed lesson',
  },
  'home.retryFailedNone': {
    playful: 'All lessons done — no retry needed',
    focus: 'All lessons completed — no retry required',
  },
  'home.retryFailedNoOpen': {
    playful: 'No missed lessons — keep going!',
    focus: 'No open failures — continue as usual',
  },
  'home.activityInsights.title': {
    playful: 'Your activity',
    focus: 'Activity overview',
  },
  'home.activityInsights.expandHint': {
    playful: 'Tap to see your orb trend as a chart',
    focus: 'Tap to open the orb activity chart',
  },
  'home.activityInsights.collapseHint': {
    playful: 'Tap to return to the weekly summary',
    focus: 'Tap to return to the weekly summary',
  },
  'home.activityInsights.chartTitle': {
    playful: 'Orb journal',
    focus: 'Daily orb activity',
  },
  'home.activityInsights.period': {
    playful: 'Last {{days}} days',
    focus: 'Period: {{days}} days',
  },
  'home.activityInsights.productivityValue': {
    playful: '{{percent}}%',
    focus: '{{percent}}%',
  },
  'home.activityInsights.productivityWithGoal': {
    playful: 'Productivity vs your {{goal}}-orb daily goal',
    focus: 'Productivity relative to daily goal ({{goal}} orbs)',
  },
  'home.activityInsights.productivityNoGoal': {
    playful: 'Active days — set a daily goal via the orbs above',
    focus: 'Active learning days — set daily goal via orb counter',
  },
  'home.activityInsights.orbPeekA11y': {
    playful: '{{count}} orbs on this day',
    focus: '{{count}} orbs on this day',
  },
  'orbCounter.label': {
    playful: 'Energy Orbs',
    focus: 'Orbs',
  },
  'orbCounter.dailyProgress': {
    playful: 'Today {{current}}/{{goal}} orbs',
    focus: 'Today {{current}}/{{goal}}',
  },
  'orbCounter.openDailyGoalHint': {
    playful: 'Tap to adjust your daily goal',
    focus: 'Edit daily goal',
  },
  'dailyGoal.title': {
    playful: 'How many orbs do you want today?',
    focus: 'Set your daily goal',
  },
  'dailyGoal.subtitle': {
    playful:
      'You earn orbs for every completed lesson. Choose how much you want to learn today — match your pace to your day.',
    focus:
      'Orbs are awarded per completed lesson. Set how many orbs you want to reach today and how much time you want to invest.',
  },
  'dailyGoal.explanationTitle': {
    playful: 'Orbs = learning progress',
    focus: 'Orbs as learning progress',
  },
  'dailyGoal.explanationBody': {
    playful:
      'Every lesson earns orbs. More orbs mean more practice — but you set the pace. A low daily goal is perfectly fine.',
    focus:
      'Each completed lesson awards orbs. Your daily goal controls learning pace and time investment — separate from overall progress.',
  },
  'dailyGoal.targetLabel': {
    playful: 'Your daily goal',
    focus: 'Daily goal in orbs',
  },
  'dailyGoal.presetOrbs': {
    playful: '{{count}} orbs',
    focus: '{{count}}',
  },
  'dailyGoal.notificationsTitle': {
    playful: 'Evening reminder',
    focus: 'Learning reminder',
  },
  'dailyGoal.notificationsBody': {
    playful:
      'We can remind you in the evening if you have not reached your daily goal yet — only if you allow it.',
    focus:
      'Optional evening notification when your daily goal has not been reached yet.',
  },
  'dailyGoal.notificationsExpoGoHint': {
    playful:
      'Reminders are not available in Expo Go. You can enable them later in a development build.',
    focus:
      'Notifications are not available in Expo Go. They can be enabled in a development build.',
  },
  'dailyGoal.cta': {
    playful: 'Save daily goal',
    focus: 'Save daily goal',
  },
  'dailyGoal.saving': {
    playful: 'Saving…',
    focus: 'Saving…',
  },
  'dailyGoal.notificationTitle': {
    playful: 'StructAI',
    focus: 'StructAI',
  },
  'dailyGoal.notificationBody': {
    playful: '{{remaining}} orbs left for today’s goal — a short lesson still counts.',
    focus: '{{remaining}} orbs remaining on today’s goal.',
  },
  'dailyGoal.notificationBodySkill': {
    playful:
      'Come back and reuse “{{skill}}” — {{remaining}} orbs left for today’s goal.',
    focus: 'Return to practice “{{skill}}”. {{remaining}} orbs left on today’s goal.',
  },
  'pathCard.chapters': {
    playful: 'Chapter {{current}} of {{total}}',
    focus: 'Ch. {{current}}/{{total}}',
  },
  'pathCard.chaptersTotal': {
    playful: '{{total}} chapters are waiting for you',
    focus: '{{total}} chapters',
  },
  'paths.badgeNew': {
    playful: 'New',
    focus: 'New',
  },
  'paths.sectionActive': {
    playful: 'Your active paths',
    focus: 'In progress',
  },
  'paths.sectionAvailable': {
    playful: 'Discover more',
    focus: 'Available learning paths',
  },
  'paths.sectionLocked': {
    playful: 'Still locked',
    focus: 'Locked paths',
  },
  'paths.lockedBadge': {
    playful: 'Locked',
    focus: 'Locked',
  },
  'paths.lockedTitle': {
    playful: 'This path is still locked',
    focus: 'Path locked',
  },
  'paths.lockedBody': {
    playful: 'Finish "{{path}}" first — then you can continue here!',
    focus: 'Complete "{{path}}" first to unlock this learning path.',
  },
  'paths.lockedCta': {
    playful: 'Back to paths',
    focus: 'Back to paths',
  },
  'paths.title.prompt_basics': {
    playful: 'Prompt Basics',
    focus: 'Prompt Basics',
  },
  'paths.title.structure_lab': {
    playful: 'Structure Lab',
    focus: 'Structure Lab',
  },
  'paths.title.context_mastery': {
    playful: 'Context Mastery',
    focus: 'Context Mastery',
  },
  'paths.title.iteration_loops': {
    playful: 'Iteration Loops',
    focus: 'Iteration',
  },
  'paths.title.eval_scoring': {
    playful: 'Evaluation and Scoring',
    focus: 'Scoring System',
  },
  'paths.title.prompt_mastery': {
    playful: 'Prompt Mastery',
    focus: 'Prompt Mastery',
  },
  'paths.emptyActive': {
    playful: 'Ready for your first adventure? Pick a learning path and jump in!',
    focus: 'Choose a learning path to begin.',
  },
  'pathDetail.progressTitle': {
    playful: 'Your progress',
    focus: 'Progress',
  },
  'pathDetail.chapterListTitle': {
    playful: 'Your chapters',
    focus: 'Chapters',
  },
  'pathDetail.continueCta': {
    playful: "Let's keep going!",
    focus: 'Continue',
  },
  'pathDetail.startCta': {
    playful: 'Start now!',
    focus: 'Start',
  },
  'pathDetail.notFound': {
    playful: "We don't know this path yet.",
    focus: 'Learning path not found.',
  },
  'lesson.stepLabel': {
    playful: 'Step {{current}} of {{total}}',
    focus: '{{current}}/{{total}}',
  },
  'lesson.depthBadgePlayful': {
    playful: 'Shorter · Simpler',
    focus: 'Shorter · Simpler',
  },
  'lesson.depthBadgeFocus': {
    playful: 'Deeper · More questions',
    focus: 'Deeper · More questions',
  },
  'lesson.depthInfoTitle': {
    playful: 'Your learning mode',
    focus: 'Learning mode',
  },
  'lesson.depthInfoBodyPlayful': {
    playful:
      'Playful mode keeps lessons shorter and simpler — same learning goal, fewer steps and easier language.',
    focus:
      'Playful mode keeps lessons shorter and simpler — same learning goal, fewer steps and easier language.',
  },
  'lesson.depthInfoBodyFocus': {
    playful:
      'Focus mode adds depth: longer copy, more questions, and more challenging tasks.',
    focus:
      'Focus mode adds depth: longer copy, more questions, and more challenging tasks.',
  },
  'lesson.depthInfoAgeRecommended': {
    playful:
      'Under 15, Playful is strongly recommended — you can change the mode anytime in Profile.',
    focus:
      'Under 15, Playful is strongly recommended — set in Profile or during onboarding.',
  },
  'lesson.depthInfoSettingsHint': {
    playful: 'Your mode comes from Profile or onboarding — switch anytime there.',
    focus: 'Mode is set in Profile or onboarding and can be changed there anytime.',
  },
  'lesson.depthInfoAccessibilityHint': {
    playful: 'Tap for a short explanation of the learning mode.',
    focus: 'Tap for learning mode explanation.',
  },
  'lesson.glossaryTapHint': {
    playful: 'Tap for a short explanation of this term.',
    focus: 'Tap for a short explanation of this term.',
  },
  'lesson.typeChoice': {
    playful: 'Choice question',
    focus: 'Choice',
  },
  'lesson.typeFillBlank': {
    playful: 'Fill in the blank',
    focus: 'Fill blank',
  },
  'lesson.typeTrueFalse': {
    playful: 'True or false',
    focus: 'True/False',
  },
  'lesson.typeReorder': {
    playful: 'Order challenge',
    focus: 'Reorder',
  },
  'lesson.typeMatching': {
    playful: 'Match pairs',
    focus: 'Matching',
  },
  'lesson.typeErrorFinding': {
    playful: 'Find the error',
    focus: 'Error spot',
  },
  'lesson.typeCategorize': {
    playful: 'Categories',
    focus: 'Categorize',
  },
  'lesson.fillBlankInstruction': {
    playful: 'Fill the blank with the best fitting term.',
    focus: 'Fill in the blank correctly.',
  },
  'lesson.trueLabel': {
    playful: 'True',
    focus: 'True',
  },
  'lesson.falseLabel': {
    playful: 'False',
    focus: 'False',
  },
  'lesson.reorderHint': {
    playful: 'Put the steps into the right order.',
    focus: 'Arrange items in the correct order.',
  },
  'lesson.matchingInstruction': {
    playful: 'Tap a term on the left, then its definition on the right.',
    focus: 'Select a term, then match its definition.',
  },
  'lesson.errorFindingInstruction': {
    playful: 'Tap the word that causes the problem.',
    focus: 'Tap the problematic segment.',
  },
  'lesson.categorizeInstruction': {
    playful: 'Tap an item, then its category.',
    focus: 'Select an item, then assign a category.',
  },
  'lesson.categorizePoolLabel': {
    playful: 'Still open',
    focus: 'Open',
  },
  'lesson.perfectBonus': {
    playful: 'Perfect! Bonus Orbs unlocked.',
    focus: 'Perfect. Bonus granted.',
  },
  'orb.speech.readingStart.a': {
    playful: 'Okay — I’m with you. Read this bit.',
    focus: '',
  },
  'orb.speech.readingStart.b': {
    playful: 'New page! Let’s soak this in.',
    focus: '',
  },
  'orb.speech.readingStart.c': {
    playful: 'Eyes on this — it matters.',
    focus: '',
  },
  'orb.speech.reading.a': {
    playful: 'Hmm… notice the structure here.',
    focus: '',
  },
  'orb.speech.reading.b': {
    playful: 'Interesting. What’s the real job of this prompt?',
    focus: '',
  },
  'orb.speech.reading.c': {
    playful: 'Keep going — the clue is in the wording.',
    focus: '',
  },
  'orb.speech.practicing.a': {
    playful: 'Your move. Make the choice feel deliberate.',
    focus: '',
  },
  'orb.speech.practicing.b': {
    playful: 'Don’t rush — pick the sharpest option.',
    focus: '',
  },
  'orb.speech.practicing.c': {
    playful: 'I believe in a clean answer. Go.',
    focus: '',
  },
  'orb.speech.correct.a': {
    playful: 'Yes! That thinking tracks.',
    focus: '',
  },
  'orb.speech.correct.b': {
    playful: 'Nailed it — that’s the pattern.',
    focus: '',
  },
  'orb.speech.correct.c': {
    playful: 'Clean hit. Lock that in.',
    focus: '',
  },
  'orb.speech.wrong.a': {
    playful: 'Almost. Flip the angle once.',
    focus: '',
  },
  'orb.speech.wrong.b': {
    playful: 'Not quite — read the constraint again.',
    focus: '',
  },
  'orb.speech.wrong.c': {
    playful: 'Close! The trick was hiding in the details.',
    focus: '',
  },
  'orb.speech.celebrating.a': {
    playful: 'You did it! That lesson’s ours.',
    focus: '',
  },
  'orb.speech.celebrating.b': {
    playful: 'Boom — progress unlocked.',
    focus: '',
  },
  'orb.speech.celebrating.c': {
    playful: 'Proud of that run. Onward!',
    focus: '',
  },
  'orb.speech.lowEnergy.a': {
    playful: 'Hey — a few more Orbs and today’s goal smiles.',
    focus: '',
  },
  'orb.speech.lowEnergy.b': {
    playful: 'I’m a bit dim. One short lesson helps.',
    focus: '',
  },
  'orb.speech.lowEnergy.c': {
    playful: 'Fuel check: we could use a practice win.',
    focus: '',
  },
  'orb.speech.focus.correctTip.a': {
    playful: '',
    focus: 'Keep that pattern — name the job before you write.',
  },
  'orb.speech.focus.correctTip.b': {
    playful: '',
    focus: 'Good. On the next step, tighten one constraint.',
  },
  'orb.speech.focus.correctTip.c': {
    playful: '',
    focus: 'Solid. Reuse this structure on the next prompt.',
  },
  'orb.speech.focus.wrongTip.a': {
    playful: '',
    focus: 'Tip: separate role, task, and format before choosing.',
  },
  'orb.speech.focus.wrongTip.b': {
    playful: '',
    focus: 'Re-check the constraint that limited the answer.',
  },
  'orb.speech.focus.wrongTip.c': {
    playful: '',
    focus: 'Next try: ask what output shape was required.',
  },
  'orb.speech.focus.celebrating.a': {
    playful: '',
    focus: 'Lesson complete. Carry one clear rule forward.',
  },
  'orb.speech.focus.celebrating.b': {
    playful: '',
    focus: 'Done. Note the pattern that earned this pass.',
  },
  'orb.speech.focus.lowEnergy.a': {
    playful: '',
    focus: 'Daily goal is low — one focused lesson closes the gap.',
  },
  'orb.speech.focus.lowEnergy.b': {
    playful: '',
    focus: 'Progress tip: finish one short practice block today.',
  },
  'lesson.check': {
    playful: 'Check answer!',
    focus: 'Check',
  },
  'lesson.next': {
    playful: "Let's go!",
    focus: 'Next',
  },
  'lesson.correctFeedback': {
    playful: 'Nice! Your answer is on point.',
    focus: 'Correct.',
  },
  'lesson.wrongFeedback': {
    playful: 'Not quite — here’s how to fix it.',
    focus: 'Incorrect — review why, then the next pattern.',
  },
  'lesson.hintLabel': {
    playful: 'Hint:',
    focus: 'Hint:',
  },
  'lesson.coachingWhyLabel': {
    playful: 'Why this fails',
    focus: 'Why this fails',
  },
  'lesson.coachingNextLabel': {
    playful: 'What to do next',
    focus: 'Next pattern',
  },
  'lesson.coachingNextFromBeat': {
    playful: 'On the next try, apply {{term}} deliberately.',
    focus: 'Next: apply {{term}} consciously on the retry.',
  },
  'lesson.coachingNextFallback': {
    playful: 'Re-read the why, then pick the option that closes that gap.',
    focus: 'Re-read the failure reason, then choose the option that fixes it.',
  },
  'lesson.learningBeatLabel': {
    playful: 'Remember',
    focus: 'Key takeaway',
  },
  'lesson.completeTitle': {
    playful: 'Lesson complete!',
    focus: 'Lesson completed.',
  },
  'lesson.orbsEarned': {
    playful: '+{{count}} Orbs for you!',
    focus: '+{{count}} Orbs',
  },
  'lesson.practiceComplete': {
    playful: 'Practice complete — no extra Orbs.',
    focus: 'Repeated. No additional Orbs.',
  },
  'sessionSkill.eyebrow': {
    playful: 'You can do this now',
    focus: 'Skill gained',
  },
  'sessionSkill.generic.name': {
    playful: 'Clearer prompting',
    focus: 'Clearer prompting',
  },
  'sessionSkill.generic.proof': {
    playful: 'You practiced a concrete prompting pattern you can reuse on your next AI task.',
    focus: 'You practiced a reusable prompting pattern for your next AI task.',
  },
  'sessionSkill.comeBackTomorrow': {
    playful: 'Come back tomorrow and reuse this pattern on a real task — that is how it sticks.',
    focus: 'Return tomorrow and apply this pattern on a real task.',
  },
  'sessionSkill.pb-1.name': {
    playful: 'Spot what a prompt really is',
    focus: 'Define a prompt as a task brief',
  },
  'sessionSkill.pb-1.proof': {
    playful: 'You can tell a vague wish from a usable instruction — the first step to better AI answers.',
    focus: 'You can distinguish a vague wish from a usable instruction for an AI model.',
  },
  'sessionSkill.pb-2.name': {
    playful: 'Write clear instructions',
    focus: 'Write clear instructions',
  },
  'sessionSkill.pb-2.proof': {
    playful: 'You can replace fuzzy asks with direct instructions the model can follow.',
    focus: 'You can replace vague requests with direct, followable instructions.',
  },
  'sessionSkill.pb-3.name': {
    playful: 'Define the goal up front',
    focus: 'Define the goal up front',
  },
  'sessionSkill.pb-3.proof': {
    playful: 'You can name the outcome you want before you ask the model to work.',
    focus: 'You can state the desired outcome before sending the prompt.',
  },
  'sessionSkill.pb-4.name': {
    playful: 'Specify the output format',
    focus: 'Specify the output format',
  },
  'sessionSkill.pb-4.proof': {
    playful: 'You can ask for the shape of the answer (list, length, structure) instead of hoping.',
    focus: 'You can specify list/length/structure instead of hoping for a usable shape.',
  },
  'sessionSkill.pb-5.name': {
    playful: 'Steer with examples',
    focus: 'Steer with examples',
  },
  'sessionSkill.pb-5.proof': {
    playful: 'You can show the model what “good” looks like instead of only describing it.',
    focus: 'You can use examples so the model matches the pattern you want.',
  },
  'sessionSkill.pb-6.name': {
    playful: 'Use negative constraints well',
    focus: 'Apply negative constraints',
  },
  'sessionSkill.pb-6.proof': {
    playful: 'You can ban bad patterns without leaving the model guessing what to do instead.',
    focus: 'You can combine prohibitions with positive guidance so the model knows what to do.',
  },
  'sessionSkill.pb-7.name': {
    playful: 'Keep prompts as short as they can be',
    focus: 'Right-size prompt length',
  },
  'sessionSkill.pb-7.proof': {
    playful: 'You can cut filler and keep only context, task, and constraints that change the answer.',
    focus: 'You can trim filler so every line adds context, task, or constraint.',
  },
  'sessionSkill.pb-8.name': {
    playful: 'Assemble a full basics brief',
    focus: 'Assemble a full basics brief',
  },
  'sessionSkill.pb-8.proof': {
    playful: 'You can combine goal, format, examples, and bans into one compact brief.',
    focus: 'You can combine goal, format, examples, and constraints into one brief.',
  },
  'sessionSkill.pb-9.name': {
    playful: 'Replace vague words with precise ones',
    focus: 'Prefer precise wording',
  },
  'sessionSkill.pb-9.proof': {
    playful: 'You can swap “short” / “good” for measurable limits the model can hit.',
    focus: 'You can replace relative words with measurable limits.',
  },
  'sessionSkill.pb-10.name': {
    playful: 'Give the model one job at a time',
    focus: 'One task per prompt',
  },
  'sessionSkill.pb-10.proof': {
    playful: 'You can split multi-asks so each prompt has a single clear job.',
    focus: 'You can split multi-asks into one clear job per prompt.',
  },
  'sessionSkill.pb-11.name': {
    playful: 'Name who the answer is for',
    focus: 'Specify the audience',
  },
  'sessionSkill.pb-11.proof': {
    playful: 'You can name the reader so tone and depth match who will use the answer.',
    focus: 'You can name the audience so tone and depth match the reader.',
  },
  'sessionSkill.pb-12.name': {
    playful: 'Spot common beginner mistakes',
    focus: 'Spot common beginner mistakes',
  },
  'sessionSkill.pb-12.proof': {
    playful: 'You can catch missing goal, format, or constraints before you hit send.',
    focus: 'You can catch missing goal, format, or constraints before sending.',
  },
  'firstSessionProof.brand': {
    playful: 'Your first skill proof',
    focus: 'First skill proof',
  },
  'firstSessionProof.headline': {
    playful: 'Watch a vague prompt get better — then name what you learned.',
    focus: 'Critique, rewrite, compare — then name the skill.',
  },
  'firstSessionProof.sub': {
    playful: 'No API key needed. Local coach shows quality → critique → rewrite in under a minute.',
    focus: 'Local coach only. Quality, critique, rewrite — no BYOK required.',
  },
  'firstSessionProof.weakLabel': {
    playful: 'Vague prompt',
    focus: 'Vague prompt',
  },
  'firstSessionProof.improvedLabel': {
    playful: 'Rewritten prompt',
    focus: 'Rewritten prompt',
  },
  'firstSessionProof.scoreLabel': {
    playful: 'Coach score: {{score}}/100',
    focus: 'Score: {{score}}/100',
  },
  'firstSessionProof.critiqueBody': {
    playful: 'Too vague: no role, no audience, no format, no length. The model has to guess.',
    focus: 'Missing role, audience, format, and length — the model must guess.',
  },
  'firstSessionProof.compareTitle': {
    playful: '{{before}} → {{after}} (+{{delta}})',
    focus: '{{before}} → {{after}} (+{{delta}})',
  },
  'firstSessionProof.skillName': {
    playful: 'Turn a vague ask into a usable brief',
    focus: 'Turn a vague ask into a usable brief',
  },
  'firstSessionProof.skillProof': {
    playful: 'Ten minutes ago that was “write something.” Now you can see why structure, role, and constraints change the score.',
    focus: 'You can explain why role, context, and constraints raise prompt quality.',
  },
  'firstSessionProof.comeBackTomorrow': {
    playful: 'Tomorrow: reuse this rewrite pattern on one real task — that is your day-2 win.',
    focus: 'Tomorrow: apply this rewrite pattern on one real task.',
  },
  'firstSessionProof.ctaCritique': {
    playful: 'Critique it',
    focus: 'Show critique',
  },
  'firstSessionProof.ctaRewrite': {
    playful: 'Show a rewrite',
    focus: 'Show rewrite',
  },
  'firstSessionProof.ctaCompare': {
    playful: 'Compare scores',
    focus: 'Compare scores',
  },
  'firstSessionProof.ctaSummary': {
    playful: 'Name what I learned',
    focus: 'Show skill summary',
  },
  'firstSessionProof.ctaDone': {
    playful: 'Continue — set up my profile',
    focus: 'Continue to profile',
  },
  'promptLab.learnedEyebrow': {
    playful: 'You practiced',
    focus: 'Skill practiced',
  },
  'promptLab.learnedImproved': {
    playful: 'You improved this draft by +{{delta}} — that is a real skill gain, not just a number.',
    focus: 'Draft improved by +{{delta}}. Named gain: clearer structure and constraints.',
  },
  'promptLab.learnedNext': {
    playful: 'Next skill to lock in: {{skill}}',
    focus: 'Next skill focus: {{skill}}',
  },
  'promptLab.learnedComplete': {
    playful: 'You hit the core pillars — role, context, format, constraints.',
    focus: 'Core pillars present: role, context, format, constraints.',
  },

  'promptLab.dictationStart': {
    playful: 'Dictate prompt',
    focus: 'Dictate prompt',
  },
  'promptLab.dictationStop': {
    playful: 'Stop dictation',
    focus: 'Stop dictation',
  },
  'promptLab.dictationListening': {
    playful: 'Listening… speak your prompt',
    focus: 'Listening… speak your prompt',
  },
  'promptLab.dictationPermission': {
    playful: 'Microphone access is needed for dictation. Enable it in system settings.',
    focus: 'Microphone permission is required for dictation.',
  },
  'promptLab.dictationError': {
    playful: 'Dictation hiccuped — tap the mic and try again.',
    focus: 'Dictation failed. Tap the mic and try again.',
  },
  'promptLab.dictationUnavailable': {
    playful: 'Dictation needs the StructAI development build (not Expo Go).',
    focus: 'Dictation requires a StructAI development build — Expo Go has no speech module.',
  },
  'orb.speech.onboarding.welcome': {
    playful: 'Hey! I’m your Orb — let’s make prompting feel easy.',
    focus: 'I’m your Orb coach. We’ll practice clear prompts together.',
  },
  'orb.speech.onboarding.mode': {
    playful: 'Pick the vibe that fits you — I’ll match your pace.',
    focus: 'Choose Focus or Playful — same skills, different density.',
  },
  'orb.speech.onboarding.loop': {
    playful: 'Short loop: learn → practice → get better. Ready?',
    focus: 'Three beats: learn, practice, improve. Start when ready.',
  },
  'orb.speech.onboarding.proof': {
    playful: 'Watch this vague prompt level up — that’s the skill.',
    focus: 'Critique → rewrite → compare. That’s the proof.',
  },
  'orb.speech.onboarding.proofDone': {
    playful: 'Nice — you can spot a weak prompt and fix it now.',
    focus: 'You can turn a vague ask into a usable brief.',
  },
  'orb.speech.onboarding.dailyGoal': {
    playful: 'Set a tiny daily goal — I’ll nudge you tomorrow.',
    focus: 'Pick a daily orb goal so we keep the streak honest.',
  },
  'orb.speech.lessonComplete': {
    playful: 'Yes! That skill is yours — come back tomorrow and reuse it.',
    focus: 'Lesson cleared. Reuse this pattern on a real task tomorrow.',
  },
  'orb.speech.lessonRetry': {
    playful: 'Close! Let’s retry the weak spots — you’ve got this.',
    focus: 'Not quite yet. Retry the missed checks and lock the pattern.',
  },

  'lesson.backToPath': {
    playful: 'Back to path',
    focus: 'Back to path',
  },
  'lesson.continueNext': {
    playful: 'On to the next lesson!',
    focus: 'Next chapter',
  },
  'lesson.lockedTitle': {
    playful: 'This chapter is still locked',
    focus: 'Chapter locked',
  },
  'lesson.lockedBody': {
    playful: 'Finish the earlier chapters first, then you can continue here.',
    focus: 'Complete the previous chapters first.',
  },
  'lesson.notFound': {
    playful: "This lesson doesn't exist yet.",
    focus: 'Lesson not found.',
  },
  'lesson.retryTitle': {
    playful: 'Not quite there yet!',
    focus: 'Threshold not met.',
  },
  'lesson.retrySummary': {
    playful: '{{correct}} of {{total}} correct — try again!',
    focus: '{{correct}}/{{total}} correct. At least 60% required.',
  },
  'lesson.retryPrimary': {
    playful: 'Try again',
    focus: 'Retry lesson',
  },
  'lesson.retrySecondary': {
    playful: 'Continue later',
    focus: 'Continue later',
  },
  'profile.statsSection': {
    playful: 'Your wins',
    focus: 'Stats',
  },
  'profile.modeSection': {
    playful: 'How do you want to learn?',
    focus: 'Display mode',
  },
  'profile.modePlayful': {
    playful: 'Playful',
    focus: 'Playful',
  },
  'profile.modeFocus': {
    playful: 'Focus',
    focus: 'Focus',
  },
  'profile.modeDescription': {
    playful:
      'Playful: shorter copy and fewer questions. Focus: more depth and follow-ups — same learning goal.',
    focus:
      'Playful: shorter text, fewer graded steps. Focus: more depth — same learning goal.',
  },
  'profile.languageSection': {
    playful: 'Language',
    focus: 'Language',
  },
  'profile.languageDescription': {
    playful: 'Choose your interface language. Your progress stays the same.',
    focus: 'Set the interface language.',
  },
  'profile.languageDe': {
    playful: 'German',
    focus: 'German',
  },
  'profile.languageEn': {
    playful: 'English',
    focus: 'English',
  },
  'profile.languageFr': {
    playful: 'French',
    focus: 'French',
  },
  'profile.languageRu': {
    playful: 'Russian',
    focus: 'Russian',
  },
  'profile.byokSection': {
    playful: 'Your AI key',
    focus: 'API key (BYOK)',
  },
  'profile.byokDescription': {
    playful:
      'One key per provider — everything stays on your device and is never synced.',
    focus:
      'One API key per provider, encrypted locally (Secure Store). Keys are never synced.',
  },
  'profile.byokPlaceholder': {
    playful: 'Paste API key',
    focus: 'Enter API key',
  },
  'profile.byokSave': {
    playful: 'Save key',
    focus: 'Save',
  },
  'profile.byokDelete': {
    playful: 'Delete key',
    focus: 'Delete',
  },
  'profile.byokSavedBadge': {
    playful: 'Stored safely',
    focus: 'Saved',
  },
  'promptLab.inputLabel': {
    playful: 'Your prompt',
    focus: 'Prompt',
  },
  'promptLab.inputPlaceholder': {
    playful: 'Write your prompt here...',
    focus: 'Enter prompt...',
  },
  'promptLab.scoreButton': {
    playful: 'Score it!',
    focus: 'Score',
  },
  'promptLab.demoBanner': {
    playful: 'Demo mode: without an API key, the local practice coach scores you.',
    focus: 'Demo mode: local scoring without API key.',
  },
  'promptLab.addKeyCta': {
    playful: 'Add key in profile',
    focus: 'Add API key in profile',
  },
  'promptLab.scoreTitle': {
    playful: 'Your breakdown',
    focus: 'Evaluation',
  },
  'promptLab.catStructure': {
    playful: 'Structure',
    focus: 'Structure',
  },
  'promptLab.catGoal': {
    playful: 'Goal',
    focus: 'Goal definition',
  },
  'promptLab.catConstraints': {
    playful: 'Constraints',
    focus: 'Constraints',
  },
  'promptLab.feedbackStrong': {
    playful: 'Strong prompt! Your structure is tight.',
    focus: 'Overall rating: strong.',
  },
  'promptLab.feedbackOkay': {
    playful: 'Solid! There is still room to grow.',
    focus: 'Overall rating: solid.',
  },
  'promptLab.feedbackWeak': {
    playful: "Good start - let's sharpen it.",
    focus: 'Overall rating: needs work.',
  },
  'promptLab.hintStructure': {
    playful: 'More structure: separate context, task, and constraints into sections.',
    focus: 'Improvement area: clearly separate context, task, and constraints.',
  },
  'promptLab.hintGoal': {
    playful: 'Tell the model more precisely what output you want.',
    focus: 'Improvement area: define the expected result more precisely.',
  },
  'promptLab.hintConstraints': {
    playful: 'Add sharper constraints and go for a top score.',
    focus: 'Improvement area: more precise constraints (length, format, audience).',
  },
  'promptLab.historyTitle': {
    playful: 'Your score history',
    focus: 'Score history',
  },
  'promptLab.promptHistoryTitle': {
    playful: 'Prompts you scored',
    focus: 'Recent scored prompts',
  },
  'promptLab.promptHistoryDescription': {
    playful: 'Tap a prompt to load it back into the editor.',
    focus: 'Select an entry to reuse that prompt in the input field.',
  },
  'promptLab.promptHistoryEmpty': {
    playful: 'No scored prompts yet — score one to build your trail.',
    focus: 'No scored prompts stored yet.',
  },
  'promptLab.promptHistoryMissing': {
    playful: 'Older entry — prompt text was not saved yet.',
    focus: 'Legacy entry without stored prompt text.',
  },
  'promptLab.promptHistoryScore': {
    playful: 'Score {{score}}',
    focus: '{{score}} / 100',
  },
  'promptLab.promptHistoryTapReuse': {
    playful: 'Tap to reuse',
    focus: 'Reuse',
  },
  'promptLab.promptHistoryReuseHint': {
    playful: 'Loads this prompt into the input field',
    focus: 'Loads this prompt into the input field',
  },
  'promptLab.promptHistoryItemA11y': {
    playful: 'Scored prompt, score {{score}}',
    focus: 'Scored prompt, score {{score}}',
  },
  'promptLab.scoringInProgress': {
    playful: 'Scoring in progress...',
    focus: 'Scoring...',
  },
  'promptLab.liveBadge': {
    playful: 'Live scoring: {{provider}}',
    focus: 'Live: {{provider}}',
  },
  'promptLab.fallbackInvalidKey': {
    playful: 'Your key was rejected - the local coach scored this run. Check your key in Profile.',
    focus: 'API key rejected. Local scoring used. Check key in profile.',
  },
  'promptLab.fallbackQuota': {
    playful: 'Your API quota is exhausted or limited - the local coach is stepping in.',
    focus: 'Quota or credit exhausted. Local scoring used.',
  },
  'promptLab.fallbackNetwork': {
    playful: 'No connection to the AI - the local coach is taking over.',
    focus: 'API unreachable. Local scoring used.',
  },
  'promptLab.fallbackGeneric': {
    playful: 'The AI response was unusable - the local coach is taking over.',
    focus: 'API error. Local scoring used.',
  },
  'promptLab.modeScore': {
    playful: 'Score',
    focus: 'Scoring',
  },
  'promptLab.modeCompare': {
    playful: 'Compare models',
    focus: 'Model compare',
  },
  'promptLab.detailHintsTitle': {
    playful: 'Specific ways to improve',
    focus: 'Specific hints',
  },
  'promptLab.improvementPathTitle': {
    playful: 'Your clearest next move',
    focus: 'Primary improvement path',
  },
  'promptLab.improvementPathSecondary': {
    playful: 'Then: {{tip}}',
    focus: 'Next: {{tip}}',
  },
  'promptLab.improvementPathComplete': {
    playful: 'Nice — role, context, format, and constraints are all covered.',
    focus: 'All core pillars present: role, context, format, constraints.',
  },
  'promptLab.missing.context': {
    playful: 'Your prompt is missing context — what background should the AI use?',
    focus: 'Missing context: add background facts or source material the answer must use.',
  },
  'promptLab.missing.role': {
    playful: 'Your prompt is missing a role — tell the AI who it should be.',
    focus: 'Missing role: assign a clear persona or stance for the model.',
  },
  'promptLab.missing.format': {
    playful: 'Your prompt is missing a format — bullets, paragraphs, table…?',
    focus: 'Missing format: specify the output shape (list, paragraphs, JSON, …).',
  },
  'promptLab.missing.constraints': {
    playful: 'Your prompt is missing constraints — length, audience, or tone.',
    focus: 'Missing constraints: add hard limits (length, audience, tone, bans).',
  },
  'promptLab.comparisonTitle': {
    playful: '+{{delta}} points — here is what improved',
    focus: '+{{delta}} points vs. the previous draft',
  },
  'promptLab.demoWeakExample': {
    playful: 'Load weak example',
    focus: 'Weak example',
  },
  'promptLab.demoImprovedExample': {
    playful: 'Load improved version',
    focus: 'Improved version',
  },
  'modelComparer.description': {
    playful:
      'One prompt, multiple models in parallel — swipe through answers and compare speed and cost.',
    focus:
      'Sends one prompt in parallel to 2–3 configured providers and shows answers side by side (horizontal scroll).',
  },
  'modelComparer.needTwoKeys': {
    playful: 'Add at least two API keys in Profile to compare models.',
    focus: 'At least two provider keys required in Profile.',
  },
  'modelComparer.modelPickerLabel': {
    playful: 'Pick models (2–3)',
    focus: 'Models (2–3)',
  },
  'modelComparer.modelPickerHint': {
    playful: 'Select at least two and at most three models.',
    focus: 'Selection: minimum 2, maximum 3 models.',
  },
  'modelComparer.promptLabel': {
    playful: 'Your prompt',
    focus: 'Prompt',
  },
  'modelComparer.promptPlaceholder': {
    playful: 'Write the prompt for all models...',
    focus: 'Prompt for all selected models...',
  },
  'modelComparer.compareButton': {
    playful: 'Compare in parallel',
    focus: 'Compare',
  },
  'modelComparer.comparing': {
    playful: 'Models are responding...',
    focus: 'Comparison running...',
  },
  'modelComparer.resultsTitle': {
    playful: 'Answers compared',
    focus: 'Results',
  },
  'modelComparer.copyA11y': {
    playful: 'Copy this answer',
    focus: 'Copy answer to clipboard',
  },
  'modelComparer.copiedA11y': {
    playful: 'Copied',
    focus: 'Answer copied',
  },
  'modelComparer.latencyBadge': {
    playful: '{{seconds}} s',
    focus: '{{seconds}} s',
  },
  'modelComparer.costBadge': {
    playful: 'approx. {{cost}}',
    focus: '≈ {{cost}}',
  },
  'modelComparer.errorBadge': {
    playful: 'Error',
    focus: 'Error',
  },
  'modelComparer.errorInvalidKey': {
    playful: 'Key rejected — check it in Profile.',
    focus: 'Invalid API key.',
  },
  'modelComparer.errorQuota': {
    playful: 'Quota or credit exhausted.',
    focus: 'Rate limit or quota exhausted.',
  },
  'modelComparer.errorNetwork': {
    playful: 'Network error or timeout.',
    focus: 'Network error / timeout.',
  },
  'modelComparer.errorGeneric': {
    playful: 'This model could not respond.',
    focus: 'Model response failed.',
  },
  'modelComparer.insightMoreExpensiveSlightlyDetailed': {
    playful: '{{costMultiplier}}× more expensive, but only {{detailPercent}}% more detailed than the others.',
    focus: '{{costMultiplier}}× costlier with only {{detailPercent}}% more text than other models.',
  },
  'modelComparer.insightMoreExpensiveMuchDetailed': {
    playful: '{{costMultiplier}}× more expensive and {{detailPercent}}% more detailed than the others.',
    focus: '{{costMultiplier}}× costlier with {{detailPercent}}% longer output.',
  },
  'modelComparer.insightMoreExpensiveShorter': {
    playful: '{{costMultiplier}}× more expensive with a {{detailPercent}}% shorter answer.',
    focus: '{{costMultiplier}}× costlier; answer {{detailPercent}}% shorter than others.',
  },
  'modelComparer.insightMoreExpensiveSimilarDetail': {
    playful: '{{costMultiplier}}× more expensive with similar answer length.',
    focus: '{{costMultiplier}}× costlier; text length near the average.',
  },
  'modelComparer.insightCheaperMoreDetailed': {
    playful: '{{costMultiplier}}× cheaper and {{detailPercent}}% more detailed.',
    focus: '{{costMultiplier}}× cheaper with {{detailPercent}}% more text.',
  },
  'modelComparer.insightCheaperShorter': {
    playful: '{{costMultiplier}}× cheaper, but {{detailPercent}}% shorter.',
    focus: '{{costMultiplier}}× cheaper; answer {{detailPercent}}% shorter.',
  },
  'modelComparer.insightCheaperSimilarDetail': {
    playful: '{{costMultiplier}}× cheaper with similar answer length.',
    focus: '{{costMultiplier}}× cheaper; text length near the average.',
  },
  'modelComparer.insightFaster': {
    playful: '{{speedMultiplier}}× faster — cost and length similar to the others.',
    focus: '{{speedMultiplier}}× faster with comparable cost and text length.',
  },
  'modelComparer.insightSlower': {
    playful: '{{speedMultiplier}}× slower — cost and length similar to the others.',
    focus: '{{speedMultiplier}}× slower with comparable cost and text length.',
  },
  'modelComparer.insightSimilar': {
    playful: 'Cost, speed, and length are close to the average of the other models.',
    focus: 'Cost, latency, and text length near the mean of other models.',
  },
  'modelComparer.spendingWarningDaily': {
    playful: 'Heads-up: your daily estimated API spend limit is reached (estimate only, not guaranteed).',
    focus: 'Daily estimated API spend limit reached (client-side estimate, non-binding).',
  },
  'modelComparer.spendingWarningMonthly': {
    playful: 'Heads-up: your monthly estimated API spend limit is reached (estimate only, not guaranteed).',
    focus: 'Monthly estimated API spend limit reached (client-side estimate, non-binding).',
  },
  'modelComparer.spendingWarningBoth': {
    playful: 'Heads-up: daily and monthly estimated spend limits reached (estimate only).',
    focus: 'Daily and monthly estimated spend limits reached (non-binding estimate).',
  },
  'profile.spendingLimitSection': {
    playful: 'Spend guard',
    focus: 'Spend limit (BYOK)',
  },
  'profile.spendingLimitDescription': {
    playful: 'Set a daily or monthly cap on estimated API spend — we warn you locally before it adds up quietly.',
    focus: 'Optional daily/monthly cap on estimated BYOK spend with local warnings.',
  },
  'profile.spendingLimitDisclaimer': {
    playful: 'Rough on-device estimate only — not real billing, no guarantee.',
    focus: 'Client-side cost estimate without billing guarantee; orientation only.',
  },
  'profile.spendingLimitDailyLabel': {
    playful: 'Daily limit (USD, optional)',
    focus: 'Daily limit USD (optional)',
  },
  'profile.spendingLimitMonthlyLabel': {
    playful: 'Monthly limit (USD, optional)',
    focus: 'Monthly limit USD (optional)',
  },
  'profile.spendingLimitPlaceholder': {
    playful: 'e.g. 1.00',
    focus: 'e.g. 1.00',
  },
  'profile.spendingLimitSave': {
    playful: 'Save limit',
    focus: 'Save',
  },
  'profile.spendingLimitUsageToday': {
    playful: 'Estimated today: {{amount}}',
    focus: 'Today (estimate): {{amount}}',
  },
  'profile.spendingLimitUsageMonth': {
    playful: 'Estimated this month: {{amount}}',
    focus: 'Month (estimate): {{amount}}',
  },
  'profile.spendingLimitWarningDaily': {
    playful: 'Daily limit reached (estimate)',
    focus: 'Daily limit reached (estimate)',
  },
  'profile.spendingLimitWarningMonthly': {
    playful: 'Monthly limit reached (estimate)',
    focus: 'Monthly limit reached (estimate)',
  },
  'profile.spendingLimitWarningBoth': {
    playful: 'Daily and monthly limits reached (estimate)',
    focus: 'Daily and monthly limits reached (estimate)',
  },
  'profile.byokChecking': {
    playful: 'Checking your key...',
    focus: 'Checking key...',
  },
  'profile.byokValidBadge': {
    playful: 'Working ({{provider}})',
    focus: 'Active ({{provider}})',
  },
  'profile.byokInvalidError': {
    playful: 'This key was rejected - please check it again.',
    focus: 'Invalid key. Please verify.',
  },
  'profile.byokUnverifiedBadge': {
    playful: 'Saved - not verified yet',
    focus: 'Saved (unverified)',
  },
  'profile.byokTest': {
    playful: 'Test key',
    focus: 'Test',
  },
  'profile.byokConfiguredCount': {
    playful: '{{count}} providers connected',
    focus: '{{count}} providers configured',
  },
  'profile.accountSection': {
    playful: 'Your account',
    focus: 'Account',
  },
  'profile.accountDescription': {
    playful: 'You are signed in. Signing out only ends the session on this device.',
    focus: 'Signed in. Sign out ends the session on this device.',
  },
  'profile.signOut': {
    playful: 'Sign out',
    focus: 'Sign out',
  },
  'profile.privacySection': {
    playful: 'Privacy & usage',
    focus: 'Privacy',
  },
  'profile.analyticsDisclosure': {
    playful: 'StructAI records five self-hosted usage events. Guest events stay anonymous; after sign-in they are linked to your account. Prompts and API keys are never included.',
    focus: 'Five self-hosted usage events measure the activation funnel. Guest events are anonymous; signed-in events include the user ID. Prompt content and API keys are not collected.',
  },
  'profile.guestDisplayName': {
    playful: 'Guest',
    focus: 'Guest',
  },
  'profile.resetSection': {
    playful: 'Reset & start over',
    focus: 'Data & reset',
  },
  'profile.resetSectionDescription': {
    playful: 'Need a clean slate for testing or a fresh start? Pick what to wipe.',
    focus: 'Reset learning progress only, or wipe all local account data and restart onboarding.',
  },
  'profile.resetProgressCta': {
    playful: 'Reset all progress',
    focus: 'Reset all learning progress',
  },
  'profile.deleteAccountCta': {
    playful: 'Delete everything & restart onboarding',
    focus: 'Delete account data & restart onboarding',
  },
  'profile.resetCancel': {
    playful: 'Cancel',
    focus: 'Cancel',
  },
  'profile.resetProgressConfirmTitle': {
    playful: 'Reset all progress?',
    focus: 'Reset all learning progress?',
  },
  'profile.resetProgressConfirmBody': {
    playful: 'Lessons, paths, orbs, and streaks will be cleared. You stay signed in and keep your settings.',
    focus: 'Clears lessons, paths, orbs, and streaks. Account and preferences remain.',
  },
  'profile.resetProgressConfirmAction': {
    playful: 'Reset progress',
    focus: 'Reset progress',
  },
  'profile.deleteAccountConfirmTitle': {
    playful: 'Delete everything?',
    focus: 'Delete account data?',
  },
  'profile.deleteAccountConfirmBodyGuest': {
    playful: 'This wipes progress, name, keys, and settings — then sends you back to onboarding.',
    focus: 'Deletes all local progress and profile data, then opens onboarding.',
  },
  'profile.deleteAccountConfirmBodySignedIn': {
    playful: 'This wipes progress (including cloud save), signs you out, and restarts onboarding.',
    focus: 'Deletes learning data (local + cloud progress), signs you out, and opens onboarding.',
  },
  'profile.deleteAccountConfirmAction': {
    playful: 'Delete & restart',
    focus: 'Delete & restart',
  },
  'profile.deleteAccountFootnoteGuest': {
    playful: 'Full wipe — you will see the welcome screens again.',
    focus: 'Full local wipe returns you to onboarding.',
  },
  'profile.deleteAccountFootnoteSignedIn': {
    playful: 'Cloud progress is removed and you are signed out. Auth email deletion may need support.',
    focus: 'Removes synced progress and ends the session. Auth identity deletion may require support.',
  },
  'profile.guestAccountDescription': {
    playful: 'You are using StructAI without an account. Progress stays on this device — sign in to sync across devices.',
    focus: 'Guest mode. Progress is local on this device; sign in to sync across devices.',
  },
  'guest.saveProgressHint': {
    playful: 'Your progress is only on this device. An account lets you sync and keep it safe.',
    focus: 'Progress is stored locally only. Sign in to sync across devices.',
  },
  'guest.saveProgressCta': {
    playful: 'Save progress – sign in now',
    focus: 'Save progress – sign in now',
  },
  'auth.headline': {
    playful: 'Welcome to StructAI',
    focus: 'Sign in to StructAI',
  },
  'auth.subheadline': {
    playful: 'Sign in so your progress can be saved securely later.',
    focus: 'Sign in to secure your learning progress.',
  },
  'auth.signInTab': {
    playful: 'Sign in',
    focus: 'Sign in',
  },
  'auth.signUpTab': {
    playful: 'Register',
    focus: 'Register',
  },
  'auth.emailPlaceholder': {
    playful: 'Email address',
    focus: 'Email',
  },
  'auth.passwordPlaceholder': {
    playful: 'Password (min. 6 characters)',
    focus: 'Password (min. 6 chars)',
  },
  'auth.signInCta': {
    playful: 'Sign in now',
    focus: 'Sign in',
  },
  'auth.signInLoading': {
    playful: 'Signing in…',
    focus: 'Signing in…',
  },
  'auth.signUpCta': {
    playful: 'Create account',
    focus: 'Register',
  },
  'auth.signUpLoading': {
    playful: 'Creating account…',
    focus: 'Registering…',
  },
  'auth.signUpHint': {
    playful: 'After registration, check your inbox if email confirmation is required.',
    focus: 'Check your inbox if email confirmation is required.',
  },
  'auth.signUpConfirmEmail': {
    playful: 'Account created! Please confirm your email, then sign in.',
    focus: 'Registration successful. Confirm email, then sign in.',
  },
  'auth.dividerOr': {
    playful: 'or',
    focus: 'or',
  },
  'auth.googleCta': {
    playful: 'Continue with Google',
    focus: 'Sign in with Google',
  },
  'auth.googleLoading': {
    playful: 'Google sign-in…',
    focus: 'Google…',
  },
  'auth.errorGeneric': {
    playful: 'Something went wrong. Please try again.',
    focus: 'Sign-in failed. Please try again.',
  },
  'auth.errorInvalidCredentials': {
    playful: 'Email or password is incorrect.',
    focus: 'Invalid credentials.',
  },
  'auth.errorEmailNotConfirmed': {
    playful: 'Please confirm your email address first.',
    focus: 'Email address not confirmed.',
  },
  'auth.errorUserExists': {
    playful: 'An account already exists for this email.',
    focus: 'Account already exists.',
  },
  'auth.errorWeakPassword': {
    playful: 'The password does not meet the requirements.',
    focus: 'Password requirements not met.',
  },
  'auth.errorNotConfigured': {
    playful: 'Supabase is not configured yet.',
    focus: 'Supabase configuration missing.',
  },
  'auth.errorOAuthCancelled': {
    playful: 'Google sign-in was cancelled.',
    focus: 'Google sign-in cancelled.',
  },
  'auth.errorOAuthFailed': {
    playful: 'Google sign-in could not be completed. Check the redirect URL in Supabase.',
    focus: 'Google sign-in failed. Check redirect URL in Supabase.',
  },
  'auth.configMissingTitle': {
    playful: 'Backend not connected yet',
    focus: 'Backend not configured',
  },
  'auth.configMissingBody': {
    playful: 'Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env.',
    focus: 'Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env.',
  },
  'onboarding.welcomeHeadline': {
    playful: 'Write better prompts. Judge AI answers.',
    focus: 'Write better prompts. Judge AI answers.',
  },
  'onboarding.welcomeSub': {
    playful:
      'StructAI teaches you to write better prompts and judge AI answers through short lessons, live scoring, and a BYOK Prompt Lab.',
    focus:
      'StructAI teaches you to write better prompts and judge AI answers through short lessons, live scoring, and a BYOK Prompt Lab.',
  },
  'onboarding.welcomeCta': {
    playful: "Let's go!",
    focus: 'Start',
  },
  'onboarding.modeQuestion': {
    playful: 'How would you like to learn?',
    focus: 'How would you like to learn?',
  },
  'onboarding.modeHint': {
    playful: 'Both modes show the same content - you can switch anytime in settings.',
    focus: 'Identical content and features. Change anytime in settings.',
  },
  'onboarding.modeCta': {
    playful: 'Confirm choice',
    focus: 'Confirm',
  },
  'onboarding.loopTitle': {
    playful: 'How StructAI works',
    focus: 'The learning loop in three steps',
  },
  'onboarding.loopStep1': {
    playful: 'Pick a learning path with a clear chapter structure.',
    focus: 'Choose a path: set the topic and chapter order.',
  },
  'onboarding.loopStep2': {
    playful: 'Work through lessons with short exercises, step by step.',
    focus: 'Complete a lesson: work through short exercises in sequence.',
  },
  'onboarding.loopStep3': {
    playful: 'Earn Orbs and unlock the next chapter.',
    focus: 'Collect Orbs and unlock the next chapter.',
  },
  'onboarding.loopCta': {
    playful: 'Start first lesson!',
    focus: 'Start first lesson',
  },
  'onboarding.loopHomeCta': {
    playful: 'Go to overview first',
    focus: 'Go to home',
  },
  'onboarding.profileTitle': {
    playful: 'Almost there — who are you?',
    focus: 'Complete your profile',
  },
  'onboarding.profileSubtitle': {
    playful: 'You finished your first lesson! Tell us your name so we can tailor StructAI to you.',
    focus: 'First lesson completed. Please enter your name and age so we can recommend a learning mode.',
  },
  'onboarding.profileNameLabel': {
    playful: 'Your name',
    focus: 'Display name',
  },
  'onboarding.profileNamePlaceholder': {
    playful: 'What should we call you?',
    focus: 'Enter display name',
  },
  'onboarding.profileAgeLabel': {
    playful: 'Your age',
    focus: 'Age',
  },
  'onboarding.profileAgePlaceholder': {
    playful: 'e.g. 14',
    focus: 'Age in years',
  },
  'onboarding.profileAgeDisclaimer': {
    playful: 'We only use your age for mode recommendations — not to make tasks harder or easier.',
    focus: 'Age is used exclusively for mode recommendations, not to manipulate gameplay difficulty.',
  },
  'onboarding.profileAgeInvalid': {
    playful: 'Please enter an age between 1 and 120.',
    focus: 'Please enter a valid age between 1 and 120.',
  },
  'onboarding.profileAuthSection': {
    playful: 'Save your progress',
    focus: 'Link an account',
  },
  'onboarding.profileAuthHint': {
    playful: 'Optional: Sign in to keep your progress. You will return here afterward.',
    focus: 'Optional: Sign in with Google or email. You will return to this step after authentication.',
  },
  'onboarding.profileModeSection': {
    playful: 'Choose your mode',
    focus: 'Select learning mode',
  },
  'onboarding.profileModeHintRecommended': {
    playful: 'For your age we recommend Playful — simpler tasks and easier understanding. Focus remains available.',
    focus: 'For this age, Playful is recommended: simpler tasks and easier understanding. Focus remains selectable.',
  },
  'onboarding.profileModeHintNeutral': {
    playful: 'Both modes are equal — pick what fits you.',
    focus: 'Both modes are available without preference.',
  },
  'onboarding.profileModeHintCarried': {
    playful: 'Your earlier choice is pre-selected — adjust it here if you like.',
    focus: 'Your previous selection is pre-selected and can be adjusted here.',
  },
  'onboarding.profilePlayfulBadge': {
    playful: 'Recommended',
    focus: 'Recommended',
  },
  'onboarding.profilePlayfulRecommendCopy': {
    playful: 'Simpler tasks, easier understanding',
    focus: 'Simpler tasks, easier understanding',
  },
  'onboarding.profileCta': {
    playful: 'Let\'s go!',
    focus: 'Save profile and start',
  },
  'onboarding.profileSaving': {
    playful: 'Saving…',
    focus: 'Saving…',
  },
  'onboarding.profileSaveError': {
    playful: 'Could not save — please try again.',
    focus: 'Profile could not be saved. Please try again.',
  },
  'onboarding.previewPathTitle': {
    playful: 'Prompt Basics',
    focus: 'Prompt Basics',
  },
  'statBlock.completedLessons': {
    playful: 'Completed lessons',
    focus: 'Lessons completed',
  },
  'statBlock.currentStreak': {
    playful: 'Current streak',
    focus: 'Streak (days)',
  },
  'streakTracker.title': {
    playful: 'Your week',
    focus: 'Weekly progress',
  },
  'streakTracker.weekdayMon': {
    playful: 'Mon',
    focus: 'Mon',
  },
  'streakTracker.weekdayTue': {
    playful: 'Tue',
    focus: 'Tue',
  },
  'streakTracker.weekdayWed': {
    playful: 'Wed',
    focus: 'Wed',
  },
  'streakTracker.weekdayThu': {
    playful: 'Thu',
    focus: 'Thu',
  },
  'streakTracker.weekdayFri': {
    playful: 'Fri',
    focus: 'Fri',
  },
  'streakTracker.weekdaySat': {
    playful: 'Sat',
    focus: 'Sat',
  },
  'streakTracker.weekdaySun': {
    playful: 'Sun',
    focus: 'Sun',
  },
  'celebration.lessonComplete': {
    playful: 'Lesson complete!',
    focus: 'Lesson completed.',
  },
  'celebration.orbGain': {
    playful: '+{{count}} Orbs for you!',
    focus: '+{{count}} Orbs',
  },
  'celebration.streakMilestone': {
    playful: 'Full week - your streak is alive!',
    focus: '7-day milestone reached.',
  },
  'celebration.pathComplete': {
    playful: 'Path complete: {{path}}!',
    focus: 'Learning path completed: {{path}}.',
  },
  'celebration.capstoneComplete': {
    playful: 'Capstone project complete!',
    focus: 'Capstone project passed.',
  },
  'celebration.sectionMilestone': {
    playful: 'Chapter complete!',
    focus: 'Milestone reached.',
  },
  'capstoneIncomplete.title': {
    playful: 'Path almost done — not fully complete',
    focus: 'Path finished — not fully complete',
  },
  'capstoneIncomplete.subtitle': {
    playful:
      'Capstone passed. {{missing}} of {{total}} lessons remain before the next path unlocks.',
    focus:
      'Capstone project passed. {{missing}} of {{total}} lessons remain to unlock the next path.',
  },
  'capstoneIncomplete.statCompleted': {
    playful: 'Passed',
    focus: 'Completed',
  },
  'capstoneIncomplete.statSkipped': {
    playful: 'Skipped',
    focus: 'Skipped/missing',
  },
  'capstoneIncomplete.lockHint': {
    playful: 'The next path stays locked until every lesson is passed.',
    focus: 'The next path stays locked until every lesson is passed.',
  },
  'capstoneIncomplete.openMissingCta': {
    playful: 'Go to open lessons',
    focus: 'Go to open lessons',
  },
  'capstoneIncomplete.backToPath': {
    playful: 'Back to path',
    focus: 'Back to path',
  },
  'sectionMilestone.title': {
    playful: 'Chapter complete!',
    focus: 'Capstone project passed',
  },
  'sectionMilestone.subtitle': {
    playful: 'Nice work — continue with the next section.',
    focus: 'You reached an important milestone.',
  },
  'sectionMilestone.continueCta': {
    playful: 'Next chapter',
    focus: 'Continue',
  },
  'sectionMilestone.backToPath': {
    playful: 'Back to path',
    focus: 'Back to path',
  },
  'pathPreview.lockedHint': {
    playful: 'Still locked — pass every lesson in this path first.',
    focus: 'Still locked — pass every lesson in this path first.',
  },
  'pathCompletion.titleFull': {
    playful: 'Path fully complete!',
    focus: 'Path fully completed',
  },
  'pathCompletion.subtitleFull': {
    playful:
      'All {{total}} chapters of "{{path}}" passed. Your certificate is ready and the next path is unlocked.',
    focus:
      'All lessons passed. Your certificate is ready and the next path is unlocked.',
  },
  'pathCompletion.statCompleted': {
    playful: 'Chapters passed',
    focus: 'Lessons passed',
  },
  'pathCompletion.statCertificate': {
    playful: 'Certificate',
    focus: 'Certificate available',
  },
  'pathCompletion.startNextPathCta': {
    playful: 'Continue to {{path}}',
    focus: 'Start next path: {{path}}',
  },
  'pathCompletion.title': {
    playful: 'Path complete!',
    focus: 'Learning path completed',
  },
  'pathCompletion.subtitle': {
    playful: 'You passed all {{total}} chapters of "{{path}}".',
    focus: 'All {{total}} chapters of "{{path}}" completed successfully.',
  },
  'pathCompletion.certificateHint': {
    playful: 'Your certificate will be available here soon.',
    focus: 'Certificate export will be added here next (G2).',
  },
  'pathCompletion.backToPaths': {
    playful: 'Back to learning paths',
    focus: 'Back to path overview',
  },
  'certificate.badge': {
    playful: 'Prompt skill certificate',
    focus: 'Skill certificate',
  },
  'certificate.awardedTo': {
    playful: 'Earned by',
    focus: 'Holder',
  },
  'certificate.completedOn': {
    playful: 'Completed on',
    focus: 'Completion date',
  },
  'certificate.brandTagline': {
    playful: 'Better prompts. Sharper AI judgment.',
    focus: 'Prompt skill · Verified path completion',
  },
  'certificate.skillLabel': {
    playful: 'Skill unlocked',
    focus: 'Demonstrated skill',
  },
  'certificate.skill.prompt_basics': {
    playful: 'Write clear, goal-driven prompts with structure.',
    focus: 'Clear, goal-driven prompt structure',
  },
  'certificate.skill.structure_lab': {
    playful: 'Build prompts with role, constraints, and format.',
    focus: 'Role, constraints, and output format control',
  },
  'certificate.skill.context_mastery': {
    playful: 'Feed AI the right context without drowning it.',
    focus: 'Context selection and grounding',
  },
  'certificate.skill.iteration_loops': {
    playful: 'Iterate prompts until the output holds up.',
    focus: 'Prompt iteration and refinement loops',
  },
  'certificate.skill.eval_scoring': {
    playful: 'Judge AI answers — and catch weak ones.',
    focus: 'Output evaluation and critique',
  },
  'certificate.skill.prompt_mastery': {
    playful: 'Design advanced prompts under real constraints.',
    focus: 'Advanced prompt design under constraints',
  },
  'certificate.skill.generic': {
    playful: 'Completed a StructAI prompting path.',
    focus: 'StructAI prompting path completed',
  },
  'certificate.evidence': {
    playful: '{{completed}} / {{total}} chapters completed',
    focus: '{{completed}} of {{total}} chapters completed',
  },
  'certificate.credentialLabel': {
    playful: 'Credential ID',
    focus: 'Credential ID',
  },
  'certificate.share': {
    playful: 'Share your skill win',
    focus: 'Export certificate',
  },
  'certificate.sharing': {
    playful: 'Preparing…',
    focus: 'Exporting…',
  },
  'certificate.shareDialogTitle': {
    playful: '{{name}} can now: {{skill}}',
    focus: '{{name}} — {{skill}}',
  },
  'pathCompletion.identityLine': {
    playful: 'This is yours to share: {{skill}}',
    focus: 'Credential: {{skill}}',
  },
  'certificate.shareUnavailable': {
    playful: 'Sharing is not available on this device right now.',
    focus: 'Certificate export is not available on this device.',
  },
  'certificate.download': {
    playful: 'Download certificate',
    focus: 'Save as image',
  },
  'certificate.shareWebUnavailable': {
    playful:
      'Download did not start. Sharing works in the StructAI mobile app — in the browser use “Download certificate”.',
    focus:
      'Download failed. Use native sharing in the iOS/Android app; the browser should save a PNG file.',
  },
  'profile.certificatesSection': {
    playful: 'Your certificates',
    focus: 'Completion certificates',
  },
  'profile.certificatesDescription': {
    playful: 'Preview your skill wins here. Export and share are Pro.',
    focus: 'Completed paths — preview free; export is Pro.',
  },
  'pro.planSection': {
    playful: 'Your plan',
    focus: 'Plan',
  },
  'pro.planEyebrow': {
    playful: 'Access',
    focus: 'Access',
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
      'Free: all lessons + local Lab coach. Pro: live AI grades and certificate export from {{monthly}}/mo or {{yearly}}/year.',
    focus:
      'Free: lessons + local Lab. Pro: live AI grades + certificate export — from {{monthly}}/mo or {{yearly}}/year.',
  },
  'pro.planBodyPro': {
    playful: 'Pro is active on this device: live Lab grades and certificate export are unlocked.',
    focus: 'Pro active. Live Lab grades and certificate export unlocked on this device.',
  },
  'pro.previewUnlockCta': {
    playful: 'Try Pro preview',
    focus: 'Enable Pro preview',
  },
  'pro.previewLockCta': {
    playful: 'Back to Free',
    focus: 'Return to Free',
  },
  'pro.gateTitle': {
    playful: 'Pro feature',
    focus: 'Pro',
  },
  'pro.gateCertificateBody': {
    playful: 'Certificate export is Pro — see pricing on the Pro screen.',
    focus: 'Certificate export is Pro. Open the Pro paywall for pricing.',
  },
  'pro.gateLabBody': {
    playful:
      'Your API key alone is not Pro. Live AI grades are Pro — local coach scoring stays free.',
    focus:
      'An API key is not Pro. Live grades are Pro; local coach scoring stays free. Open Pro for planned pricing.',
  },
  'pro.certificateCta': {
    playful: 'Export with Pro',
    focus: 'Export (Pro)',
  },
  'pro.openPlanCta': {
    playful: 'See Pro plans',
    focus: 'See Pro',
  },
  'pro.openPaywallCta': {
    playful: 'See Pro plans & pricing',
    focus: 'View Pro pricing',
  },
  'pro.paywall.brand': {
    playful: 'StructAI Pro',
    focus: 'StructAI Pro',
  },
  'pro.paywall.headline': {
    playful: 'Prove your skill. Grade with real models.',
    focus: 'Live grades and shareable proof of skill.',
  },
  'pro.paywall.sub': {
    playful:
      'Keep learning free. Upgrade when you want live AI scoring in the Prompt Lab and certificates you can export.',
    focus:
      'Lessons stay free. Pro unlocks live Lab AI grades (your key) and certificate export after path completion.',
  },
  'pro.paywall.compareFeature': {
    playful: 'What you get',
    focus: 'Included',
  },
  'pro.paywall.benefitLessons': {
    playful: 'Full lesson paths & daily practice',
    focus: 'All lesson paths and daily practice',
  },
  'pro.paywall.benefitLabLocal': {
    playful: 'Local Prompt Lab coach',
    focus: 'Local Prompt Lab coach',
  },
  'pro.paywall.benefitLabLive': {
    playful: 'Live AI grades with your API key',
    focus: 'Live AI grades (BYOK)',
  },
  'pro.paywall.benefitCertificates': {
    playful: 'Export & share skill certificates',
    focus: 'Certificate export and share',
  },
  'pro.paywall.included': {
    playful: 'Yes',
    focus: 'Yes',
  },
  'pro.paywall.excluded': {
    playful: '—',
    focus: '—',
  },
  'pro.paywall.periodMonthly': {
    playful: 'Monthly',
    focus: 'Monthly',
  },
  'pro.paywall.periodYearly': {
    playful: 'Yearly',
    focus: 'Yearly',
  },
  'pro.paywall.bestValue': {
    playful: 'Best value',
    focus: 'Best value',
  },
  'pro.paywall.monthlyHint': {
    playful: 'Cancel anytime',
    focus: 'Billed monthly',
  },
  'pro.paywall.yearlyHint': {
    playful: 'About {{monthly}}/mo',
    focus: '{{monthly}}/mo equivalent',
  },
  'pro.paywall.cta': {
    playful: 'Try Pro on this device (preview)',
    focus: 'Enable Pro preview on this device',
  },
  'pro.paywall.ctaBusy': {
    playful: 'Enabling preview…',
    focus: 'Enabling preview…',
  },
  'pro.paywall.billingFootnote': {
    playful:
      'Prices above are planned. App Store / Play billing is not live yet (Block H). This button only unlocks a local Pro preview — you will not be charged.',
    focus:
      'Prices are planned, not billed yet (Block H). CTA enables a local Pro preview only — no store charge.',
  },
  'pro.paywall.dismiss': {
    playful: 'Not now',
    focus: 'Not now',
  },
};
