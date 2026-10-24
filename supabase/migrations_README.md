# Supabase: deployed schema and pending hardening

* `live-schema-2026-10-24.sql` documents what is deployed on project `rafeeq` as read on 2026-10-24 (functions and policies). It is a record, not a migration to run.
* `ibd-connect-rn/supabase/schema.sql` describes a DIFFERENT, per-user (`auth.uid()`) model that is not what is deployed. The deployed web apps use anonymous, capability-style RPCs keyed by a sync ID derived from the user's recovery code.
* `migrations/20261024_hardening.sql` is PENDING: review, test on a branch database, then apply. It has not been applied to production.
