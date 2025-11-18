const CACHE_NAME = 'AHM-Grocery-App-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css', 
  '/main.js', 
  '/images/icon-256.ico'
];

//-- try this code
let cacheName = "AHM-Grocery-App";

// --- 1. Install Event: Caching Files ---
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
      caches.open(CACHE_NAME)
          .then(cache => {
              console.log('Opened cache');
              return cache.addAll(urlsToCache);
          })
  );
});

// --- 2. Fetch Event: Serving Cached Content ---
self.addEventListener('fetch', event => {
  event.respondWith(
      caches.match(event.request)
          .then(response => {
              // Cache hit - return response
              if (response) {
                  return response;
              }
              // No hit - fetch from network
              return fetch(event.request);
          })
  );
});

// --- 3. Activate Event: Cleaning up old caches ---
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
      caches.keys().then(cacheNames => {
          return Promise.all(
              cacheNames.map(cacheName => {
                  if (cacheWhitelist.indexOf(cacheName) === -1) {
                      return caches.delete(cacheName);
                  }
              })
          );
      })
  );
});

