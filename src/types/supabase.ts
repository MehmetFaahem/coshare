export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      ride_requests: {
        Row: {
          id: string;
          creator_id: string;
          starting_point: Json;
          destination: Json;
          seats_available: number;
          total_seats: number;
          status: string;
          created_at: string;
          updated_at: string;
          contact_phone?: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          starting_point: Json;
          destination: Json;
          seats_available: number;
          total_seats: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
          contact_phone?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          starting_point?: Json;
          destination?: Json;
          seats_available?: number;
          total_seats?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
          contact_phone?: string;
        };
      };
      ride_passengers: {
        Row: {
          ride_id: string;
          user_id: string;
          joined_at: string;
          contact_phone?: string;
        };
        Insert: {
          ride_id: string;
          user_id: string;
          joined_at?: string;
          contact_phone?: string;
        };
        Update: {
          ride_id?: string;
          user_id?: string;
          joined_at?: string;
          contact_phone?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          message: string;
          type: string;
          read: boolean;
          ride_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          message: string;
          type: string;
          read?: boolean;
          ride_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          message?: string;
          type?: string;
          read?: boolean;
          ride_id?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
