import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ManageSubscription = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleManageSubscription = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('create-portal-session');
      
      if (error) throw error;
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
      toast({
        variant: "destructive",
        title: "Error accessing subscription portal",
        description: "Please try again later",
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