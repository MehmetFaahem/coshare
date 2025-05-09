import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location, RideRequest } from '../../types';
import { MapPin, Navigation } from 'lucide-react';

// Fix the icon issue with Leaflet in React
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const startIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'start-marker'
});

const endIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'end-marker'
});

// Component to recenter the map when coordinates change
const RecenterAutomatically = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);
  return null;
};

// Component to handle map clicks
const MapClickHandler = ({
  onLocationSelect,
  selectingLocation
}: {
  onLocationSelect?: (location: Location) => void;
  selectingLocation?: 'start' | 'destination' | null;
}) => {
  const map = useMapEvents({
    click: async (e) => {
      if (onLocationSelect && selectingLocation) {
        try {
          // Use reverse geocoding to get the address
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
          );
          const data = await response.json();
          
          const selectedLocation: Location = {
            coordinates: {
              lat: e.latlng.lat,
              lng: e.latlng.lng
            },
            address: data.display_name || `Location at ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`
          };
          
          onLocationSelect(selectedLocation);
        } catch (error) {
          console.error('Error getting location address:', error);
          // Fallback to coordinates if geocoding fails
          const selectedLocation: Location = {
            coordinates: {
              lat: e.latlng.lat,
              lng: e.latlng.lng
            },
            address: `Location at ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`
          };
          onLocationSelect(selectedLocation);
        }
      }
    }
  });
  return null;
};

interface RideMapProps {
  initialPosition?: [number, number];
  rides?: RideRequest[];
  startingPoint?: Location;
  destination?: Location;
  onLocationSelect?: (location: Location) => void;
  selectingLocation?: 'start' | 'destination' | null;
  height?: string;
}

const RideMap: React.FC<RideMapProps> = ({
  initialPosition = [28.613939, 77.209021], // Default to Delhi
  rides = [],
  startingPoint,
  destination,
  onLocationSelect,
  selectingLocation,
  height = '400px'
}) => {
  const [currentPosition, setCurrentPosition] = useState<[number, number]>(initialPosition);

  // Get user's current location on component mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  return (
    <div style={{ height, width: '100%' }} className="relative">
      {selectingLocation && (
        <div className="absolute top-2 left-0 right-0 z-10 mx-auto text-center bg-white bg-opacity-90 py-2 px-4 rounded-md shadow-md text-sm max-w-xs">
          <p className="font-medium">
            Click on the map to select your {selectingLocation === 'start' ? 'starting point' : 'destination'}
          </p>
        </div>
      )}
      
      <MapContainer
        center={currentPosition}
        zoom={13}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <RecenterAutomatically position={currentPosition} />
        <MapClickHandler onLocationSelect={onLocationSelect} selectingLocation={selectingLocation} />
        
        {/* Current location marker */}
        <Marker position={currentPosition} icon={markerIcon}>
          <Popup>Your current location</Popup>
        </Marker>
        
        {/* Starting point marker */}
        {startingPoint && (
          <Marker 
            position={[startingPoint.coordinates.lat, startingPoint.coordinates.lng]} 
            icon={startIcon}
          >
            <Popup>
              <strong>Starting Point:</strong><br />
              {startingPoint.address}
            </Popup>
          </Marker>
        )}
        
        {/* Destination marker */}
        {destination && (
          <Marker 
            position={[destination.coordinates.lat, destination.coordinates.lng]} 
            icon={endIcon}
          >
            <Popup>
              <strong>Destination:</strong><br />
              {destination.address}
            </Popup>
          </Marker>
        )}
        
        {/* Render ride markers */}
        {rides.map((ride) => (
          <React.Fragment key={ride.id}>
            <Marker
              position={[ride.startingPoint.coordinates.lat, ride.startingPoint.coordinates.lng]}
              icon={startIcon}
            >
              <Popup>
                <strong>Ride #{ride.id.substring(0, 4)}</strong><br />
                <strong>Starting Point:</strong> {ride.startingPoint.address}<br />
                <strong>Passengers:</strong> {ride.passengers.length}/{ride.totalSeats}<br />
                <strong>Status:</strong> {ride.status}
              </Popup>
            </Marker>
            <Marker
              position={[ride.destination.coordinates.lat, ride.destination.coordinates.lng]}
              icon={endIcon}
            >
              <Popup>
                <strong>Ride #{ride.id.substring(0, 4)}</strong><br />
                <strong>Destination:</strong> {ride.destination.address}<br />
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>
      
      {/* Map controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <button 
          className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
          onClick={() => {
            if ('geolocation' in navigator) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  setCurrentPosition([position.coords.latitude, position.coords.longitude]);
                }
              );
            }
          }}
        >
          <Navigation className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default RideMap;