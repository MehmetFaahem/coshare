import React, { useEffect, useState, useCallback } from "react";
import { Phone } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useRide } from "../../contexts/RideContext";
import { useAbly } from "../../contexts/AblyContext";
import { toast } from "react-hot-toast";
import { supabase } from "../../lib/supabase";

// Set to true to show the button for debugging
const DEBUG_MODE = false; // Temporarily set to true for debugging

interface FloatingCallButtonProps {
  rideId?: string; // Optional ride ID to check
}

// Define the Ably message type
interface AblyMessage {
  data: Record<string, unknown>;
}

const FloatingCallButton: React.FC<FloatingCallButtonProps> = ({ rideId }) => {
  const { user } = useAuth();
  const { rides, syncRideStatus } = useRide();
  const { subscribeToEvent } = useAbly();
  const [creatorPhone, setCreatorPhone] = useState<string | undefined>(
    DEBUG_MODE ? "1234567890" : undefined
  );
  const [showButton, setShowButton] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [activeRideId, setActiveRideId] = useState<string | null>(null);

  // Add debug info
  const addDebugInfo = (info: string) => {
    console.log("[FloatingCall]", info);
    if (DEBUG_MODE) {
      setDebugInfo((prev) => [...prev, info]);
    }
  };

  // Define checkForActiveRides as a useCallback to prevent recreation on each render
  const checkForActiveRides = useCallback(async () => {
    addDebugInfo("Running checkForActiveRides");

    // Reset state for fresh evaluation
    let shouldShowButton = false;
    let phoneToUse: string | undefined = undefined;
    let rideIdToUse: string | null = null;

    if (!user) {
      addDebugInfo("No user logged in");
      return;
    }

    // If we have an activeRideId, sync it first to get latest status
    if (activeRideId) {
      addDebugInfo(`Syncing active ride status for ${activeRideId}`);
      await syncRideStatus(activeRideId);
    }

    // Get active rides where user is a passenger but not the creator
    let activeRides = [];

    if (rideId) {
      // If specific ride ID is provided
      activeRides = rides.filter(
        (r) =>
          r.id === rideId &&
          r.passengers.includes(user.id) &&
          r.creator !== user.id &&
          r.status !== "completed" &&
          r.status !== "cancelled"
      );
      addDebugInfo(`Filtered rides by ID ${rideId}: ${activeRides.length}`);
    } else {
      // Get all active rides where user is a passenger
      activeRides = rides.filter(
        (r) =>
          r.passengers.includes(user.id) &&
          r.status !== "completed" &&
          r.status !== "cancelled" &&
          r.creator !== user.id
      );
      addDebugInfo(
        `Found ${activeRides.length} active rides where user is passenger`
      );
    }

    // Only show button if there is at least one active ride
    if (activeRides.length > 0) {
      // Use the first active ride
      const ride = activeRides[0];
      addDebugInfo(`Selected ride: ${ride.id}, status: ${ride.status}`);

      // Store the active ride ID for real-time updates
      rideIdToUse = ride.id;

      // If the ride has the contact phone, use it
      if (ride.contactPhone) {
        addDebugInfo(`Using ride.contactPhone: ${ride.contactPhone}`);
        phoneToUse = ride.contactPhone;
        shouldShowButton = true;
      } else {
        // Otherwise, fetch from database
        addDebugInfo(`No phone on ride object, fetching from database`);
        const phone = await fetchCreatorPhone(ride.id, ride.creator);
        if (phone) {
          addDebugInfo(`Found phone in database: ${phone}`);
          phoneToUse = phone;
          shouldShowButton = true;
        } else {
          addDebugInfo(`No phone found in database`);

          // Only in debug mode, show button with test number
          if (DEBUG_MODE) {
            phoneToUse = "1234567890";
            shouldShowButton = true;
          }
        }
      }
    } else {
      addDebugInfo("No active rides found where user is passenger");
    }

    // Update state all at once
    setCreatorPhone(phoneToUse);
    setActiveRideId(rideIdToUse);
    setShowButton(shouldShowButton);
  }, [user, rides, rideId, activeRideId, syncRideStatus]);

  // Subscribe to real-time ride updates
  useEffect(() => {
    if (!user) return;

    addDebugInfo("Setting up real-time ride status subscriptions");

    // Handle any ride update (change in status, passengers, etc.)
    const handleRideUpdate = (message: AblyMessage) => {
      // Since we're getting a generic message, we need to cast and validate it
      const data = message.data as Record<string, unknown>;

      // Log the complete message for debugging
      addDebugInfo(`Received update event: ${JSON.stringify(data)}`);

      // Check if this looks like a valid ride
      if (typeof data.id !== "string" || typeof data.status !== "string") {
        addDebugInfo("Received invalid ride update data");
        return;
      }

      const rideId = data.id;
      const status = data.status;

      addDebugInfo(`Received update for ride ${rideId} with status ${status}`);

      // If this is our active ride and it's completed or cancelled, hide the button immediately
      if (activeRideId === rideId) {
        addDebugInfo(`This is our active ride! (${activeRideId})`);

        if (status === "completed" || status === "cancelled") {
          addDebugInfo(
            `Active ride ${rideId} status changed to ${status} - hiding button immediately`
          );

          // Force direct state updates to ensure immediate hiding
          setShowButton(false);
          setCreatorPhone(undefined);
          setActiveRideId(null);
        }
      }

      // Always re-check for active rides when we get any update
      setTimeout(() => {
        addDebugInfo(`Checking for active rides after status update event`);
        checkForActiveRides();
      }, 100); // Small delay to ensure DB has processed updates
    };

    // Subscribe to event types that could affect our button
    const unsubscribeUpdate = subscribeToEvent(
      "rides",
      "update",
      handleRideUpdate
    );

    const unsubscribeComplete = subscribeToEvent(
      "rides",
      "complete",
      handleRideUpdate
    );

    const unsubscribeCancel = subscribeToEvent(
      "rides",
      "cancel",
      handleRideUpdate
    );

    const unsubscribeLeave = subscribeToEvent(
      "rides",
      "leave",
      handleRideUpdate
    );

    // Add a periodic check to ensure button state is correct
    const intervalId = setInterval(() => {
      if (activeRideId) {
        addDebugInfo(`Periodic check for ride ${activeRideId}`);
        checkForActiveRides();
      }
    }, 5000); // Check every 5 seconds

    return () => {
      // Clean up subscriptions when component unmounts
      unsubscribeUpdate();
      unsubscribeComplete();
      unsubscribeCancel();
      unsubscribeLeave();
      clearInterval(intervalId);
    };
  }, [user, activeRideId, checkForActiveRides]);

  // Debug useEffect to log the current state
  useEffect(() => {
    addDebugInfo(
      `FloatingCallButton initialized. User: ${user?.id || "none"}, Rides: ${
        rides.length
      }`
    );

    if (user && rides.length > 0) {
      // Log all rides where user is a passenger
      const userRides = rides.filter(
        (r) => r.passengers.includes(user.id) && r.creator !== user.id
      );
      addDebugInfo(`User rides (as passenger): ${userRides.length}`);

      if (userRides.length > 0) {
        userRides.forEach((ride, i) => {
          addDebugInfo(
            `Ride ${i}: ID=${ride.id}, Status=${ride.status}, Has phone: ${
              ride.contactPhone ? "yes" : "no"
            }`
          );
        });
      }
    }
  }, [user, rides]);

  // Fetch creator phone number directly from supabase
  const fetchCreatorPhone = async (rideId: string, creatorId: string) => {
    try {
      addDebugInfo(
        `Fetching creator phone for ride ${rideId}, creator ${creatorId}`
      );
      const { data, error } = await supabase
        .from("ride_passengers")
        .select("contact_phone")
        .eq("ride_id", rideId)
        .eq("user_id", creatorId)
        .single();

      if (error || !data) {
        addDebugInfo(
          `Error fetching creator phone: ${error?.message || "No data"}`
        );
        return null;
      }

      addDebugInfo(`Found creator phone: ${data.contact_phone || "none"}`);
      return data.contact_phone;
    } catch (err) {
      addDebugInfo(`Exception fetching creator phone: ${err}`);
      return null;
    }
  };

  // Call checkForActiveRides when dependencies change
  useEffect(() => {
    checkForActiveRides();
  }, [checkForActiveRides]);

  const handleCallCreator = () => {
    if (creatorPhone) {
      addDebugInfo(`Calling ${creatorPhone}`);
      window.location.href = `tel:${creatorPhone}`;
    } else {
      addDebugInfo("No phone number available");
      toast.error("Creator's phone number is not available");
    }
  };

  // Don't render if button shouldn't be shown
  if (!showButton || !creatorPhone) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Pulsing animation */}
      <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-30"></div>

      {/* Active ride indicator */}
      {activeRideId && (
        <div className="absolute -top-3 -right-3 bg-white text-xs px-2 py-1 rounded-full shadow-md">
          {activeRideId.substring(0, 4)}
        </div>
      )}

      {/* Button */}
      <button
        onClick={handleCallCreator}
        className="relative flex items-center bg-emerald-600 text-white px-5 py-4 rounded-full shadow-xl hover:bg-emerald-700 transition-colors transform hover:scale-105 transition-all duration-200"
        aria-label="Call ride creator"
      >
        <div className="h-9 w-9 bg-white rounded-full flex items-center justify-center mr-3">
          <Phone className="h-5 w-5 text-emerald-600" />
        </div>
        <span className="font-medium text-base">Call Ride Creator</span>
      </button>

      {/* Debug info panel */}
      {DEBUG_MODE && (
        <div
          className="absolute bottom-20 right-0 bg-white border border-gray-300 p-3 rounded-lg shadow-lg max-w-xs overflow-auto"
          style={{ maxHeight: "400px" }}
        >
          <h4 className="font-bold mb-2">Debug Info</h4>
          <div className="mb-2">
            <strong>Active Ride:</strong> {activeRideId || "none"}
          </div>
          <div className="mb-2">
            <strong>Show Button:</strong> {showButton ? "yes" : "no"}
          </div>
          <div className="mb-2">
            <strong>Phone:</strong> {creatorPhone || "none"}
          </div>
          <h5 className="font-bold mb-1">Log:</h5>
          <ul className="text-xs max-h-60 overflow-y-auto">
            {debugInfo.map((info, i) => (
              <li key={i} className="mb-1">
                {info}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FloatingCallButton;
