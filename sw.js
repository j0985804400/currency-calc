// PWA 安裝必備的空 Service Worker 檔案
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // 不攔截任何網路請求，單純為了滿足 PWA 條件
});
