-- First, drop the problematic policy
DROP POLICY IF EXISTS "Users can read passenger contact info in rides they belong to" ON ride_passengers;
DROP POLICY IF EXISTS "Users can see passenger details for their rides" ON ride_passengers;

-- Create a simple RLS policy for ride_passengers without self-referential conditions
CREATE POLICY "Users can select their own passenger records"
  ON ride_passengers
  FOR SELECT
  TO authenticated
  USING (
    -- User can always see their own passenger records
    auth.uid() = user_id
  );

-- Create a separate policy for creators to see all passenger records
CREATE POLICY "Ride creators can see all passenger records"
  ON ride_passengers
  FOR SELECT
  TO authenticated
  USING (
    -- Check if the authenticated user is the creator of the ride
    EXISTS (
      SELECT 1 FROM ride_requests
      WHERE id = ride_passengers.ride_id 
      AND creator_id = auth.uid()
    )
  ); 