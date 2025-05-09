-- Drop existing policies to update them
DROP POLICY IF EXISTS "Users can read their own data" ON users;
DROP POLICY IF EXISTS "Creators can update their ride requests" ON ride_requests;
DROP POLICY IF EXISTS "Users can leave rides" ON ride_passengers;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;

-- Create improved users policies
CREATE POLICY "Users can read any user data"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can only update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Improved ride requests policies
CREATE POLICY "Creators can update their ride requests"
  ON ride_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their ride requests"
  ON ride_requests
  FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Improved ride passengers policies
CREATE POLICY "Users can leave rides or be removed by the creator"
  ON ride_passengers
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM ride_requests 
      WHERE id = ride_id AND creator_id = auth.uid()
    )
  );

-- Improved notifications policies
CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON notifications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id); 