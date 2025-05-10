-- Add contact_phone column to ride_passengers table
ALTER TABLE ride_passengers ADD COLUMN contact_phone TEXT;

-- Create or update RLS policy for the new column
CREATE POLICY "Users can read passenger contact info in rides they belong to"
  ON ride_passengers
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM ride_passengers 
      WHERE ride_id = ride_passengers.ride_id AND user_id = auth.uid()
    )
  );

-- Add comment to explain the purpose of this column
COMMENT ON COLUMN ride_passengers.contact_phone IS 'Phone number provided by passenger for contact during ride'; 