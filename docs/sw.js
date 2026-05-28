// LOST CARD - Service Worker (Self-Destruct + Force Reload)
// 1. Clears ALL caches (lostcard-v1, lostcard-v2, lostcard-v3, everything)
// 2. Force-reloads every open tab → browser gets fresh files from Live Server
// 3. Unregisters itself → after this, NO service worker runs, ever

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => {
  e.waitUntil(
    (async () => {
      // Nuke every cache
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));

      // Claim all tabs (controlled + uncontrolled)
      await self.clients.claim();

      // Force reload every open tab
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      clients.forEach(client => {
        try { client.navigate(client.url); } catch(err) {}
      });

      // Unregister self - no SW = pure network from now on
      await self.registration.unregister();
    })()
  );
});

// NO fetch handler - every request goes straight to the network
