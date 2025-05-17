// public/sw.js
self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  self.skipWaiting(); // optional
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
});

self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  const notification = event.notification;
  notification.close();

  // Handle notification actions
  if (event.action === "redirect" && event.notification.data?.redirectPath) {
    event.waitUntil(clients.openWindow(event.notification.data.redirectPath));
  } else {
    // Default action - open the app
    event.waitUntil(clients.openWindow("https://sohojatra.com"));
  }
});

// Handle push events from the server
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();

    const options = {
      body: data.body || "You have a new notification",
      icon: data.icon || "/banner_image.png",
      badge: data.badge || "/banner_image.png",
      data: data.data || {},
      requireInteraction: data.requireInteraction || false,
      actions: data.actions || [],
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || "New Notification",
        options
      )
    );
  } catch (err) {
    console.error("Error showing push notification:", err);
  }
});
