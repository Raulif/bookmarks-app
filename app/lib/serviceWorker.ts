// This content will be used to create the service worker file
const CACHE_NAME = "tts-pwa-cache-v1";
const urlsToCache = ["./", "./index.html"];

self.addEventListener("install", (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event: any) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

// Try to keep service worker active
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "KEEP_ALIVE") {
    console.log("Keeping service worker alive");
  }
});
