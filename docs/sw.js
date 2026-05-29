'use strict';
// LOST CARD — Service Worker v3
// Strategy: stale-while-revalidate for same-origin HTML, JS, CSS

const CACHE = 'lc-static-v3';

// Only cache static assets from same origin
function isCacheable(req) {
  if (req.method !== 'GET') return false;
  try {
    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return false;
    const p = url.pathname;
    // Skip admin panel — always fetch fresh
    if (p.includes('/admin/')) return false;
    return p.endsWith('.html') || p.endsWith('.js') || p.endsWith('.css') || p.endsWith('/');
  } catch(e) { return false; }
}

// Install: take control immediately
self.addEventListener('install', () => self.skipWaiting());

// Activate: delete stale caches, claim all clients
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: stale-while-revalidate
// — Cached copy returned immediately (instant load)
// — Fresh copy fetched in background and written to cache
self.addEventListener('fetch', e => {
  if (!isCacheable(e.request)) return;
  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(e.request).then(cached => {
        const network = fetch(e.request).then(res => {
          if (res && res.ok) cache.put(e.request, res.clone());
          return res;
        }).catch(() => cached); // offline: fall back to cache
        return cached || network;
      })
    )
  );
});
