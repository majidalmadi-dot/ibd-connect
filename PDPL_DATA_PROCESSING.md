# Rafeeq — Data Processing Description (PDPL)

Working description of how Rafeeq processes personal data, to support a Saudi PDPL (Personal Data Protection Law) assessment, the SFDA classification file, and the app-store data-safety forms. This is a draft for review, not legal advice — confirm with a qualified privacy/regulatory adviser.

## Controller
Saudi Gastroenterology Association (Rafeeq). Contact: majid.almadi@gmail.com.

## Data-minimisation principle
By default Rafeeq stores **all** personal and health data **locally on the user’s device** (browser localStorage). No account is required and nothing leaves the device unless the user activates a specific optional feature below. This is the primary PDPL safeguard.

## Processing activities

| Activity | Data | Purpose | Lawful basis | Location / processor | Retention |
|---|---|---|---|---|---|
| On-device app use | Profile + all logs (symptoms, bowel, meals, sleep, mood, activity, meds/doses, supplements, labs, IBD-DISC) | Personal self-tracking & education | Consent | User’s device only | Until the user deletes (in-app) |
| Share with doctor (opt-in) | Read-only summary: **initials only**, descriptive trends, latest labs | Support a clinic visit | Explicit consent (user-initiated) | Supabase, **eu-central-1 (Frankfurt)** | Auto-expires ≤7 days; row deletable |
| Research registry (opt-in) | De-identified, aggregate points (disease type, age band, region, summary scores) — no name/email/ID | Population insight | Explicit consent | Supabase, eu-central-1 | Indefinite (anonymous, not linkable) |
| Reminders / push (opt-in) | Web-push subscription token | Deliver reminders | Explicit consent | Supabase, eu-central-1 | Until user disables; auto-pruned on expiry |
| Diagnostics (opt-in, off by default) | Anonymous usage (Plausible) + scrubbed crash reports (Sentry) | Reliability & UX | Consent (+ respects Do-Not-Track) | Plausible (EU) / Sentry (de) | Per processor defaults |
| Hosting | App delivery; IP/standard web logs | Serve the app | Legitimate interest | Vercel (CDN/EU) | Per processor defaults |

## Cross-border transfer — action needed
All backend processing currently occurs in the **EU (Frankfurt)**, not in the Kingdom. For a production deployment involving Saudi residents’ health data, PDPL transfer conditions must be satisfied (adequacy, appropriate safeguards, or a documented exception) — or the backend should be relocated to KSA-region hosting. Recommended: confirm with counsel and, if required, migrate the clinician-share/registry/push data to an in-Kingdom or approved region before scale-up.

## Data-subject rights (implemented)
- **Access/portability:** in-app full **export** to JSON; **import** to restore.
- **Erasure:** in-app **delete data** (clears every module) and **delete profile**; backend share rows expire automatically and are deletable; email for any backend request.
- **Withdraw consent:** every server feature is opt-in and reversible in Settings.

## Security measures
- On-device-first storage; TLS in transit; Supabase Row-Level Security (insert-bounded `shared_reports`/`registry`, insert-only `push_subscriptions`, no client read-back of registry).
- Output escaping across all user-entered fields (XSS mitigation); no client-side secrets (only public keys ship); telemetry scrubbed of PII and app state and gated on consent + DNT.
- Server secrets (service role, web-push private key) held only server-side.

## Recommended before launch
1. Privacy counsel review + a short DPIA for the opt-in server features.
2. Resolve the EU-hosting / PDPL transfer question (above).
3. Record SGA’s clinical-content validation process.
4. Re-confirm the medication-tracking feature against the non-medical line (see SFDA draft).
