-- Add contact_phone column to ride_requests table
ALTER TABLE ride_requests ADD COLUMN contact_phone TEXT;

-- Create or update RLS policy for the new column
CREATE POLICY "Creators can set and passengers can read contact_phone"
  ON ride_requests
  FOR ALL
  TO authenticated
  USING (
    -- For SELECT: Anyone can read
    (current_setting('request.method', TRUE) = 'GET' AND true)
    OR 
    -- For INSERT/UPDATE: Only creator can modify
    (current_setting('request.method', TRUE) != 'GET' AND auth.uid() = creator_id)
  );

-- Add comment to explain the purpose of this column
COMMENT ON COLUMN ride_requests.contact_phone IS 'Phone number provided by ride creator for contact during ride'; 