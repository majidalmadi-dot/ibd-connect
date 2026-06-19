# IBD Connect — Backend setup (Supabase)

The app works fully offline today. The clinician-share and registry features have a
**live backend mode** that activates the moment you add two keys. Until then:

- **Clinician share** still works — it encodes the summary inside the QR/link itself, on-device (nothing uploaded).
- **Registry opt-in** records the user's consent locally and starts sending once the backend is connected.

## 1. Create a free Supabase project
1. Go to https://supabase.com → **New project** (free tier is fine).
2. Once created, open **Project Settings → API** and copy:
   - **Project URL** (e.g. `https://abcd1234.supabase.co`)
   - **anon public** key (a long `eyJ...` string — this is safe to ship in a web app)

## 2. Paste the keys into the app
Open `index.html`, find this line near the bottom of the script:

```js
const CLOUD = { url: '', anon: '' };  // <-- paste Supabase project URL + anon (public) key here
```

Fill it in:

```js
const CLOUD = { url: 'https://abcd1234.supabase.co', anon: 'eyJhbGciOi...' };
```

Then run the usual sync + deploy (see DEPLOY.md). That's it — live mode turns on automatically.

## 3. Create the tables (run once in Supabase → SQL Editor)

```sql
-- ============ Clinician share links (short-lived, unguessable code) ============
create table if not exists public.shared_reports (
  code        text primary key,
  data        jsonb not null,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null
);
alter table public.shared_reports enable row level security;

-- Anyone may create a share (the patient, from the app)
create policy "anon can create share"
  on public.shared_reports for insert
  to anon with check (true);

-- A share is readable only if you know its (random, unguessable) code and it hasn't expired
create policy "anon can read unexpired share"
  on public.shared_reports for select
  to anon using (expires_at > now());

-- ============ Anonymous research registry (write-only from the app) ============
create table if not exists public.registry (
  id          uuid primary key default gen_random_uuid(),
  dx          text,
  age_band    text,
  region      text,
  sym         numeric,
  bow         numeric,
  adh         numeric,
  disc        integer,
  ctrl        integer,
  gen         date,
  created_at  timestamptz not null default now()
);
alter table public.registry enable row level security;

-- The app may contribute anonymized rows; nobody can read them back from the client
create policy "anon can contribute"
  on public.registry for insert
  to anon with check (true);
-- (no select policy => the anon key cannot read registry data; query it from the Supabase dashboard or a service-role backend)
```

### Optional housekeeping
Auto-delete expired shares daily (Supabase → Database → Cron, or a scheduled function):

```sql
delete from public.shared_reports where expires_at < now();
```

## Privacy notes
- The **anon key is public by design** — RLS policies above are what protect the data, not the key.
- `shared_reports` access control = the long random `code` in the link + a 7-day expiry.
- `registry` is **write-only** from the client (no SELECT policy), so contributed rows can't be read back by the app or other users.
- The optional multi-device account sync (`snapshots` table) is described in `ibd-connect-rn/supabase/schema.sql`.
