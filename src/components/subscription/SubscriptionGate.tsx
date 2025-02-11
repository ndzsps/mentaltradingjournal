
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
    const checkAuth = async () => {
      const currentSession = await supabase.auth.getSession();
      if (!currentSession.data.session) {
        setLoading(false);
        navigate('/login');
        return;
      }
      checkSubscription(currentSession.data.session.access_token);
    };

    checkAuth();
  }, [session]);

  const checkSubscription = async (accessToken: string) => {
    try {
      console.log('Checking subscription status...');
      
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      
      if (error) {
        console.error('Subscription check error:', error);
        
        // Handle invalid session
        if (error.message.includes("Auth session missing") || 
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

        // Handle other errors
        toast({
          variant: "destructive",
          title: "Error checking subscription",
          description: "Please try again later",
        });
        throw error;
      }
      
      console.log('Subscription check response:', data);
      
      // Update subscription status based on response
      const hasActiveSubscription = data?.subscribed === true;
      console.log('Setting subscription status to:', hasActiveSubscription);
      setIsSubscribed(hasActiveSubscription);
      
      if (hasActiveSubscription) {
        console.log('User has active subscription, showing premium features');
      } else {
        console.log('User does not have active subscription, showing subscribe prompt');
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      
      // Handle specific error cases
      if (typeof error === 'object' && error !== null && 'message' in error && 
          (error.message.includes("Auth session missing") || 
           error.message.includes("User from sub claim in JWT does not exist"))) {
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
      
      const currentSession = await supabase.auth.getSession();
      if (!currentSession.data.session?.access_token) {
        console.log('No session token found, redirecting to login');
        navigate('/login');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        headers: {
          Authorization: `Bearer ${currentSession.data.session.access_token}`,
        }
      });

      if (error) {
        console.error('Create checkout session error:', error);
        
        // Parse the error response body if it exists
        let errorBody;
        try {
          errorBody = JSON.parse(error.message);
        } catch {
          errorBody = null;
        }
        
        // Handle already subscribed case (409 Conflict)
        if (error.status === 409 || (errorBody?.error === "already_subscribed")) {
          toast({
            title: "Already Subscribed",
            description: "You already have an active subscription.",
          });
          // Refresh subscription status and redirect if specified
          if (errorBody?.redirectTo) {
            navigate(errorBody.redirectTo);
          }
          await checkSubscription(currentSession.data.session.access_token);
          return;
        }
        
        // Handle invalid session
        if (error.message.includes("Auth session missing") || 
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
        
        throw error;
      }
      
      if (data?.url) {
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
