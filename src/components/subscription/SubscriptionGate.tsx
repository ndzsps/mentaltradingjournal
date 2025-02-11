
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";

interface SubscriptionGateProps {
  children: React.ReactNode;
}

export const SubscriptionGate = ({ children }: SubscriptionGateProps) => {
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });
      
      if (error) {
        console.error('Subscription check error:', error);
        throw error;
      }
      
      setIsSubscribed(data.subscribed);
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast({
        variant: "destructive",
        title: "Error checking subscription",
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout-session');
      
      if (error) throw error;
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        variant: "destructive",
        title: "Error creating checkout session",
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className="flex items-center justify-center min-h-[500px] bg-background/50 backdrop-blur-sm p-4">
        <Card className="max-w-md w-full p-6 space-y-6 text-center border-2 border-primary/20">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Premium Feature</h2>
            <p className="text-muted-foreground">
              Subscribe to access all premium features including advanced analytics, journal entries, and more.
            </p>
          </div>
          <Button 
            className="w-full" 
            onClick={handleSubscribe}
            disabled={loading}
            size="lg"
          >
            {loading ? "Loading..." : "Subscribe to Access Feature"}
          </Button>
        </Card>
      </div>
    );
  }

  return children;
};
