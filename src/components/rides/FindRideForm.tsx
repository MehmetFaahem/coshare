import React, { useState, useEffect, useCallback } from "react";
import { useRide } from "../../contexts/RideContext";
import { useAbly } from "../../contexts/AblyContext";
import { Search } from "lucide-react";
import { Location, RideRequest } from "../../types";
import GlobalMap from "../map/GlobalMap";
import RideList from "./RideList";

const FindRideForm: React.FC = () => {
  const [startingPoint, setStartingPoint] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [matchingRides, setMatchingRides] = useState<RideRequest[]>([]);
  const [searched, setSearched] = useState(false);

  const { findMatchingRides, refreshAllRides } = useRide();
  const { subscribeToEvent } = useAbly();

  // Function to refresh matching rides - memoized to avoid recreating on every render
  const refreshMatchingRides = useCallback(async () => {
    if (searched && startingPoint && destination) {
      console.log("Refreshing ride matches...");

      // First refresh the full database data to ensure we have the latest rides
      await refreshAllRides();

      // Then run the match algorithm
      const updatedRides = findMatchingRides(startingPoint, destination);
      console.log(`Found ${updatedRides.length} matching rides`);

      // Update the UI with the results
      setMatchingRides(updatedRides);
    }
  }, [
    searched,
    startingPoint,
    destination,
    findMatchingRides,
    refreshAllRides,
  ]);

  // Event handlers - moved outside useEffect and memoized
  const handleNewRide = useCallback(() => {
    console.log("New ride created event received");
    refreshMatchingRides();
  }, [refreshMatchingRides]);

  const handleUpdateRide = useCallback(() => {
    console.log("Ride update event received");
    refreshMatchingRides();
  }, [refreshMatchingRides]);

  const handleSyncEvent = useCallback(() => {
    console.log("Sync event received");
    // Wait a moment to allow the database to update before refreshing
    setTimeout(() => refreshMatchingRides(), 300);
  }, [refreshMatchingRides]);

  const handleGenericEvent = useCallback(() => {
    refreshMatchingRides();
  }, [refreshMatchingRides]);

  // Always subscribe to ride updates regardless of search state
  useEffect(() => {
    console.log("Setting up real-time ride update subscriptions");

    // Subscribe to all ride events that might affect our results
    const unsubscribeNew = subscribeToEvent("rides", "new", handleNewRide);
    const unsubscribeUpdate = subscribeToEvent(
      "rides",
      "update",
      handleUpdateRide
    );
    const unsubscribeJoin = subscribeToEvent(
      "rides",
      "join",
      handleGenericEvent
    );
    const unsubscribeLeave = subscribeToEvent(
      "rides",
      "leave",
      handleGenericEvent
    );
    const unsubscribeSync = subscribeToEvent("rides", "sync", handleSyncEvent);

    // Immediate refresh when subscriptions are set up
    if (searched && startingPoint && destination) {
      refreshMatchingRides();
    }

    return () => {
      console.log("Cleaning up ride subscriptions");
      unsubscribeNew();
      unsubscribeUpdate();
      unsubscribeJoin();
      unsubscribeLeave();
      unsubscribeSync();
    };
  }, [
    refreshMatchingRides,
    subscribeToEvent,
    searched,
    startingPoint,
    destination,
    handleNewRide,
    handleUpdateRide,
    handleGenericEvent,
    handleSyncEvent,
  ]);

  // Refresh the ride list periodically - modified to use ref to avoid resubscription
  useEffect(() => {
    if (!searched || !startingPoint || !destination) return;

    console.log("Setting up periodic ride refresh interval");
    const refreshInterval = setInterval(refreshMatchingRides, 10000); // Refresh every 10 seconds

    return () => {
      console.log("Cleaning up periodic refresh interval");
      clearInterval(refreshInterval);
    };
  }, [searched, startingPoint, destination, refreshMatchingRides]);

  const handleSearch = async () => {
    if (!startingPoint || !destination) return;

    console.log("Searching for matching rides...");

    // First refresh all ride data to ensure we have the latest information
    await refreshAllRides();

    // Then run the matching algorithm
    const rides = findMatchingRides(startingPoint, destination);
    setMatchingRides(rides);
    setSearched(true);
    console.log(`Initial search found ${rides.length} rides`);
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Find a Ride</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <GlobalMap
                startingPoint={startingPoint}
                destination={destination}
                onStartingPointChange={setStartingPoint}
                onDestinationChange={setDestination}
                height="350px"
                rides={matchingRides}
              />

              <div className="mt-6 mb-6">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md shadow transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70 flex items-center justify-center"
                  disabled={!startingPoint || !destination}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Find Matching Rides
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Search Details</h3>

              {startingPoint && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">
                    Starting Point:
                  </p>
                  <p className="text-sm text-gray-600">
                    {startingPoint.address}
                  </p>
                </div>
              )}

              {destination && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">
                    Destination:
                  </p>
                  <p className="text-sm text-gray-600">{destination.address}</p>
                </div>
              )}

              {searched && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700">
                    Found Rides:
                  </p>
                  <p className="text-sm text-gray-600">
                    {matchingRides.length} rides match your route
                  </p>
                </div>
              )}

              <div className="text-sm text-gray-500 mt-6">
                <p>Need help?</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Use the search box to find a location</li>
                  <li>Drag markers to refine exact positions</li>
                  <li>Click anywhere on the map to set a location</li>
                </ul>
              </div>
            </div>
          </div>

          {searched && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {matchingRides.length > 0
                  ? `Found ${matchingRides.length} matching rides`
                  : "No matching rides found"}
              </h3>

              <RideList
                rides={matchingRides}
                emptyMessage="No rides match your route. Would you like to create a new ride request?"
              />

              {matchingRides.length === 0 && (
                <div className="mt-6 text-center">
                  <a
                    href="/create-ride"
                    className="inline-block px-6 py-3 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    Create a New Ride Request
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindRideForm;
