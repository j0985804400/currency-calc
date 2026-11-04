const CACHE_NAME = 'currency-calc-v4';
const ASSETS_TO_CACHE = [
  '/currency-calc/',
  '/currency-calc/index.html',
  '/currency-calc/manifest.json',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('快取核心檔案');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('清除舊快取:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // 【關鍵修復】遇到匯率 API，絕對不走快取，強制走外部網路！
  if (event.request.url.includes('open.er-api.com')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // 其他網頁檔案則正常使用快取
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch(() => {
      return new Response('目前處於離線狀態');
    })
  );
});
