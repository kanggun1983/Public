// 🪪 신분증 스캐너 오프라인 — 한 번 열면 인터넷이 끊겨도 열려요
// 화면 파일은 인터넷이 되면 항상 새로 받고(업데이트 바로 반영), 안 되면 저장해 둔 걸로 열어요.
// 고객 사진은 여기 저장하지 않아요 (사진은 화면 메모리에서만 처리).
const CACHE = 'idscan-v4';
const FILES = ['./', './index.html', './manifest.json', './scan-icon-192.png', './scan-icon-512.png', './scan-icon-maskable-512.png', './scan-apple-touch.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); } return res; })
    .catch(() => caches.match(r, { ignoreSearch: true }).then(m => m || caches.match('./index.html'))));
});
