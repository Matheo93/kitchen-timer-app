/**
 * Kitchen Timer Service Worker
 * Offline cache strategy: Cache-first for assets, network-first for pages.
 * Enables "Add to Home Screen" and offline cooking without internet.
 */

const CACHE_VERSION = 'kitchen-timer-v1'
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
]

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Non-fatal: assets may not exist during build
      })
    })
  )
  self.skipWaiting()
})

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

// Fetch: cache-first for static, network-first for navigation
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET and cross-origin
  if (request.method !== 'GET' || url.origin !== location.origin) return

  // Navigation requests: network-first
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE_VERSION).then((c) => c.put(request, copy))
          return res
        })
        .catch(() => caches.match('/') || Response.error())
    )
    return
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((res) => {
        if (res.ok) {
          const copy = res.clone()
          caches.open(CACHE_VERSION).then((c) => c.put(request, copy))
        }
        return res
      })
    })
  )
})
