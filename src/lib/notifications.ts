import { supabase } from "./supabase";
import { fetchRidePassengersWithDetails } from "./database";

/**
 * Sends a notification to all passengers of a ride
 * @param rideId The ID of the ride
 * @param message The notification message
 * @param type The type of notification
 */
export const notifyAllRidePassengers = async (
  rideId: string,
  message: string,
  type: "update" | "join" | "leave" | "system" | "match"
) => {
  try {
    console.log(`Sending notifications to all passengers of ride ${rideId}`);

    // Get all passengers of the ride
    const passengers = await fetchRidePassengersWithDetails(rideId);
    console.log(`Found ${passengers.length} passengers to notify`);

    if (passengers.length === 0) {
      console.warn(`No passengers found for ride ${rideId}`);
      return 0;
    }

    // Create a notification for each passenger
    const notifications = passengers.map((passenger) => ({
      user_id: passenger.user_id,
      message,
      type,
      read: false,
      ride_id: rideId,
    }));

    console.log(`Preparing to insert ${notifications.length} notifications`);

    // Insert all notifications at once
    if (notifications.length > 0) {
      const { error } = await supabase
        .from("notifications")
        .insert(notifications);

      if (error) {
        console.error("Error sending notifications to ride passengers:", error);
        throw error;
      }

      console.log(`Successfully sent ${notifications.length} notifications`);
      return notifications.length;
    }

    return 0;
  } catch (error) {
    console.error("Error in notifyAllRidePassengers:", error);

    // Try sending notifications one by one as a fallback
    try {
      console.log("Trying fallback method - sending notifications one by one");
      const passengers = await fetchRidePassengersWithDetails(rideId);

      let successCount = 0;
      for (const passenger of passengers) {
        try {
          const { error } = await supabase.from("notifications").insert({
            user_id: passenger.user_id,
            message,
            type,
            read: false,
            ride_id: rideId,
          });

          if (!error) {
            successCount++;
          }
        } catch (innerError) {
          console.error(
            `Failed to notify passenger ${passenger.user_id}:`,
            innerError
          );
        }
      }

      console.log(
        `Fallback method: sent ${successCount} of ${passengers.length} notifications`
      );
      return successCount;
    } catch (fallbackError) {
      console.error("Fallback notification method also failed:", fallbackError);
      throw error; // Throw the original error
    }
  }
};
