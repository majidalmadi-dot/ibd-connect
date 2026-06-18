// Local notifications service. expo-notifications is lazy-required so the rest of
// the app (and tests) run even where the native module isn't available (e.g. web, Node).
let _N = null;
function mod() {
  if (_N === null) { try { _N = require('expo-notifications'); } catch (e) { _N = false; } }
  return _N;
}

let _configured = false;
function configure() {
  const N = mod(); if (!N || _configured) return N;
  try {
    N.setNotificationHandler({
      handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: false }),
    });
    _configured = true;
  } catch (e) {}
  return N;
}

export async function ensurePermissions() {
  const N = configure(); if (!N) return false;
  try {
    const { status } = await N.getPermissionsAsync();
    if (status === 'granted') return true;
    const req = await N.requestPermissionsAsync();
    return req.status === 'granted';
  } catch (e) { return false; }
}

function parseTime(s) {
  const [h, m] = String(s || '20:00').split(':').map((x) => parseInt(x, 10) || 0);
  return { hour: h, minute: m };
}

// Reschedule all app reminders from current prefs. Safe no-op when unsupported.
export async function reschedule(prefs, strings) {
  const N = configure(); if (!N) return;
  try {
    const ok = await ensurePermissions(); if (!ok) return;
    await N.cancelAllScheduledNotificationsAsync();
    const t = (k, fallback) => (strings && strings[k] ? strings[k] : fallback);
    if (prefs.remindDaily) {
      await N.scheduleNotificationAsync({
        content: { title: 'IBD Connect', body: t('nudgeLogToday', 'Time for your daily check-in') },
        trigger: { hour: 20, minute: 0, repeats: true },
      });
    }
    if (prefs.remindMed) {
      const { hour, minute } = parseTime(prefs.medTime);
      await N.scheduleNotificationAsync({
        content: { title: 'IBD Connect', body: t('medReminderBody', 'Medication reminder') },
        trigger: { hour, minute, repeats: true },
      });
    }
  } catch (e) {}
}

export async function cancelAll() {
  const N = mod(); if (!N) return;
  try { await N.cancelAllScheduledNotificationsAsync(); } catch (e) {}
}

export function isSupported() { return !!mod(); }
