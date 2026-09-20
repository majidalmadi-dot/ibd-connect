# Rafeeq — Internal Security & QA Pass

Date: 21 June 2026 · Scope: live web app (ibd-connect.vercel.app), service worker, Supabase backend. This is an **internal** review, not an independent third-party penetration test (that remains a recommended paid engagement before a clinical/pharma launch).

## Summary

Posture is solid for a privacy-first PWA. This pass found and fixed three residual output-escaping gaps and tightened two over-broad database policies. No secrets are exposed in the client; no `eval`/dynamic code execution; backend access is governed by row-level security.

## Findings & actions

| # | Severity | Finding | Action |
|---|---|---|---|
| 1 | Medium | Three user-entered fields were interpolated into `value="…"` without escaping: profile-edit **name** and **email**, and the medication-change **dose**. A quote or markup could break the field or inject. | **Fixed** — wrapped all three in `esc()`. Full escaping now covers names, email, notes, meals, meds/doses, supplements, grocery, labs, and the clinician payload. |
| 2 | Low | `push_subscriptions` had `UPDATE` and `DELETE` policies for `anon` with always-true conditions (anyone knowing an endpoint could alter/delete it). | **Fixed** — dropped both; the table is now **insert-only** for `anon`. Stale endpoints are pruned server-side by the edge function on 404/410. Client re-subscribe switched to `ignoreDuplicates`. |
| 3 | Info | `pg_net` extension installed in the `public` schema (Supabase default). | **Left as-is** — moving it would break the scheduled-reminder cron that references `net.http_post`. Documented; acceptable. |

## Checks that passed

- **Secrets:** no `service_role` key and no VAPID **private** key in the client bundle. Only the public anon key, Sentry DSN, and VAPID **public** key ship — all public-safe by design. The VAPID private key exists only inside the Supabase Edge Function.
- **Code execution:** no `eval()` / `new Function()` in the app.
- **Transport/secrets at rest:** keystore and private keys are not committed to the public repo (`.vercelignore` excludes internal docs/assets; verified the AbbVie deck, audit, and setup docs return 404).
- **RLS:** `shared_reports` and `registry` inserts are value-bounded; reads are code+expiry gated; `push_subscriptions` is insert-only. Verified earlier via the anon REST endpoint (valid → 201, abusive → 401).
- **Telemetry:** Sentry/Plausible stay dormant unless the user opts in and DNT is off; Sentry scrubs request bodies, cookies, user, and app state.
- **Parse integrity:** the single inline script parse-checks clean on every deploy (a gate before each push).

## Manual device-QA checklist (run before a store release)

These need real devices/browsers and can't be automated from here:

- iOS Safari (installed PWA) and Android Chrome: full route walk, RTL/Arabic layout, dark/light themes.
- Notifications: enable on a real device, confirm the immediate confirmation fires, then confirm a scheduled reminder is delivered when the app is closed.
- Offline: load once, go offline, confirm shell + charts render; confirm graceful fallback for external images.
- Data: export → clear browser data → import → confirm full restore; confirm "delete my data" clears every module.
- Clinician share: generate, open on a second device, confirm read-only render and 7-day expiry.

## Recommended next (paid / external)

- Independent penetration test + dependency/CDN supply-chain review.
- PDPL data-processing assessment for the Supabase clinician-share and registry.
- Rotate the keystore/edge-function VAPID and store secrets in a managed vault for production.
