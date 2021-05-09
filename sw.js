const CACHE_KEY = 'go-offline::v1';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_KEY).then(function(cache) {
      return Promise.all([
        // GitHub pages hosted demo
        cache.add('/go-offline/'),
        cache.add('/go-offline/index.html'),
        // js13kgames hosted path
        cache.add('/games/go-offline/'),
        cache.add('/games/go-offline/index.html'),
        // relative file name - that in theory would be enough
        cache.add('index.html')
      ].map(p => p.catch(() => undefined)));
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      let networked = fetch(event.request)
        .then(response => {
          caches
            .open(CACHE_KEY)
            .then(cache => cache.put(event.request, response.clone()));
        })
        .catch(() => undefined);
     return cached || networked;
   })
 );
});
