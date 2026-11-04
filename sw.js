const CACHE_NAME = 'currency-calc-v5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((k) => {
        if (k !== CACHE_NAME) return caches.delete(k);
      })
    ))
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  // 匯率 API 與外部即時請求絕對不攔截、不進快取
  if (url.includes('open.er-api.com') || event.request.method !== 'GET') {
    event.respondWith(fetch(event.request));
    return;
  }

  // 靜態資源優先走快取，失敗走網路
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).catch(() => new Response('離線模式'));
    })
  );
});
