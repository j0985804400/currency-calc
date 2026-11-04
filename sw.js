const CACHE_NAME = 'currency-calc-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com' // 將外掛樣式表也一併快取
];

// 1. 安裝階段：將核心檔案存入快取
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// 2. 啟用階段：清除舊快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// 3. 攔截請求：優先讀取快取，離線時也能啟動
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 若快取中有對應檔案，直接回傳快取；否則透過網路抓取
        return response || fetch(event.request).catch(() => {
          // 若網路斷線且找不到資源，可考慮回傳離線專用頁面 (此處直接放行)
        });
      })
  );
});
