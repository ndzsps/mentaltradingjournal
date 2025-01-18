import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, AuthError } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          toast({
            variant: "destructive",
            title: "Error signing out",
            description: getErrorMessage(error),
          });
          throw error;
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Sign out error:", error);
      setUser(null);
      throw error;
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
        throw error;
      }
    } catch (error) {
      console.error("Update username error:", error);
      throw error;
    }
  };

  const value = {
    user,
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