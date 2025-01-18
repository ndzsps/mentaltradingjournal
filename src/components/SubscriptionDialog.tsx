import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function SubscriptionDialog() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubscribe = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        method: 'POST'
      });

      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start subscription process. Please try again.",
      });
      console.error("Subscription error:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/login");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Subscribe to Access Features</DialogTitle>
          <DialogDescription>
            Get access to all features by subscribing to our service. Start your journey today!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button onClick={handleSubscribe} className="w-full">
            Subscribe Now
          </Button>
          <Button variant="outline" onClick={handleClose} className="w-full">
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}