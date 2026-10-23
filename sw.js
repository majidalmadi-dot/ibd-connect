/* IBD Connect service worker — offline support + fresh-on-deploy.
   Bump CACHE on each release to invalidate old assets. */
const CACHE = 'ibd-connect-v65';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './logo-glyph.png',
  // self-hosted charting lib + fonts so charts and type work on the very first offline launch
  './vendor/chart.umd.js', './fonts/inter-latin-400-normal.woff2', './fonts/inter-latin-500-normal.woff2', './fonts/inter-latin-600-normal.woff2', './fonts/inter-latin-700-normal.woff2', './fonts/inter-latin-800-normal.woff2',
  './fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2', './fonts/ibm-plex-sans-arabic-arabic-500-normal.woff2', './fonts/ibm-plex-sans-arabic-arabic-600-normal.woff2', './fonts/ibm-plex-sans-arabic-arabic-700-normal.woff2'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()).catch(() => {}));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Push reminders: show the notification, and focus/open the app on click
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { try { d = { body: e.data && e.data.text() }; } catch (e2) { d = {}; } }
  const title = d.title || 'Rafeeq · رفيق';
  e.waitUntil(self.registration.showNotification(title, {
    body: d.body || '', icon: './icon-192.png', badge: './icon-192.png',
    tag: d.tag || 'rafeeq', data: { url: d.url || './' }
  }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cl) => {
    for (const c of cl) { if ('focus' in c) return c.focus(); }
    return self.clients.openWindow(url);
  }));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  // Sibling apps (Maeen /EoE/, Qawam /Qawam/, Barem /Barem/) have their own workers — never intercept them.
  try { const p = new URL(req.url).pathname; if (/^\/(EoE|Qawam|Barem)(\/|$)/i.test(p)) return; } catch (_) {}
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => { if (res && res.ok) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); } return res; })
        .catch(() => caches.match(req).then((c) => c || caches.match('./index.html')).then((c) => c || caches.match('./')))
    );
    return;
  }
  e.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
        const cp = res.clone(); caches.open(CACHE).then((c) => c.put(req, cp));
      }
      return res;
    }).catch(() => cached))
  );
});
