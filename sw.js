// Service worker: игра работает без интернета. Обновления подхватываются при следующем запуске.
const CACHE = 'evolution-v1';
const CORE = ["./", "index.html", "manifest.webmanifest", "css/style.css", "js/achievements.js", "js/ads.js", "js/art.js", "js/ascension.js", "js/audio.js", "js/cloud.js", "js/config.js", "js/creatures.js", "js/effects.js", "js/events.js", "js/i18n.js", "js/main.js", "js/pwa.js", "js/quests.js", "js/shop.js", "js/state.js", "js/storage.js", "js/ui.js", "js/utils.js", "js/world.js", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const own = url.origin === location.origin, font = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!own && !font) return;
  // сразу отдаём из кэша и в фоне обновляем (stale-while-revalidate)
  e.respondWith(caches.open(CACHE).then(c => c.match(req).then(hit => {
    const net = fetch(req).then(res => { if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  })));
});
