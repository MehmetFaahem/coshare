import { supabase } from "./supabase";

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  email: string;
  password: string;
  name: string;
};

export const signIn = async ({ email, password }: SignInCredentials) => {
  const result = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (result.error) {
    throw result.error;
  }

  // Ensure the user exists in the users table
  if (result.data?.user) {
    try {
      // Check if user exists in database
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .eq("id", result.data.user.id)
        .single();

      if (fetchError || !existingUser) {
        // Create user if not found
        const userName =
          result.data.user.user_metadata?.name ||
          result.data.user.user_metadata?.full_name ||
          email.split("@")[0] ||
          "User";

        const { error: insertError } = await supabase.from("users").upsert({
          id: result.data.user.id,
          email: email,
          name: userName,
        });

        if (insertError && insertError.code !== "23505") {
          // Ignore duplicate key errors
          console.error("Error creating user during login:", insertError);
        }
      }
    } catch (err) {
      console.error("Error checking/creating user during login:", err);
    }
  }

  return result.data;
};

export const signUp = async ({ email, password, name }: SignUpCredentials) => {
  const result = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name, // Store name in auth metadata
      },
    },
  });

  if (result.error) {
    throw result.error;
  }

  if (!result.data.user) {
    throw new Error("Failed to create user");
  }

  // The database trigger will handle user creation in most cases,
  // but we'll check if the user exists and only create if needed
  try {
    // First check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", result.data.user.id)
      .single();

    // Only create user if they don't already exist
    if (!existingUser) {
      const { error: profileError } = await supabase.from("users").insert({
        id: result.data.user.id,
        email,
        name,
      });

      if (profileError && profileError.code !== "23505") {
        // Ignore duplicate key errors
        console.error("Failed to create user profile", profileError);
      }
    }
  } catch (err: any) {
    // If error is not a "record not found" error, then log it
    if (err?.code !== "PGRST116") {
      console.error("Error checking/creating user profile:", err);
    }
  }

  return result.data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  return data.session;
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  return data.user;
};

// Get the full user profile including name
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
