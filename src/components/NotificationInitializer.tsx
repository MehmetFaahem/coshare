import { useEffect, useState } from "react";
import {
  registerServiceWorker,
  requestNotificationPermission,
} from "../lib/browserNotifications";

/**
 * A component that initializes the notification system
 * Including service worker registration and permission request
 */
const NotificationInitializer: React.FC = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeNotifications = async () => {
      if (!initialized && typeof window !== "undefined") {
        try {
          // Register service worker
          await registerServiceWorker();

          // Request permission (this will only prompt if not already granted/denied)
          await requestNotificationPermission();

          setInitialized(true);
          console.log("Notification system initialized");
        } catch (error) {
          console.error("Failed to initialize notification system:", error);
        }
      }
    };

    initializeNotifications();
  }, [initialized]);

  // This component doesn't render anything
  return null;
};

export default NotificationInitializer;
