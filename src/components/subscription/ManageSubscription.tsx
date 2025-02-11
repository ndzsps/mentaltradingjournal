
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const ManageSubscription = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleManageSubscription = async () => {
    try {
      setLoading(true);
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        toast({
          variant: "destructive",
          title: "Not logged in",
          description: "Please log in to manage your subscription",
        });
        navigate('/login');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        headers: {
          Authorization: `Bearer ${session.data.session.access_token}`,
        },
      });

      if (error) {
        // Parse the error response if it's a string
        let errorData;
        try {
          errorData = JSON.parse(error.message);
        } catch {
          errorData = { error: error.message };
        }

        // Handle the case where user is already subscribed
        if (errorData.error === "already_subscribed") {
          // Redirect to Stripe billing portal
          window.location.href = "https://billing.stripe.com/p/login/dR617i4AUaWldbibII";
          return;
        }

        toast({
          variant: "destructive",
          title: "Error",
          description: errorData.message || "Failed to create checkout session",
        });
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Manage Subscription</h2>
          <p className="text-muted-foreground">
            Click below to manage your subscription settings, including cancellation.
          </p>
        </div>
        <Button 
          onClick={handleManageSubscription}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Loading..." : "Manage Subscription"}
        </Button>
      </div>
    </Card>
  );
};
