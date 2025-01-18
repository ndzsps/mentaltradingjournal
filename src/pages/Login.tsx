import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionDialog } from "@/components/SubscriptionDialog";
import { AuthError } from "@supabase/supabase-js";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const getErrorMessage = (error: AuthError) => {
    if (error.message.includes("Invalid login credentials")) {
      return "Invalid email or password. Please check your credentials and try again.";
    }
    if (error.message.includes("Email not confirmed")) {
      return "Please verify your email address before signing in.";
    }
    return error.message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        setShowSubscriptionDialog(true);
        toast({
          title: "Account created successfully",
          description: "Please check your email to verify your account.",
        });
      } else {
        await signIn(email, password);
        navigate("/dashboard");
      }
    } catch (error) {
      const errorMessage = error instanceof AuthError 
        ? getErrorMessage(error)
        : "An unexpected error occurred";
        
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-6 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome to TradingMind</h1>
            <p className="text-muted-foreground">
              {isSignUp ? "Create an account" : "Sign in to your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : isSignUp ? (
                "Sign Up"
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </Button>
          </div>
        </Card>
      </div>
      {showSubscriptionDialog && <SubscriptionDialog />}
    </>
  );
};

export default Login;