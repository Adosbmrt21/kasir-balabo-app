const CACHE = 'kasir-balabo-v2';
self.addEventListener('install', (e) => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png']))); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then((r) => {
    if (r && r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
    return r;
  }).catch(async () => {
    const hit = await caches.match(e.request, { ignoreSearch: true });
    if (hit && hit.ok) return hit;
    if (e.request.mode === 'navigate') { const idx = await caches.match('./index.html'); if (idx) return idx; }
    return Response.error();
  }));
});
