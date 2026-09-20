# Rafeeq — Native app packaging guide

Goal: ship the existing PWA (ibd-connect.vercel.app) to the **Google Play Store** and **Apple App Store** with minimal new code, by wrapping it. This is the fastest, lowest-risk route to native store presence.

---

## Already done (in this repo)

- **`/.well-known/assetlinks.json`** — Digital Asset Links file, deployed and served at `https://ibd-connect.vercel.app/.well-known/assetlinks.json`. It links the Android app to the website so the app opens **full-screen with no browser URL bar**. It already contains the SHA-256 of the upload keystore below.
- **`twa-manifest.json`** — Bubblewrap config tuned to Rafeeq (name, colors, icons, notifications enabled).
- **`rafeeq-upload.keystore`** — an upload signing key (delivered separately; **keep it secret and backed up** — losing it blocks future updates). Alias `rafeeq`, store/key password `rafeeq2026` (change this before production).
  - Upload-key SHA-256: `C2:20:F8:7B:7E:71:91:E1:98:A2:B3:BA:8F:01:97:66:10:36:55:79:D8:12:F1:C1:7F:69:F4:A6:8E:3A:C7:97`

---

## Android (Google Play) — Trusted Web Activity via Bubblewrap

Needs: Node 18+, JDK 17, Android SDK (Bubblewrap can fetch the JDK/SDK for you), and a **Google Play Developer account** (one-time $25).

```bash
npm install -g @bubblewrap/cli

# Initialise from the live manifest (or point at the local twa-manifest.json)
bubblewrap init --manifest https://ibd-connect.vercel.app/manifest.webmanifest

# Build the signed app bundle (.aab) + APK, using rafeeq-upload.keystore
bubblewrap build

# Test on a device/emulator
bubblewrap install
```

Then in **Play Console**: create the app → upload `app-release-bundle.aab` → complete the data-safety form, content rating, and store listing → roll out to internal testing first.

> **Important — Play App Signing:** Google re-signs your app with its own key. After your first upload, copy the **App signing key SHA-256** from Play Console → *Setup → App integrity*, and **add it to `assetlinks.json`** alongside the upload-key fingerprint (the file accepts an array). Re-deploy the site. Without this, the URL bar may show on installed devices.

## iOS (App Store)

iOS has no TWA equivalent. Two options:

1. **Capacitor wrapper (recommended)** — wrap the same web app in a thin native shell:
   ```bash
   npm install -g @capacitor/cli
   npx cap init Rafeeq com.sga.rafeeq
   # point the webDir/server.url at https://ibd-connect.vercel.app, add iOS platform, open in Xcode
   npx cap add ios && npx cap open ios
   ```
   For push on iOS you must use **APNs** (Apple Push Notification service) via Capacitor's push plugin — the web-push pipeline does not cover native iOS. Alternatively rely on the installed-PWA web-push path (iOS 16.4+ supports web push **only** for home-screen-installed PWAs).
2. **Ship the existing React Native build** (the `ibd-connect-rn/` project in this repo) if you prefer a fully-native iOS codebase.

Needs: a Mac with Xcode and an **Apple Developer account** ($99/yr).

## What still needs you (cannot be automated here)

- Enrol the Apple Developer + Google Play accounts (I can't create accounts).
- Decide/lock the production signing password and store the keystore safely.
- Complete each store's data-safety / privacy questionnaire and listing copy.
- Add the Play App-Signing SHA-256 to `assetlinks.json` after first upload.
