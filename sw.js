/*
const CACHE_NAME = 'AHM-Grocery-App-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css', // Example CSS file
  '/main.js',  // Example JavaScript file
  '/manifest.json',
  '/sw.js',
  '/images/icon-192.ico',
  '/images/icon-256.ico'
];

//-- try this code
let cacheName = "AHM-Grocery-App-cache-v1";

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

*/


// Register the service worker
if ('serviceWorker' in navigator) {
    // Wait for the 'load' event to not block other work
    window.addEventListener('load', async () => {
      // Try to register the service worker.
      try {
        // Capture the registration for later use, if needed
        let reg;
  
        // Use ES Module version of our Service Worker in development
        if (meta.env?.DEV) {
          reg = await navigator.serviceWorker.register('/sw.js', {
            type: 'module',
          });
        } else {
          // In production, use the normal service worker registration
          reg = await navigator.serviceWorker.register('/sw.js');
        }
  
        console.log('Service worker registered! 😎', reg);
      } catch (err) {
        console.log('😥 Service worker registration failed: ', err);
      }
    });
  }
  

  // Choose a cache name
const cacheName = 'cache-v1';
// List the files to precache
const precacheResources = [
    '/',
    '/index.html',
    '/style.css', // Example CSS file
    '/main.js',  // Example JavaScript file
    '/manifest.json',
    '/sw.js',
    '/images/icon-192.ico',
    '/images/icon-256.ico'
];

// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener('install', (event) => {
  console.log('Service worker install event!');
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activate event!');
});

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener('fetch', (event) => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    }),
  );
});


