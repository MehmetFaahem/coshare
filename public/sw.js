// public/sw.js
self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  self.skipWaiting(); // Allow immediate activation
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
  // Claim any clients immediately
  event.waitUntil(clients.claim());
});

self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  const notification = event.notification;
  notification.close();

  // Try to detect if it's a mobile device by the action
  const isMobileContext = !event.action || event.action === "";

  // Handle notification actions
  if (event.action === "redirect" && event.notification.data?.redirectPath) {
    event.waitUntil(clients.openWindow(event.notification.data.redirectPath));
  } else {
    // Default action - try to find an existing window/tab and focus it
    // This works better on mobile than always opening a new window
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((windowClients) => {
          // If we have an existing window, focus it
          if (windowClients.length > 0) {
            let client = windowClients[0];

            // If we have a target path, try to find a client with that URL
            if (event.notification.data?.redirectPath) {
              const targetPath = event.notification.data.redirectPath;
              const matchingClient = windowClients.find((client) =>
                client.url.includes(targetPath)
              );

              if (matchingClient) {
                client = matchingClient;
              }
            }

            // Focus the client
            return client.focus();
          } else {
            // If no existing window, open a new one
            return clients.openWindow("https://sohojatra.com");
          }
        })
    );
  }
});

// Handle push events from the server
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();

    // Detect mobile context - simplified options for mobile
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        self.navigator?.userAgent || ""
      );

    const options = {
      body: data.body || "You have a new notification",
      icon: data.icon || "/banner_image.png",
      badge: data.badge || "/banner_image.png",
      data: data.data || {},
      // Simplify notification for mobile
      requireInteraction: isMobile ? false : data.requireInteraction || false,
      actions: isMobile ? [] : data.actions || [],
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
