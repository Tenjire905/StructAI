import { isRunningInExpoGo } from 'expo';

import { appStorage } from '@/lib/appStorage';
import { getCatalogForLocale } from '@/theme/copy/index';
import { getCopyText } from '@/theme/copy/types';
import { DEFAULT_LOCALE, isLocale } from '@/theme/locale';
import type { ThemeMode } from '@/theme/theme';

const DAILY_GOAL_REMINDER_ID = 'structai-daily-goal-reminder';
const LOCALE_STORAGE_KEY = 'structai.locale';
const THEME_MODE_STORAGE_KEY = 'structai.theme-mode';

type NotificationsModule = typeof import('expo-notifications');

let notificationsModulePromise: Promise<NotificationsModule | null> | null = null;
let notificationHandlerConfigured = false;

export function areDailyGoalNotificationsSupported(): boolean {
  return !isRunningInExpoGo();
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
  return stored && isLocale(stored) ? stored : DEFAULT_LOCALE;
}

function readStoredMode(): ThemeMode {
  const stored = appStorage.getString(THEME_MODE_STORAGE_KEY);
  return stored === 'playful' || stored === 'focus' ? stored : 'focus';
}

function getDailyGoalNotificationCopy() {
  const locale = readStoredLocale();
  const mode = readStoredMode();
  const catalog = getCatalogForLocale(locale);

  return {
    title: getCopyText('dailyGoal.notificationTitle', mode, catalog),
    body: getCopyText('dailyGoal.notificationBody', mode, catalog),
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

export async function syncDailyGoalReminder(enabled: boolean): Promise<void> {
  const Notifications = await loadNotificationsModule();

  if (!Notifications) {
    return;
  }

  await ensureNotificationHandler(Notifications);

  await Notifications.cancelScheduledNotificationAsync(DAILY_GOAL_REMINDER_ID).catch(() => undefined);

  if (!enabled) {
    return;
  }

  const granted = await requestDailyGoalNotificationPermission();

  if (!granted) {
    return;
  }

  const { title, body } = getDailyGoalNotificationCopy();

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
