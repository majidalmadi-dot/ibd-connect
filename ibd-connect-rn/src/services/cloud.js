// Optional Supabase cloud sync. Entirely additive and OFF by default:
// the app is fully functional offline. Provide credentials in app.json →
// expo.extra.supabaseUrl / supabaseAnonKey to enable accounts + multi-device sync.
//
// @supabase/supabase-js is lazy-required so the app/tests run without it installed
// or configured. See supabase/schema.sql for the tables this expects.
let _client = null;
let _cfg;

function config() {
  if (_cfg !== undefined) return _cfg;
  let url, key;
  try {
    const Constants = require('expo-constants').default;
    const extra = (Constants.expoConfig && Constants.expoConfig.extra) || (Constants.manifest && Constants.manifest.extra) || {};
    url = extra.supabaseUrl; key = extra.supabaseAnonKey;
  } catch (e) {}
  _cfg = url && key ? { url, key } : null;
  return _cfg;
}

export function cloudEnabled() { return !!config(); }

function client() {
  if (!cloudEnabled()) return null;
  if (!_client) {
    try {
      require('react-native-url-polyfill/auto');
      const { createClient } = require('@supabase/supabase-js');
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const { url, key } = config();
      _client = createClient(url, key, {
        auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
      });
    } catch (e) { _client = null; }
  }
  return _client;
}

export async function signUp(email, password) {
  const c = client(); if (!c) return { ok: false, offline: true };
  try { const { data, error } = await c.auth.signUp({ email, password }); return error ? { ok: false, error: error.message } : { ok: true, user: data.user }; }
  catch (e) { return { ok: false, error: String(e) }; }
}
export async function signIn(email, password) {
  const c = client(); if (!c) return { ok: false, offline: true };
  try { const { data, error } = await c.auth.signInWithPassword({ email, password }); return error ? { ok: false, error: error.message } : { ok: true, user: data.user }; }
  catch (e) { return { ok: false, error: String(e) }; }
}
export async function signOut() { const c = client(); if (!c) return; try { await c.auth.signOut(); } catch (e) {} }
export async function currentUser() { const c = client(); if (!c) return null; try { const { data } = await c.auth.getUser(); return data.user || null; } catch (e) { return null; } }

// Push the full local snapshot (last-write-wins). Stores profile + logs JSON per user.
export async function pushState(state) {
  const c = client(); if (!c) return { ok: false };
  try {
    const u = await currentUser(); if (!u) return { ok: false };
    const payload = { user_id: u.id, updated_at: new Date().toISOString(), data: { user: state.user, prefs: state.prefs, logs: state.logs, disc: state.disc, reminders: state.reminders, badges: state.badges, game: state.game } };
    const { error } = await c.from('snapshots').upsert(payload, { onConflict: 'user_id' });
    return { ok: !error, error: error && error.message };
  } catch (e) { return { ok: false, error: String(e) }; }
}
export async function pullState() {
  const c = client(); if (!c) return null;
  try {
    const u = await currentUser(); if (!u) return null;
    const { data, error } = await c.from('snapshots').select('data,updated_at').eq('user_id', u.id).single();
    if (error || !data) return null;
    return data.data;
  } catch (e) { return null; }
}
