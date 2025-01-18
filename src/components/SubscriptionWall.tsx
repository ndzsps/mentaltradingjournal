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
        throw new Error("Failed to create checkout session");
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
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold">Unlock All Features</h2>
          <p className="text-muted-foreground">
            Get access to all features and start improving your trading journey today
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Features included:</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Journal Entry System
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Analytics Dashboard
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Backtesting Tools
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Trading Blueprints
              </li>
            </ul>
          </div>
          <Button 
            className="w-full"
            size="lg"
            onClick={handleSubscribe}
          >
            Subscribe Now
          </Button>
        </div>
      </Card>
    </div>
  );
};