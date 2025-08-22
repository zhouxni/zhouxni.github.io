const CACHE_NAME = "my-app-cache";
const urlsToCache = [
  "/css/github-markdown.min.css",
  "/css/github.min.css",
  "/css/uikit.min.css",
  "/js/highlight.min.js",
  "/js/jquery.min.js",
  "/js/markdown-it.min.js",
  "/js/zip.js",
];
const cacheWhitelist = [CACHE_NAME];
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // 删除旧缓存
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (
    event.request.url.startsWith("http") &&
    (event.request.url.endsWith("preview.html") ||
      event.request.url.endsWith("index.html") ||
      event.request.url.endsWith("privacy.js") ||
      event.request.url == "https://zhouxni.github.io/" ||
      event.request.url == "https://zhouxni.github.io")
  ) {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        return networkResponse;
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response; // 从缓存中返回响应
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok && event.request.url.startsWith("http")) {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }
          return networkResponse;
        }); // 从网络获取资源
      })
    );
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // 删除旧缓存
          }
        })
      );
    })
  );
});

self.addEventListener("message", (event) => {
  const urls = event.data;
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urls);
    })
  );
});
