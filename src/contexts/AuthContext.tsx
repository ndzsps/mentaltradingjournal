import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, AuthChangeEvent } from "@supabase/supabase-js";
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
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setUser(null);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          navigate("/");
        } else {
          setUser(null);
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      console.log("Auth state change:", event);
      
      switch (event) {
        case 'SIGNED_IN':
          setUser(session?.user ?? null);
          navigate("/");
          break;
        case 'SIGNED_OUT':
          setUser(null);
          navigate("/login");
          break;
        case 'TOKEN_REFRESHED':
        case 'USER_UPDATED':
          setUser(session?.user ?? null);
          break;
        default:
          // Handle any other auth events, including user deletion
          if (!session?.user) {
            setUser(null);
            navigate("/login");
          }
          break;
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