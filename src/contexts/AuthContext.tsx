import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, AuthError, AuthApiError } from "@supabase/supabase-js";
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
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'PASSWORD_RECOVERY') {
        const newPassword = prompt('What would you like your new password to be?');
        if (newPassword) {
          const { error } = await supabase.auth.updateUser({
            password: newPassword,
          });

          if (error) {
            toast({
              variant: "destructive",
              title: "Error resetting password",
              description: error.message,
            });
          } else {
            toast({
              title: "Password updated successfully",
              description: "You can now sign in with your new password.",
            });
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const getErrorMessage = (error: AuthError | AuthApiError) => {
    // First check if it's an AuthApiError
    if ('code' in error) {
      switch (error.code) {
        case 'invalid_credentials':
          return "Invalid email or password. Please check your credentials and try again.";
        case 'email_not_confirmed':
          return "Please verify your email address before signing in.";
        case 'user_not_found':
          return "No account found with this email address.";
        case 'invalid_grant':
          return "Invalid login credentials. Please check your email and password.";
        default:
          return error.message || "An authentication error occurred";
      }
    }
    // If it's not an AuthApiError, return the message or a default
    return error.message || "An unexpected error occurred";
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in with email:", email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error);
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
      console.log("Attempting to sign up with email:", email);
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
        console.error("Sign up error:", error);
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
          console.error("Sign out error:", error);
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
        console.error("Update username error:", error);
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