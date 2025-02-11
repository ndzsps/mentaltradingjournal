
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

      console.log('Subscription check response:', data);
      
      if (data.subscribed) {
        setIsSubscribed(true);
        toast({
          title: "Premium Access Granted",
          description: "You have access to all premium features",
        });
      }
    } catch (error: any) {
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
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please sign in to subscribe",
        });
        return;
      }

      const { data: subscriptionData, error: subscriptionError } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      if (subscriptionError) {
        throw subscriptionError;
      }

      if (subscriptionData.subscribed) {
        setIsSubscribed(true);
        toast({
          title: "Subscription Active",
          description: "You already have an active subscription. Enjoy the premium features!",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });
      
      if (error) {
        // Check if the error indicates an active subscription
        const errorMessage = error.message || '';
        const errorBody = error.body ? JSON.parse(error.body) : {};
        
        if (errorMessage.includes('already have an active subscription') || 
            (errorBody.error && errorBody.error.includes('already have an active subscription'))) {
          setIsSubscribed(true);
          toast({
            title: "Subscription Active",
            description: "You already have an active subscription. Enjoy the premium features!",
          });
          return;
        }
        throw error;
      }
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Error handling subscription:', error);
      toast({
        variant: "destructive",
        title: "Error processing subscription",
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
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 space-y-6 text-center border-2 border-primary/20">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Premium Features</h2>
            <p className="text-muted-foreground">
              Subscribe to unlock all premium features:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 mt-2">
              <li>✨ Advanced Analytics Dashboard</li>
              <li>📝 Journal Entries</li>
              <li>📊 Performance Tracking</li>
              <li>📓 Trading Notebook</li>
              <li>🔄 Backtesting Tools</li>
              <li>📈 MFE/MAE Analysis</li>
            </ul>
          </div>
          <Button 
            className="w-full" 
            onClick={handleSubscribe}
            disabled={loading}
            size="lg"
          >
            {loading ? "Loading..." : "Subscribe Now"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Get unlimited access to all features and future updates
          </p>
        </Card>
      </div>
    );
  }

  return children;
};
