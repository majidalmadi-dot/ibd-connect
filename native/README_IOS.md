# Rafeeq — iOS (Capacitor) wrapper

This folder wraps the live PWA (`ibd-connect.vercel.app`) in a thin native iOS shell so it can ship on the App Store. It loads the hosted app (`server.url`), so the app updates whenever the website does.

## Requirements (yours)
- A **Mac with Xcode**.
- An **Apple Developer account** ($99/yr) — I can't create accounts or sign in.

## Build steps
```bash
cd native
mkdir -p www && echo "Rafeeq" > www/index.html   # placeholder; server.url loads the live app
npm install
npx cap add ios
npx cap sync ios
npx cap open ios   # opens Xcode → set Team/signing → run on device → Archive → upload
```

## Push notifications on iOS
iOS does **not** use the Web Push pipeline through a wrapper. To deliver native reminders:
1. Add the `@capacitor/push-notifications` plugin (already in package.json) and enable the Push Notifications capability + Background Modes in Xcode.
2. Configure **APNs** (Apple Push Notification service) keys in your Apple Developer account.
3. Send via APNs from the backend (the existing Supabase function can be extended with an APNs sender), or use a provider.

Alternatively, rely on the installed-PWA web-push path: iOS 16.4+ supports web push **only** when the user adds the site to the Home Screen — no wrapper needed, but discovery is weaker.

## App Store review note (important)
Apple guideline 4.2 ("minimum functionality") can flag pure website wrappers. Rafeeq mitigates this with native push, offline support, and home-screen behaviour, but be ready to (a) emphasise the offline/native features in the review notes, or (b) if rejected, ship the fuller native build from the `ibd-connect-rn/` React Native project instead.

## Privacy / data-safety
Use the hosted policy at `https://ibd-connect.vercel.app/privacy.html` and the answers in `STORE_LAUNCH_KIT.md`.
