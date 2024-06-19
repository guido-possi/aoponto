self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('v1').then(function(cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/style.css',
                '/script.js',
                '/manifest.json',
                '/icon.png',
                '/alarm1.mp3',
                '/alarm2.mp3',
                '/alarm3.mp3',
                '/alarm4.mp3',
                '/alarm5.mp3',
                '/alarm6.mp3',
                '/alarm7.mp3'
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('push', function(event) {
    const title = 'Ao Ponto - Countdown Timer';
    const options = {
        body: event.data.text(),
        icon: 'icon.png',
        badge: 'icon.png'
    };

    event.waitUntil(self.registration.showNotification(title, options));
});
