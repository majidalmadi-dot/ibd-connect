import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STRINGS } from '../i18n/strings';
import { getTheme } from '../theme/themes';
import { DEFAULT_LEARN, SGA_ARTICLES, DEFAULT_TIPS } from '../data/content';
import { LEVELS, BADGES, QUESTS } from '../data/misc';
import * as Notif from '../services/notifications';
import * as Cloud from '../services/cloud';

const KEY = 'ibdconnect_rn_v1';
const StoreCtx = createContext(null);
export const useStore = () => useContext(StoreCtx);

const rid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const pick = (a) => a[Math.floor(Math.random() * a.length)];

function blank() {
  return {
    lang: null, onboarded: false, authed: false,
    user: { name: '', email: '', year: '', gender: '', disease: '', diagYear: '', avatar: '🙂', country: '', countryFlag: '' },
    prefs: { remindDaily: true, remindMed: false, remindContent: true, analytics: false, medTime: '20:00', theme: 'midnight', stepGoal: 8000, nudges: true, nudgeDaily: true, nudgeSteps: true, nudgeHydra: true },
    logs: [], disc: null, reminders: [],
    badges: [], learn: JSON.parse(JSON.stringify(DEFAULT_LEARN)), tips: JSON.parse(JSON.stringify(DEFAULT_TIPS)),
    game: { xp: 0, quests: {}, lastLevel: 1, readCount: 0 },
    nudgeDismiss: {},
  };
}

function seedDemo(s) {
  const syms = ['abdPain', 'diarrhea', 'bloating', 'fatigue', 'urgency', 'jointPain'];
  for (let d = 12; d >= 1; d--) {
    const day = new Date(); day.setDate(day.getDate() - d);
    const iso = day.toISOString();
    if (Math.random() > 0.2) s.logs.push({ id: rid(), type: 'symptom', t: iso, sym: pick(syms), sev: 1 + Math.floor(Math.random() * 3), notes: '' });
    if (Math.random() > 0.3) s.logs.push({ id: rid(), type: 'meal', t: iso, mealType: pick(['breakfast', 'lunch', 'dinner', 'snack']), desc: '—', photo: false });
    if (Math.random() > 0.25) s.logs.push({ id: rid(), type: 'sleep', t: iso, hours: 5 + Math.floor(Math.random() * 4), qual: 1 + Math.floor(Math.random() * 4) });
    if (Math.random() > 0.25) s.logs.push({ id: rid(), type: 'mood', t: iso, mood: 1 + Math.floor(Math.random() * 5) });
    if (Math.random() > 0.5) s.logs.push({ id: rid(), type: 'activity', t: iso, act: pick(['walking', 'gym', 'yoga']), mins: 15 + Math.floor(Math.random() * 45), intensity: 1 + Math.floor(Math.random() * 3) });
    if (Math.random() > 0.3) s.logs.push({ id: rid(), type: 'bowel', t: iso, count: 1 + Math.floor(Math.random() * 5), bristol: 1 + Math.floor(Math.random() * 7) });
    if (Math.random() > 0.2) s.logs.push({ id: rid(), type: 'steps', t: iso, steps: 3000 + Math.floor(Math.random() * 8000) });
  }
  return s;
}

function ensureSga(s) {
  SGA_ARTICLES.forEach((a) => { if (!s.learn.find((x) => x.id === a.id)) s.learn.push(JSON.parse(JSON.stringify(a))); });
  return s;
}

export const todayKey = (d) => (d || new Date()).toISOString().slice(0, 10);
export function lastNDays(n) { const a = []; for (let i = n - 1; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); a.push(todayKey(d)); } return a; }

