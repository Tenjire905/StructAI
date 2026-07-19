# Development Build — Daily Goal Notifications (P2.3)

**Why:** Expo Go blocks scheduled notifications (`areDailyGoalNotificationsSupported()` returns `false` in Expo Go). You need a **development build** (native binary with `expo-dev-client`) to exercise the evening reminder.

**Already on `develop`:** progress-aware local reminders (cancel when goal met, `{{remaining}}` orbs in body). Widgets are still open.

---

## 0. One-time prerequisites

1. Expo account: https://expo.dev/signup  
2. On your Mac/PC:

```bash
npm install -g eas-cli@latest
eas login
```

3. In the StructAI repo (branch `develop`):

```bash
git pull origin develop
npm install
eas init   # link project if not linked yet — accept creating an EAS project
```

---

## 1. Build the development client

### Android (physical phone — easiest)

```bash
eas build --profile development --platform android
```

When the build finishes, open the Expo dashboard link → install the APK on your phone  
(or scan the QR from the build page).

### iOS (physical iPhone)

Needs an Apple Developer account + device registered:

```bash
eas build --profile development --platform ios
```

Install via the Expo page / TestFlight-internal link EAS shows.

### iOS Simulator (Mac only)

```bash
eas build --profile development-simulator --platform ios
```

Then install the `.tar.gz` / run as EAS instructs for simulator.

### Local native toolchain (optional alternative)

If Android Studio / Xcode is installed:

```bash
npx expo prebuild
npx expo run:android   # or: npx expo run:ios
```

---

## 2. Start Metro for the development build

**Not** Expo Go. From the repo:

```bash
npx expo start --dev-client
```

Open the **StructAI** development app on the device (not Expo Go) and connect to the same LAN/tunnel URL.

---

## 3. How to trigger P2.3 reminders in the app

1. Open **Profil** or complete onboarding until **Tagesziel** (`/tagesziel`).
2. Set a daily orb goal (e.g. 50).
3. Enable the **Abend-Erinnerung** toggle — you should get a system permission prompt  
   (in Expo Go you only saw the “not available” hint; here the Switch is live).
4. Save the goal.
5. Keep `orbsEarnedToday` **below** the goal (don’t finish the goal yet).
6. Reminder is scheduled for **19:00 local time** every day while the goal is unmet.
7. To verify sooner without waiting until 19:00:
   - Temporarily change `hour` / `minute` in `lib/dailyGoalNotifications.ts` (e.g. now+1 minute), rebuild is **not** required for JS-only changes — reload Metro — then restore 19:00.
8. When you earn enough orbs to meet the goal, the reminder is **cancelled** automatically.

---

## 4. What you will / won’t see

| Surface | Expo Go | Development build |
|---------|---------|-------------------|
| Tagesziel notification Switch | Hint only | Real toggle + OS permission |
| Scheduled 19:00 reminder | Never | Yes, if enabled + goal unmet |
| Body with remaining orbs | n/a | Yes |
| Home widgets | Not built yet | Not built yet |

---

## 5. Rebuild only when native config changes

Reload JS is enough for copy/logic tweaks.  
**Rebuild** after changing `app.json` plugins, `eas.json`, or adding native modules:

```bash
eas build --profile development --platform android
```
