// Helper functions for browser notifications

// Function to request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

// Check if service worker is registered
export const isServiceWorkerRegistered = async (): Promise<boolean> => {
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    return registrations.length > 0;
  }
  return false;
};

// Register service worker for notifications
export const registerServiceWorker =
  async (): Promise<ServiceWorkerRegistration | null> => {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("Service worker registration successful:", registration);
        return registration;
      } catch (error) {
        console.error("Service worker registration failed:", error);
      }
    } else {
      console.log("Service workers not supported");
    }
    return null;
  };

// Show a browser notification
export const showBrowserNotification = async (
  title: string,
  options: {
    body: string;
    icon?: string;
    requireInteraction?: boolean;
    actions?: { action: string; title: string; deepLink?: string }[];
    data?: { redirectPath?: string; [key: string]: any };
  }
): Promise<boolean> => {
  // Check and request permission if needed
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    console.log("Notification permission not granted");
    return false;
  }

  // Ensure service worker is registered
  let swRegistration: ServiceWorkerRegistration | null = null;

  if ("serviceWorker" in navigator) {
    // Check for existing service worker
    const registrations = await navigator.serviceWorker.getRegistrations();
    if (registrations.length > 0) {
      swRegistration = registrations[0];
    } else {
      swRegistration = await registerServiceWorker();
    }
  }

  if (!swRegistration) {
    console.error("Service worker not available");
    return false;
  }

  try {
    await swRegistration.showNotification(title, {
      ...options,
      badge: options.icon || "/banner_image.png",
      silent: false,
    });
    return true;
  } catch (error) {
    console.error("Error showing notification:", error);
    return false;
  }
};
