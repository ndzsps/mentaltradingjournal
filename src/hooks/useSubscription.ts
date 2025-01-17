import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useSubscription = () => {
  const { data: isSubscribed, isLoading: checkingSubscription } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) {
        toast.error("Failed to check subscription status");
        throw error;
      }
      return data.subscribed;
    },
  });

  const createCheckoutSession = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout-session");
      if (error) {
        console.error("Checkout session error:", error);
        toast.error(error.message || "Failed to start checkout process");
        throw error;
      }
      
      // Redirect to Stripe Checkout
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      toast.error(error.message || "Failed to start checkout process");
    }
  };

  return {
    isSubscribed,
    checkingSubscription,
    createCheckoutSession,
  };
};