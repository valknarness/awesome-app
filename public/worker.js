/**
 * Awesome Web Worker
 * Intelligently polls for database updates and manages cache invalidation
 */

const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes
const DB_VERSION_ENDPOINT = '/api/db-version';

let currentDbVersion = null;
let pollTimer = null;

// Smart polling with exponential backoff
class SmartPoller {
  constructor(interval) {
    this.baseInterval = interval;
    this.currentInterval = interval;
    this.maxInterval = interval * 4;
    this.minInterval = interval / 2;
    this.consecutiveErrors = 0;
  }

  increaseInterval() {
    this.currentInterval = Math.min(this.currentInterval * 1.5, this.maxInterval);
    console.log('[Worker] Increased poll interval to', this.currentInterval / 1000, 'seconds');
  }

  decreaseInterval() {
    this.currentInterval = Math.max(this.currentInterval * 0.75, this.minInterval);
    console.log('[Worker] Decreased poll interval to', this.currentInterval / 1000, 'seconds');
  }

  resetInterval() {
    this.currentInterval = this.baseInterval;
  }

  getInterval() {
    return this.currentInterval;
  }
}

const poller = new SmartPoller(POLL_INTERVAL);

// Check for database updates
async function checkForUpdates() {
  try {
    const response = await fetch(DB_VERSION_ENDPOINT, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // First time or version changed
    if (currentDbVersion === null) {
      currentDbVersion = data.version;
      console.log('[Worker] Initial DB version:', currentDbVersion);
    } else if (data.version !== currentDbVersion) {
      console.log('[Worker] New DB version detected!', data.version);

      // Notify all clients
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'DB_UPDATE',
          version: data.version,
          metadata: data,
        });
      });

      currentDbVersion = data.version;

      // Invalidate cache
      await invalidateCache();
    }

    // Reset error counter and adjust interval
    poller.consecutiveErrors = 0;
    poller.resetInterval();

  } catch (error) {
    console.error('[Worker] Poll failed:', error);
    poller.consecutiveErrors++;

    if (poller.consecutiveErrors > 3) {
      poller.increaseInterval();
    }
  }
}

// Invalidate cache
async function invalidateCache() {
  try {
    const cacheNames = await caches.keys();

    await Promise.all(
      cacheNames.map(cacheName => {
        if (cacheName.includes('awesome')) {
          console.log('[Worker] Clearing cache:', cacheName);
          return caches.delete(cacheName);
        }
      })
    );

    console.log('[Worker] Cache invalidated');
  } catch (error) {
    console.error('[Worker] Cache invalidation failed:', error);
  }
}

// Start polling
function startPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
  }

  // Initial check
  checkForUpdates();

  // Schedule periodic checks
  pollTimer = setInterval(() => {
    checkForUpdates();
  }, poller.getInterval());

  console.log('[Worker] Polling started');
}

// Stop polling
function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
    console.log('[Worker] Polling stopped');
  }
}

// Service Worker event listeners
self.addEventListener('install', (event) => {
  console.log('[Worker] Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Worker] Activated');
  event.waitUntil(self.clients.claim());
  startPolling();
});

self.addEventListener('message', (event) => {
  console.log('[Worker] Message received:', event.data);

  if (event.data.type === 'CHECK_UPDATE') {
    checkForUpdates();
  } else if (event.data.type === 'START_POLLING') {
    startPolling();
  } else if (event.data.type === 'STOP_POLLING') {
    stopPolling();
  }
});

// Fetch event - cache strategy
self.addEventListener('fetch', (event) => {
  // Add caching strategy here if needed
  event.respondWith(fetch(event.request));
});
