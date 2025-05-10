-- First, drop the problematic policy
DROP POLICY IF EXISTS "Users can read passenger contact info in rides they belong to" ON ride_passengers;

-- Create a better policy that doesn't cause infinite recursion
CREATE POLICY "Users can see passenger details for their rides"
  ON ride_passengers
  FOR SELECT
  TO authenticated
  USING (
    -- User can see their own passenger records
    auth.uid() = user_id 
    OR 
    -- User can see passenger records for rides they created
    EXISTS (
      SELECT 1 FROM ride_requests 
      WHERE id = ride_passengers.ride_id AND creator_id = auth.uid()
    )
    OR
    -- User can see passenger records for rides they're part of
    EXISTS (
      SELECT 1 FROM ride_requests r
      WHERE r.id = ride_passengers.ride_id 
      AND r.id IN (
        SELECT ride_id FROM ride_passengers 
        WHERE user_id = auth.uid()
      )
    )
  ); 