export function StoreProvider({ children }) {
  const [s, setS] = useState(blank());
  const [ready, setReady] = useState(false);
  const [, force] = useState(0);
  const toastRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        let st = raw ? Object.assign(blank(), JSON.parse(raw)) : seedDemo(blank());
        ensureSga(st);
        setS(st);
      } catch (e) { setS(seedDemo(blank())); }
      setReady(true);
    })();
  }, []);

  const cloudTimer = useRef(null);
  const persist = (st) => {
    AsyncStorage.setItem(KEY, JSON.stringify(st)).catch(() => {});
    // debounced cloud push (no-op unless configured + authed)
    if (Cloud.cloudEnabled() && st.authed) {
      clearTimeout(cloudTimer.current);
      cloudTimer.current = setTimeout(() => { Cloud.pushState(st).catch(() => {}); }, 1500);
    }
  };

  // mutate current state then persist + re-render
  const update = (fn) => {
    setS((prev) => { const next = { ...prev }; fn(next); persist(next); return next; });
  };

  const lang = s.lang || 'en';
  const isAr = lang === 'ar';
  const theme = getTheme(s.prefs?.theme || 'midnight');
  const t = (k) => { const e = STRINGS[k]; return e ? e[lang] : k; };
  const L = (arr) => (arr ? arr[isAr ? 1 : 0] : '');

  // Reschedule local notifications whenever reminder prefs change.
  useEffect(() => {
    if (!ready) return;
    Notif.reschedule(s.prefs, { nudgeLogToday: STRINGS.nudgeLogToday[lang], medReminderBody: STRINGS.meds[lang] });
  }, [ready, s.prefs.remindDaily, s.prefs.remindMed, s.prefs.medTime, lang]);

  // On ready + signed in, pull cloud snapshot and merge (logs union by id).
  useEffect(() => {
    if (!ready || !s.authed || !Cloud.cloudEnabled()) return;
    let cancelled = false;
    (async () => {
      const remote = await Cloud.pullState();
      if (cancelled || !remote) return;
      setS((prev) => {
        const ids = new Set(prev.logs.map((l) => l.id));
        const mergedLogs = prev.logs.concat((remote.logs || []).filter((l) => !ids.has(l.id)));
        const next = { ...prev, ...remote, logs: mergedLogs, lang: prev.lang, prefs: { ...remote.prefs, ...prev.prefs } };
        persist(next); return next;
      });
    })();
    return () => { cancelled = true; };
  }, [ready, s.authed]);

  // ---- helpers ----
  const logsOn = (dayK) => s.logs.filter((l) => l.t.slice(0, 10) === dayK);
  const streak = () => { let n = 0; for (let i = 0; i < 400; i++) { const d = new Date(); d.setDate(d.getDate() - i); if (logsOn(todayKey(d)).length > 0) n++; else if (i > 0) break; } return n; };
  const weekActiveDays = () => lastNDays(7).filter((d) => logsOn(d).length > 0).length;
  const todaySteps = () => logsOn(todayKey()).filter((l) => l.type === 'steps').reduce((a, l) => a + (l.steps || 0), 0);

  const levelInfo = () => {
    const xp = s.game?.xp || 0; let i = 0;
    for (let j = 0; j < LEVELS.length; j++) if (xp >= LEVELS[j].min) i = j;
    const cur = LEVELS[i], nxt = LEVELS[i + 1];
    const floor = cur.min, ceil = nxt ? nxt.min : cur.min + 600;
    const xpIn = xp - floor, xpFor = ceil - floor;
    return { level: i + 1, en: cur.en, ar: cur.ar, icon: cur.icon, xpIn, xpFor, pct: Math.min(100, Math.round((xpIn / xpFor) * 100)), xp };
  };

  const goals = () => {
    const today = logsOn(todayKey());
    const variety = new Set(today.map((l) => l.type)).size;
    const reflect = (today.some((l) => l.type === 'mood') ? 1 : 0) + (today.some((l) => l.type === 'sleep') ? 1 : 0);
    return [
      { key: 'log', label: isAr ? 'سجِّل' : 'Log', val: Math.min(today.length, 4), goal: 4, color: theme.accent },
      { key: 'variety', label: isAr ? 'تنوّع' : 'Variety', val: Math.min(variety, 3), goal: 3, color: theme.coral },
      { key: 'reflect', label: isAr ? 'تأمّل' : 'Reflect', val: reflect, goal: 2, color: theme.accent2 },
    ];
  };

  const badgeTest = (id, st) => {
    const lo = (dk) => st.logs.filter((l) => l.t.slice(0, 10) === dk);
    const strk = () => { let n = 0; for (let i = 0; i < 400; i++) { const d = new Date(); d.setDate(d.getDate() - i); if (lo(todayKey(d)).length > 0) n++; else if (i > 0) break; } return n; };
    switch (id) {
      case 'first': return st.logs.length >= 1;
      case 'streak3': return strk() >= 3;
      case 'streak7': return strk() >= 7;
      case 'allsix': return new Set(lo(todayKey()).map((l) => l.type)).size >= 5;
      case 'disc': return !!st.disc;
      case 'logs25': return st.logs.length >= 25;
      default: return false;
    }
  };
  const questProg = (id, st) => {
    const lo = (dk) => st.logs.filter((l) => l.t.slice(0, 10) === dk);
    const strk = () => { let n = 0; for (let i = 0; i < 400; i++) { const d = new Date(); d.setDate(d.getDate() - i); if (lo(todayKey(d)).length > 0) n++; else if (i > 0) break; } return n; };
    switch (id) {
      case 'q_days3': return new Set(st.logs.map((l) => l.t.slice(0, 10))).size;
      case 'q_full': { let m = 0; lastNDays(30).forEach((d) => { m = Math.max(m, new Set(lo(d).map((l) => l.type)).size); }); return m; }
      case 'q_streak7': return strk();
      case 'q_disc': return st.disc ? 1 : 0;
      case 'q_logs50': return st.logs.length;
      default: return 0;
    }
  };

  const toast = (msg) => { if (toastRef.current) toastRef.current(msg); };

  const addLog = (o) => {
    update((st) => {
      o.id = rid(); o.t = o.t || new Date().toISOString();
      st.logs = [...st.logs, o];
      st.game = { ...st.game, xp: (st.game.xp || 0) + 10 };
      BADGES.forEach((b) => { if (badgeTest(b.id, st) && !st.badges.includes(b.id)) st.badges = [...st.badges, b.id]; });
      QUESTS.forEach((q) => { if (!st.game.quests[q.id] && questProg(q.id, st) >= q.goal) st.game.quests = { ...st.game.quests, [q.id]: 'ready' }; });
    });
    toast(t('loggedOk'));
  };
  const deleteLog = (id) => update((st) => { st.logs = st.logs.filter((l) => l.id !== id); });

  const claimQuest = (id) => {
    update((st) => { if (st.game.quests[id] === 'ready') { const q = QUESTS.find((x) => x.id === id); st.game.quests = { ...st.game.quests, [id]: 'claimed' }; st.game = { ...st.game, quests: st.game.quests, xp: (st.game.xp || 0) + q.xp }; } });
  };

  const setLang = (l) => update((st) => { st.lang = l; });
  const setTheme = (id) => update((st) => { st.prefs = { ...st.prefs, theme: id }; });
  const reset = () => { const l = s.lang; const nb = blank(); nb.lang = l; ensureSga(nb); setS(nb); persist(nb); };

  // Optional cloud (no-op unless configured). Local auth always succeeds; cloud runs alongside.
  const cloud = {
    enabled: Cloud.cloudEnabled(),
    signIn: (e, p) => Cloud.signIn(e, p),
    signUp: (e, p) => Cloud.signUp(e, p),
    signOut: () => Cloud.signOut(),
    syncNow: () => Cloud.pushState(s),
  };
  const rescheduleNotifs = () => Notif.reschedule(s.prefs, { nudgeLogToday: STRINGS.nudgeLogToday[lang], medReminderBody: STRINGS.meds[lang] });

  const value = {
    s, ready, lang, isAr, dir: isAr ? 'rtl' : 'ltr', theme, t, L,
    update, setLang, setTheme, reset, addLog, deleteLog, claimQuest,
    logsOn, lastNDays, todayKey, streak, weekActiveDays, todaySteps, levelInfo, goals,
    questProg: (id) => questProg(id, s), toast, registerToast: (fn) => { toastRef.current = fn; },
    cloud, rescheduleNotifs,
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
