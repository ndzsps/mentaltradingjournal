import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light/5 to-secondary-light/5">
      <Card className="w-full max-w-md p-8 space-y-4">
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
            Welcome to TradingMind
          </h1>
          <p className="text-muted-foreground">
            Sign in to track your trading journey
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary-light))',
                  inputText: 'white',
                  inputBackground: 'hsl(var(--background))',
                  inputPlaceholder: 'hsl(var(--muted-foreground))',
                }
              }
            },
            className: {
              container: 'space-y-4',
              button: 'bg-primary hover:bg-primary/90',
              input: 'bg-background text-foreground',
              label: 'text-foreground',
            }
          }}
          providers={[]}
          redirectTo={window.location.origin}
          localization={{
            variables: {
              sign_up: {
                email_label: 'Email',
                password_label: 'Password',
              }
            }
          }}
          view="sign_up"
        />
      </Card>
    </div>
  );
};

export default AuthPage;