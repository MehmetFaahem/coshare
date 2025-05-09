import React, { useState } from "react";
import { useRide } from "../../contexts/RideContext";
import { Search } from "lucide-react";
import { Location, RideRequest } from "../../types";
import GlobalMap from "../map/GlobalMap";
import RideList from "./RideList";

const FindRideForm: React.FC = () => {
  const [startingPoint, setStartingPoint] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [matchingRides, setMatchingRides] = useState<RideRequest[]>([]);
  const [searched, setSearched] = useState(false);

  const { findMatchingRides } = useRide();

  const handleSearch = () => {
    if (!startingPoint || !destination) return;

    const rides = findMatchingRides(startingPoint, destination);
    setMatchingRides(rides);
    setSearched(true);
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
