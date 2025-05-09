import React, { createContext, useContext, useState, useEffect } from "react";
import { UserType } from "../types";
import { supabase } from "../lib/supabase";
import { signIn, signUp, signOut } from "../lib/auth";
import { getAuthTokenKey } from "../lib/sessionHelper";

interface AuthContextType {
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<unknown>;
  register: (name: string, email: string, password: string) => Promise<unknown>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to set user state and log for debugging
  const setUserState = (userData: UserType | null) => {
    setUser(userData);
    console.log("Auth state updated:", {
      user: userData?.id,
      isAuthenticated: !!userData,
    });
  };

  useEffect(() => {
    // Check for authentication directly from localStorage
    const checkAuth = () => {
      try {
        // Get token from localStorage
        const tokenKey = getAuthTokenKey();
        const tokenStr = localStorage.getItem(tokenKey);

        if (tokenStr) {
          try {
            const token = JSON.parse(tokenStr);

            // If token exists, consider user authenticated
            if (token.user && token.user.id) {
              const tokenUser = {
                id: token.user.id,
                name:
                  token.user.user_metadata?.name ||
                  token.user.user_metadata?.full_name ||
                  token.user.email?.split("@")[0] ||
                  "User",
                email: token.user.email || "",
              };

              console.log("User authenticated from token:", tokenUser.id);
              setUserState(tokenUser);
              return;
            }
          } catch (err) {
            console.error("Error parsing token:", err);
          }
        }

        // No valid token, user is not authenticated
        setUserState(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes from Supabase
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change event:", event, session?.user?.id);

      if (event === "SIGNED_IN" && session?.user) {
        const userData = {
          id: session.user.id,
          name:
            session.user.user_metadata?.name ||
            session.user.user_metadata?.full_name ||
            session.user.email?.split("@")[0] ||
            "User",
          email: session.user.email || "",
        };
        console.log("User signed in:", userData.id);
        setUserState(userData);
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
        localStorage.removeItem(getAuthTokenKey());
        setUserState(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Login attempt for:", email);
      const result = await signIn({ email, password });
      console.log("Login successful");
      return result;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Register attempt for:", email);
      const result = await signUp({ name, email, password });
      console.log("Registration successful");
      return result;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out user");
      await signOut();
      localStorage.removeItem(getAuthTokenKey());
      setUserState(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
