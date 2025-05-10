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

export type RideRequest = {
  id: string;
  creator: string;
  startingPoint: Location;
  destination: Location;
  seatsAvailable: number;
  totalSeats: number;
  passengers: string[];
  status: RideStatus;
  createdAt: string;
  contactPhone?: string;
};

export type Notification = {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: "match" | "update" | "join" | "system";
  rideId?: string;
};
