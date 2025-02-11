
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

interface SubscriptionGateProps {
  children: React.ReactNode;
}

export const SubscriptionGate = ({ children }: SubscriptionGateProps) => {
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, signOut } = useAuth();

  useEffect(() => {
    if (session?.access_token) {
      checkSubscription();
    } else {
      setLoading(false);
      navigate('/login');
    }
  }, [session]);

  const checkSubscription = async () => {
    try {
      console.log('Checking subscription status...');
      
      if (!session?.access_token) {
        console.log('No session token found, redirecting to login');
        setLoading(false);
        navigate('/login');
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });
      
      if (error) {
        console.error('Subscription check error:', error);
        
        // Handle invalid session
        if (error.message.includes("User from sub claim in JWT does not exist")) {
          toast({
            variant: "destructive",
            title: "Session expired",
            description: "Your session has expired. Please sign in again.",
          });
          await signOut();
          navigate('/login');
          return;
        }

        // Handle other errors
        toast({
          variant: "destructive",
          title: "Error checking subscription",
          description: "Please try again later",
        });
        throw error;
      }
      
      console.log('Subscription check response:', data);
      setIsSubscribed(data.subscribed);
    } catch (error) {
      console.error('Error checking subscription:', error);
      
      // Handle specific error cases
      if (typeof error === 'object' && error !== null && 'message' in error && 
          error.message.includes("User from sub claim in JWT does not exist")) {
        toast({
          variant: "destructive",
          title: "Session expired",
          description: "Your session has expired. Please sign in again.",
        });
        await signOut();
        navigate('/login');
        return;
      }
      
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
      console.log('Creating checkout session...');
      
      if (!session?.access_token) {
        console.log('No session token found, redirecting to login');
        navigate('/login');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });
      
      if (error) {
        console.error('Create checkout session error:', error);
        
        // Handle already subscribed case (409 Conflict)
        if (error.status === 409) {
          toast({
            title: "Already Subscribed",
            description: "You already have an active subscription.",
          });
          await checkSubscription(); // Refresh subscription status
          return;
        }
        
        // Handle invalid session
        if (error.message.includes("User from sub claim in JWT does not exist")) {
          toast({
            variant: "destructive",
            title: "Session expired",
            description: "Your session has expired. Please sign in again.",
          });
          await signOut();
          navigate('/login');
          return;
        }
        
        throw error;
      }
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        variant: "destructive",
        title: "Error creating checkout session",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? error.message 
          : "Please try again later",
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

  if (!session) {
    navigate('/login');
    return null;
  }

  if (!isSubscribed) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="max-w-md w-full p-6 space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">Premium Features</h2>
            <p className="text-muted-foreground">
              Subscribe to access all features including advanced analytics, journal entries, and more.
            </p>
          </div>
          <Button 
            className="w-full" 
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? "Loading..." : "Subscribe Now"}
          </Button>
        </Card>
      </div>
    );
  }

  return children;
};
