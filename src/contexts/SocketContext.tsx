import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { toast } from "react-hot-toast";

// Type for callback functions
type CallbackFunction = (...args: any[]) => void;

// Type for callbacks object
interface SocketCallbacks {
  [key: string]: CallbackFunction[];
}

// Extend Socket interface to include our custom properties
interface MockSocket extends Socket {
  _callbacks?: SocketCallbacks;
}

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// In a real application, we would use WebSockets with a proper backend
// For this demo, we'll mock the socket events for the frontend
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();
  const socketRef = useRef<MockSocket | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Cleanup function to prevent memory leaks
    const cleanup = () => {
      if (socketRef.current) {
        try {
          // Clean up event listeners instead of disconnecting
          if (socketRef.current._callbacks) {
            socketRef.current._callbacks = {};
          }

          // Reset connection state
          if (isMounted) {
            setConnected(false);
            setSocket(null);
          }
        } catch (error) {
          console.error("Error cleaning up socket:", error);
        }
      }
    };

    // If user logs out, clean up socket
    if (!user) {
      cleanup();
      return () => {
        isMounted = false;
      };
    }

    // Create mock socket only if we don't have one already
    if (!socketRef.current) {
      // Create a mock socket using socket.io-client
      const mockSocketUrl = "https://mock-socket-server.example";

      try {
        const newSocket = io(mockSocketUrl, {
          autoConnect: false,
          transports: ["websocket"],
        }) as MockSocket;

        // Override connect to simulate connection without actual server
        const originalConnect = newSocket.connect;
        newSocket.connect = function () {
          setTimeout(() => {
            if (this && isMounted) {
              this.connected = true;
              this._callbacks?.["$connect"]?.forEach((callback) => callback());
            }
          }, 500);
          return this;
        };

        // Override emit to simulate events without actual server
        const originalEmit = newSocket.emit;
        newSocket.emit = function (ev: string, ...args: any[]) {
          if (ev.startsWith("ride:")) {
            setTimeout(() => {
              if (this && this._callbacks) {
                this._callbacks["$" + ev]?.forEach((callback) =>
                  callback(...args)
                );
              }
            }, 300);
          }
          return this;
        };

        // Override on to track callbacks
        const originalOn = newSocket.on;
        newSocket.on = function (ev: string, callback: CallbackFunction) {
          this._callbacks = this._callbacks || {};
          this._callbacks["$" + ev] = this._callbacks["$" + ev] || [];
          this._callbacks["$" + ev].push(callback);
          return this;
        };

        // Override disconnect to safely handle cleanup
        const originalDisconnect = newSocket.disconnect;
        newSocket.disconnect = function () {
          // Don't actually do anything that might cause errors
          if (this && isMounted) {
            this.connected = false;
            this._callbacks?.["$disconnect"]?.forEach((callback) => callback());
          }
          return this;
        };

        // Set up event listeners
        newSocket.on("connect", () => {
          if (isMounted) {
            setConnected(true);
            toast.success("Connected to real-time updates");
          }
        });

        newSocket.on("disconnect", () => {
          if (isMounted) {
            setConnected(false);
            toast.error("Disconnected from real-time updates");
          }
        });

        // Store the socket reference
        socketRef.current = newSocket;

        if (isMounted) {
          setSocket(newSocket);
          // Simulate connection
          newSocket.connect();
        }
      } catch (error) {
        console.error("Error creating socket:", error);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [user]); // Only depend on user changes, not socket state

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
