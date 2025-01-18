import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const SubscriptionWall = () => {
  const { toast } = useToast();

  const handleSubscribe = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please sign in to subscribe",
        });
        return;
      }

      const response = await fetch("/api/create-checkout-session", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start subscription process",
      });
    }
  };

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