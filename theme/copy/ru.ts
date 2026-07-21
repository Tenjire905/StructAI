import type { CopyCatalog } from './types';

export const copyRu: CopyCatalog = {
  'tabs.home': {
    playful: 'Главная',
    focus: 'Главная',
  },
  'tabs.paths': {
    playful: 'Треки',
    focus: 'Треки',
  },
  'tabs.promptLab': {
    playful: 'Промпт-мастерская',
    focus: 'Мастерская',
  },
  'tabs.profile': {
    playful: 'Профиль',
    focus: 'Профиль',
  },
  'home.greeting': {
    playful: 'С возвращением, {{name}}!',
    focus: 'Здравствуйте, {{name}}.',
  },
  'skillRank.eyebrow': {
    playful: 'Твой ранг',
    focus: 'Ранг навыка',
  },
  'skillRank.level': {
    playful: 'Ур. {{level}}',
    focus: 'Уровень {{level}}',
  },
  'skillRank.xpProgress': {
    playful: '{{current}} / {{next}} XP до следующего уровня',
    focus: '{{current}} / {{next}} XP',
  },
  'skillRank.totalXp': {
    playful: '{{xp}} XP всего — из уроков и Орбов.',
    focus: 'Всего XP: {{xp}} (уроки + Орбы).',
  },
  'skillRank.lessonXpGain': {
    playful: '+{{xp}} XP к рангу',
    focus: '+{{xp}} XP',
  },
  'skillRank.rank.spark': {
    playful: 'Искра',
    focus: 'Новичок',
  },
  'skillRank.rank.builder': {
    playful: 'Строитель',
    focus: 'Ученик',
  },
  'skillRank.rank.craftsman': {
    playful: 'Мастер',
    focus: 'Практик',
  },
  'skillRank.rank.specialist': {
    playful: 'Специалист',
    focus: 'Специалист',
  },
  'skillRank.rank.architect': {
    playful: 'Архитектор промптов',
    focus: 'Архитектор',
  },
  'home.continueLearning': {
    playful: 'Продолжить обучение',
    focus: 'Текущие треки',
  },
  'home.dailyChallenge.eyebrow': {
    playful: 'Задача на сегодня',
    focus: 'Дневной челлендж',
  },
  'home.dailyChallenge.title': {
    playful: 'Одна ясная победа сегодня',
    focus: 'Одна сфокусированная практика',
  },
  'home.dailyChallenge.bodyFresh': {
    playful: 'Начни с {{path}} — короткий урок, реальная практика, мгновенный фидбек.',
    focus: 'Начните {{path}}: один урок, один цикл практики, ясный фидбек.',
  },
  'home.dailyChallenge.bodyContinue': {
    playful: 'Продолжи {{path}} — один урок, один промпт, готово.',
    focus: 'Следующий шаг в {{path}}: один урок с ясным чекпоинтом.',
  },
  'home.dailyChallenge.ctaFresh': {
    playful: 'Начать урок дня',
    focus: 'Начать урок дня',
  },
  'home.dailyChallenge.ctaContinue': {
    playful: 'Сделать урок дня',
    focus: 'Продолжить урок дня',
  },
  'home.startHint': {
    playful: 'Начни с основ промптов — первый шаг к структурированному prompting.',
    focus: 'Начните с основ промптов — первый шаг к структурированному prompting.',
  },
  'home.startCta': {
    playful: 'Поехали!',
    focus: 'Открыть первый трек',
  },
  'home.labPracticeHint': {
    playful: 'Преврати сегодняшний навык в реальный промпт — оцени его в Prompt Lab.',
    focus: 'Преврати сегодняшний навык в реальный промпт — оцени его в Prompt Lab.',
  },
  'home.labPracticeCta': {
    playful: 'Открыть Prompt Lab',
    focus: 'Открыть Prompt Lab',
  },
  'home.retryFailedCta': {
    playful: 'Повторить первую открытую главу',
    focus: 'К первой непройденной главе',
  },
  'home.retryFailedNone': {
    playful: 'Все главы пройдены — повтор не нужен',
    focus: 'Все главы завершены — повтор не требуется',
  },
  'home.retryFailedNoOpen': {
    playful: 'Нет ошибок — продолжай как обычно',
    focus: 'Нет открытых ошибок — продолжайте как обычно',
  },
  'home.activityInsights.title': {
    playful: 'Твоя активность',
    focus: 'Обзор активности',
  },
  'home.activityInsights.expandHint': {
    playful: 'Нажми, чтобы увидеть график орбов',
    focus: 'Нажмите, чтобы открыть график активности орбов',
  },
  'home.activityInsights.collapseHint': {
    playful: 'Нажми, чтобы вернуться к недельной сводке',
    focus: 'Нажмите, чтобы вернуться к недельной сводке',
  },
  'home.activityInsights.chartTitle': {
    playful: 'Дневник орбов',
    focus: 'Ежедневная активность орбов',
  },
  'home.activityInsights.period': {
    playful: 'Последние {{days}} дней',
    focus: 'Период: {{days}} дней',
  },
  'home.activityInsights.productivityValue': {
    playful: '{{percent}} %',
    focus: '{{percent}} %',
  },
  'home.activityInsights.productivityWithGoal': {
    playful: 'Продуктивность относительно цели {{goal}} орбов в день',
    focus: 'Продуктивность относительно дневной цели ({{goal}} орбов)',
  },
  'home.activityInsights.productivityNoGoal': {
    playful: 'Активные дни — задай цель через орбы сверху',
    focus: 'Активные дни — задайте цель через счётчик орбов',
  },
  'home.activityInsights.orbPeekA11y': {
    playful: '{{count}} орбов в этот день',
    focus: '{{count}} орбов в этот день',
  },
  'orbCounter.label': {
    playful: 'Энерго-орбы',
    focus: 'Орбы',
  },
  'orbCounter.dailyProgress': {
    playful: 'Сегодня {{current}}/{{goal}} орбов',
    focus: 'Сегодня {{current}}/{{goal}}',
  },
  'orbCounter.openDailyGoalHint': {
    playful: 'Нажми, чтобы изменить дневную цель',
    focus: 'Изменить дневную цель',
  },
  'dailyGoal.title': {
    playful: 'Сколько орбов хочешь собрать сегодня?',
    focus: 'Задать дневную цель',
  },
  'dailyGoal.subtitle': {
    playful:
      'За каждый завершённый урок ты получаешь орбы. Выбери, сколько хочешь учиться сегодня — подстрой темп под свой день.',
    focus:
      'Орбы начисляются за каждый завершённый урок. Укажите, сколько орбов хотите получить сегодня и сколько времени готовы потратить.',
  },
  'dailyGoal.explanationTitle': {
    playful: 'Орбы = прогресс',
    focus: 'Орбы как прогресс обучения',
  },
  'dailyGoal.explanationBody': {
    playful:
      'Каждый урок приносит орбы. Больше орбов — больше практики, но темп выбираешь ты. Низкая дневная цель — это нормально.',
    focus:
      'За каждый завершённый урок начисляются орбы. Дневная цель задаёт темп и время — отдельно от общего прогресса.',
  },
  'dailyGoal.targetLabel': {
    playful: 'Твоя дневная цель',
    focus: 'Дневная цель в орбах',
  },
  'dailyGoal.presetOrbs': {
    playful: '{{count}} орбов',
    focus: '{{count}}',
  },
  'dailyGoal.notificationsTitle': {
    playful: 'Напоминание вечером',
    focus: 'Напоминание об обучении',
  },
  'dailyGoal.notificationsBody': {
    playful:
      'Можем напомнить вечером, если дневная цель ещё не достигнута — только с твоего разрешения.',
    focus:
      'Необязательное вечернее уведомление, если дневная цель ещё не достигнута.',
  },
  'dailyGoal.notificationsExpoGoHint': {
    playful:
      'Напоминания недоступны в Expo Go. Их можно включить позже в development build.',
    focus:
      'Уведомления недоступны в Expo Go. Их можно включить в development build.',
  },
  'dailyGoal.cta': {
    playful: 'Сохранить цель',
    focus: 'Сохранить цель',
  },
  'dailyGoal.saving': {
    playful: 'Сохранение…',
    focus: 'Сохранение…',
  },
  'dailyGoal.notificationTitle': {
    playful: 'StructAI',
    focus: 'StructAI',
  },
  'dailyGoal.notificationBody': {
    playful: 'Ещё {{remaining}} орбов до дневной цели — короткий урок тоже считается.',
    focus: 'Осталось {{remaining}} орбов до дневной цели.',
  },
  'dailyGoal.notificationBodySkill': {
    playful: 'Вернись и примени «{{skill}}» — ещё {{remaining}} орбов до дневной цели.',
    focus: 'Вернись и примени «{{skill}}» — ещё {{remaining}} орбов до дневной цели.',
  },
  'pathCard.chapters': {
    playful: 'Глава {{current}} из {{total}}',
    focus: 'Гл. {{current}}/{{total}}',
  },
  'pathCard.chaptersTotal': {
    playful: '{{total}} глав ждут тебя',
    focus: '{{total}} глав',
  },
  'paths.badgeNew': {
    playful: 'Новое',
    focus: 'Новое',
  },
  'paths.sectionActive': {
    playful: 'Твои активные треки',
    focus: 'В процессе',
  },
  'paths.sectionAvailable': {
    playful: 'Открой новое',
    focus: 'Доступные треки',
  },
  'paths.sectionLocked': {
    playful: 'Пока закрыто',
    focus: 'Закрытые пути',
  },
  'paths.lockedBadge': {
    playful: 'Закрыто',
    focus: 'Закрыто',
  },
  'paths.lockedTitle': {
    playful: 'Этот путь пока закрыт',
    focus: 'Путь закрыт',
  },
  'paths.lockedBody': {
    playful: 'Сначала заверши «{{path}}» — потом откроется этот путь!',
    focus: 'Сначала завершите «{{path}}», чтобы открыть этот путь обучения.',
  },
  'paths.lockedCta': {
    playful: 'К списку путей',
    focus: 'К списку путей',
  },
  'paths.title.prompt_basics': {
    playful: 'Основы промптов',
    focus: 'Основы промптов',
  },
  'paths.title.structure_lab': {
    playful: 'Лаборатория структуры',
    focus: 'Структурная лаборатория',
  },
  'paths.title.context_mastery': {
    playful: 'Мастерство контекста',
    focus: 'Контекст',
  },
  'paths.title.iteration_loops': {
    playful: 'Циклы итераций',
    focus: 'Итерации',
  },
  'paths.title.eval_scoring': {
    playful: 'Оценка и баллы',
    focus: 'Оценивание',
  },
  'paths.title.prompt_mastery': {
    playful: 'Мастерство промптов',
    focus: 'Мастерство промптов',
  },
  'paths.emptyActive': {
    playful: 'Готов к первому приключению? Выбери трек и начинай!',
    focus: 'Выберите трек, чтобы начать.',
  },
  'pathDetail.progressTitle': {
    playful: 'Твой прогресс',
    focus: 'Прогресс',
  },
  'pathDetail.chapterListTitle': {
    playful: 'Твои главы',
    focus: 'Главы',
  },
  'pathDetail.continueCta': {
    playful: 'Продолжим!',
    focus: 'Продолжить',
  },
  'pathDetail.startCta': {
    playful: 'Начать сейчас!',
    focus: 'Начать',
  },
  'pathDetail.notFound': {
    playful: 'Пока мы не знаем такой трек.',
    focus: 'Трек не найден.',
  },
  'lesson.stepLabel': {
    playful: 'Шаг {{current}} из {{total}}',
    focus: '{{current}}/{{total}}',
  },
  'lesson.depthBadgePlayful': {
    playful: 'Короче · Проще',
    focus: 'Короче · Проще',
  },
  'lesson.depthBadgeFocus': {
    playful: 'Глубже · Больше вопросов',
    focus: 'Глубже · Больше вопросов',
  },
  'lesson.depthInfoTitle': {
    playful: 'Твой режим обучения',
    focus: 'Режим обучения',
  },
  'lesson.depthInfoBodyPlayful': {
    playful:
      'В игривом режиме уроки короче и проще — та же цель, меньше шагов и более легкий язык.',
    focus:
      'В игривом режиме уроки короче и проще — та же цель, меньше шагов и более легкий язык.',
  },
  'lesson.depthInfoBodyFocus': {
    playful:
      'В режиме фокуса больше глубины: длиннее тексты, больше вопросов и сложнее задания.',
    focus:
      'В режиме фокуса больше глубины: длиннее тексты, больше вопросов и сложнее задания.',
  },
  'lesson.depthInfoAgeRecommended': {
    playful:
      'До 15 лет игривый режим особенно рекомендуется — его можно сменить в профиле в любой момент.',
    focus:
      'До 15 лет особенно рекомендуется игривый режим — настраивается в профиле или при онбординге.',
  },
  'lesson.depthInfoSettingsHint': {
    playful:
      'Режим берется из профиля или онбординга — там его можно изменить в любой момент.',
    focus:
      'Режим задается в профиле или при онбординге и там же меняется.',
  },
  'lesson.depthInfoAccessibilityHint': {
    playful: 'Нажми для краткого объяснения режима обучения.',
    focus: 'Нажать для объяснения режима обучения.',
  },
  'lesson.glossaryTapHint': {
    playful: 'Нажми для краткого объяснения этого термина.',
    focus: 'Нажать для краткого объяснения этого термина.',
  },
  'lesson.typeChoice': {
    playful: 'Выбор варианта',
    focus: 'Выбор',
  },
  'lesson.typeFillBlank': {
    playful: 'Заполни пропуск',
    focus: 'Пропуск',
  },
  'lesson.typeTrueFalse': {
    playful: 'Верно или неверно',
    focus: 'Верно/Неверно',
  },
  'lesson.typeReorder': {
    playful: 'Порядок шагов',
    focus: 'Порядок',
  },
  'lesson.typeMatching': {
    playful: 'Сопоставить',
    focus: 'Сопоставление',
  },
  'lesson.typeErrorFinding': {
    playful: 'Найти ошибку',
    focus: 'Ошибка',
  },
  'lesson.typeCategorize': {
    playful: 'Категории',
    focus: 'Классификация',
  },
  'lesson.fillBlankInstruction': {
    playful: 'Заполни пропуск подходящим словом.',
    focus: 'Заполните пропуск корректно.',
  },
  'lesson.trueLabel': {
    playful: 'Верно',
    focus: 'Верно',
  },
  'lesson.falseLabel': {
    playful: 'Неверно',
    focus: 'Неверно',
  },
  'lesson.reorderHint': {
    playful: 'Расставь шаги в правильном порядке.',
    focus: 'Расположите элементы по порядку.',
  },
  'lesson.matchingInstruction': {
    playful: 'Нажми термин слева, затем подходящее определение справа.',
    focus: 'Выберите термин, затем сопоставьте определение.',
  },
  'lesson.errorFindingInstruction': {
    playful: 'Нажми на слово, которое создаёт проблему.',
    focus: 'Нажмите проблемный сегмент.',
  },
  'lesson.categorizeInstruction': {
    playful: 'Нажми элемент, затем подходящую категорию.',
    focus: 'Выберите элемент, затем назначьте категорию.',
  },
  'lesson.categorizePoolLabel': {
    playful: 'Ещё не распределено',
    focus: 'Открыто',
  },
  'lesson.perfectBonus': {
    playful: 'Идеально! Бонус-орбы твои.',
    focus: 'Идеально. Бонус получен.',
  },
  'orb.speech.readingStart.a': {
    playful: 'Ок — я с тобой. Читай этот кусок.',
    focus: '',
  },
  'orb.speech.readingStart.b': {
    playful: 'Новая страница! Впитываем.',
    focus: '',
  },
  'orb.speech.readingStart.c': {
    playful: 'Глаза сюда — это важно.',
    focus: '',
  },
  'orb.speech.reading.a': {
    playful: 'Хм… смотри на структуру.',
    focus: '',
  },
  'orb.speech.reading.b': {
    playful: 'Интересно. В чём настоящая задача промпта?',
    focus: '',
  },
  'orb.speech.reading.c': {
    playful: 'Дальше — подсказка в формулировке.',
    focus: '',
  },
  'orb.speech.practicing.a': {
    playful: 'Твой ход. Выбирай осознанно.',
    focus: '',
  },
  'orb.speech.practicing.b': {
    playful: 'Не торопись — бери самый точный вариант.',
    focus: '',
  },
  'orb.speech.practicing.c': {
    playful: 'Хочу чёткий ответ. Давай.',
    focus: '',
  },
  'orb.speech.correct.a': {
    playful: 'Да! Мышление верное.',
    focus: '',
  },
  'orb.speech.correct.b': {
    playful: 'В точку — вот паттерн.',
    focus: '',
  },
  'orb.speech.correct.c': {
    playful: 'Чисто. Запомни это.',
    focus: '',
  },
  'orb.speech.wrong.a': {
    playful: 'Почти. Смени угол один раз.',
    focus: '',
  },
  'orb.speech.wrong.b': {
    playful: 'Не совсем — перечитай ограничение.',
    focus: '',
  },
  'orb.speech.wrong.c': {
    playful: 'Близко! Трюк был в деталях.',
    focus: '',
  },
  'orb.speech.celebrating.a': {
    playful: 'Получилось! Урок наш.',
    focus: '',
  },
  'orb.speech.celebrating.b': {
    playful: 'Бум — прогресс открыт.',
    focus: '',
  },
  'orb.speech.celebrating.c': {
    playful: 'Сильный заход. Дальше!',
    focus: '',
  },
  'orb.speech.lowEnergy.a': {
    playful: 'Эй — ещё пару Орбов, и дневная цель оживает.',
    focus: '',
  },
  'orb.speech.lowEnergy.b': {
    playful: 'Я чуть тусклый. Короткий урок поможет.',
    focus: '',
  },
  'orb.speech.lowEnergy.c': {
    playful: 'Проверка энергии: нужен маленький вин.',
    focus: '',
  },
  'orb.speech.focus.correctTip.a': {
    playful: '',
    focus: 'Держи этот паттерн — назови задачу до письма.',
  },
  'orb.speech.focus.correctTip.b': {
    playful: '',
    focus: 'Хорошо. Дальше ужесточи одно ограничение.',
  },
  'orb.speech.focus.correctTip.c': {
    playful: '',
    focus: 'Сильно. Повтори эту структуру в следующем промпте.',
  },
  'orb.speech.focus.wrongTip.a': {
    playful: '',
    focus: 'Совет: раздели роль, задачу и формат.',
  },
  'orb.speech.focus.wrongTip.b': {
    playful: '',
    focus: 'Проверь ограничение, которое сузило ответ.',
  },
  'orb.speech.focus.wrongTip.c': {
    playful: '',
    focus: 'Следующая попытка: какой формат вывода требовался?',
  },
  'orb.speech.focus.celebrating.a': {
    playful: '',
    focus: 'Урок завершён. Возьми одно ясное правило дальше.',
  },
  'orb.speech.focus.celebrating.b': {
    playful: '',
    focus: 'Готово. Зафиксируй паттерн, который дал проход.',
  },
  'orb.speech.focus.lowEnergy.a': {
    playful: '',
    focus: 'Дневная цель низкая — один фокусный урок закрывает разрыв.',
  },
  'orb.speech.focus.lowEnergy.b': {
    playful: '',
    focus: 'Совет: сегодня заверши короткий блок практики.',
  },
  'lesson.check': {
    playful: 'Проверить ответ!',
    focus: 'Проверить',
  },
  'lesson.next': {
    playful: 'Дальше!',
    focus: 'Далее',
  },
  'lesson.correctFeedback': {
    playful: 'Отлично! Ответ точный.',
    focus: 'Верно.',
  },
  'lesson.wrongFeedback': {
    playful: 'Ещё нет — вот как исправить.',
    focus: 'Неверно — почему, затем следующий паттерн.',
  },
  'lesson.hintLabel': {
    playful: 'Подсказка:',
    focus: 'Подсказка:',
  },
  'lesson.coachingWhyLabel': {
    playful: 'Почему это не сработало',
    focus: 'Почему это не сработало',
  },
  'lesson.coachingNextLabel': {
    playful: 'Что делать дальше',
    focus: 'Следующий паттерн',
  },
  'lesson.coachingNextFromBeat': {
    playful: 'В следующей попытке сознательно примени {{term}}.',
    focus: 'Дальше: осознанно примените {{term}} при повторе.',
  },
  'lesson.coachingNextFallback': {
    playful: 'Перечитай «почему» — выбери вариант, который закрывает пробел.',
    focus: 'Перечитайте причину, затем выберите вариант, который её закрывает.',
  },
  'lesson.learningBeatLabel': {
    playful: 'Запомни',
    focus: 'Главное',
  },
  'lesson.completeTitle': {
    playful: 'Урок пройден!',
    focus: 'Урок завершен.',
  },
  'lesson.orbsEarned': {
    playful: '+{{count}} орбов для тебя!',
    focus: '+{{count}} орбов',
  },
  'lesson.practiceComplete': {
    playful: 'Повтор пройден — без дополнительных орбов.',
    focus: 'Повторено. Дополнительных орбов нет.',
  },
  'sessionSkill.eyebrow': {
    playful: 'Теперь ты умеешь',
    focus: 'Полученный навык',
  },
  'sessionSkill.generic.name': {
    playful: 'Более ясный промптинг',
    focus: 'Более ясный промптинг',
  },
  'sessionSkill.generic.proof': {
    playful: 'Ты отработал конкретный паттерн промптинга, который можно взять на следующую задачу с ИИ.',
    focus: 'Ты отработал переиспользуемый паттерн промптинга для следующей задачи с ИИ.',
  },
  'sessionSkill.comeBackTomorrow': {
    playful: 'Вернись завтра и примени этот паттерн к реальной задаче — так он закрепляется.',
    focus: 'Вернись завтра и примени этот паттерн к реальной задаче.',
  },
  'sessionSkill.pb-1.name': {
    playful: 'Понять, что такое промпт',
    focus: 'Определить промпт как бриф',
  },
  'sessionSkill.pb-1.proof': {
    playful: 'Ты отличаешь смутное желание от рабочей инструкции — первый шаг к лучшим ответам.',
    focus: 'Ты отличаешь смутное желание от рабочей инструкции для модели.',
  },
  'sessionSkill.pb-2.name': {
    playful: 'Писать чёткие инструкции',
    focus: 'Писать чёткие инструкции',
  },
  'sessionSkill.pb-2.proof': {
    playful: 'Ты заменяешь размытые просьбы прямыми инструкциями, которым модель может следовать.',
    focus: 'Ты заменяешь размытые просьбы прямыми, выполнимыми инструкциями.',
  },
  'sessionSkill.pb-3.name': {
    playful: 'Сначала задать цель',
    focus: 'Сначала задать цель',
  },
  'sessionSkill.pb-3.proof': {
    playful: 'Ты называешь желаемый результат до того, как модель начнёт работу.',
    focus: 'Ты формулируешь желаемый результат до отправки промпта.',
  },
  'sessionSkill.pb-4.name': {
    playful: 'Задать формат ответа',
    focus: 'Задать формат ответа',
  },
  'sessionSkill.pb-4.proof': {
    playful: 'Ты просишь форму ответа (список, длина, структура), а не надеешься.',
    focus: 'Ты задаёшь список/длину/структуру вместо надежды на удобную форму.',
  },
  'sessionSkill.pb-5.name': {
    playful: 'Управлять примерами',
    focus: 'Управлять примерами',
  },
  'sessionSkill.pb-5.proof': {
    playful: 'Ты показываешь модели, как выглядит «хорошо», а не только описываешь.',
    focus: 'Ты используешь примеры, чтобы модель попала в нужный паттерн.',
  },
  'sessionSkill.pb-6.name': {
    playful: 'Правильно использовать негативные ограничения',
    focus: 'Применять негативные ограничения',
  },
  'sessionSkill.pb-6.proof': {
    playful: 'Ты запрещаешь плохие паттерны, не оставляя модель гадать, что делать вместо этого.',
    focus: 'Ты сочетаешь запреты с позитивным руководством, чтобы модель знала, что делать.',
  },
  'sessionSkill.pb-7.name': {
    playful: 'Держать промпты настолько короткими, насколько нужно',
    focus: 'Правильно выбирать длину промпта',
  },
  'sessionSkill.pb-7.proof': {
    playful: 'Ты убираешь воду и оставляешь только контекст, задачу и ограничения, которые меняют ответ.',
    focus: 'Ты убираешь воду, чтобы каждая строка давала контекст, задачу или ограничение.',
  },
  'sessionSkill.pb-8.name': {
    playful: 'Собрать полный basics-бриф',
    focus: 'Собрать полный basics-бриф',
  },
  'sessionSkill.pb-8.proof': {
    playful: 'Ты объединяешь цель, формат, примеры и запреты в один компактный бриф.',
    focus: 'Ты объединяешь цель, формат, примеры и ограничения в один бриф.',
  },
  'sessionSkill.pb-9.name': {
    playful: 'Заменять размытые слова точными',
    focus: 'Предпочитать точные формулировки',
  },
  'sessionSkill.pb-9.proof': {
    playful: 'Ты меняешь «коротко» / «хорошо» на измеримые пределы.',
    focus: 'Ты заменяешь относительные слова измеримыми пределами.',
  },
  'sessionSkill.pb-10.name': {
    playful: 'Давать модели одну задачу за раз',
    focus: 'Одна задача на промпт',
  },
  'sessionSkill.pb-10.proof': {
    playful: 'Ты разделяешь многозадачные просьбы так, чтобы у каждого промпта была одна ясная работа.',
    focus: 'Ты разделяешь многозадачные просьбы на одну ясную задачу на промпт.',
  },
  'sessionSkill.pb-11.name': {
    playful: 'Указать, для кого ответ',
    focus: 'Указать аудиторию',
  },
  'sessionSkill.pb-11.proof': {
    playful: 'Ты называешь читателя, чтобы тон и глубина совпали.',
    focus: 'Ты называешь аудиторию, чтобы тон и глубина совпали с читателем.',
  },
  'sessionSkill.pb-12.name': {
    playful: 'Замечать типичные ошибки новичка',
    focus: 'Замечать типичные ошибки новичка',
  },
  'sessionSkill.pb-12.proof': {
    playful: 'Ты ловишь отсутствие цели, формата или ограничений до отправки.',
    focus: 'Ты ловишь отсутствие цели, формата или ограничений до отправки.',
  },
  'promptLab.learnedEyebrow': {
    playful: 'Ты потренировал',
    focus: 'Отработанный навык',
  },
  'promptLab.learnedImproved': {
    playful: 'Ты улучшил этот черновик на +{{delta}} — это реальный прирост навыка, не просто число.',
    focus: 'Черновик улучшен на +{{delta}}. Прирост: яснее структура и ограничения.',
  },
  'promptLab.learnedNext': {
    playful: 'Следующий навык закрепить: {{skill}}',
    focus: 'Следующий фокус навыка: {{skill}}',
  },
  'promptLab.learnedComplete': {
    playful: 'Ты закрыл ключевые столпы — роль, контекст, формат, ограничения.',
    focus: 'Ключевые столпы на месте: роль, контекст, формат, ограничения.',
  },

  'promptLab.dictationStart': {
    playful: 'Надиктовать промпт',
    focus: 'Надиктовать промпт',
  },
  'promptLab.dictationStop': {
    playful: 'Остановить диктовку',
    focus: 'Остановить диктовку',
  },
  'promptLab.dictationListening': {
    playful: 'Слушаю… говори свой промпт',
    focus: 'Слушаю… продиктуй промпт',
  },
  'promptLab.dictationPermission': {
    playful: 'Для диктовки нужен доступ к микрофону. Включи его в настройках.',
    focus: 'Для диктовки требуется разрешение микрофона.',
  },
  'promptLab.dictationError': {
    playful: 'Диктовка сбойнула — нажми на микрофон ещё раз.',
    focus: 'Диктовка не удалась. Нажми на микрофон и попробуй снова.',
  },
  'promptLab.dictationUnavailable': {
    playful: 'Диктовка нужна в StructAI development build (не Expo Go).',
    focus: 'Диктовка требует development build StructAI — в Expo Go нет speech-модуля.',
  },
  'orb.voice.tapHint': {
    playful: 'Нажми на Orb, чтобы услышать.',
    focus: 'Нажми на Orb для voiceover.',
  },
  'orb.voice.tapA11y': {
    playful: 'Воспроизвести голос Orb',
    focus: 'Воспроизвести voiceover Orb',
  },
  'orb.voice.needsDevBuild': {
    playful: 'Голос нужен в StructAI development build (не Expo Go).',
    focus: 'Voiceover требует development build StructAI.',
  },
  'orb.speech.onboarding.welcome': {
    playful: 'Привет! Я твой Orb — локальный коуч по промптам. Коротко и ясно.',
    focus: 'Я твой Orb-коуч. Будем практиковать ясные промпты — шаг за шагом.',
  },
  'orb.speech.onboarding.meetReady': {
    playful: 'Всего пара вопросов — и поехали!',
    focus: 'Коротко несколько деталей — затем старт.',
  },
  'orb.speech.onboarding.mode': {
    playful: 'Выбери вайб — я подстрою темп и тон. Навыки те же.',
    focus: 'Focus или Playful: те же навыки, разная плотность. Выбери своё.',
  },
  'orb.speech.onboarding.modePlayful': {
    playful: 'Класс — Playful. Короткие биты, больше энергии. Я рядом.',
    focus: 'Выбран Playful: короче шаги, те же цели.',
  },
  'orb.speech.onboarding.modeFocus': {
    playful: 'Focus — чисто и плотно. Меньше шума.',
    focus: 'Выбран Focus: короткие советы, глубина на проверке.',
  },
  'orb.speech.onboarding.loop': {
    playful: 'Цикл: учись → практикуй → становись лучше. Готов к первому навыку?',
    focus: 'Три шага: учиться, практиковать, улучшать. Начни, когда готов.',
  },
  'orb.speech.onboarding.dailyGoal': {
    playful: 'Поставь маленькую дневную цель — напомню без стресса.',
    focus: 'Выбери честную дневную цель по орбам. Стрик чистый.',
  },
  'orb.speech.lessonComplete': {
    playful: 'Да! Этот навык твой — завтра примени его снова.',
    focus: 'Урок пройден. Завтра используй этот паттерн на реальной задаче.',
  },
  'orb.speech.lessonRetry': {
    playful: 'Почти! Давай повторим слабые места — ты справишься.',
    focus: 'Ещё не всё. Повтори пропущенные проверки и закрепи паттерн.',
  },

  'lesson.backToPath': {
    playful: 'Назад к треку',
    focus: 'Назад к треку',
  },
  'lesson.continueNext': {
    playful: 'К следующему уроку!',
    focus: 'Следующая глава',
  },
  'lesson.lockedTitle': {
    playful: 'Эта глава пока закрыта',
    focus: 'Глава заблокирована',
  },
  'lesson.lockedBody': {
    playful: 'Сначала пройди предыдущие главы — тогда откроется доступ сюда.',
    focus: 'Сначала заверши предыдущие главы.',
  },
  'lesson.notFound': {
    playful: 'Такого урока пока нет.',
    focus: 'Урок не найден.',
  },
  'lesson.retryTitle': {
    playful: 'Пока не получилось!',
    focus: 'Порог не достигнут.',
  },
  'lesson.retrySummary': {
    playful: '{{correct}} из {{total}} верно — попробуй ещё!',
    focus: '{{correct}}/{{total}} верно. Нужно больше 60%.',
  },
  'lesson.retryPrimary': {
    playful: 'Попробовать снова',
    focus: 'Повторить урок',
  },
  'lesson.retrySecondary': {
    playful: 'Продолжить позже',
    focus: 'Продолжить позже',
  },
  'profile.statsSection': {
    playful: 'Твои достижения',
    focus: 'Статистика',
  },
  'profile.modeSection': {
    playful: 'Как хочешь учиться?',
    focus: 'Режим отображения',
  },
  'profile.modePlayful': {
    playful: 'Игривый',
    focus: 'Игривый',
  },
  'profile.modeFocus': {
    playful: 'Фокус',
    focus: 'Фокус',
  },
  'profile.modeDescription': {
    playful:
      'Игривый: короче тексты и меньше вопросов. Фокус: больше глубины и уточнений — та же цель обучения.',
    focus:
      'Игривый: меньше оцениваемых шагов. Фокус: больше глубины — та же цель обучения.',
  },
  'profile.languageSection': {
    playful: 'Язык',
    focus: 'Язык',
  },
  'profile.languageDescription': {
    playful: 'Выбери язык интерфейса. Твой прогресс сохранится.',
    focus: 'Выберите язык интерфейса.',
  },
  'profile.languageDe': {
    playful: 'Немецкий',
    focus: 'Немецкий',
  },
  'profile.languageEn': {
    playful: 'Английский',
    focus: 'Английский',
  },
  'profile.languageFr': {
    playful: 'Французский',
    focus: 'Французский',
  },
  'profile.languageRu': {
    playful: 'Русский',
    focus: 'Русский',
  },
  'profile.byokSection': {
    playful: 'Твой ключ ИИ',
    focus: 'API-ключ (BYOK)',
  },
  'profile.byokDescription': {
    playful:
      'Один ключ на провайдера — все остается на устройстве и никогда не синхронизируется.',
    focus:
      'Один API-ключ на провайдера, локально в Secure Store. Ключи не синхронизируются.',
  },
  'profile.byokPlaceholder': {
    playful: 'Вставь API-ключ',
    focus: 'Введите API-ключ',
  },
  'profile.byokSave': {
    playful: 'Сохранить ключ',
    focus: 'Сохранить',
  },
  'profile.byokDelete': {
    playful: 'Удалить ключ',
    focus: 'Удалить',
  },
  'profile.byokSavedBadge': {
    playful: 'Надежно сохранен',
    focus: 'Сохранен',
  },
  'promptLab.inputLabel': {
    playful: 'Твой промпт',
    focus: 'Промпт',
  },
  'promptLab.inputPlaceholder': {
    playful: 'Напиши промпт здесь...',
    focus: 'Введите промпт...',
  },
  'promptLab.scoreButton': {
    playful: 'Оценить!',
    focus: 'Оценить',
  },
  'promptLab.demoBanner': {
    playful: 'Демо-режим: без API-ключа тебя оценивает локальный тренер.',
    focus: 'Демо-режим: локальная оценка без API-ключа.',
  },
  'promptLab.addKeyCta': {
    playful: 'Добавить ключ в профиле',
    focus: 'Указать API-ключ в профиле',
  },
  'promptLab.scoreTitle': {
    playful: 'Твой разбор',
    focus: 'Оценка',
  },
  'promptLab.catStructure': {
    playful: 'Структура',
    focus: 'Структура',
  },
  'promptLab.catGoal': {
    playful: 'Цель',
    focus: 'Постановка цели',
  },
  'promptLab.catConstraints': {
    playful: 'Ограничения',
    focus: 'Ограничения',
  },
  'promptLab.feedbackStrong': {
    playful: 'Сильный промпт! Структура отличная.',
    focus: 'Общая оценка: сильная.',
  },
  'promptLab.feedbackOkay': {
    playful: 'Неплохо! Можно еще лучше.',
    focus: 'Общая оценка: хорошая.',
  },
  'promptLab.feedbackWeak': {
    playful: 'Хорошее начало - давай отточим.',
    focus: 'Общая оценка: требует доработки.',
  },
  'promptLab.hintStructure': {
    playful: 'Добавь структуры: раздели контекст, задачу и ограничения по блокам.',
    focus: 'Зона улучшения: четко разделить контекст, задачу и ограничения.',
  },
  'promptLab.hintGoal': {
    playful: 'Точнее скажи модели, какой результат нужен.',
    focus: 'Зона улучшения: точнее определить ожидаемый результат.',
  },
  'promptLab.hintConstraints': {
    playful: 'Сделай ограничения четче и забери максимальный балл.',
    focus: 'Зона улучшения: более точные ограничения (длина, формат, аудитория).',
  },
  'promptLab.historyTitle': {
    playful: 'История твоих баллов',
    focus: 'История баллов',
  },
  'promptLab.promptHistoryTitle': {
    playful: 'Твои оценённые промпты',
    focus: 'Недавно оценённые промпты',
  },
  'promptLab.promptHistoryDescription': {
    playful: 'Нажми на промпт, чтобы снова загрузить его в редактор.',
    focus: 'Выберите запись, чтобы снова использовать этот промпт.',
  },
  'promptLab.promptHistoryEmpty': {
    playful: 'Пока нет оценённых промптов — оцени один, чтобы начать след.',
    focus: 'Оценённые промпты ещё не сохранены.',
  },
  'promptLab.promptHistoryMissing': {
    playful: 'Старая запись — текст промпта тогда ещё не сохранялся.',
    focus: 'Старая запись без сохранённого текста промпта.',
  },
  'promptLab.promptHistoryScore': {
    playful: 'Балл {{score}}',
    focus: '{{score}} / 100',
  },
  'promptLab.promptHistoryTapReuse': {
    playful: 'Нажми, чтобы использовать снова',
    focus: 'Использовать снова',
  },
  'promptLab.promptHistoryReuseHint': {
    playful: 'Загружает этот промпт в поле ввода',
    focus: 'Загружает этот промпт в поле ввода',
  },
  'promptLab.promptHistoryItemA11y': {
    playful: 'Оценённый промпт, балл {{score}}',
    focus: 'Оценённый промпт, балл {{score}}',
  },
  'promptLab.scoringInProgress': {
    playful: 'Идет оценка...',
    focus: 'Оценка...',
  },
  'promptLab.liveBadge': {
    playful: 'Оценка в реальном времени: {{provider}}',
    focus: 'Онлайн: {{provider}}',
  },
  'promptLab.fallbackInvalidKey': {
    playful: 'Твой ключ отклонен - в этот раз оценил локальный тренер. Проверь ключ в профиле.',
    focus: 'API-ключ отклонен. Использована локальная оценка. Проверьте ключ в профиле.',
  },
  'promptLab.fallbackQuota': {
    playful: 'Квота API закончилась или ограничена - локальный тренер берет это на себя.',
    focus: 'Квота или баланс исчерпаны. Использована локальная оценка.',
  },
  'promptLab.fallbackNetwork': {
    playful: 'Нет связи с ИИ - локальный тренер берет это на себя.',
    focus: 'API недоступен. Использована локальная оценка.',
  },
  'promptLab.fallbackGeneric': {
    playful: 'Ответ ИИ оказался бесполезным - локальный тренер берет это на себя.',
    focus: 'Ошибка API. Использована локальная оценка.',
  },
  'promptLab.modeScore': {
    playful: 'Оценить',
    focus: 'Оценка',
  },
  'promptLab.modeCompare': {
    playful: 'Сравнить модели',
    focus: 'Сравнение',
  },
  'promptLab.detailHintsTitle': {
    playful: 'Конкретные идеи для улучшения',
    focus: 'Конкретные подсказки',
  },
  'promptLab.improvementPathTitle': {
    playful: 'Самый ясный следующий шаг',
    focus: 'Главный путь улучшения',
  },
  'promptLab.improvementPathSecondary': {
    playful: 'Потом: {{tip}}',
    focus: 'Далее: {{tip}}',
  },
  'promptLab.improvementPathComplete': {
    playful: 'Отлично — роль, контекст, формат и ограничения на месте.',
    focus: 'Все ключевые столпы есть: роль, контекст, формат, ограничения.',
  },
  'promptLab.missing.context': {
    playful: 'В промпте нет контекста — какой фон должна учесть ИИ?',
    focus: 'Нет контекста: добавьте фон или исходные данные для ответа.',
  },
  'promptLab.missing.role': {
    playful: 'В промпте нет роли — скажи ИИ, кем ей быть.',
    focus: 'Нет роли: задайте чёткую персону или позицию модели.',
  },
  'promptLab.missing.format': {
    playful: 'В промпте нет формата — пункты, абзацы, таблица…?',
    focus: 'Нет формата: укажите форму вывода (список, абзацы, JSON, …).',
  },
  'promptLab.missing.constraints': {
    playful: 'В промпте нет ограничений — длина, аудитория или тон.',
    focus: 'Нет ограничений: задайте жёсткие рамки (длина, аудитория, тон).',
  },
  'promptLab.comparisonTitle': {
    playful: '+{{delta}} баллов — вот что улучшилось',
    focus: '+{{delta}} баллов по сравнению с предыдущим черновиком',
  },
  'promptLab.demoWeakExample': {
    playful: 'Загрузить слабый пример',
    focus: 'Слабый пример',
  },
  'promptLab.demoImprovedExample': {
    playful: 'Загрузить улучшенную версию',
    focus: 'Улучшенная версия',
  },
  'modelComparer.description': {
    playful:
      'Один промпт — несколько моделей параллельно. Листай ответы и сравнивай скорость и стоимость.',
    focus:
      'Отправляет один промпт параллельно 2–3 настроенным провайдерам и показывает ответы рядом (горизонтальный скролл).',
  },
  'modelComparer.needTwoKeys': {
    playful: 'Добавь минимум два API-ключа в профиле для сравнения.',
    focus: 'Нужны минимум два ключа провайдеров в профиле.',
  },
  'modelComparer.modelPickerLabel': {
    playful: 'Выбери модели (2–3)',
    focus: 'Модели (2–3)',
  },
  'modelComparer.modelPickerHint': {
    playful: 'Минимум две и максимум три модели.',
    focus: 'Выбор: минимум 2, максимум 3 модели.',
  },
  'modelComparer.promptLabel': {
    playful: 'Твой промпт',
    focus: 'Промпт',
  },
  'modelComparer.promptPlaceholder': {
    playful: 'Напиши промпт для всех моделей...',
    focus: 'Промпт для всех выбранных моделей...',
  },
  'modelComparer.compareButton': {
    playful: 'Сравнить параллельно',
    focus: 'Сравнить',
  },
  'modelComparer.comparing': {
    playful: 'Модели отвечают...',
    focus: 'Сравнение...',
  },
  'modelComparer.resultsTitle': {
    playful: 'Ответы в сравнении',
    focus: 'Результаты',
  },
  'modelComparer.copyA11y': {
    playful: 'Скопировать ответ',
    focus: 'Скопировать ответ в буфер обмена',
  },
  'modelComparer.copiedA11y': {
    playful: 'Скопировано',
    focus: 'Ответ скопирован',
  },
  'modelComparer.latencyBadge': {
    playful: '{{seconds}} с',
    focus: '{{seconds}} с',
  },
  'modelComparer.costBadge': {
    playful: '≈ {{cost}}',
    focus: '≈ {{cost}}',
  },
  'modelComparer.errorBadge': {
    playful: 'Ошибка',
    focus: 'Ошибка',
  },
  'modelComparer.errorInvalidKey': {
    playful: 'Ключ отклонен — проверь его в профиле.',
    focus: 'Недействительный API-ключ.',
  },
  'modelComparer.errorQuota': {
    playful: 'Квота или баланс исчерпаны.',
    focus: 'Rate-limit или квота исчерпаны.',
  },
  'modelComparer.errorNetwork': {
    playful: 'Сетевая ошибка или таймаут.',
    focus: 'Сеть / таймаут.',
  },
  'modelComparer.errorGeneric': {
    playful: 'Эта модель не смогла ответить.',
    focus: 'Ответ модели не получен.',
  },
  'modelComparer.insightMoreExpensiveSlightlyDetailed': {
    playful: 'В {{costMultiplier}}× дороже, но всего на {{detailPercent}}% подробнее остальных.',
    focus: 'В {{costMultiplier}}× дороже, лишь на {{detailPercent}}% больше текста.',
  },
  'modelComparer.insightMoreExpensiveMuchDetailed': {
    playful: 'В {{costMultiplier}}× дороже и на {{detailPercent}}% подробнее остальных.',
    focus: 'В {{costMultiplier}}× дороже, текст на {{detailPercent}}% длиннее.',
  },
  'modelComparer.insightMoreExpensiveShorter': {
    playful: 'В {{costMultiplier}}× дороже, ответ на {{detailPercent}}% короче.',
    focus: 'В {{costMultiplier}}× дороже, ответ короче на {{detailPercent}}%.',
  },
  'modelComparer.insightMoreExpensiveSimilarDetail': {
    playful: 'В {{costMultiplier}}× дороже при похожей длине ответа.',
    focus: 'В {{costMultiplier}}× дороже, длина текста близка к средней.',
  },
  'modelComparer.insightCheaperMoreDetailed': {
    playful: 'В {{costMultiplier}}× дешевле и на {{detailPercent}}% подробнее.',
    focus: 'В {{costMultiplier}}× дешевле, текст на {{detailPercent}}% длиннее.',
  },
  'modelComparer.insightCheaperShorter': {
    playful: 'В {{costMultiplier}}× дешевле, но на {{detailPercent}}% короче.',
    focus: 'В {{costMultiplier}}× дешевле, ответ короче на {{detailPercent}}%.',
  },
  'modelComparer.insightCheaperSimilarDetail': {
    playful: 'В {{costMultiplier}}× дешевле при похожей длине ответа.',
    focus: 'В {{costMultiplier}}× дешевле, длина текста близка к средней.',
  },
  'modelComparer.insightFaster': {
    playful: 'В {{speedMultiplier}}× быстрее — стоимость и длина похожи.',
    focus: 'В {{speedMultiplier}}× быстрее при сопоставимых cost и длине.',
  },
  'modelComparer.insightSlower': {
    playful: 'В {{speedMultiplier}}× медленнее — стоимость и длина похожи.',
    focus: 'В {{speedMultiplier}}× медленнее при сопоставимых cost и длине.',
  },
  'modelComparer.insightSimilar': {
    playful: 'Стоимость, скорость и длина близки к среднему других моделей.',
    focus: 'Cost, latency и длина текста близки к среднему других моделей.',
  },
  'modelComparer.spendingWarningDaily': {
    playful: 'Дневной лимит оценочных расходов достигнут (только оценка, без гарантии).',
    focus: 'Дневной лимит оценочных API-расходов достигнут (локальная оценка).',
  },
  'modelComparer.spendingWarningMonthly': {
    playful: 'Месячный лимит оценочных расходов достигнут (только оценка, без гарантии).',
    focus: 'Месячный лимит оценочных API-расходов достигнут (локальная оценка).',
  },
  'modelComparer.spendingWarningBoth': {
    playful: 'Дневной и месячный лимит оценочных расходов достигнут (только оценка).',
    focus: 'Дневной и месячный лимит оценочных расходов достигнут.',
  },
  'profile.spendingLimitSection': {
    playful: 'Лимит расходов',
    focus: 'Лимит расходов (BYOK)',
  },
  'profile.spendingLimitDescription': {
    playful: 'Задай дневной или месячный лимит оценочных API-расходов — предупредим локально.',
    focus: 'Опциональный дневной/месячный лимит оценочных BYOK-расходов с локальным предупреждением.',
  },
  'profile.spendingLimitDisclaimer': {
    playful: 'Только грубая оценка на устройстве — не реальный счет, без гарантии.',
    focus: 'Клиентская оценка без гарантии биллинга; только для ориентира.',
  },
  'profile.spendingLimitDailyLabel': {
    playful: 'Дневной лимит (USD, опционально)',
    focus: 'Дневной лимит USD (опционально)',
  },
  'profile.spendingLimitMonthlyLabel': {
    playful: 'Месячный лимит (USD, опционально)',
    focus: 'Месячный лимит USD (опционально)',
  },
  'profile.spendingLimitPlaceholder': {
    playful: 'напр. 1.00',
    focus: 'напр. 1.00',
  },
  'profile.spendingLimitSave': {
    playful: 'Сохранить лимит',
    focus: 'Сохранить',
  },
  'profile.spendingLimitUsageToday': {
    playful: 'Сегодня оценочно: {{amount}}',
    focus: 'Сегодня (оценка): {{amount}}',
  },
  'profile.spendingLimitUsageMonth': {
    playful: 'За месяц оценочно: {{amount}}',
    focus: 'Месяц (оценка): {{amount}}',
  },
  'profile.spendingLimitWarningDaily': {
    playful: 'Дневной лимит достигнут (оценка)',
    focus: 'Дневной лимит достигнут (оценка)',
  },
  'profile.spendingLimitWarningMonthly': {
    playful: 'Месячный лимит достигнут (оценка)',
    focus: 'Месячный лимит достигнут (оценка)',
  },
  'profile.spendingLimitWarningBoth': {
    playful: 'Дневной и месячный лимит достигнут (оценка)',
    focus: 'Дневной и месячный лимит достигнут (оценка)',
  },
  'profile.byokChecking': {
    playful: 'Проверяем твой ключ...',
    focus: 'Проверка ключа...',
  },
  'profile.byokValidBadge': {
    playful: 'Работает ({{provider}})',
    focus: 'Активен ({{provider}})',
  },
  'profile.byokInvalidError': {
    playful: 'Ключ отклонен - пожалуйста, проверь его еще раз.',
    focus: 'Ключ недействителен. Пожалуйста, проверьте.',
  },
  'profile.byokUnverifiedBadge': {
    playful: 'Сохранен - еще не проверен',
    focus: 'Сохранен (не проверен)',
  },
  'profile.byokTest': {
    playful: 'Проверить ключ',
    focus: 'Тест',
  },
  'profile.byokConfiguredCount': {
    playful: '{{count}} провайдеров подключено',
    focus: '{{count}} провайдеров настроено',
  },
  'profile.accountSection': {
    playful: 'Твой аккаунт',
    focus: 'Аккаунт',
  },
  'profile.accountDescription': {
    playful: 'Ты вошел в аккаунт. Выход завершит сессию только на этом устройстве.',
    focus: 'Вы вошли в аккаунт. Выход завершит сессию на этом устройстве.',
  },
  'profile.signOut': {
    playful: 'Выйти',
    focus: 'Выйти',
  },
  'profile.privacySection': {
    playful: 'Конфиденциальность и использование',
    focus: 'Конфиденциальность',
  },
  'profile.analyticsDisclosure': {
    playful: 'StructAI записывает пять самостоятельно размещенных событий использования. Для гостей они анонимны, после входа связаны с аккаунтом. Промпты и API-ключи никогда не отправляются.',
    focus: 'Пять самостоятельно размещенных событий измеряют воронку активации. Гостевые события анонимны; события после входа содержат ID пользователя. Содержимое промптов и API-ключи не собираются.',
  },
  'profile.guestDisplayName': {
    playful: 'Гость',
    focus: 'Гость',
  },
  'profile.resetSection': {
    playful: 'Сброс и новый старт',
    focus: 'Данные и сброс',
  },
  'profile.resetSectionDescription': {
    playful: 'Нужен чистый старт? Выбери, что удалить.',
    focus: 'Сбросить только прогресс обучения или удалить все локальные данные и снова пройти онбординг.',
  },
  'profile.resetProgressCta': {
    playful: 'Сбросить весь прогресс',
    focus: 'Сбросить весь прогресс обучения',
  },
  'profile.deleteAccountCta': {
    playful: 'Удалить всё и снова онбординг',
    focus: 'Удалить данные аккаунта и снова онбординг',
  },
  'profile.resetCancel': {
    playful: 'Отмена',
    focus: 'Отмена',
  },
  'profile.resetProgressConfirmTitle': {
    playful: 'Сбросить весь прогресс?',
    focus: 'Сбросить весь прогресс обучения?',
  },
  'profile.resetProgressConfirmBody': {
    playful: 'Уроки, пути, орбы и серии будут очищены. Ты остаёшься в системе с настройками.',
    focus: 'Очищает уроки, пути, орбы и серии. Аккаунт и настройки сохраняются.',
  },
  'profile.resetProgressConfirmAction': {
    playful: 'Сбросить прогресс',
    focus: 'Сбросить прогресс',
  },
  'profile.deleteAccountConfirmTitle': {
    playful: 'Удалить всё?',
    focus: 'Удалить данные аккаунта?',
  },
  'profile.deleteAccountConfirmBodyGuest': {
    playful: 'Прогресс, имя, ключи и настройки исчезнут — затем снова онбординг.',
    focus: 'Удаляет локальный прогресс и профиль, затем открывает онбординг.',
  },
  'profile.deleteAccountConfirmBodySignedIn': {
    playful: 'Прогресс (включая облако), выход из аккаунта и снова онбординг.',
    focus: 'Удаляет данные обучения (локально + облако), выходит из аккаунта и открывает онбординг.',
  },
  'profile.deleteAccountConfirmAction': {
    playful: 'Удалить и начать заново',
    focus: 'Удалить и начать заново',
  },
  'profile.deleteAccountFootnoteGuest': {
    playful: 'Полный wipe — снова увидишь welcome-экраны.',
    focus: 'Полный локальный wipe возвращает к онбордингу.',
  },
  'profile.deleteAccountFootnoteSignedIn': {
    playful: 'Облачный прогресс удалён, выход выполнен. Удаление email auth — через поддержку.',
    focus: 'Удаляет sync-прогресс и завершает сессию. Auth-идентичность иногда только через поддержку.',
  },
  'profile.guestAccountDescription': {
    playful: 'Ты используешь StructAI без аккаунта. Прогресс остается на этом устройстве — войди, чтобы синхронизировать.',
    focus: 'Гостевой режим. Прогресс локально на этом устройстве; вход для синхронизации между устройствами.',
  },
  'guest.saveProgressHint': {
    playful: 'Прогресс только на этом устройстве. Аккаунт позволит синхронизировать и сохранить его.',
    focus: 'Прогресс хранится только локально. Вход для синхронизации между устройствами.',
  },
  'guest.saveProgressCta': {
    playful: 'Сохранить прогресс – войти сейчас',
    focus: 'Сохранить прогресс – войти сейчас',
  },
  'auth.headline': {
    playful: 'Добро пожаловать в StructAI',
    focus: 'Вход в StructAI',
  },
  'auth.subheadline': {
    playful: 'Войди, чтобы позже можно было безопасно сохранить прогресс.',
    focus: 'Войдите, чтобы сохранить прогресс обучения.',
  },
  'auth.signInTab': {
    playful: 'Вход',
    focus: 'Вход',
  },
  'auth.signUpTab': {
    playful: 'Регистрация',
    focus: 'Регистрация',
  },
  'auth.emailPlaceholder': {
    playful: 'Электронная почта',
    focus: 'E-mail',
  },
  'auth.passwordPlaceholder': {
    playful: 'Пароль (мин. 6 символов)',
    focus: 'Пароль (мин. 6 симв.)',
  },
  'auth.signInCta': {
    playful: 'Войти',
    focus: 'Войти',
  },
  'auth.signInLoading': {
    playful: 'Вход…',
    focus: 'Вход…',
  },
  'auth.signUpCta': {
    playful: 'Создать аккаунт',
    focus: 'Регистрация',
  },
  'auth.signUpLoading': {
    playful: 'Регистрация…',
    focus: 'Регистрация…',
  },
  'auth.signUpHint': {
    playful: 'После регистрации проверь почту, если нужно подтверждение.',
    focus: 'Проверьте почту, если требуется подтверждение e-mail.',
  },
  'auth.signUpConfirmEmail': {
    playful: 'Аккаунт создан! Подтверди e-mail, затем войди.',
    focus: 'Регистрация успешна. Подтвердите e-mail, затем войдите.',
  },
  'auth.dividerOr': {
    playful: 'или',
    focus: 'или',
  },
  'auth.googleCta': {
    playful: 'Продолжить с Google',
    focus: 'Войти через Google',
  },
  'auth.googleLoading': {
    playful: 'Вход через Google…',
    focus: 'Google…',
  },
  'auth.errorGeneric': {
    playful: 'Что-то пошло не так. Попробуй еще раз.',
    focus: 'Не удалось войти. Попробуйте снова.',
  },
  'auth.errorInvalidCredentials': {
    playful: 'Неверный e-mail или пароль.',
    focus: 'Неверные учетные данные.',
  },
  'auth.errorEmailNotConfirmed': {
    playful: 'Сначала подтверди e-mail.',
    focus: 'E-mail еще не подтвержден.',
  },
  'auth.errorUserExists': {
    playful: 'Аккаунт с этим e-mail уже существует.',
    focus: 'Аккаунт уже существует.',
  },
  'auth.errorWeakPassword': {
    playful: 'Пароль не соответствует требованиям.',
    focus: 'Пароль не соответствует требованиям.',
  },
  'auth.errorNotConfigured': {
    playful: 'Supabase еще не настроен.',
    focus: 'Конфигурация Supabase отсутствует.',
  },
  'auth.errorOAuthCancelled': {
    playful: 'Вход через Google отменен.',
    focus: 'Вход через Google отменен.',
  },
  'auth.errorOAuthFailed': {
    playful: 'Не удалось завершить вход через Google. Проверь redirect URL в Supabase.',
    focus: 'Ошибка Google. Проверь redirect URL в Supabase.',
  },
  'auth.configMissingTitle': {
    playful: 'Бэкенд еще не подключен',
    focus: 'Бэкенд не настроен',
  },
  'auth.configMissingBody': {
    playful: 'Укажи EXPO_PUBLIC_SUPABASE_URL и EXPO_PUBLIC_SUPABASE_ANON_KEY в .env.',
    focus: 'Задайте EXPO_PUBLIC_SUPABASE_URL и EXPO_PUBLIC_SUPABASE_ANON_KEY в .env.',
  },
  'onboarding.welcomeHeadline': {
    playful: 'Пиши лучшие промпты. Оценивай ответы ИИ.',
    focus: 'Пиши лучшие промпты. Оценивай ответы ИИ.',
  },
  'onboarding.welcomeSub': {
    playful:
      'StructAI учит писать лучшие промпты и оценивать ответы ИИ — через короткие уроки, живой скоринг и BYOK Prompt Lab.',
    focus:
      'StructAI учит писать лучшие промпты и оценивать ответы ИИ — через короткие уроки, живой скоринг и BYOK Prompt Lab.',
  },
  'onboarding.welcomeCta': {
    playful: 'Поехали!',
    focus: 'Поехали',
  },
  'onboarding.skip': {
    playful: 'Пропустить',
    focus: 'Пропустить',
  },
  'onboarding.introNext': {
    playful: 'Далее',
    focus: 'Далее',
  },
  'onboarding.languagePickerA11y': {
    playful: 'Выбрать язык',
    focus: 'Выбрать язык',
  },
  'onboarding.languagePickerCloseA11y': {
    playful: 'Закрыть меню языка',
    focus: 'Закрыть меню языка',
  },
  'onboarding.languagePickerTitle': {
    playful: 'Язык',
    focus: 'Язык',
  },
  'onboarding.introSignIn': {
    playful: 'Войти',
    focus: 'Войти',
  },
  'onboarding.introSlide1Value': {
    playful: 'Пиши лучшие промпты — и смотри, как растёт скор.',
    focus: 'Пиши лучшие промпты. Делай структуру измеримой.',
  },
  'onboarding.introSlide2Value': {
    playful: 'Расти с короткими уроками и Orbами.',
    focus: 'Короткие уроки, Orbs, ясный прогресс.',
  },
  'onboarding.introSlide3Value': {
    playful: 'Твой Orb-коуч остаётся локально рядом.',
    focus: 'Локальный Orb-коуч с подсказками — без voiceover.',
  },
  'onboarding.introVisual.scoreLabel': {
    playful: 'Скор промпта',
    focus: 'Скор промпта',
  },
  'onboarding.introVisual.scoreNav': {
    playful: 'Prompt Lab',
    focus: 'Prompt Lab',
  },
  'onboarding.introVisual.scoreFeedback': {
    playful: 'Сильная структура — цель и формат на месте.',
    focus: 'Структура и цель ясны. Формат точен.',
  },
  'onboarding.introVisual.scoreCta': {
    playful: 'Оценить снова',
    focus: 'Оценить снова',
  },
  'onboarding.introVisual.scoreChip1': {
    playful: 'Структура',
    focus: 'Структура',
  },
  'onboarding.introVisual.scoreChip2': {
    playful: 'Цель',
    focus: 'Цель',
  },
  'onboarding.introVisual.scoreChip3': {
    playful: 'Формат',
    focus: 'Формат',
  },
  'onboarding.introVisual.pathTitle': {
    playful: 'Твой путь',
    focus: 'Учебный путь',
  },
  'onboarding.introVisual.pathHome': {
    playful: 'Главная',
    focus: 'Главная',
  },
  'onboarding.introVisual.pathSection': {
    playful: 'Продолжить',
    focus: 'Текущие пути',
  },
  'onboarding.introVisual.pathCard1': {
    playful: 'Основы промптов',
    focus: 'Основы промптов',
  },
  'onboarding.introVisual.pathCard2': {
    playful: 'Оценка ответов',
    focus: 'Оценка ответов',
  },
  'onboarding.introVisual.pathCard3': {
    playful: 'Практика Prompt Lab',
    focus: 'Практика Prompt Lab',
  },
  'onboarding.introVisual.pathMeta': {
    playful: 'Глава 3 из 6',
    focus: 'Глава 3 из 6',
  },
  'onboarding.introVisual.pathOrbs': {
    playful: '+ Открывай Orbs',
    focus: 'Открывай Orbs',
  },
  'onboarding.introVisual.coachBubble': {
    playful: 'Быстрый чек: чего ещё не хватает?',
    focus: 'Проверь цель, ограничения и формат.',
  },
  'onboarding.introVisual.coachCaption': {
    playful: 'Orb · локальный коуч',
    focus: 'Orb · локальный коуч',
  },
  'onboarding.introVisual.coachStep': {
    playful: 'Шаг 2 из 4',
    focus: '2/4',
  },
  'onboarding.introVisual.coachPromptLabel': {
    playful: 'Твой промпт',
    focus: 'Промпт',
  },
  'onboarding.introVisual.coachPromptBody': {
    playful: 'Напиши ясный промпт с целью и форматом…',
    focus: 'Укажи цель, ограничения и формат вывода.',
  },
  'onboarding.introVisual.coachCheck': {
    playful: 'Проверить',
    focus: 'Проверить',
  },
  'onboarding.meetCta': {
    playful: 'Звучит хорошо!',
    focus: 'Далее',
  },
  'onboarding.meetReadyCta': {
    playful: 'Поехали!',
    focus: 'Далее',
  },
  'onboarding.modeQuestion': {
    playful: 'Как тебе удобнее учиться?',
    focus: 'Как тебе удобнее учиться?',
  },
  'onboarding.modeHint': {
    playful: 'Оба режима показывают один и тот же контент - переключаться можно в любой момент в настройках.',
    focus: 'Идентичный контент и функции. Можно изменить в настройках в любое время.',
  },
  'onboarding.modeCta': {
    playful: 'Далее',
    focus: 'Далее',
  },
  'onboarding.loopTitle': {
    playful: 'Как устроен StructAI',
    focus: 'Цикл обучения в три шага',
  },
  'onboarding.loopStep1': {
    playful: 'Выбери трек с понятной структурой глав.',
    focus: 'Выбрать трек: задать тему и порядок глав.',
  },
  'onboarding.loopStep2': {
    playful: 'Проходи уроки с короткими упражнениями шаг за шагом.',
    focus: 'Завершить урок: выполнить короткие упражнения по порядку.',
  },
  'onboarding.loopStep3': {
    playful: 'Собирай орбы и открывай следующую главу.',
    focus: 'Заработать орбы и открыть следующую главу.',
  },
  'onboarding.loopCta': {
    playful: 'Начать первый урок!',
    focus: 'Начать первый урок',
  },
  'onboarding.loopHomeCta': {
    playful: 'Сначала к обзору',
    focus: 'На главную',
  },
  'onboarding.profileTitle': {
    playful: 'Почти готово — как тебя зовут?',
    focus: 'Заполните профиль',
  },
  'onboarding.profileSubtitle': {
    playful: 'Ты завершил первый урок! Расскажи, как тебя зовут — мы настроим StructAI под тебя.',
    focus: 'Первый урок завершен. Укажите имя и возраст, чтобы мы могли рекомендовать режим обучения.',
  },
  'onboarding.profileNameLabel': {
    playful: 'Твое имя',
    focus: 'Отображаемое имя',
  },
  'onboarding.profileNamePlaceholder': {
    playful: 'Как к тебе обращаться?',
    focus: 'Введите отображаемое имя',
  },
  'onboarding.profileAgeLabel': {
    playful: 'Твой возраст',
    focus: 'Возраст',
  },
  'onboarding.profileAgePlaceholder': {
    playful: 'напр. 14',
    focus: 'Возраст в годах',
  },
  'onboarding.profileAgeDisclaimer': {
    playful: 'Возраст нужен только для рекомендации режима — не для изменения сложности заданий.',
    focus: 'Возраст используется исключительно для рекомендации режима, а не для манипуляции сложностью.',
  },
  'onboarding.profileAgeInvalid': {
    playful: 'Введи возраст от 1 до 120.',
    focus: 'Введите корректный возраст от 1 до 120.',
  },
  'onboarding.profileAuthSection': {
    playful: 'Сохранить прогресс',
    focus: 'Привязать аккаунт',
  },
  'onboarding.profileAuthHint': {
    playful: 'Необязательно: войди, чтобы сохранить прогресс. После входа ты вернешься сюда.',
    focus: 'Необязательно: вход через Google или email. После авторизации вы вернетесь на этот шаг.',
  },
  'onboarding.profileModeSection': {
    playful: 'Выбери режим',
    focus: 'Выбор режима обучения',
  },
  'onboarding.profileModeHintRecommended': {
    playful: 'Для твоего возраста рекомендуем Playful — проще задания и легче понимание. Focus тоже доступен.',
    focus: 'Для этого возраста рекомендуется Playful: проще задания и легче понимание. Focus остается доступным.',
  },
  'onboarding.profileModeHintNeutral': {
    playful: 'Оба режима равноправны — выбирай, что подходит.',
    focus: 'Оба режима доступны без предпочтения.',
  },
  'onboarding.profileModeHintCarried': {
    playful: 'Твой прошлый выбор уже выбран — при необходимости измени его здесь.',
    focus: 'Ваш предыдущий выбор предварительно выбран — при необходимости измените его здесь.',
  },
  'onboarding.profilePlayfulBadge': {
    playful: 'Рекомендуем',
    focus: 'Рекомендуем',
  },
  'onboarding.profilePlayfulRecommendCopy': {
    playful: 'Проще задания, легче понимание',
    focus: 'Проще задания, легче понимание',
  },
  'onboarding.profileCta': {
    playful: 'Поехали!',
    focus: 'Сохранить профиль и начать',
  },
  'onboarding.profileSaving': {
    playful: 'Сохраняем…',
    focus: 'Сохранение…',
  },
  'onboarding.profileSaveError': {
    playful: 'Не удалось сохранить — попробуй еще раз.',
    focus: 'Не удалось сохранить профиль. Попробуйте снова.',
  },
  'onboarding.previewPathTitle': {
    playful: 'Основы промптов',
    focus: 'Основы промптов',
  },
  'statBlock.completedLessons': {
    playful: 'Завершенные уроки',
    focus: 'Уроков завершено',
  },
  'statBlock.currentStreak': {
    playful: 'Текущая серия',
    focus: 'Серия (дни)',
  },
  'streakTracker.title': {
    playful: 'Твоя неделя',
    focus: 'Прогресс за неделю',
  },
  'streakTracker.weekdayMon': {
    playful: 'Пн',
    focus: 'Пн',
  },
  'streakTracker.weekdayTue': {
    playful: 'Вт',
    focus: 'Вт',
  },
  'streakTracker.weekdayWed': {
    playful: 'Ср',
    focus: 'Ср',
  },
  'streakTracker.weekdayThu': {
    playful: 'Чт',
    focus: 'Чт',
  },
  'streakTracker.weekdayFri': {
    playful: 'Пт',
    focus: 'Пт',
  },
  'streakTracker.weekdaySat': {
    playful: 'Сб',
    focus: 'Сб',
  },
  'streakTracker.weekdaySun': {
    playful: 'Вс',
    focus: 'Вс',
  },
  'celebration.lessonComplete': {
    playful: 'Урок пройден!',
    focus: 'Урок завершен.',
  },
  'celebration.orbGain': {
    playful: '+{{count}} орбов для тебя!',
    focus: '+{{count}} орбов',
  },
  'celebration.streakMilestone': {
    playful: 'Полная неделя - серия продолжается!',
    focus: 'Достигнут рубеж в 7 дней.',
  },
  'celebration.pathComplete': {
    playful: 'Путь пройден: {{path}}!',
    focus: 'Учебный путь завершён: {{path}}.',
  },
  'celebration.capstoneComplete': {
    playful: 'Финальный проект пройден!',
    focus: 'Финальный проект сдан.',
  },
  'celebration.sectionMilestone': {
    playful: 'Глава завершена!',
    focus: 'Достигнута веха.',
  },
  'capstoneIncomplete.title': {
    playful: 'Путь почти пройден — ещё не полностью',
    focus: 'Путь завершён — ещё не полностью',
  },
  'capstoneIncomplete.subtitle': {
    playful:
      'Финальный проект сдан. До открытия следующего пути осталось {{missing}} из {{total}} уроков.',
    focus:
      'Финальный проект сдан. До открытия следующего пути осталось {{missing}} из {{total}} уроков.',
  },
  'capstoneIncomplete.statCompleted': {
    playful: 'Пройдено',
    focus: 'Завершено',
  },
  'capstoneIncomplete.statSkipped': {
    playful: 'Пропущено',
    focus: 'Пропущено/не сдано',
  },
  'capstoneIncomplete.lockHint': {
    playful: 'Следующий путь останется закрыт, пока не сданы все уроки.',
    focus: 'Следующий путь останется закрыт, пока не сданы все уроки.',
  },
  'capstoneIncomplete.openMissingCta': {
    playful: 'К открытым урокам',
    focus: 'К открытым урокам',
  },
  'capstoneIncomplete.backToPath': {
    playful: 'Назад к пути',
    focus: 'Назад к пути',
  },
  'sectionMilestone.title': {
    playful: 'Глава завершена!',
    focus: 'Финальный проект сдан',
  },
  'sectionMilestone.subtitle': {
    playful: 'Отлично — продолжай со следующим разделом.',
    focus: 'Ты достиг важной вехи.',
  },
  'sectionMilestone.continueCta': {
    playful: 'Следующая глава',
    focus: 'Продолжить',
  },
  'sectionMilestone.backToPath': {
    playful: 'Назад к пути',
    focus: 'Назад к пути',
  },
  'pathPreview.lockedHint': {
    playful: 'Ещё закрыт — сначала сдай все уроки этого пути.',
    focus: 'Ещё закрыт — сначала сдай все уроки этого пути.',
  },
  'pathCompletion.titleFull': {
    playful: 'Путь полностью пройден!',
    focus: 'Путь полностью завершён',
  },
  'pathCompletion.subtitleFull': {
    playful:
      'Все {{total}} глав «{{path}}» сданы. Сертификат готов, следующий путь открыт.',
    focus:
      'Все уроки сданы. Сертификат готов, следующий путь открыт.',
  },
  'pathCompletion.statCompleted': {
    playful: 'Глав сдано',
    focus: 'Уроков сдано',
  },
  'pathCompletion.statCertificate': {
    playful: 'Сертификат',
    focus: 'Сертификат доступен',
  },
  'pathCompletion.startNextPathCta': {
    playful: 'Далее: {{path}}',
    focus: 'Начать следующий путь: {{path}}',
  },
  'pathCompletion.title': {
    playful: 'Путь пройден!',
    focus: 'Учебный путь завершён',
  },
  'pathCompletion.subtitle': {
    playful: 'Ты успешно прошёл все {{total}} глав «{{path}}».',
    focus: 'Все {{total}} глав «{{path}}» успешно завершены.',
  },
  'pathCompletion.certificateHint': {
    playful: 'Сертификат скоро можно будет получить здесь.',
    focus: 'Экспорт сертификата будет добавлен здесь (G2).',
  },
  'pathCompletion.backToPaths': {
    playful: 'К учебным путям',
    focus: 'К обзору путей',
  },
  'certificate.badge': {
    playful: 'Сертификат навыка промптинга',
    focus: 'Сертификат навыка',
  },
  'certificate.awardedTo': {
    playful: 'Получил(а)',
    focus: 'Владелец',
  },
  'certificate.completedOn': {
    playful: 'Завершено',
    focus: 'Дата завершения',
  },
  'certificate.brandTagline': {
    playful: 'Лучшие промпты. Точнее оценка ответов ИИ.',
    focus: 'Навык промптинга · Подтверждённый путь',
  },
  'certificate.skillLabel': {
    playful: 'Навык открыт',
    focus: 'Подтверждённый навык',
  },
  'certificate.skill.prompt_basics': {
    playful: 'Писать ясные, целевые промпты со структурой.',
    focus: 'Ясная целевая структура промпта',
  },
  'certificate.skill.structure_lab': {
    playful: 'Собирать промпты с ролью, ограничениями и форматом.',
    focus: 'Роль, ограничения и формат вывода',
  },
  'certificate.skill.context_mastery': {
    playful: 'Давать ИИ нужный контекст без перегруза.',
    focus: 'Выбор контекста и grounding',
  },
  'certificate.skill.iteration_loops': {
    playful: 'Итерировать промпты, пока вывод не станет надёжным.',
    focus: 'Итерация и доработка промптов',
  },
  'certificate.skill.eval_scoring': {
    playful: 'Оценивать ответы ИИ — и ловить слабые.',
    focus: 'Оценка и критика вывода',
  },
  'certificate.skill.prompt_mastery': {
    playful: 'Проектировать продвинутые промпты под реальные ограничения.',
    focus: 'Продвинутый дизайн промптов под ограничения',
  },
  'certificate.skill.generic': {
    playful: 'Завершён путь StructAI по промптингу.',
    focus: 'Завершён путь StructAI по промптингу',
  },
  'certificate.evidence': {
    playful: '{{completed}} / {{total}} глав завершено',
    focus: '{{completed}} из {{total}} глав завершено',
  },
  'certificate.credentialLabel': {
    playful: 'ID credential',
    focus: 'ID credential',
  },
  'certificate.share': {
    playful: 'Поделиться навыком',
    focus: 'Экспорт сертификата',
  },
  'certificate.sharing': {
    playful: 'Подготовка…',
    focus: 'Экспорт…',
  },
  'certificate.shareDialogTitle': {
    playful: '{{name}} теперь умеет: {{skill}}',
    focus: '{{name}} — {{skill}}',
  },
  'pathCompletion.identityLine': {
    playful: 'Этим можно делиться: {{skill}}',
    focus: 'Credential: {{skill}}',
  },
  'certificate.shareUnavailable': {
    playful: 'Поделиться сейчас нельзя на этом устройстве.',
    focus: 'Экспорт сертификата недоступен на этом устройстве.',
  },
  'certificate.download': {
    playful: 'Скачать сертификат',
    focus: 'Сохранить как изображение',
  },
  'certificate.shareWebUnavailable': {
    playful:
      'Скачивание не удалось. Поделиться можно в приложении StructAI на телефоне — в браузере нажми «Скачать сертификат».',
    focus:
      'Ошибка скачивания. Нативный экспорт — в iOS/Android-приложении; в браузере должен сохраниться PNG.',
  },
  'profile.certificatesSection': {
    playful: 'Твои сертификаты',
    focus: 'Сертификаты об окончании',
  },
  'profile.certificatesDescription': {
    playful: 'Смотри skill wins здесь. Экспорт и шаринг — Pro.',
    focus: 'Завершённые пути — превью бесплатно; экспорт Pro.',
  },
  'pro.planSection': {
    playful: 'Твой план',
    focus: 'План',
  },
  'pro.planEyebrow': {
    playful: 'Доступ',
    focus: 'Доступ',
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
      'Free: все уроки + локальный Lab coach. Pro: live AI-оценки и экспорт сертификатов от {{monthly}}/мес или {{yearly}}/год.',
    focus:
      'Free: уроки + локальный Lab. Pro: live AI-оценки + экспорт сертификатов — от {{monthly}}/мес или {{yearly}}/год.',
  },
  'pro.planBodyPro': {
    playful: 'Pro активен на этом устройстве: live Lab-оценки и экспорт сертификатов разблокированы.',
    focus: 'Pro активен. Live Lab-оценки и экспорт сертификатов разблокированы на этом устройстве.',
  },
  'pro.previewUnlockCta': {
    playful: 'Попробовать Pro preview',
    focus: 'Включить Pro preview',
  },
  'pro.previewLockCta': {
    playful: 'Вернуться к Free',
    focus: 'Вернуться к Free',
  },
  'pro.gateTitle': {
    playful: 'Функция Pro',
    focus: 'Pro',
  },
  'pro.gateCertificateBody': {
    playful: 'Экспорт сертификата — Pro. Цены на экране Pro.',
    focus: 'Экспорт сертификата — Pro. Открой paywall для цен.',
  },
    'pro.gateLabBody': {
    playful:
      'Один API-ключ — это ещё не Pro. Живые оценки ИИ — Pro; локальный коуч остаётся бесплатным.',
    focus:
      'API-ключ ≠ Pro. Живые оценки — Pro; локальный коуч бесплатен. Открой Pro для планируемых цен.',
  },
  'pro.certificateCta': {
    playful: 'Экспорт с Pro',
    focus: 'Экспорт (Pro)',
  },
  'pro.openPlanCta': {
    playful: 'Смотреть тарифы Pro',
    focus: 'Смотреть Pro',
  },
  'pro.openPaywallCta': {
    playful: 'Тарифы и цены Pro',
    focus: 'Цены Pro',
  },
  'pro.paywall.brand': {
    playful: 'StructAI Pro',
    focus: 'StructAI Pro',
  },
  'pro.paywall.headline': {
    playful: 'Докажи навык. Оценивай реальными моделями.',
    focus: 'Live-оценки и делимое подтверждение навыка.',
  },
  'pro.paywall.sub': {
    playful:
      'Обучение остаётся Free. Переходи на Pro ради live AI-скоринга в Prompt Lab и экспорта сертификатов.',
    focus:
      'Уроки остаются Free. Pro открывает live Lab-оценки (твой ключ) и экспорт сертификатов после пути.',
  },
  'pro.paywall.compareFeature': {
    playful: 'Что ты получаешь',
    focus: 'Включено',
  },
  'pro.paywall.benefitLessons': {
    playful: 'Все пути и ежедневная практика',
    focus: 'Все пути и ежедневная практика',
  },
  'pro.paywall.benefitLabLocal': {
    playful: 'Локальный Prompt Lab coach',
    focus: 'Локальный Prompt Lab coach',
  },
  'pro.paywall.benefitLabLive': {
    playful: 'Live AI-оценки со своим API-ключом',
    focus: 'Live AI-оценки (BYOK)',
  },
  'pro.paywall.benefitCertificates': {
    playful: 'Экспорт и шаринг сертификатов',
    focus: 'Экспорт и шаринг сертификатов',
  },
  'pro.paywall.included': {
    playful: 'Да',
    focus: 'Да',
  },
  'pro.paywall.excluded': {
    playful: '—',
    focus: '—',
  },
  'pro.paywall.periodMonthly': {
    playful: 'Месяц',
    focus: 'Месяц',
  },
  'pro.paywall.periodYearly': {
    playful: 'Год',
    focus: 'Год',
  },
  'pro.paywall.bestValue': {
    playful: 'Выгоднее',
    focus: 'Выгоднее',
  },
  'pro.paywall.monthlyHint': {
    playful: 'Отмена в любой момент',
    focus: 'Ежемесячная оплата',
  },
  'pro.paywall.yearlyHint': {
    playful: 'Около {{monthly}}/мес',
    focus: '{{monthly}}/мес эквивалент',
  },
    'pro.paywall.cta': {
    playful: 'Попробовать Pro на этом устройстве (превью)',
    focus: 'Включить превью Pro на этом устройстве',
  },
  'pro.paywall.ctaBusy': {
    playful: 'Включаем превью…',
    focus: 'Включаем превью…',
  },
  'pro.paywall.billingFootnote': {
    playful:
      'Цены выше — плановые. Оплата App Store / Play ещё не подключена (Block H). Эта кнопка включает только локальное превью Pro — списания не будет.',
    focus:
      'Цены плановые, оплаты ещё нет (Block H). CTA включает только локальное превью Pro — без оплаты в сторе.',
  },
  'pro.paywall.dismiss': {
    playful: 'Не сейчас',
    focus: 'Не сейчас',
  },
};
