import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export const SubscriptionWall = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSubscribe = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please sign in to subscribe",
        });
        navigate("/login");
        return;
      }

      console.log('Making request to create-checkout-session with token:', session.access_token);
      
      const response = await supabase.functions.invoke('create-checkout-session', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      console.log('Checkout session response:', response);

      if (response.error) {
        throw new Error(response.error.message || "Failed to create checkout session");
      }

      const { data } = response;
      if (!data?.url) {
        throw new Error("No checkout URL received");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start subscription process",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary/10 p-4">
      <Card className="w-full max-w-md p-8 space-y-8 shadow-xl border-primary/20">
        <div className="space-y-4 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
            Welcome to TradingJournal Pro
          </h2>
          <p className="text-muted-foreground text-lg">
            Start your journey to becoming a better trader today
          </p>
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Features included:</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-lg">
                <span className="mr-2 text-primary">✓</span>
                Advanced Journal Entry System
              </li>
              <li className="flex items-center text-lg">
                <span className="mr-2 text-primary">✓</span>
                Comprehensive Analytics Dashboard
              </li>
              <li className="flex items-center text-lg">
                <span className="mr-2 text-primary">✓</span>
                Professional Backtesting Tools
              </li>
              <li className="flex items-center text-lg">
                <span className="mr-2 text-primary">✓</span>
                Trading Blueprint Management
              </li>
            </ul>
          </div>
          <Button 
            className="w-full text-lg py-6"
            size="lg"
            onClick={handleSubscribe}
          >
            Subscribe Now - $29.99/month
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Cancel anytime. 30-day money-back guarantee.
          </p>
        </div>
      </Card>
    </div>
  );
};