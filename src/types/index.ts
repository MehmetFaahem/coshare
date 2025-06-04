export type UserType = {
  id: string;
  name: string;
  email: string;
};

export type Coordinates = {
  lat: number;
  lng: number;
};

export type Location = {
  coordinates: Coordinates;
  address: string;
};

export type RideStatus = "open" | "full" | "completed" | "cancelled";

export type VehicleType = "Rickshaw" | "CNG" | "Bike" | "Bus" | "Car" | "Uber/Pathao";

export type RideRequest = {
  id: string;
  creator: string;
  startingPoint: Location;
  destination: Location;
  seatsAvailable: number;
  totalSeats: number;
  passengers: string[];
  status: RideStatus;
  vehicle: VehicleType
  createdAt: string;
  contactPhone?: string;
};

export const VEHICLE_OPTIONS: Array<{
  value: VehicleType;
  label: string;
  description: string;
  icon: string;
  estimatedCost: string;
}> = [
  {
    value: "Rickshaw",
    label: "Rickshaw",
    description: "Traditional rickshaw",
    icon: "🚲",
    estimatedCost: "৳20-50"
  },
  {
    value: "CNG",
    label: "CNG",
    description: "3-wheeler auto-rickshaw - fast and economical",
    icon: "🛺",
    estimatedCost: "৳30-100"
  },
  {
    value: "Bike",
    label: "Motorbike",
    description: "Motorcycle ride - quick for short distances",
    icon: "🏍️",
    estimatedCost: "৳15-40"
  },
  {
    value: "Uber/Pathao",
    label: "Ride-sharing",
    description: "App-based ride sharing - convenient and trackable",
    icon: "📱",
    estimatedCost: "৳40-150"
  }
];

export type Notification = {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: "match" | "update" | "join" | "system" | "leave";
  rideId?: string;
};
