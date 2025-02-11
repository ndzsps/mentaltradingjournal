
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, AuthError, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Clear auth state
  const clearAuthState = () => {
    setUser(null);
    setSession(null);
    // Clear any persisted session
    supabase.auth.signOut();
  };

  useEffect(() => {
    // Initialize auth state from any existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Error getting session:", error);
        clearAuthState();
        return;
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getErrorMessage = (error: AuthError) => {
    switch (error.message) {
      case "Invalid login credentials":
        return "Invalid email or password. Please check your credentials and try again.";
      case "Email not confirmed":
        return "Please verify your email address before signing in.";
      case "User not found":
        return "No account found with this email address.";
      case "Invalid email or password":
        return "The email or password you entered is incorrect. Please try again.";
      case "User from sub claim in JWT does not exist":
        return "Your session has expired. Please sign in again.";
      default:
        return error.message;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast({
          variant: "destructive",
          title: "Error signing in",
          description: getErrorMessage(error),
        });
        if (error.message === "User from sub claim in JWT does not exist") {
          clearAuthState();
        }
        throw error;
      }
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            username: email.split("@")[0],
          },
        },
      });
      if (error) {
        toast({
          variant: "destructive",
          title: "Error signing up",
          description: getErrorMessage(error),
        });
        throw error;
      } else {
        toast({
          title: "Check your email",
          description: "We've sent you a verification link to complete your registration.",
        });
      }
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        toast({
          variant: "destructive",
          title: "Error signing out",
          description: getErrorMessage(error),
        });
      }
      clearAuthState();
    } catch (error) {
      console.error("Sign out error:", error);
      clearAuthState();
    }
  };

  const updateUsername = async (username: string) => {
    if (!user) return;
    try {
      const { error } = await supabase.auth.updateUser({
        data: { username },
      });
      if (error) {
        toast({
          variant: "destructive",
          title: "Error updating username",
          description: getErrorMessage(error),
        });
        if (error.message === "User from sub claim in JWT does not exist") {
          clearAuthState();
        }
        throw error;
      }
    } catch (error) {
      console.error("Update username error:", error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateUsername,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
