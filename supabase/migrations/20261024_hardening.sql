-- PENDING, NOT APPLIED. Review, test on a branch database, then apply.
-- Goal: bound what anonymous clients can write (abuse, poisoning, storage fill). Compatible with the current client payloads.

-- 1) events: bound the props payload and event name charset
ALTER TABLE public.events ADD CONSTRAINT events_props_size CHECK (props IS NULL OR pg_column_size(props) <= 2048) NOT VALID;
ALTER TABLE public.events ADD CONSTRAINT events_ev_charset CHECK (ev ~ '^[A-Za-z0-9_:.-]{1,40}$') NOT VALID;

-- 2) registry: bound free-text fields (age_band values the client sends: '<25','25-39','40-59','60+')
ALTER TABLE public.registry ADD CONSTRAINT registry_age_band CHECK (age_band IS NULL OR age_band IN ('<25','25-39','40-59','60+')) NOT VALID;
ALTER TABLE public.registry ADD CONSTRAINT registry_text_len CHECK (char_length(coalesce(dx,'')) <= 40 AND char_length(coalesce(region,'')) <= 60) NOT VALID;

-- 3) snapshots: cap blob format (legacy "iv.ct" or "v2:iv.ct"), allowed characters only
ALTER TABLE public.snapshots ADD CONSTRAINT snapshots_blob_format CHECK (blob ~ '^(v2:)?[A-Za-z0-9+/=]+\.[A-Za-z0-9+/=]+$') NOT VALID;

-- 4) Do not let the API roles call the admin analytics functions through PostgREST if you move the dashboard
--    to an authenticated or server-side call. LEFT AS A DECISION: the current dashboard may call them as anon.
-- REVOKE EXECUTE ON FUNCTION public.event_summary(integer,text), public.event_daily(integer,text) FROM anon;

-- 5) Rate limiting is NOT possible with these constraints alone: add it at the edge (Vercel/Cloudflare WAF rules on
--    /rest/v1/rpc/snapshot_put, snapshot_get, get_shared_report and on inserts to registry/events).
-- NOT VALID constraints apply to new rows only; run VALIDATE CONSTRAINT after checking existing rows.
