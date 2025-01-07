import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    // Check active session and refresh if needed
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session error:", error);
          setUser(null);
          navigate("/login");
          return;
        }
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Session check error:", error);
        setUser(null);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);
      
      if (event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate("/login");
      } else if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        navigate("/");
      } else if (event === 'USER_UPDATED') {
        setUser(session?.user ?? null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({
          variant: "destructive",
          title: "Error signing in",
          description: error.message
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
          data: {
            username: email.split('@')[0]
          }
        }
      });
      if (error) {
        toast({
          variant: "destructive",
          title: "Error signing up",
          description: error.message
        });
        throw error;
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
        toast({
          variant: "destructive",
          title: "Error signing out",
          description: error.message
        });
        throw error;
      }
      navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const updateUsername = async (username: string) => {
    if (!user) return;
    try {
      const { error } = await supabase.auth.updateUser({
        data: { username }
      });
      if (error) {
        toast({
          variant: "destructive",
          title: "Error updating username",
          description: error.message
        });
        throw error;
      }
    } catch (error) {
      console.error("Update username error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateUsername }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}