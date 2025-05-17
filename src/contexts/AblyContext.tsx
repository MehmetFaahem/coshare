import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import * as Ably from "ably";
import { useAuth } from "./AuthContext";
import { toast } from "react-hot-toast";

// Using a placeholder API key - in production, you would use environment variables
// This should be replaced with your actual Ably API key
const ABLY_API_KEY = process.env.VITE_ABLY_API_KEY;

// Define proper types for Ably messages
interface AblyMessage {
  name: string;
  data: Record<string, unknown>;
  id?: string;
}

interface AblyContextType {
  ably: Ably.Realtime | null;
  connected: boolean;
  publishEvent: (
    channelName: string,
    eventName: string,
    data: Record<string, unknown>
  ) => void;
  subscribeToEvent: (
    channelName: string,
    eventName: string,
    callback: (message: AblyMessage) => void
  ) => () => void;
}

const AblyContext = createContext<AblyContextType | undefined>(undefined);

export const AblyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [ably, setAbly] = useState<Ably.Realtime | null>(null);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    let ablyInstance: Ably.Realtime | null = null;

    const setupAbly = () => {
      // Only initialize Ably if the user is logged in
      if (user) {
        try {
          // Create Ably instance with client ID for authentication
          ablyInstance = new Ably.Realtime({
            key: ABLY_API_KEY,
            clientId: user.id,
            autoConnect: true,
          });

          // Set up connection state change listener
          ablyInstance.connection.on("connected", () => {
            setConnected(true);
            toast.success("Connected to real-time updates");
          });

          ablyInstance.connection.on("disconnected", () => {
            setConnected(false);
            toast.error("Disconnected from real-time updates");
          });

          ablyInstance.connection.on("failed", () => {
            setConnected(false);
            toast.error("Failed to connect to real-time updates");
          });

          setAbly(ablyInstance);
        } catch (error) {
          console.error("Error initializing Ably:", error);
          toast.error("Failed to initialize real-time connection");
        }
      }
    };

    setupAbly();

    // Cleanup when unmounting or when user changes
    return () => {
      if (ablyInstance) {
        ablyInstance.connection.off();
        ablyInstance.close();
        setAbly(null);
        setConnected(false);
      }
    };
  }, [user]);

  // Function to publish an event to a channel
  const publishEvent = (
    channelName: string,
    eventName: string,
    data: Record<string, unknown>
  ) => {
    if (!ably || !connected) {
      console.warn("Ably not connected, can't publish event");
      return;
    }

    try {
      console.log(
        `Publishing ${eventName} event to ${channelName} channel:`,
        "id" in data ? `id: ${data.id}, status: ${data.status || "N/A"}` : data
      );
      const channel = ably.channels.get(channelName);
      channel.publish(eventName, data);
    } catch (error) {
      console.error(`Error publishing event ${eventName}:`, error);
    }
  };

  // Function to subscribe to an event on a channel
  const subscribeToEvent = (
    channelName: string,
    eventName: string,
    callback: (message: AblyMessage) => void
  ) => {
    if (!ably) {
      console.warn("Ably not initialized, can't subscribe to event");
      return () => {};
    }

    try {
      console.log(
        `Subscribing to ${eventName} events on ${channelName} channel`
      );
      const channel = ably.channels.get(channelName);

      // Wrap the callback to add logging and type safety
      const wrappedCallback = (message: any) => {
        // Safe access to data properties
        const data = message.data || {};
        const eventId = data.id
          ? `id: ${data.id}`
          : JSON.stringify(data).substring(0, 100);

        console.log(
          `Received ${message.name} event on ${channelName} channel:`,
          eventId
        );

        // Convert to our defined type
        const typedMessage: AblyMessage = {
          name: message.name,
          data: message.data || {},
        };

        callback(typedMessage);
      };

      channel.subscribe(eventName, wrappedCallback);

      // Return unsubscribe function
      return () => {
        console.log(
          `Unsubscribing from ${eventName} events on ${channelName} channel`
        );
        channel.unsubscribe(eventName, wrappedCallback);
      };
    } catch (error) {
      console.error(`Error subscribing to event ${eventName}:`, error);
      return () => {};
    }
  };

  return (
    <AblyContext.Provider
      value={{
        ably,
        connected,
        publishEvent,
        subscribeToEvent,
      }}
    >
      {children}
    </AblyContext.Provider>
  );
};

export const useAbly = () => {
  const context = useContext(AblyContext);
  if (context === undefined) {
    throw new Error("useAbly must be used within an AblyProvider");
  }
  return context;
};
