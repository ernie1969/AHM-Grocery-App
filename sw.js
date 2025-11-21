const CACHE_NAME = 'AHM-Grocery-App-cache-v1';
const urlsToCache = [
    '/',                 // Correct root path
    'index.html',       // Use root-relative path
    'style.css',        // Use root-relative path
    'main.js',          // Use root-relative path
    'manifest.json',    // Use root-relative path
    'images/icon-96.png',
    'images/icon-144.png',
    'images/icon-192.png',
    'images/icon-256.png',
    'images/icon-512.png'
];

// --- 1. Install Event: Caching Files (NOW WITH ERROR CATCHING) ---
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('SW: Opened cache, attempting to add files...');
                // If any file in urlsToCache fails, the promise will reject
                return cache.addAll(urlsToCache);
            })
            // 🚨 CRUCIAL: CATCH THE INSTALLATION FAILURE HERE
            .catch(err => {
                console.error('SW FAILURE: Service Worker installation failed! Check your Network tab for a 404 (File Not Found) error in the list below:', urlsToCache);
                console.error(err); 
                // Throwing the error ensures it is visible in the console
                throw err;
            })
    );
  });
  

// --- 2. Fetch Event: Serving Cached Content (Now with Fallback) ---
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                console.log('Success Fetch');
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No hit - fetch from network
                return fetch(event.request).catch(() => {
                    // If the network fetch fails, return the cached root page
                    return caches.match('/'); // Fallback to the root
                });
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