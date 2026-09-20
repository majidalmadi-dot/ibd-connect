# Rafeeq · رفيق — Honest Technical Audit

**Scope:** `index.html` (the live single-file PWA, 4,417 lines / ~504 KB), `sw.js`, `manifest.webmanifest`, Supabase config, repo hygiene. Reviewed by reading the actual source, not the marketing deck. Date: 21 Jun 2026.

**One-line verdict:** A genuinely impressive, feature-rich, well-localised prototype with excellent compliance discipline — but it is still a *prototype*, not a production health product. The gaps that matter most are real authentication, output escaping, complete data export/delete, and offline robustness. None are hard to fix.

---

## What is genuinely strong (not flattery — verified in code)

- **Compliance posture is excellent.** Descriptive-only language is enforced everywhere; disclaimers sit on the insight engine, IBD-Disk, the check-in, and the clinician summary (e.g. lines 749, 975, 3742, 2505). No diagnosis/prediction/dosing language anywhere. This is the hardest thing to get right and it's done well.
- **Telemetry is correctly gated.** Sentry/Plausible stay dormant unless the user opts in *and* DNT is off, and Sentry `beforeSend` scrubs request bodies, cookies, user, and app state (lines 2396–2413). Textbook.
- **Backend secrets are handled correctly.** Only the Supabase *anon* key and Sentry DSN are in the client — both public by design. No `service_role` key anywhere in the tree.
- **Clean routing + additive-safe-ish state.** `ROUTES`/`go`/`render` is tidy; `load()` merges saved state over `blank()` so updates don't wipe users (line 1210).
- **Real bilingual RTL and a coherent design system.** 60 routes, full AR/EN, themeable tokens.

---

## Findings by severity

### 🔴 High — fix before any real-user / pharma rollout

**1. "Login" and "Sign up" are cosmetic — there is no authentication.**
`doLogin` (line 1485) accepts *any* email + any 6-character password and sets `authed=true`; the password is never checked against anything. Same for signup. This is fine for a local-only profile, but the UI strongly implies an account that protects data. For AbbVie/clinic distribution this is a credibility and (if cloud sync is ever claimed) a security problem.
→ Either (a) relabel honestly as a local profile / passcode, or (b) wire real Supabase Auth (email magic-link or OTP) — the Supabase project already exists.

**2. No HTML escaping → markup injection / stored XSS, including into the doctor's browser.**
There is no `esc()` helper anywhere. User-entered text (name, notes, meal description, lab values) is interpolated straight into `innerHTML` and into `value="…"` attributes (e.g. clinician view line 2494 renders `payload.nm` raw; log list line 1285). Concretely:
- A name containing `"` breaks input fields today.
- A note like `<img src=x onerror=…>` executes when rendered — and because the **clinician summary is fetched from Supabase / a shared link and rendered with `renderClinician`**, a crafted payload runs in the *clinician's* browser, not just the patient's.
→ Add one `esc()` function and wrap every user-supplied interpolation. ~1 hour, removes the whole class of bug.

**3. Export and Delete operate on a stale subset of the data — data-loss + "right to erasure" gap.**
`doExport` (line 3966) saves only `{user, logs, disc}`. `reallyDeleteData` (line 3969) clears only `logs/disc/badges/reminders`. Both predate the meds, labs, supplements, vaccines, grocery, discHistory, and control features — so **export silently omits them, and "delete my data" leaves medication and lab history behind.** Under PDPL/GDPR that's a non-compliant erasure. There is also no *import/restore* of the export (the only file reader is the CSV/lab-photo path), so export is one-way.
→ Make both functions iterate the full `blank()` schema; add JSON re-import.

### 🟠 Medium — fix soon

