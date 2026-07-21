import { isRunningInExpoGo } from 'expo';

import { appStorage, getLastCompletedLessonId } from '@/lib/appStorage';
import { isBelowDailyGoal } from '@/lib/dailyOrbGoal';
import { resolveSessionSkillSummary } from '@/lib/sessionSkillSummary';
import { getCatalogForLocale } from '@/theme/copy/index';
import { formatCopyText, getCopyText } from '@/theme/copy/types';
import { isLocale, resolveLocaleFromDevice } from '@/theme/locale';
import type { ThemeMode } from '@/theme/theme';

const DAILY_GOAL_REMINDER_ID = 'structai-daily-goal-reminder';
const LOCALE_STORAGE_KEY = 'structai.locale';
const THEME_MODE_STORAGE_KEY = 'structai.theme-mode';

type NotificationsModule = typeof import('expo-notifications');

export type DailyGoalReminderContext = {
  enabled: boolean;
  dailyOrbGoal: number;
  orbsEarnedToday: number;
  /** Optional override; falls back to last completed lesson in storage. */
  lastLessonId?: string;
};

let notificationsModulePromise: Promise<NotificationsModule | null> | null = null;
let notificationHandlerConfigured = false;

export function areDailyGoalNotificationsSupported(): boolean {
  return !isRunningInExpoGo();
}

/** True when a reminder should exist: opted in, goal set, and still short today. */
export function shouldScheduleDailyGoalReminder(context: DailyGoalReminderContext): boolean {
  return (
    context.enabled &&
    areDailyGoalNotificationsSupported() &&
    isBelowDailyGoal(context.orbsEarnedToday, context.dailyOrbGoal)
  );
}

async function loadNotificationsModule(): Promise<NotificationsModule | null> {
  if (!areDailyGoalNotificationsSupported()) {
    return null;
  }

  if (!notificationsModulePromise) {
    notificationsModulePromise = import('expo-notifications');
  }

  return notificationsModulePromise;
}

async function ensureNotificationHandler(Notifications: NotificationsModule): Promise<void> {
  if (notificationHandlerConfigured) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  notificationHandlerConfigured = true;
}

function readStoredLocale() {
  const stored = appStorage.getString(LOCALE_STORAGE_KEY);
  return stored && isLocale(stored) ? stored : resolveLocaleFromDevice();
}

function readStoredMode(): ThemeMode {
  const stored = appStorage.getString(THEME_MODE_STORAGE_KEY);
  return stored === 'playful' || stored === 'focus' ? stored : 'focus';
}

export function getDailyGoalNotificationCopy(
  remainingOrbs: number,
  lastLessonId?: string,
): { title: string; body: string } {
  const locale = readStoredLocale();
  const mode = readStoredMode();
  const catalog = getCatalogForLocale(locale);
  const lessonId = lastLessonId ?? getLastCompletedLessonId();
  const title = getCopyText('dailyGoal.notificationTitle', mode, catalog);

  if (lessonId) {
    const summary = resolveSessionSkillSummary(lessonId);
    const skill = getCopyText(summary.nameKey, mode, catalog);

    if (skill.length > 0) {
      return {
        title,
        body: formatCopyText('dailyGoal.notificationBodySkill', mode, catalog, {
          skill,
          remaining: remainingOrbs,
        }),
      };
    }
  }

  return {
    title,
    body: formatCopyText('dailyGoal.notificationBody', mode, catalog, {
      remaining: remainingOrbs,
    }),
  };
}

export async function requestDailyGoalNotificationPermission(): Promise<boolean> {
  const Notifications = await loadNotificationsModule();

  if (!Notifications) {
    return false;
  }

  await ensureNotificationHandler(Notifications);

  const current = await Notifications.getPermissionsAsync();

  if (current.granted) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

/**
 * Keep the evening reminder in sync with today's goal progress.
 * Cancels when disabled, unsupported, or the daily goal is already met.
 */
export async function syncDailyGoalReminder(context: DailyGoalReminderContext): Promise<void> {
  const Notifications = await loadNotificationsModule();

  if (!Notifications) {
    return;
  }

  await ensureNotificationHandler(Notifications);

  await Notifications.cancelScheduledNotificationAsync(DAILY_GOAL_REMINDER_ID).catch(() => undefined);

  if (!shouldScheduleDailyGoalReminder(context)) {
    return;
  }

  const granted = await requestDailyGoalNotificationPermission();

  if (!granted) {
    return;
  }

  const remaining = Math.max(0, context.dailyOrbGoal - context.orbsEarnedToday);
  const { title, body } = getDailyGoalNotificationCopy(remaining, context.lastLessonId);

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_GOAL_REMINDER_ID,
    content: {
      title,
      body,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 19,
      minute: 0,
    },
  });
}
