import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function SubscriptionDialog() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth(); // Use the signOut method from AuthContext

  const handleSubscribe = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initiate subscription process. Please try again.",
      });
    }
  };

  const handleClose = async () => {
    setOpen(false);
    try {
      await signOut(); // Use the signOut method from AuthContext
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      // Still navigate to home page even if sign out fails
      navigate("/");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subscribe to Access Features</DialogTitle>
          <DialogDescription>
            A subscription is required to access the trading journal features. Subscribe now to start your journey!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button onClick={handleSubscribe}>Subscribe Now</Button>
          <Button variant="outline" onClick={handleClose}>
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}