**4. "Offline-first" is only half true.** The service worker pre-caches just the shell (`sw.js` CORE). Charts (Chart.js via Cloudflare, loaded in `<head>`), Google Fonts, and ~30 diet/hero images (all Unsplash, lines 3042–3070+) are external. Offline or on a flaky connection: charts go blank, fonts fall back, and every food/diet photo breaks. Unsplash also means link-rot, an IP/privacy leak to a third party on every view, and photos not guaranteed to match the labelled food.
→ Self-host Chart.js + the two fonts, and ship compressed local food images (or pre-cache them in the SW). Biggest single UX-robustness win.

**5. Service-worker version drift.** The local `sw.js` says `ibd-connect-v20` while the working notes referenced v22, and there are *two* SW files (`./sw.js` and `site/sw.js`) plus a Finder duplicate `sw 2.js`. Manual version bumping across copies = returning users stuck on stale builds.
→ Single SW, single source of truth, auto-stamp the cache name at deploy.

**6. Shared clinician report contains real PHI behind only a random code.** The payload includes the patient's real name, disease, country, and labs, uploaded to Supabase and readable by anyone with the link for 7 days (no read auth). Defensible, but the name is unnecessary.
→ Default to initials or a patient-chosen label; keep the full name on-device only.

**7. Shallow state merge.** `Object.assign(blank(), v)` is shallow, so nested objects (`prefs`, `user`, `game`) from an old save *replace* the new defaults — newly added nested prefs come back `undefined` for existing users (patched ad-hoc with `||` fallbacks today).
→ Deep-merge on load.

### 🟡 Low — hygiene & maintainability

- **Repo bloat / wrong-file risk:** `ibd-connect.html` (502 KB) is a stale near-twin of `index.html`; `site/` holds duplicate copies, deploy `.zip` artifacts, and `sw 2.js`; a 12 MB PDF and two PPTX sit in the web root. Clean these out so the wrong file can't be deployed.
- **No automated tests / CI.** One syntax error in the single `<script>` bricks the entire app, and QA is manual screenshots. Add a parse-check + a headless smoke test (walk all 60 routes, fail on console errors) on every push.
- **Manifest contradiction:** `categories` includes `"medical"` (manifest line 15) while the whole product is positioned non-medical — that can invite stricter app-store medical review. Use `health`/`lifestyle` only.
- **Single 504 KB unminified file.** Fine as a prototype; increasingly a maintenance liability. Consider a light build step (concatenate + minify from modules) without abandoning the single-file deploy artifact.

---

## Prioritised improvement roadmap

**Now (a day or two, high impact / low effort)**
1. Add `esc()` and escape all user input → kills the XSS/markup class (#2).
2. Fix `doExport` + `reallyDeleteData` to cover the full schema; add JSON import (#3).
3. Decide auth honestly: relabel as local profile *or* turn on Supabase Auth (#1).
4. Drop `"medical"` from manifest categories (#8).

**Next (this sprint)**
5. Self-host Chart.js, fonts, and food images; pre-cache them so offline actually works (#4).
6. Collapse to one service worker with an auto-stamped cache version (#5).
7. Deep-merge state on load (#7).
8. Repo cleanup: delete `ibd-connect.html`, `site/` duplicates, zips, and media from the web root (#9).

**Then (raises it from prototype to product)**
9. Add CI: script parse-check + headless route smoke test on every deploy (#10).
10. Pseudonymise the shared clinician payload (#6).
11. If multi-device is a real goal, finish Supabase Auth + sync (the schema already exists) so data survives a cleared browser — today, localStorage is the only store and a cache clear loses everything.

**Bigger bets (product, not bug-fixes)**
- Reminders are display-only in the PWA; real push needs the native (Expo) build or Web Push. Decide which is the shipping target.
- Consider a clinician-side view (read-only dashboard) rather than a one-off shared summary, if clinics are the channel.

---

*Bottom line: the compliance and localisation work is the genuinely hard part, and it's done well. The remaining work is the unglamorous production-hardening — escaping, real (or honestly-labelled) auth, complete export/delete, and true offline. All are small, well-bounded changes.*
