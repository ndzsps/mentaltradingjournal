
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function createCheckoutSession(priceId: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      toast.error("Please sign in to continue");
      throw new Error('User must be logged in');
    }

    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        priceId,
        userId: session.user.id,
      },
    });

    if (error) {
      console.error('Checkout session error:', error);
      toast.error(error.message || "Failed to start checkout process");
      throw error;
    }
    
    if (!data?.url) {
      toast.error("No checkout URL returned");
      throw new Error('No checkout URL returned');
    }

    window.location.href = data.url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    toast.error("Failed to start checkout process. Please try again.");
    throw error;
  }
}

export async function createPortalSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      toast.error("Please sign in to continue");
      throw new Error('User must be logged in');
    }

    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: {},
    });

    if (error) {
      console.error('Portal session error:', error);
      toast.error(error.message || "Failed to access billing portal");
      throw error;
    }
    
    if (!data?.url) {
      toast.error("No portal URL returned");
      throw new Error('No portal URL returned');
    }

    window.location.href = data.url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    toast.error("Failed to access billing portal. Please try again.");
    throw error;
  }
}
