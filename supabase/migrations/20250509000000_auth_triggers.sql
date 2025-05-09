-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user already exists before inserting
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id) THEN
    INSERT INTO public.users (id, name, email)
    VALUES (
      NEW.id, 
      COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 
      NEW.email
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create a user profile when a new auth user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function for handling user auth and RLS
CREATE OR REPLACE FUNCTION auth.is_ride_creator(ride_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM ride_requests 
    WHERE id = ride_id AND creator_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Add a function to check if a user is a passenger in a ride
CREATE OR REPLACE FUNCTION auth.is_ride_passenger(ride_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM ride_passengers 
    WHERE ride_id = ride_id AND user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER; 