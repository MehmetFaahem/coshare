/*
  # Initial Schema Setup for Rickshaw Share

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `ride_requests`
      - `id` (uuid, primary key)
      - `creator_id` (uuid, references users)
      - `starting_point` (jsonb)
      - `destination` (jsonb)
      - `seats_available` (int)
      - `total_seats` (int)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `ride_passengers`
      - `ride_id` (uuid, references ride_requests)
      - `user_id` (uuid, references users)
      - `joined_at` (timestamp)
    
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `message` (text)
      - `type` (text)
      - `read` (boolean)
      - `ride_id` (uuid, references ride_requests)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ride_requests table
CREATE TABLE IF NOT EXISTS ride_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES users(id) NOT NULL,
  starting_point jsonb NOT NULL,
  destination jsonb NOT NULL,
  seats_available int NOT NULL,
  total_seats int NOT NULL,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_seats CHECK (seats_available >= 0 AND seats_available <= total_seats),
  CONSTRAINT valid_total_seats CHECK (total_seats BETWEEN 2 AND 5)
);

-- Create ride_passengers table
CREATE TABLE IF NOT EXISTS ride_passengers (
  ride_id uuid REFERENCES ride_requests(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (ride_id, user_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  message text NOT NULL,
  type text NOT NULL,
  read boolean DEFAULT false,
  ride_id uuid REFERENCES ride_requests(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create a user profile when a new auth user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users policies
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read other users' basic info"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Ride requests policies
CREATE POLICY "Anyone can read ride requests"
  ON ride_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create ride requests"
  ON ride_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their ride requests"
  ON ride_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Ride passengers policies
CREATE POLICY "Anyone can read ride passengers"
  ON ride_passengers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join rides"
  ON ride_passengers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave rides"
  ON ride_passengers
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can read their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create notifications for anyone"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ride_requests_updated_at
  BEFORE UPDATE ON ride_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();