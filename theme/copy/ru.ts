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
  'home.competence.title': {
    playful: 'Ты становишься острее в',
    focus: 'Навыки, которые ты строишь',
  },
  'home.startHint': {
    playful: 'Начни с основ промптов — первый шаг к структурированному prompting.',
    focus: 'Начните с основ промптов — первый шаг к структурированному prompting.',
  },
  'home.startCta': {
    playful: 'Поехали!',
    focus: 'Открыть первый трек',
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
    playful: 'Дневная цель ждёт — ты уже учился сегодня?',
    focus: 'Дневная цель ещё не выполнена — вы уже учились сегодня?',
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
    playful: 'Почти! Посмотри объяснение.',
    focus: 'Неверно. См. объяснение.',
  },
  'lesson.hintLabel': {
    playful: 'Подсказка:',
    focus: 'Подсказка:',
  },
  'lesson.learningBeatLabel': {
    playful: 'Запомни',
    focus: 'Главное',
  },
  'lesson.skillCardTitle': {
    playful: 'Сегодня ты тренировал',
    focus: 'Навыки в этой сессии',
  },
  'lesson.skillCardImproved': {
    playful: 'Стало острее: {{skills}}',
    focus: 'Улучшено: {{skills}}',
  },
  'lesson.skillCardMissed': {
    playful: 'Стоит ещё раз: {{skills}}',
    focus: 'Ещё неуверенно: {{skills}}',
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
  'profile.guestAccountDescription': {
    playful: 'Ты используешь StructAI без аккаунта. Прогресс остается на этом устройстве — войди, чтобы синхронизировать.',
    focus: 'Гостевой режим. Прогресс локально на этом устройстве; вход для синхронизации и сертификатов.',
  },
  'guest.saveProgressHint': {
    playful: 'Прогресс только на этом устройстве. Аккаунт позволит синхронизировать и сохранить его.',
    focus: 'Прогресс хранится только локально. Вход для синхронизации и сертификатов.',
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
    playful: 'Освой промптинг как профи',
    focus: 'Структурированное обучение AI-промптингу',
  },
  'onboarding.welcomeSub': {
    playful: 'Короткие уроки, реальная оценка, заметный прогресс - шаг за шагом к лучшим промптам.',
    focus: 'Короткие уроки, измеримая оценка, ясный прогресс.',
  },
  'onboarding.welcomeCta': {
    playful: 'Поехали!',
    focus: 'Начать',
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
    playful: 'Подтвердить выбор',
    focus: 'Подтвердить',
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
    playful: 'Сертификат об окончании',
    focus: 'Сертификат',
  },
  'certificate.awardedTo': {
    playful: 'Вручено',
    focus: 'Участник',
  },
  'certificate.completedOn': {
    playful: 'Завершено',
    focus: 'Дата завершения',
  },
  'certificate.brandTagline': {
    playful: 'Prompt Engineering · Учебный путь',
    focus: 'StructAI · Завершение пути',
  },
  'certificate.share': {
    playful: 'Поделиться сертификатом',
    focus: 'Экспорт сертификата',
  },
  'certificate.sharing': {
    playful: 'Подготовка…',
    focus: 'Экспорт…',
  },
  'certificate.shareDialogTitle': {
    playful: 'Поделиться сертификатом StructAI',
    focus: 'Поделиться сертификатом StructAI',
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
    playful: 'Делись изображением сертификата за каждый завершённый путь.',
    focus: 'Завершённые пути с экспортом изображения.',
  },
};
