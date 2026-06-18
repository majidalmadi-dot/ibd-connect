# IBD Connect — React Native (Expo) app

A bilingual (English / Arabic, RTL-aware) **non-medical** patient companion for people living with Inflammatory Bowel Disease. This is the production-oriented mobile build of the IBD Connect prototype, targeting **iOS and Android** via Expo / React Native, as specified in the project deck.

> **Positioning:** descriptive-only, compliance-focused. No correlation analysis, no predictive analytics, no clinical-decision support. Charts show only what the user logged. Medication reminders never store drug names or doses.

---

## Run it

You need [Node.js 18+](https://nodejs.org) and the **Expo Go** app on your phone (or an iOS/Android simulator).

```bash
cd ibd-connect-rn
npm install
npx expo start
```

Then scan the QR code with Expo Go (Android) or the Camera app (iOS). To open a simulator directly: press `i` (iOS) or `a` (Android) in the Expo CLI.

### Build native binaries (for the stores)

```bash
npm install -g eas-cli
eas login
eas build --platform ios       # or android, or all
```

(App identifiers are pre-set in `app.json`: `com.sga.ibdconnect`.)

---

## Architecture

```
ibd-connect-rn/
├─ App.js                     # SafeAreaProvider → StoreProvider → RootNavigator → Toast
├─ app.json / babel.config.js / package.json
└─ src/
   ├─ store/Store.js          # React Context: state, AsyncStorage persistence, i18n t(), theme, helpers
   ├─ i18n/strings.js         # EN/AR dictionary
   ├─ theme/themes.js         # 9 palettes (5 dark + 4 light)
   ├─ data/
   │   ├─ content.js          # Learn library + SGA IBD-Guide articles + wellness tips
   │   ├─ disc.js             # IBD-DISC 10 domains
   │   └─ misc.js             # countries, levels, badges, quests, avatars
   ├─ components/
   │   ├─ ui.js               # Screen, Card, buttons, Field, Input, Chip, Badge, Pbar …
   │   ├─ charts.js           # SVG: Ring, TriRings, Gauge, BarChart, LineChart, Sparkline, Radar, Heatmap
   │   └─ Toast.js
   ├─ navigation/
   │   ├─ RootNavigator.js    # native-stack (onboarding/auth + modal/detail screens)
   │   └─ MainTabs.js         # bottom tabs: Today / Track / Reports / Learn / More
   └─ screens/                # 30+ screens (see below)
```

### State & persistence
A single React Context (`StoreProvider`) holds all state and persists to **AsyncStorage** (key `ibdconnect_rn_v1`) on every change. `useStore()` exposes `t()` (i18n), the resolved `theme` palette, and helper functions (`addLog`, `logsOn`, `streak`, `levelInfo`, `goals`, `claimQuest`, …). First launch seeds ~12 days of demo data so charts aren't empty.

### Data visualizations
All charts are custom **react-native-svg** components (no chart library), so they re-tint to the active theme: activity rings, a consistency gauge, gradient-style bar/line charts, a logging heatmap, and the **IBD-DISC radar "disk"**.

---

## Features (parity with the prototype & deck)

- **Onboarding & auth** — splash, language picker, onboarding, non-medical disclaimer, consent, profile setup, **world-map country picker**, sign in / sign up / reset.
- **Today** — greeting, level/XP, Apple-style daily goal rings, streak stats, steps ring, smart nudge banner, quick-log grid, 30-day heatmap, today summary, achievements, IBD-DISC entry.
- **Track** — symptoms, meals (+photo flag), sleep, mood, activity, Bristol bowel, steps, weight, medication reminders (no drug names), timeline (7/14/30-day + filters), history, IBD-DISC.
- **IBD-DISC** — 10-domain self-check with the circular **radar** visualization + ranked breakdown.
- **Reports** — weekly/monthly, consistency gauge, symptom-frequency / BM / severity / mood / sleep charts, heatmap, and a **native Share** clinician summary the patient can send to their doctor.
- **Learn** — categorized library with the **SGA IBD Guide** (IBDguide.net) articles, author + source attribution, deep link to the source.
- **Insights & Wellness** — travel, meals, hydration, sleep, mental wellbeing, lifestyle.
- **My measurements** — every captured metric with latest value, today, and a sparkline.
- **More / Settings** — edit profile (+ country, avatar), **9 themes**, language toggle, notification & nudge toggles, privacy, change password, legal pages, data export (share) / delete, account deletion.
- **Rewards & Quests** — XP, levels, daily goal rings, quests with claimable rewards, badges.
- **Health Tools** — BMI, daily calories (TDEE), hydration, ideal-weight, waist-to-height, protein, fluid-replacement (IBD), heart-rate zones.
- **Admin** — role login, KPI dashboard, content lists.

---

## Notifications (built in)
Local reminders use **expo-notifications** (`src/services/notifications.js`). When the user enables *Daily logging reminder* or *Medication reminder* in Settings → Notifications, the app requests permission and schedules a repeating local notification (medication time is taken from the user's `medTime`). The module is lazy-loaded and safely no-ops on web or anywhere the native module isn't present.

## Cloud sync (optional — off by default)
The app is **offline-first**: it works fully with on-device AsyncStorage and needs no backend. An optional **Supabase** layer (`src/services/cloud.js`) adds real accounts + multi-device sync when configured:

1. Create a project at supabase.com and run `supabase/schema.sql` in the SQL editor.
2. Enable **Email** auth (Authentication → Providers).
3. Put your keys in `app.json` → `expo.extra.supabaseUrl` and `supabaseAnonKey`.

When keys are present, sign-up/sign-in also create a Supabase session, the local snapshot is pushed (debounced) on every change, and on launch the remote snapshot is pulled and merged (logs union by id). With keys blank, all of this is skipped and the app stays purely local. Health data is stored as an opaque JSON blob under the user's own RLS-protected row; no medication names/doses are collected.

## Assets
Branded `icon.png`, `adaptive-icon.png`, `splash.png`, and `favicon.png` are in `assets/` and wired in `app.json` — the project is store-submission ready (swap in final artwork anytime).

## Notes
- **Runtime RTL:** language flips text alignment and row direction immediately. For full native mirroring, call `I18nManager.forceRTL(true)` and reload (left out to avoid a forced restart in the prototype).
- Educational content © their respective authors via the **Saudi Gastroenterology Association** IBD Guide (https://www.saudigastro.com/ibd-guide).
- Tested via React test-renderer with mocked native modules: **88/88** screen render cases (44 screens × EN/AR) and **20/20** interaction flows pass.
