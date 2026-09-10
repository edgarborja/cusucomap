// CusucoMap's push-notification service worker. Plain JS, not part of the
// Vite build - copied verbatim to the site root (same mechanism
// manifest.webmanifest already uses) so its push scope covers the whole
// app. Registered from src/push-notifications.ts.
//
// Payload shape ({title, body, url, tag}) matches the original design doc
// (see push-notifications.ts's own header comment) - the worker's
// push-sender.js is the actual source of truth for what it sends, which
// this file has no visibility into, hence the defensive fallbacks below
// rather than assuming every field is present.
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    // Not JSON, or no body at all - fall back to a generic notification
    // rather than dropping the push silently.
  }

  const title = typeof data.title === "string" && data.title ? data.title : "CusucoMap";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: typeof data.body === "string" ? data.body : "",
      tag: typeof data.tag === "string" ? data.tag : undefined,
      icon: "./icon-192.png",
      data: { url: typeof data.url === "string" ? data.url : "./" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url ? event.notification.data.url : "./";
  event.waitUntil(clients.openWindow(url));
});
