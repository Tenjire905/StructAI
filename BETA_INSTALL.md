# BETA_INSTALL.md
### StructAI als echte Beta-App (ohne Expo-Go-Tunnel / ohne Cloud-Server)

**Warum:** Expo Go + Cloudflare-Tunnel hängt an einem Remote-Metro. Der kann neu starten müssen oder ausfallen. Eine **EAS Preview-/Internal-Build** ist eine echte App-Datei auf dem Gerät und läuft **offline-fähig** (nur eure eigenen Backend-Calls wie Supabase/BYOK brauchen Netz).

EAS-Projekt ist bereits verknüpft (`app.json` → `extra.eas.projectId`, Owner `stabileo`).

---

## A) Einmalig auf dem Rechner (Mac/Windows/Linux)

### 1. Node + Repo
```bash
git clone https://github.com/Tenjire905/StructAI.git
cd StructAI
git checkout develop
git pull
npm install
```

### 2. Expo-Account
```bash
npx eas-cli login
npx eas-cli whoami
```
Account muss Zugriff auf das Projekt `structai` (Owner `stabileo`) haben.

### 3. (Nur iOS) Apple Developer
- Bezahlter Apple Developer Account
- In Expo: `npx eas-cli credentials` bzw. dem Wizard folgen (Bundle-ID `com.structai.app`)

Android braucht **kein** Play-Console-Abo für interne APK-Installation.

---

## B) Android-Beta (empfohlen, am einfachsten)

Auf dem Rechner, im Repo-Root, Branch `develop`:

```bash
git pull origin develop
npx eas-cli build --profile preview --platform android
```

1. Build läuft in der Expo-Cloud (5–20 Min).
2. Am Ende: **Download-Link zur `.apk`** (auch unter https://expo.dev → Project → Builds).
3. APK aufs Handy (Download im Browser, Drive, AirDrop, USB).
4. Android: „Unbekannte Apps installieren“ für den Browser/File-Manager erlauben → APK tippen → installieren.
5. App-Icon **StructAI** öffnen — **kein** Expo Go, **kein** Tunnel.

Updates später: gleichen Befehl nochmal → neue APK installieren (überschreibt).

---

## C) iOS-Beta (Internal / TestFlight)

### Option 1 — Internal Distribution (Gerät registrieren)
```bash
npx eas-cli build --profile preview --platform ios
```
- Gerät-UDID muss in den Credentials stehen (Expo/Apple-Wizard fragt danach).
- Install-Link aus dem Build öffnen **auf dem iPhone** (Safari).

### Option 2 — TestFlight (besser für mehrere Tester)
```bash
npx eas-cli build --profile production --platform ios
npx eas-cli submit --platform ios --latest
```
Dann in App Store Connect → TestFlight → dich/Tester einladen.

---

## D) Vom Handy aus steuern (ohne lokalen Dev-Server)

Du brauchst **keinen** Cursor-Cloud-Agent und **keinen** Expo-Tunnel.

1. Builds starten: vom Rechner (Abschnitt B/C) **oder** über https://expo.dev (Project → Builds → „New build“, Profile `preview`).
2. Fertige Builds immer unter https://expo.dev → Builds herunterladen / QR öffnen.
3. Nach Code-Fixes: jemand pusht nach `develop` → du startest einen **neuen** EAS-Build (alte APK/IPA bleibt installiert bis du ersetzt).

---

## E) Was du NIE mehr brauchst für den Alltag

- `exps://…trycloudflare.com`
- Expo Go gegen den Cloud-Agent-Metro
- „Server neu starten“

Das bleibt nur für **Entwicklung**. Für Beta-Nutzung = **installierte Preview-App**.

---

## F) Kurzer Smoke-Check nach Installation

1. App startet ohne Expo Go.
2. Onboarding ohne „Überspringen“ durchklicken.
3. Tab-Leiste schwebt, Haptik spürbar stark (Buttons/Tabs/Antworten).
4. Eine Lektion öffnen + abschließen.
5. Airplane-Mode kurz: UI bleibt nutzbar; Sync/BYOK braucht wieder Netz.

---

## G) Wenn etwas schiefgeht

| Problem | Fix |
|---|---|
| `eas-cli` not logged in | `npx eas-cli login` |
| Android blockiert APK | Einstellungen → App-Installation aus dieser Quelle erlauben |
| iOS „Untrusted Developer“ | Einstellungen → Allgemein → VPN & Geräteverwaltung → Entwickler-App vertrauen |
| Alte UI trotz neuem Build | Alte App deinstallieren, neue APK/IPA installieren |
| Build schlägt fehl | Expo.dev Build-Logs öffnen; oft Credentials/Bundle-ID — Wizard erneut `npx eas-cli credentials` |

---

**Stand:** Preview-Profil erzeugt für Android bewusst eine **APK** (`eas.json` → `preview.android.buildType: apk`) für Sideload ohne Play Store.
