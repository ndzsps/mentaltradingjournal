
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export function ManageSubscriptionButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePortalSession = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('create-portal-session');
      
      if (error) throw error;
      
      // Redirect to Stripe Customer Portal
      window.location.href = data.url;
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not access subscription portal. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePortalSession}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        'Manage Subscription'
      )}
    </Button>
  );
}
