const CACHE_NAME = 'currency-calc-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// 三星瀏覽器要求必須要有這個 fetch 攔截器，才承認是合法 PWA
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response('目前處於離線狀態');
    })
  );
});
